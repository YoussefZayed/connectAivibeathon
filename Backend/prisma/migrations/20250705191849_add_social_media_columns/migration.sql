-- AlterTable
ALTER TABLE "user" ADD COLUMN     "facebook_url" TEXT,
ADD COLUMN     "instagram_url" TEXT,
ADD COLUMN     "last_scraped_at" TIMESTAMP(3),
ADD COLUMN     "linkedin_url" TEXT,
ADD COLUMN     "social_media_data" JSONB,
ADD COLUMN     "tiktok_url" TEXT,
ADD COLUMN     "twitter_url" TEXT,
ADD COLUMN     "youtube_url" TEXT;
