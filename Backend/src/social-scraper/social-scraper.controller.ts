import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { SocialScraperService } from './social-scraper.service';

@Controller('social-scraper')
export class SocialScraperController {
  constructor(private readonly socialScraperService: SocialScraperService) {}

  @Post('scrape/:userId')
  async scrapeProfiles(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string; data?: any; insights?: any }> {
    return this.socialScraperService.scrapeUserProfiles(userId);
  }

  @Post('scrape-contact/:userId/:contactId')
  async scrapeContactProfiles(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<{ message: string; data?: any; insights?: any }> {
    return this.socialScraperService.scrapeContactProfiles(userId, contactId);
  }

  @Post('scrape-all-contacts/:userId')
  async scrapeAllContacts(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string; results: any[] }> {
    return this.socialScraperService.scrapeAllContacts(userId);
  }

  @Post('update-urls/:userId')
  async updateSocialMediaUrls(
    @Param('userId', ParseIntPipe) userId: number,
    @Body()
    urls: {
      linkedin_url?: string;
      facebook_url?: string;
      instagram_url?: string;
      twitter_url?: string;
      youtube_url?: string;
      tiktok_url?: string;
    },
  ): Promise<{ message: string; data: any }> {
    return this.socialScraperService.updateSocialMediaUrls(userId, urls);
  }

  @Get('knowledge-base/:userId')
  async getKnowledgeBase(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string; data?: any }> {
    return this.socialScraperService.getKnowledgeBase(userId);
  }

  // Debug endpoint to test BrightData integration
  @Post('debug-linkedin/:userId')
  async debugLinkedInScraping(@Param('userId') userId: string) {
    try {
      const userIdNum = parseInt(userId, 10);
      const result =
        await this.socialScraperService.debugLinkedInScraping(userIdNum);
      return {
        success: true,
        debug: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        debug: true,
        error: error.message,
      };
    }
  }
}
