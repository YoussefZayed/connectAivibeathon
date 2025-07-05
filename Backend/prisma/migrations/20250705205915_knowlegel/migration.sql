-- AlterTable
ALTER TABLE "user" ADD COLUMN     "facebook_url" TEXT,
ADD COLUMN     "instagram_url" TEXT,
ADD COLUMN     "linkedin_url" TEXT,
ADD COLUMN     "tiktok_url" TEXT,
ADD COLUMN     "twitter_url" TEXT,
ADD COLUMN     "youtube_url" TEXT;

-- CreateTable
CREATE TABLE "facebook_profile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "profile_data" JSONB,
    "last_scraped" TIMESTAMP(3),
    "scraping_status" TEXT NOT NULL DEFAULT 'pending',
    "scraping_error" TEXT,

    CONSTRAINT "facebook_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instagram_profile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "profile_data" JSONB,
    "last_scraped" TIMESTAMP(3),
    "scraping_status" TEXT NOT NULL DEFAULT 'pending',
    "scraping_error" TEXT,

    CONSTRAINT "instagram_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_base_entry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source_platform" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT,
    "source_url" TEXT,
    "summary" TEXT,
    "keywords" JSONB,
    "sentiment" TEXT,
    "topics" JSONB,
    "confidence_score" DOUBLE PRECISION,
    "is_processed" BOOLEAN NOT NULL DEFAULT false,
    "processing_error" TEXT,

    CONSTRAINT "knowledge_base_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linkedin_posts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "post_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "post_type" TEXT,
    "date_posted" TIMESTAMP(3),
    "title" TEXT,
    "post_text" TEXT,
    "hashtags" JSONB,
    "embedded_links" JSONB,
    "images" JSONB,
    "videos" JSONB,
    "video_duration" INTEGER,
    "num_likes" INTEGER,
    "num_comments" INTEGER,
    "top_visible_comments" JSONB,
    "tagged_companies" JSONB,
    "tagged_people" JSONB,
    "last_scraped" TIMESTAMP(3),
    "scraping_status" TEXT NOT NULL DEFAULT 'pending',
    "scraping_error" TEXT,

    CONSTRAINT "linkedin_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linkedin_profile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "linkedin_id" TEXT,
    "linkedin_num_id" TEXT,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "country_code" TEXT,
    "city" TEXT,
    "about" TEXT,
    "followers" INTEGER,
    "connections" INTEGER,
    "position" TEXT,
    "current_company_name" TEXT,
    "avatar" TEXT,
    "banner_image" TEXT,
    "experience" JSONB,
    "education" JSONB,
    "certifications" JSONB,
    "activity" JSONB,
    "posts" JSONB,
    "last_scraped" TIMESTAMP(3),
    "scraping_status" TEXT NOT NULL DEFAULT 'pending',
    "scraping_error" TEXT,

    CONSTRAINT "linkedin_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_profile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "profile_data" JSONB,
    "last_scraped" TIMESTAMP(3),
    "scraping_status" TEXT NOT NULL DEFAULT 'pending',
    "scraping_error" TEXT,

    CONSTRAINT "tiktok_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twitter_profile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "profile_data" JSONB,
    "last_scraped" TIMESTAMP(3),
    "scraping_status" TEXT NOT NULL DEFAULT 'pending',
    "scraping_error" TEXT,

    CONSTRAINT "twitter_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "youtube_profile" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "profile_data" JSONB,
    "last_scraped" TIMESTAMP(3),
    "scraping_status" TEXT NOT NULL DEFAULT 'pending',
    "scraping_error" TEXT,

    CONSTRAINT "youtube_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facebook_profile_user_id_key" ON "facebook_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "instagram_profile_user_id_key" ON "instagram_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "linkedin_posts_post_id_key" ON "linkedin_posts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "linkedin_profile_user_id_key" ON "linkedin_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tiktok_profile_user_id_key" ON "tiktok_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "twitter_profile_user_id_key" ON "twitter_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "youtube_profile_user_id_key" ON "youtube_profile"("user_id");

-- AddForeignKey
ALTER TABLE "facebook_profile" ADD CONSTRAINT "facebook_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instagram_profile" ADD CONSTRAINT "instagram_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knowledge_base_entry" ADD CONSTRAINT "knowledge_base_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linkedin_posts" ADD CONSTRAINT "linkedin_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "linkedin_profile" ADD CONSTRAINT "linkedin_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiktok_profile" ADD CONSTRAINT "tiktok_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twitter_profile" ADD CONSTRAINT "twitter_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "youtube_profile" ADD CONSTRAINT "youtube_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
