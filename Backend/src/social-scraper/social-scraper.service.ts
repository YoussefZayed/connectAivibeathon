import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BrightDataService } from './services/brightdata.service';
import { KnowledgeBaseService } from './services/knowledge-base.service';
import { UserRepository } from '../user/user.repository';
import {
  LinkedInProfile,
  TikTokProfile,
  InstagramPost,
  SocialMediaData,
} from './types/social-media.types';

@Injectable()
export class SocialScraperService {
  private readonly logger = new Logger(SocialScraperService.name);

  constructor(
    private readonly brightDataService: BrightDataService,
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly userRepository: UserRepository,
  ) {}

  async scrapeUserProfiles(
    userId: number,
  ): Promise<{ message: string; data?: any; insights?: any }> {
    try {
      // Get user data
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const socialMediaData: SocialMediaData = {
        scraped_at: new Date().toISOString(),
      };

      // Scrape LinkedIn profile if URL exists
      if (user.linkedin_url) {
        this.logger.log(`Scraping LinkedIn profile for user ${userId}`);
        const linkedinResult =
          await this.brightDataService.scrapeLinkedInProfile(user.linkedin_url);
        if (linkedinResult.success) {
          socialMediaData.linkedin = linkedinResult.data as LinkedInProfile;

          // Also scrape LinkedIn posts
          const linkedinPostsResult =
            await this.brightDataService.scrapeLinkedInPosts(user.linkedin_url);
          if (linkedinPostsResult.success) {
            socialMediaData.linkedin_posts =
              linkedinPostsResult.data as InstagramPost[];
          }
        }
      }

      // Scrape Instagram profile if URL exists
      if (user.instagram_url) {
        this.logger.log(`Scraping Instagram profile for user ${userId}`);
        const instagramResult =
          await this.brightDataService.scrapeInstagramProfile(
            user.instagram_url,
          );
        if (instagramResult.success) {
          socialMediaData.instagram = instagramResult.data;

          // Also scrape Instagram posts
          const instagramPostsResult =
            await this.brightDataService.scrapeInstagramPosts(
              user.instagram_url,
            );
          if (instagramPostsResult.success) {
            socialMediaData.instagram_posts =
              instagramPostsResult.data as InstagramPost[];
          }
        }
      }

      // Scrape TikTok profile if URL exists
      if (user.tiktok_url) {
        this.logger.log(`Scraping TikTok profile for user ${userId}`);
        const tiktokResult = await this.brightDataService.scrapeTikTokProfile(
          user.tiktok_url,
        );
        if (tiktokResult.success) {
          socialMediaData.tiktok = tiktokResult.data as TikTokProfile;
        }
      }

      // Build knowledge base and generate insights
      const knowledgeBase = this.knowledgeBaseService.buildKnowledgeBase(
        socialMediaData,
        userId,
      );
      const insights = this.knowledgeBaseService.generateUserInsights(
        socialMediaData,
        userId,
      );

      // Update user with scraped data
      await this.userRepository.updateSocialMediaData(userId, socialMediaData);

      this.logger.log(
        `Successfully scraped social media profiles for user ${userId}`,
      );

      return {
        message: `Successfully scraped social media profiles for user ${userId}`,
        data: socialMediaData,
        insights: {
          knowledgeBase,
          userInsights: insights,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to scrape social media profiles for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async scrapeContactProfiles(
    userId: number,
    contactId: number,
  ): Promise<{ message: string; data?: any; insights?: any }> {
    try {
      // Get contact data
      const contact = await this.userRepository.findById(contactId);
      if (!contact) {
        throw new NotFoundException(`Contact with ID ${contactId} not found`);
      }

      // Check if contact exists for the user
      const contactExists = await this.userRepository.checkContactExists(
        userId,
        contactId,
      );
      if (!contactExists) {
        throw new NotFoundException(
          `Contact ${contactId} is not in user ${userId}'s contact list`,
        );
      }

      // Scrape the contact's profiles
      return await this.scrapeUserProfiles(contactId);
    } catch (error) {
      this.logger.error(
        `Failed to scrape contact ${contactId} profiles for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async scrapeAllContacts(
    userId: number,
  ): Promise<{ message: string; results: any[] }> {
    try {
      // Get all contacts for the user
      const contacts = await this.userRepository.getContacts(userId);
      const results: any[] = [];

      for (const contact of contacts) {
        try {
          const result = await this.scrapeUserProfiles(contact.id);
          results.push({
            contactId: contact.id,
            username: contact.username,
            success: true,
            data: result.data as Record<string, unknown>,
            insights: result.insights as Record<string, unknown>,
          });
        } catch (error) {
          results.push({
            contactId: contact.id,
            username: contact.username,
            success: false,
            error: (error as Error).message,
          });
        }
      }

      return {
        message: `Scraped profiles for ${contacts.length} contacts`,
        results,
      };
    } catch (error) {
      this.logger.error(
        `Failed to scrape all contacts for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async updateSocialMediaUrls(
    userId: number,
    urls: {
      linkedin_url?: string;
      facebook_url?: string;
      instagram_url?: string;
      twitter_url?: string;
      youtube_url?: string;
      tiktok_url?: string;
    },
  ): Promise<{ message: string; data: any }> {
    try {
      const updatedUser = await this.userRepository.updateSocialMediaUrls(
        userId,
        urls,
      );
      return {
        message: `Updated social media URLs for user ${userId}`,
        data: updatedUser,
      };
    } catch (error) {
      this.logger.error(
        `Failed to update social media URLs for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async getKnowledgeBase(
    userId: number,
  ): Promise<{ message: string; data: any }> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      if (!user.social_media_data) {
        return {
          message: `No social media data found for user ${userId}`,
          data: null,
        };
      }

      const socialMediaData = user.social_media_data as SocialMediaData;
      const knowledgeBase = this.knowledgeBaseService.buildKnowledgeBase(
        socialMediaData,
        userId,
      );
      const insights = this.knowledgeBaseService.generateUserInsights(
        socialMediaData,
        userId,
      );

      return {
        message: `Retrieved knowledge base for user ${userId}`,
        data: {
          knowledgeBase: knowledgeBase || null,
          userInsights: insights || null,
          lastScraped: user.last_scraped_at
            ? new Date(user.last_scraped_at).toISOString()
            : null,
        },
      };
    } catch (error) {
      this.logger.error(
        `Failed to get knowledge base for user ${userId}:`,
        error,
      );
      throw error;
    }
  }
}
