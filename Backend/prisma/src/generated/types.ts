import type { ColumnType } from "kysely";
export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type eventsData = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  event_name: string;
  event_description: string;
  event_date: Timestamp;
  image_url: string;
};
export type facebook_profile = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  user_id: number;
  profile_data: unknown | null;
  last_scraped: Timestamp | null;
  scraping_status: Generated<string>;
  scraping_error: string | null;
};
export type health = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
};
export type instagram_profile = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  user_id: number;
  profile_data: unknown | null;
  last_scraped: Timestamp | null;
  scraping_status: Generated<string>;
  scraping_error: string | null;
};
export type knowledge_base_entry = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  user_id: number;
  title: string;
  content: string;
  source_platform: string;
  source_type: string;
  source_id: string | null;
  source_url: string | null;
  summary: string | null;
  keywords: unknown | null;
  sentiment: string | null;
  topics: unknown | null;
  confidence_score: number | null;
  is_processed: Generated<boolean>;
  processing_error: string | null;
};
export type linkedin_posts = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  user_id: number;
  post_id: string;
  url: string;
  post_type: string | null;
  date_posted: Timestamp | null;
  title: string | null;
  post_text: string | null;
  hashtags: unknown | null;
  embedded_links: unknown | null;
  images: unknown | null;
  videos: unknown | null;
  video_duration: number | null;
  num_likes: number | null;
  num_comments: number | null;
  top_visible_comments: unknown | null;
  tagged_companies: unknown | null;
  tagged_people: unknown | null;
  last_scraped: Timestamp | null;
  scraping_status: Generated<string>;
  scraping_error: string | null;
};
export type linkedin_profile = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  user_id: number;
  linkedin_id: string | null;
  linkedin_num_id: string | null;
  url: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  country_code: string | null;
  city: string | null;
  about: string | null;
  followers: number | null;
  connections: number | null;
  position: string | null;
  current_company_name: string | null;
  avatar: string | null;
  banner_image: string | null;
  experience: unknown | null;
  education: unknown | null;
  certifications: unknown | null;
  activity: unknown | null;
  posts: unknown | null;
  last_scraped: Timestamp | null;
  scraping_status: Generated<string>;
  scraping_error: string | null;
};
export type tiktok_profile = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  user_id: number;
  profile_data: unknown | null;
  last_scraped: Timestamp | null;
  scraping_status: Generated<string>;
  scraping_error: string | null;
};
export type twitter_profile = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  user_id: number;
  profile_data: unknown | null;
  last_scraped: Timestamp | null;
  scraping_status: Generated<string>;
  scraping_error: string | null;
};
export type user = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  username: string;
  password: string;
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  tiktok_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
};
export type user_contacts = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  user_id: number;
  contact_id: number;
};
export type user_profile = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  user_id: number;
  full_name: string;
  industry: string | null;
  hobbies: string | null;
  looking_for: string | null;
  bio: string | null;
};
export type youtube_profile = {
  id: Generated<number>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  user_id: number;
  profile_data: unknown | null;
  last_scraped: Timestamp | null;
  scraping_status: Generated<string>;
  scraping_error: string | null;
};
export type DB = {
  eventsData: eventsData;
  facebook_profile: facebook_profile;
  health: health;
  instagram_profile: instagram_profile;
  knowledge_base_entry: knowledge_base_entry;
  linkedin_posts: linkedin_posts;
  linkedin_profile: linkedin_profile;
  tiktok_profile: tiktok_profile;
  twitter_profile: twitter_profile;
  user: user;
  user_contacts: user_contacts;
  user_profile: user_profile;
  youtube_profile: youtube_profile;
};
