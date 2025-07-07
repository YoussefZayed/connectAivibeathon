import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import {
  BrightDataConfig,
  ScrapingRequest,
  ScrapingResponse,
  LinkedInProfile,
  InstagramPost,
} from '../types/social-media.types';

@Injectable()
export class BrightDataService {
  private readonly logger = new Logger(BrightDataService.name);
  private readonly config: BrightDataConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      apiKey:
        this.configService.get<string>('BRIGHTDATA_API_KEY') ||
        '6be79a15d97a25d4ac6507874d41fdbaa8a163fa97fb6ca53c397322fb80af35',
      datasets: {
        linkedin_profile: 'gd_l1viktl72bvl7bjuj0',
        linkedin_posts: 'gd_lyy3tktm25m4avu764',
        instagram_profile: 'gd_l1vikfch901nx3by4',
        instagram_posts: 'gd_lk5ns7kz21pck8jpis',
        tiktok_profile: 'gd_l1villgoiiidt09ci',
        facebook_profile: 'gd_l1vikfch901nx3by4', // Placeholder - replace with actual dataset ID
        twitter_profile: 'gd_l1vikfch901nx3by4', // Placeholder - replace with actual dataset ID
        youtube_profile: 'gd_l1vikfch901nx3by4', // Placeholder - replace with actual dataset ID
      },
    };
  }

  async scrapeLinkedInProfile(url: string): Promise<ScrapingResponse> {
    try {
      this.logger.log(`Starting LinkedIn profile scraping for URL: ${url}`);
      this.logger.log(
        `Using dataset ID: ${this.config.datasets.linkedin_profile}`,
      );

      const data = JSON.stringify([{ url }]);
      this.logger.log(`Request payload: ${data}`);

      const response = await this.makeBrightDataRequest(
        this.config.datasets.linkedin_profile,
        data,
      );

      this.logger.log(`BrightData response status: ${response.status}`);
      this.logger.log(`BrightData response data type: ${typeof response.data}`);
      this.logger.log(
        `BrightData response data: ${JSON.stringify(response.data, null, 2)}`,
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        this.logger.log(`LinkedIn scraping successful, returning data`);
        return {
          success: true,
          data: response.data[0] as LinkedInProfile,
          platform: 'linkedin',
        };
      }

      this.logger.warn(
        `LinkedIn scraping failed: No data returned from BrightData API`,
      );
      return {
        success: false,
        error: 'No data returned from LinkedIn scraping',
        platform: 'linkedin',
      };
    } catch (error) {
      this.logger.error(`LinkedIn scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'linkedin',
      };
    }
  }

  async scrapeLinkedInPosts(
    url: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ScrapingResponse> {
    try {
      const requestData: any = { url };
      if (startDate) requestData.start_date = startDate;
      if (endDate) requestData.end_date = endDate;

      const data = JSON.stringify([requestData]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.linkedin_posts,
        data,
        '&type=discover_new&discover_by=profile_url',
      );

      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data as InstagramPost[],
          platform: 'linkedin_posts',
        };
      }

      return {
        success: false,
        error: 'No data returned from LinkedIn posts scraping',
        platform: 'linkedin_posts',
      };
    } catch (error) {
      this.logger.error(`LinkedIn posts scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'linkedin_posts',
      };
    }
  }

  async scrapeInstagramProfile(url: string): Promise<ScrapingResponse> {
    try {
      const data = JSON.stringify([{ url }]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.instagram_profile,
        data,
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        return {
          success: true,
          data: response.data[0],
          platform: 'instagram',
        };
      }

      return {
        success: false,
        error: 'No data returned from Instagram profile scraping',
        platform: 'instagram',
      };
    } catch (error) {
      this.logger.error(`Instagram profile scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'instagram',
      };
    }
  }

  async scrapeInstagramPosts(
    url: string,
    numPosts: number = 10,
    startDate?: string,
    endDate?: string,
    postType?: string,
  ): Promise<ScrapingResponse> {
    try {
      const requestData: any = { url };
      if (numPosts) requestData.num_of_posts = numPosts;
      if (startDate) requestData.start_date = startDate;
      if (endDate) requestData.end_date = endDate;
      if (postType) requestData.post_type = postType;

      const data = JSON.stringify([requestData]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.instagram_posts,
        data,
        '&type=discover_new&discover_by=url',
      );

      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data as InstagramPost[],
          platform: 'instagram_posts',
        };
      }

      return {
        success: false,
        error: 'No data returned from Instagram posts scraping',
        platform: 'instagram_posts',
      };
    } catch (error) {
      this.logger.error(`Instagram posts scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'instagram_posts',
      };
    }
  }

  async scrapeTikTokProfile(
    url: string,
    country?: string,
  ): Promise<ScrapingResponse> {
    try {
      const requestData: any = { url };
      if (country) requestData.country = country;

      const data = JSON.stringify([requestData]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.tiktok_profile,
        data,
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        return {
          success: true,
          data: response.data[0],
          platform: 'tiktok',
        };
      }

      return {
        success: false,
        error: 'No data returned from TikTok scraping',
        platform: 'tiktok',
      };
    } catch (error) {
      this.logger.error(`TikTok scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'tiktok',
      };
    }
  }

  async scrapeFacebookProfile(url: string): Promise<ScrapingResponse> {
    try {
      const data = JSON.stringify([{ url }]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.facebook_profile,
        data,
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        return {
          success: true,
          data: response.data[0],
          platform: 'facebook',
        };
      }

      return {
        success: false,
        error: 'No data returned from Facebook scraping',
        platform: 'facebook',
      };
    } catch (error) {
      this.logger.error(`Facebook scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'facebook',
      };
    }
  }

  async scrapeTwitterProfile(url: string): Promise<ScrapingResponse> {
    try {
      const data = JSON.stringify([{ url }]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.twitter_profile,
        data,
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        return {
          success: true,
          data: response.data[0],
          platform: 'twitter',
        };
      }

      return {
        success: false,
        error: 'No data returned from Twitter scraping',
        platform: 'twitter',
      };
    } catch (error) {
      this.logger.error(`Twitter scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'twitter',
      };
    }
  }

  async scrapeYouTubeProfile(url: string): Promise<ScrapingResponse> {
    try {
      const data = JSON.stringify([{ url }]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.youtube_profile,
        data,
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        return {
          success: true,
          data: response.data[0],
          platform: 'youtube',
        };
      }

      return {
        success: false,
        error: 'No data returned from YouTube scraping',
        platform: 'youtube',
      };
    } catch (error) {
      this.logger.error(`YouTube scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'youtube',
      };
    }
  }

  private async makeBrightDataRequest(
    datasetId: string,
    data: string,
    additionalParams: string = '',
  ): Promise<AxiosResponse> {
    const url = `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${datasetId}&include_errors=true${additionalParams}`;
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Add delay between attempts (exponential backoff)
        if (attempt > 1) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          this.logger.log(
            `Retrying BrightData request (attempt ${attempt}/${maxRetries}) after ${delay}ms delay`,
          );
          await this.delay(delay);
        }

        const response = await axios.post(url, data, {
          headers: {
            Authorization: `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        });

        // Add a small delay between successful requests to avoid rate limiting
        await this.delay(500); // 500ms delay between requests

        return response;
      } catch (error) {
        const isLastAttempt = attempt === maxRetries;
        const isRetryableError = this.isRetryableError(error);

        if (isLastAttempt || !isRetryableError) {
          this.logger.error(
            `BrightData request failed after ${attempt} attempts:`,
            error,
          );
          throw error;
        }

        this.logger.warn(
          `BrightData request failed (attempt ${attempt}/${maxRetries}), retrying...`,
          error,
        );
      }
    }

    throw new Error('Max retries exceeded for BrightData request');
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private isRetryableError(error: any): boolean {
    // Check if error is retryable (network errors, 5xx errors, timeouts)
    if (
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ENOTFOUND'
    ) {
      return true;
    }

    if (error.response?.status >= 500 && error.response?.status < 600) {
      return true;
    }

    if (error.response?.status === 429) {
      // Rate limit
      return true;
    }

    return false;
  }
}
