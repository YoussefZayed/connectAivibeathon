import { z } from 'zod';

// Social media platform types
const SocialMediaPlatform = z.enum([
  'linkedin',
  'facebook',
  'instagram',
  'twitter',
  'youtube',
  'tiktok',
]);

// Request schemas
const UpdateSocialMediaUrlsSchema = z.object({
  linkedin_url: z.string().url().optional(),
  facebook_url: z.string().url().optional(),
  instagram_url: z.string().url().optional(),
  twitter_url: z.string().url().optional(),
  youtube_url: z.string().url().optional(),
  tiktok_url: z.string().url().optional(),
});

const ScrapeProfileSchema = z.object({
  platform: SocialMediaPlatform,
  userId: z.number(),
});

const ScrapeAllProfilesSchema = z.object({
  userId: z.number(),
});

// Response schemas
const SocialMediaUrlsResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    linkedin_url: z.string().nullable(),
    facebook_url: z.string().nullable(),
    instagram_url: z.string().nullable(),
    twitter_url: z.string().nullable(),
    youtube_url: z.string().nullable(),
    tiktok_url: z.string().nullable(),
  }),
});

const ScrapingResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    platform: SocialMediaPlatform,
    status: z.string(),
    last_scraped: z.string().nullable(),
    error: z.string().nullable(),
  }),
});

const ProfileDataResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    platform: SocialMediaPlatform,
    profile_data: z.any().nullable(),
    last_scraped: z.string().nullable(),
    status: z.string(),
  }),
});

const KnowledgeBaseResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    entries: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        content: z.string(),
        source_platform: z.string(),
        source_type: z.string(),
        summary: z.string().nullable(),
        sentiment: z.string().nullable(),
        confidence_score: z.number().nullable(),
        created_at: z.string(),
      }),
    ),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
});

export const socialMediaContract = {
  updateSocialMediaUrls: {
    method: 'POST' as const,
    path: '/social-media/urls',
    responses: {
      200: SocialMediaUrlsResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
    },
    body: UpdateSocialMediaUrlsSchema,
    summary: 'Update social media profile URLs for a user',
  },

  scrapeProfile: {
    method: 'POST' as const,
    path: '/social-media/scrape',
    responses: {
      200: ScrapingResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
    },
    body: ScrapeProfileSchema,
    summary: 'Scrape a specific social media profile',
  },

  scrapeAllProfiles: {
    method: 'POST' as const,
    path: '/social-media/scrape-all',
    responses: {
      200: z.object({
        success: z.boolean(),
        message: z.string(),
        data: z.array(ScrapingResponse.shape.data),
      }),
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
    },
    body: ScrapeAllProfilesSchema,
    summary: 'Scrape all social media profiles for a user',
  },

  getProfileData: {
    method: 'GET' as const,
    path: '/social-media/profile/:platform/:userId',
    responses: {
      200: ProfileDataResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    query: z.object({}),
    summary: 'Get scraped profile data for a specific platform',
  },

  getKnowledgeBase: {
    method: 'GET' as const,
    path: '/social-media/knowledge-base/:userId',
    responses: {
      200: KnowledgeBaseResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
    },
    query: z.object({
      limit: z.string().optional(),
      offset: z.string().optional(),
    }),
    summary: 'Get knowledge base entries for a user',
  },
};
