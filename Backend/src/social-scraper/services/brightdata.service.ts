import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { 
  BrightDataConfig, 
  ScrapingRequest, 
  ScrapingResponse,
  LinkedInProfile,
  InstagramPost
} from '../types/social-media.types';

@Injectable()
export class BrightDataService {
  private readonly logger = new Logger(BrightDataService.name);
  private readonly config: BrightDataConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      apiKey: this.configService.get<string>('BRIGHTDATA_API_KEY') || '6be79a15d97a25d4ac6507874d41fdbaa8a163fa97fb6ca53c397322fb80af35',
      datasets: {
        linkedin_profile: 'gd_l1viktl72bvl7bjuj0',
        linkedin_posts: 'gd_lyy3tktm25m4avu764',
        instagram_profile: 'gd_l1vikfch901nx3by4',
        instagram_posts: 'gd_lk5ns7kz21pck8jpis',
        tiktok_profile: 'gd_l1villgoiiidt09ci',
        facebook_profile: 'gd_l1vikfch901nx3by4', // Placeholder - replace with actual dataset ID
        twitter_profile: 'gd_l1vikfch901nx3by4', // Placeholder - replace with actual dataset ID
        youtube_profile: 'gd_l1vikfch901nx3by4', // Placeholder - replace with actual dataset ID
      }
    };
  }

  async scrapeLinkedInProfile(url: string): Promise<ScrapingResponse> {
    try {
      const data = JSON.stringify([{ url }]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.linkedin_profile,
        data
      );

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return {
          success: true,
          data: response.data[0] as LinkedInProfile,
          platform: 'linkedin'
        };
      }

      return {
        success: false,
        error: 'No data returned from LinkedIn scraping',
        platform: 'linkedin'
      };
    } catch (error) {
      this.logger.error(`LinkedIn scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'linkedin'
      };
    }
  }

  async scrapeLinkedInPosts(url: string, startDate?: string, endDate?: string): Promise<ScrapingResponse> {
    try {
      const requestData: any = { url };
      if (startDate) requestData.start_date = startDate;
      if (endDate) requestData.end_date = endDate;

      const data = JSON.stringify([requestData]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.linkedin_posts,
        data,
        '&type=discover_new&discover_by=profile_url'
      );

      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data as InstagramPost[],
          platform: 'linkedin_posts'
        };
      }

      return {
        success: false,
        error: 'No data returned from LinkedIn posts scraping',
        platform: 'linkedin_posts'
      };
    } catch (error) {
      this.logger.error(`LinkedIn posts scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'linkedin_posts'
      };
    }
  }

  async scrapeInstagramProfile(url: string): Promise<ScrapingResponse> {
    try {
      const data = JSON.stringify([{ url }]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.instagram_profile,
        data
      );

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return {
          success: true,
          data: response.data[0],
          platform: 'instagram'
        };
      }

      return {
        success: false,
        error: 'No data returned from Instagram profile scraping',
        platform: 'instagram'
      };
    } catch (error) {
      this.logger.error(`Instagram profile scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'instagram'
      };
    }
  }

  async scrapeInstagramPosts(url: string, numPosts: number = 10, startDate?: string, endDate?: string, postType?: string): Promise<ScrapingResponse> {
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
        '&type=discover_new&discover_by=url'
      );

      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data as InstagramPost[],
          platform: 'instagram_posts'
        };
      }

      return {
        success: false,
        error: 'No data returned from Instagram posts scraping',
        platform: 'instagram_posts'
      };
    } catch (error) {
      this.logger.error(`Instagram posts scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'instagram_posts'
      };
    }
  }

  async scrapeTikTokProfile(url: string, country?: string): Promise<ScrapingResponse> {
    try {
      const requestData: any = { url };
      if (country) requestData.country = country;

      const data = JSON.stringify([requestData]);
      const response = await this.makeBrightDataRequest(
        this.config.datasets.tiktok_profile,
        data
      );

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return {
          success: true,
          data: response.data[0],
          platform: 'tiktok'
        };
      }

      return {
        success: false,
        error: 'No data returned from TikTok scraping',
        platform: 'tiktok'
      };
    } catch (error) {
      this.logger.error(`TikTok scraping failed for ${url}:`, error);
      return {
        success: false,
        error: error.message,
        platform: 'tiktok'
      };
    }
  }

  private async makeBrightDataRequest(datasetId: string, data: string, additionalParams: string = ''): Promise<AxiosResponse> {
    const url = `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${datasetId}&include_errors=true${additionalParams}`;
    
    return axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
  }
} 