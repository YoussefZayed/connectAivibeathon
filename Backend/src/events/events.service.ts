import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import axios from 'axios';
import OpenAI from 'openai';
import { EventsRepository, EventData } from './events.repository';
import { Env } from '../core/config/env';
import { writeFileSync, readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EventsService {
    private readonly openai: OpenAI;

    constructor(
        private readonly eventsRepository: EventsRepository,
        private readonly configService: ConfigService<Env, true>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(EventsService.name);
        this.openai = new OpenAI({
            apiKey: this.configService.get('OPENAI_KEY'),
        });
    }

    async crawlAndSaveEvents(url?: string, instructions?: string) {
        this.logger.info('Starting to crawl events from Ottawa...');
        
        try {
            // Use default URL and instructions if not provided
            const crawlUrl = url || 'https://www.ctvnews.ca/ottawa/article/whats-happening-in-ottawa-this-weekend-july-4-6/';
            const crawlInstructions = instructions || 'Find all things to do in ottawa this weekend';

            // Call Tavily API to crawl the website
            const tavilyResponse = await this.crawlWithTavily(crawlUrl, crawlInstructions);
            
            // Use OpenAI to extract and format event data
            const formattedEvents = await this.formatEventsWithOpenAI(tavilyResponse);
            
            // Save events to database
            if (formattedEvents.length > 0) {
                await this.eventsRepository.createManyEvents(formattedEvents);
                this.logger.info(`Successfully saved ${formattedEvents.length} events to database`);
            }

            return {
                success: true,
                message: `Successfully crawled and saved ${formattedEvents.length} events`,
                eventsCount: formattedEvents.length,
            };
        } catch (error) {
            this.logger.error('Error crawling and saving events:', error);
            return {
                success: false,
                message: `Error crawling events: ${error.message}`,
                eventsCount: 0,
            };
        }
    }

    async getAllEvents() {
        this.logger.info('Fetching all events from database...');
        const events = await this.eventsRepository.getAllEvents();
        
        return events.map(event => ({
            ...event,
            createdAt: event.createdAt.toISOString(),
            event_date: event.event_date.toISOString(),
        }));
    }

    private async crawlWithTavily(url: string, instructions: string) {
        const tavilyApiKey = this.configService.get('TAVILY_API_KEY');
        
        this.logger.info(`Crawling URL: ${url} with instructions: ${instructions}`);
        
        try {
            const response = await axios.post(
                'https://api.tavily.com/crawl',
                {
                    url,
                    instructions,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tavilyApiKey}`,
                    },
                    timeout: 30000, // 30 second timeout
                }
            );

            this.logger.info('Tavily crawl completed successfully');
            
            // Write the response to a file for debugging
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `tavily-response-${timestamp}.json`;
            const filepath = join(process.cwd(), 'logs', filename);
            
            try {
                // Create logs directory if it doesn't exist
                const { mkdirSync } = require('fs');
                const { dirname } = require('path');
                mkdirSync(dirname(filepath), { recursive: true });
                
                // Write the response to file
                writeFileSync(filepath, JSON.stringify(response.data, null, 2));
                this.logger.info(`Tavily response written to: ${filepath}`);
            } catch (fileError) {
                this.logger.error('Error writing Tavily response to file:', fileError);
                // Continue execution even if file write fails
            }
            
            return response.data;
        } catch (error) {
            // Check if this is a timeout error or 429 rate limit error
            const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
            const isRateLimit = error.response?.status === 429;
            
            if (isTimeout || isRateLimit) {
                if (isTimeout) {
                    this.logger.warn('Tavily API request timed out, attempting to use cached log data...');
                } else {
                    this.logger.warn('Tavily API rate limit reached (429), attempting to use cached log data...');
                }
                
                const logData = this.getLatestLogData();
                if (logData) {
                    this.logger.info('Using cached log data from previous successful request');
                    return logData;
                }
            }

            this.logger.error('Tavily API error:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                code: error.code,
            });
            throw new Error(`Tavily API error: ${error.response?.status} ${error.response?.statusText} - ${error.response?.data?.message || error.message}`);
        }
    }

    private getLatestLogData(): any | null {
        try {
            const logsDir = join(process.cwd(), 'logs');
            
            if (!existsSync(logsDir)) {
                this.logger.warn('No logs directory found');
                return null;
            }

            const files = readdirSync(logsDir)
                .filter(file => file.startsWith('tavily-response-') && file.endsWith('.json'))
                .sort()
                .reverse(); // Get most recent file first

            if (files.length === 0) {
                this.logger.warn('No Tavily log files found');
                return null;
            }

            const latestFile = files[0];
            const filepath = join(logsDir, latestFile);
            
            this.logger.info(`Using cached data from: ${filepath}`);
            
            const fileContent = readFileSync(filepath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            this.logger.error('Error reading cached log data:', error);
            return null;
        }
    }

    private async formatEventsWithOpenAI(crawlData: any): Promise<EventData[]> {
        this.logger.info('Formatting events with OpenAI...');
        
        try {
            const prompt = `
Extract events from the following crawled data and format them as a JSON array. Each event should have:
- event_name: string (concise event title)
- event_description: string (detailed description)
- event_date: string (ISO date format, if no specific date is mentioned, use this weekend's dates)
- image_url: string (use placeholder if no image found: "https://via.placeholder.com/400x300?text=Ottawa+Event")

Important: Only include legitimate events happening in Ottawa. Return only the JSON array, no additional text.

Crawled data:
${JSON.stringify(crawlData, null, 2)}
            `;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.1,
            });

            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('OpenAI did not return any content');
            }

            // Extract JSON from the response
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('No JSON array found in OpenAI response');
            }

            const events = JSON.parse(jsonMatch[0]);
            
            // Convert event_date strings to Date objects
            const formattedEvents: EventData[] = events.map((event: any) => ({
                event_name: event.event_name,
                event_description: event.event_description,
                event_date: new Date(event.event_date),
                image_url: event.image_url || 'https://via.placeholder.com/400x300?text=Ottawa+Event',
            }));

            this.logger.info(`OpenAI formatted ${formattedEvents.length} events`);
            return formattedEvents;
        } catch (error) {
            this.logger.error('OpenAI formatting error:', {
                message: error.message,
                stack: error.stack,
            });
            throw new Error(`OpenAI formatting error: ${error.message}`);
        }
    }
} 