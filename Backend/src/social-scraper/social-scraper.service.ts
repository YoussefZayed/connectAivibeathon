import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BrightDataService } from './services/brightdata.service';
import { KnowledgeBaseService } from './services/knowledge-base.service';
import { KnowledgeBaseService as MainKnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
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
    private readonly mainKnowledgeBaseService: MainKnowledgeBaseService,
    private readonly userRepository: UserRepository,
  ) {}

  private validateScrapedData(data: any, platform: string): boolean {
    if (!data || typeof data !== 'object') {
      this.logger.warn(
        `Invalid data structure for ${platform}: data is not an object`,
      );
      return false;
    }

    // Basic validation based on platform
    switch (platform) {
      case 'linkedin':
        return this.validateLinkedInData(data);
      case 'instagram':
        return this.validateInstagramData(data);
      case 'tiktok':
        return this.validateTikTokData(data);
      case 'facebook':
        return this.validateFacebookData(data);
      case 'twitter':
        return this.validateTwitterData(data);
      case 'youtube':
        return this.validateYouTubeData(data);
      default:
        this.logger.warn(`Unknown platform for validation: ${platform}`);
        return true; // Allow unknown platforms
    }
  }

  private validateLinkedInData(data: any): boolean {
    const requiredFields = ['name', 'url'];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      this.logger.warn(
        `LinkedIn data missing required fields: ${missingFields.join(', ')}`,
      );
      return false;
    }

    return true;
  }

  private validateInstagramData(data: any): boolean {
    const requiredFields = ['username'];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      this.logger.warn(
        `Instagram data missing required fields: ${missingFields.join(', ')}`,
      );
      return false;
    }

    return true;
  }

  private validateTikTokData(data: any): boolean {
    const requiredFields = ['username'];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      this.logger.warn(
        `TikTok data missing required fields: ${missingFields.join(', ')}`,
      );
      return false;
    }

    return true;
  }

  private validateFacebookData(data: any): boolean {
    // Basic validation - can be expanded based on expected Facebook data structure
    return true;
  }

  private validateTwitterData(data: any): boolean {
    // Basic validation - can be expanded based on expected Twitter data structure
    return true;
  }

  private validateYouTubeData(data: any): boolean {
    // Basic validation - can be expanded based on expected YouTube data structure
    return true;
  }

  private validatePostsData(posts: any[], platform: string): boolean {
    if (!Array.isArray(posts)) {
      this.logger.warn(`${platform} posts data is not an array`);
      return false;
    }

    if (posts.length === 0) {
      this.logger.log(`No posts found for ${platform}`);
      return true;
    }

    // Validate each post has basic required fields
    const invalidPosts = posts.filter(
      (post) => !post || typeof post !== 'object',
    );
    if (invalidPosts.length > 0) {
      this.logger.warn(
        `${platform} contains ${invalidPosts.length} invalid posts`,
      );
      return false;
    }

    return true;
  }

  async scrapeUserProfiles(
    userId: number,
  ): Promise<{
    message: string;
    data?: any;
    insights?: any;
    scrapingResults: any;
  }> {
    const scrapingResults = {
      successful: [] as string[],
      failed: [] as { platform: string; error: string }[],
    };

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
        try {
          const linkedinResult =
            await this.brightDataService.scrapeLinkedInProfile(
              user.linkedin_url,
            );
          if (linkedinResult.success) {
            // Validate LinkedIn data before storing
            if (this.validateScrapedData(linkedinResult.data, 'linkedin')) {
              socialMediaData.linkedin = linkedinResult.data as LinkedInProfile;
              scrapingResults.successful.push('LinkedIn Profile');
            } else {
              scrapingResults.failed.push({
                platform: 'LinkedIn Profile',
                error: 'Data validation failed',
              });
            }

            // Also scrape LinkedIn posts
            try {
              const linkedinPostsResult =
                await this.brightDataService.scrapeLinkedInPosts(
                  user.linkedin_url,
                );
              if (linkedinPostsResult.success) {
                socialMediaData.linkedin_posts =
                  linkedinPostsResult.data as InstagramPost[];
                scrapingResults.successful.push('LinkedIn Posts');
              } else {
                scrapingResults.failed.push({
                  platform: 'LinkedIn Posts',
                  error: linkedinPostsResult.error || 'Unknown error',
                });
              }
            } catch (error) {
              scrapingResults.failed.push({
                platform: 'LinkedIn Posts',
                error: (error as Error).message,
              });
            }
          } else {
            scrapingResults.failed.push({
              platform: 'LinkedIn Profile',
              error: linkedinResult.error || 'Unknown error',
            });
          }
        } catch (error) {
          scrapingResults.failed.push({
            platform: 'LinkedIn Profile',
            error: (error as Error).message,
          });
        }
      }

      // Scrape Instagram profile if URL exists
      if (user.instagram_url) {
        this.logger.log(`Scraping Instagram profile for user ${userId}`);
        try {
          const instagramResult =
            await this.brightDataService.scrapeInstagramProfile(
              user.instagram_url,
            );
          if (instagramResult.success) {
            socialMediaData.instagram = instagramResult.data as any;
            scrapingResults.successful.push('Instagram Profile');

            // Also scrape Instagram posts
            try {
              const instagramPostsResult =
                await this.brightDataService.scrapeInstagramPosts(
                  user.instagram_url,
                );
              if (instagramPostsResult.success) {
                socialMediaData.instagram_posts =
                  instagramPostsResult.data as InstagramPost[];
                scrapingResults.successful.push('Instagram Posts');
              } else {
                scrapingResults.failed.push({
                  platform: 'Instagram Posts',
                  error: instagramPostsResult.error || 'Unknown error',
                });
              }
            } catch (error) {
              scrapingResults.failed.push({
                platform: 'Instagram Posts',
                error: (error as Error).message,
              });
            }
          } else {
            scrapingResults.failed.push({
              platform: 'Instagram Profile',
              error: instagramResult.error || 'Unknown error',
            });
          }
        } catch (error) {
          scrapingResults.failed.push({
            platform: 'Instagram Profile',
            error: (error as Error).message,
          });
        }
      }

      // Scrape TikTok profile if URL exists
      if (user.tiktok_url) {
        this.logger.log(`Scraping TikTok profile for user ${userId}`);
        try {
          const tiktokResult = await this.brightDataService.scrapeTikTokProfile(
            user.tiktok_url,
          );
          if (tiktokResult.success) {
            socialMediaData.tiktok = tiktokResult.data as TikTokProfile;
            scrapingResults.successful.push('TikTok Profile');
          } else {
            scrapingResults.failed.push({
              platform: 'TikTok Profile',
              error: tiktokResult.error || 'Unknown error',
            });
          }
        } catch (error) {
          scrapingResults.failed.push({
            platform: 'TikTok Profile',
            error: (error as Error).message,
          });
        }
      }

      // Scrape Facebook profile if URL exists
      if (user.facebook_url) {
        this.logger.log(`Scraping Facebook profile for user ${userId}`);
        try {
          const facebookResult =
            await this.brightDataService.scrapeFacebookProfile(
              user.facebook_url,
            );
          if (facebookResult.success) {
            socialMediaData.facebook = facebookResult.data as any;
            scrapingResults.successful.push('Facebook Profile');
          } else {
            scrapingResults.failed.push({
              platform: 'Facebook Profile',
              error: facebookResult.error || 'Unknown error',
            });
          }
        } catch (error) {
          scrapingResults.failed.push({
            platform: 'Facebook Profile',
            error: (error as Error).message,
          });
        }
      }

      // Scrape Twitter profile if URL exists
      if (user.twitter_url) {
        this.logger.log(`Scraping Twitter profile for user ${userId}`);
        try {
          const twitterResult =
            await this.brightDataService.scrapeTwitterProfile(user.twitter_url);
          if (twitterResult.success) {
            socialMediaData.twitter = twitterResult.data as any;
            scrapingResults.successful.push('Twitter Profile');
          } else {
            scrapingResults.failed.push({
              platform: 'Twitter Profile',
              error: twitterResult.error || 'Unknown error',
            });
          }
        } catch (error) {
          scrapingResults.failed.push({
            platform: 'Twitter Profile',
            error: (error as Error).message,
          });
        }
      }

      // Scrape YouTube profile if URL exists
      if (user.youtube_url) {
        this.logger.log(`Scraping YouTube profile for user ${userId}`);
        try {
          const youtubeResult =
            await this.brightDataService.scrapeYouTubeProfile(user.youtube_url);
          if (youtubeResult.success) {
            socialMediaData.youtube = youtubeResult.data as any;
            scrapingResults.successful.push('YouTube Profile');
          } else {
            scrapingResults.failed.push({
              platform: 'YouTube Profile',
              error: youtubeResult.error || 'Unknown error',
            });
          }
        } catch (error) {
          scrapingResults.failed.push({
            platform: 'YouTube Profile',
            error: (error as Error).message,
          });
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

      // Persist knowledge base entries to database
      const persistedEntries: any[] = [];
      for (const entry of knowledgeBase) {
        try {
          const persistedEntry =
            await this.mainKnowledgeBaseService.createKnowledgeBaseEntry({
              userId: entry.userId,
              title: `${entry.platform} - ${entry.dataType}`,
              content: entry.content,
              sourcePlatform: entry.platform,
              sourceType: entry.dataType,
              summary:
                entry.metadata && typeof entry.metadata === 'object'
                  ? entry.metadata.summary || null
                  : null,
              keywords:
                entry.metadata && typeof entry.metadata === 'object'
                  ? entry.metadata.keywords || null
                  : null,
              topics:
                entry.metadata && typeof entry.metadata === 'object'
                  ? entry.metadata.topics || null
                  : null,
              confidenceScore:
                entry.metadata && typeof entry.metadata === 'object'
                  ? entry.metadata.confidence || null
                  : null,
            });
          persistedEntries.push(persistedEntry);
        } catch (error) {
          this.logger.error(
            `Failed to persist knowledge base entry for user ${userId}:`,
            error,
          );
          // Continue with other entries even if one fails
        }
      }

      // Update user with scraped data
      await this.userRepository.updateSocialMediaData(userId, socialMediaData);

      // Generate comprehensive status message
      const totalAttempts =
        scrapingResults.successful.length + scrapingResults.failed.length;
      let statusMessage = `Scraping completed for user ${userId}. `;
      statusMessage += `Successful: ${scrapingResults.successful.length}/${totalAttempts} platforms. `;

      if (scrapingResults.failed.length > 0) {
        statusMessage += `Failed platforms: ${scrapingResults.failed.map((f) => f.platform).join(', ')}.`;
      }

      this.logger.log(statusMessage);

      return {
        message: statusMessage,
        data: socialMediaData,
        insights: {
          knowledgeBase: persistedEntries,
          userInsights: insights,
        },
        scrapingResults,
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
      let processedCount = 0;

      this.logger.log(
        `Starting bulk scraping for ${contacts.length} contacts of user ${userId}`,
      );

      for (const contact of contacts) {
        processedCount++;
        const progressPercentage = Math.round(
          (processedCount / contacts.length) * 100,
        );

        this.logger.log(
          `Processing contact ${processedCount}/${contacts.length} (${progressPercentage}%): ${contact.username}`,
        );

        try {
          const result = await this.scrapeUserProfiles(contact.id);
          results.push({
            contactId: contact.id,
            username: contact.username,
            success: true,
            data: result.data as Record<string, unknown>,
            insights: result.insights as Record<string, unknown>,
            scrapingResults: result.scrapingResults,
          });

          this.logger.log(
            `Successfully scraped contact ${contact.username} (${processedCount}/${contacts.length})`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to scrape contact ${contact.username} (${processedCount}/${contacts.length}): ${(error as Error).message}`,
          );
          results.push({
            contactId: contact.id,
            username: contact.username,
            success: false,
            error: (error as Error).message,
          });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      const finalMessage =
        `Bulk scraping completed for user ${userId}. ` +
        `Total contacts: ${contacts.length}, ` +
        `Successful: ${successCount}, ` +
        `Failed: ${failureCount}`;

      this.logger.log(finalMessage);

      return {
        message: finalMessage,
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
