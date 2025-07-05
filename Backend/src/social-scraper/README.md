# Social Media Scraper Module

This module provides comprehensive social media profile scraping and knowledge base building functionality using BrightData's API.

## Features

- **Multi-platform scraping**: LinkedIn, Instagram, TikTok, Facebook, Twitter, YouTube
- **Profile and posts scraping**: Extract both profile information and recent posts
- **Knowledge base building**: Process scraped data into structured knowledge entries
- **User insights generation**: Extract professional summary, skills, interests, and engagement metrics
- **Contact management**: Scrape profiles for user contacts

## API Endpoints

### 1. Scrape User Profiles

```http
POST /social-scraper/scrape/:userId
```

Scrapes all available social media profiles for a specific user.

### 2. Scrape Contact Profiles

```http
POST /social-scraper/scrape-contact/:userId/:contactId
```

Scrapes social media profiles for a specific contact of a user.

### 3. Scrape All Contacts

```http
POST /social-scraper/scrape-all-contacts/:userId
```

Scrapes social media profiles for all contacts of a user.

### 4. Update Social Media URLs

```http
POST /social-scraper/update-urls/:userId
Content-Type: application/json

{
  "linkedin_url": "https://www.linkedin.com/in/username",
  "instagram_url": "https://www.instagram.com/username",
  "tiktok_url": "https://www.tiktok.com/@username",
  "facebook_url": "https://www.facebook.com/username",
  "twitter_url": "https://twitter.com/username",
  "youtube_url": "https://www.youtube.com/@username"
}
```

### 5. Get Knowledge Base

```http
GET /social-scraper/knowledge-base/:userId
```

Retrieves the processed knowledge base and insights for a user.

## Database Schema

The module adds the following columns to the `user` table:

```sql
-- Social media profile URLs
linkedin_url          VARCHAR
facebook_url          VARCHAR
instagram_url         VARCHAR
twitter_url           VARCHAR
youtube_url           VARCHAR
tiktok_url            VARCHAR

-- Scraped data (JSONB)
social_media_data     JSONB

-- Last scraping timestamp
last_scraped_at       TIMESTAMP
```

## Configuration

Set the following environment variable:

```env
BRIGHTDATA_API_KEY=your_brightdata_api_key_here
```

## BrightData Dataset IDs

The module uses the following BrightData dataset IDs:

- LinkedIn Profile: `gd_l1viktl72bvl7bjuj0`
- LinkedIn Posts: `gd_lyy3tktm25m4avu764`
- Instagram Profile: `gd_l1vikfch901nx3by4`
- Instagram Posts: `gd_lk5ns7kz21pck8jpis`
- TikTok Profile: `gd_l1villgoiiidt09ci`

## Data Structure

### Social Media Data

The scraped data is stored as JSONB with the following structure:

```json
{
  "linkedin": {
    /* LinkedIn profile data */
  },
  "linkedin_posts": [
    /* LinkedIn posts array */
  ],
  "instagram": {
    /* Instagram profile data */
  },
  "instagram_posts": [
    /* Instagram posts array */
  ],
  "tiktok": {
    /* TikTok profile data */
  },
  "scraped_at": "2025-01-07T10:30:00.000Z"
}
```

### Knowledge Base Entries

Each knowledge base entry contains:

- `userId`: User ID
- `platform`: Social media platform
- `dataType`: Type of data (profile, post, experience, education)
- `content`: Human-readable content
- `metadata`: Additional structured data
- `createdAt`: Timestamp

### User Insights

Generated insights include:

- Professional summary
- Skills and interests
- Companies and education
- Recent activity
- Engagement metrics

## Usage Example

1. **Update user's social media URLs**:

```bash
curl -X POST http://localhost:3000/social-scraper/update-urls/1 \
  -H "Content-Type: application/json" \
  -d '{
    "linkedin_url": "https://www.linkedin.com/in/johndoe",
    "instagram_url": "https://www.instagram.com/johndoe"
  }'
```

2. **Scrape user profiles**:

```bash
curl -X POST http://localhost:3000/social-scraper/scrape/1
```

3. **Get knowledge base**:

```bash
curl -X GET http://localhost:3000/social-scraper/knowledge-base/1
```

## Error Handling

The module includes comprehensive error handling:

- User not found errors
- Contact validation
- BrightData API errors
- Data validation

## Logging

All operations are logged with appropriate log levels:

- Info: Successful operations
- Error: Failed operations with details
- Debug: Detailed operation steps

## Dependencies

- `axios`: HTTP client for BrightData API calls
- `@nestjs/common`: NestJS framework
- `@nestjs/config`: Configuration management
