import { z } from 'zod';

export const eventsRoutes = {
    crawlEvents: {
        method: 'POST',
        path: '/events/crawl',
        responses: {
            200: z.object({
                success: z.boolean(),
                message: z.string(),
                eventsCount: z.number(),
            }),
            500: z.object({
                success: z.boolean(),
                message: z.string(),
                eventsCount: z.number(),
            }),
        },
        body: z.object({
            url: z.string().url().optional(),
            instructions: z.string().optional(),
        }),
        summary: 'Crawl and save events from Ottawa using Tavily API and OpenAI',
    },
    getEvents: {
        method: 'GET',
        path: '/events',
        responses: {
            200: z.array(z.object({
                id: z.number(),
                createdAt: z.string().datetime(),
                event_name: z.string(),
                event_description: z.string(),
                event_date: z.string().datetime(),
                image_url: z.string(),
            })),
        },
        summary: 'Get all events from the database',
    },
} as const; 