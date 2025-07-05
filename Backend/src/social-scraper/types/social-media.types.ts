// LinkedIn Profile Types
export interface LinkedInProfile {
  timestamp: string;
  linkedin_num_id: string;
  url: string;
  name: string;
  country_code: string;
  city: string;
  about: string;
  followers: number;
  connections: number;
  position: string;
  experience: LinkedInExperience[];
  current_company: LinkedInCompany;
  current_company_name: string;
  posts: any;
  activity: LinkedInActivity[];
  education: LinkedInEducation[];
  educations_details: string;
  courses: any;
  certifications: LinkedInCertification[];
  honors_and_awards: any;
  volunteer_experience: any;
  organizations: any;
  recommendations_count: any;
  recommendations: any;
  languages: any;
  projects: any;
  patents: any;
  publications: any;
  avatar: string;
  default_avatar: boolean;
  banner_image: string;
  similar_profiles: any[];
  people_also_viewed: any;
  memorialized_account: boolean;
  input_url: string;
  linkedin_id: string;
  bio_links: any[];
  first_name: string;
  last_name: string;
}

export interface LinkedInExperience {
  company: string;
  company_id: string;
  company_logo_url: string | null;
  description_html: string | null;
  duration: string;
  location: string;
  positions: LinkedInPosition[];
  title: string;
  url: string;
}

export interface LinkedInPosition {
  description_html: string | null;
  end_date: string;
  location: string;
  meta: string;
  start_date: string;
  subtitle: string;
  title: string;
}

export interface LinkedInCompany {
  company_id: string;
  link: string;
  location: string;
  name: string;
  title: string;
}

export interface LinkedInActivity {
  id: string;
  img: string | null;
  interaction: string;
  link: string;
  title: string;
}

export interface LinkedInEducation {
  degree: string;
  description: string | null;
  description_html: string | null;
  end_year: string;
  institute_logo_url: string;
  start_year: string;
  title: string;
  url: string;
}

export interface LinkedInCertification {
  credential_id: string | null;
  credential_url: string | null;
  meta: string;
  subtitle: string;
  title: string;
}

// Instagram Types
export interface InstagramPost {
  url: string;
  user_posted: string;
  description: string;
  hashtags: string[];
  num_comments: number;
  date_posted: string;
  likes: number;
  photos: string[];
  videos: string[];
  location: string | null;
  latest_comments: InstagramComment[];
  post_id: string;
  discovery_input: any;
  has_handshake: any;
  shortcode: string;
  content_type: string;
  pk: string;
  content_id: string;
  engagement_score_view: number;
  thumbnail: string;
  video_view_count: number | null;
  product_type: string;
  coauthor_producers: any;
  tagged_users: any;
  video_play_count: number;
  followers: number;
  posts_count: number;
  profile_image_link: string;
  is_verified: boolean;
  is_paid_partnership: boolean;
  partnership_details: any;
  user_posted_id: string;
  post_content: InstagramPostContent[];
  audio: InstagramAudio;
  profile_url: string;
  videos_duration: InstagramVideoDuration[];
  images: any[];
  alt_text: string | null;
  photos_number: number;
}

export interface InstagramComment {
  comments: string;
  likes: number;
  profile_picture: string;
  user_commenting: string;
}

export interface InstagramPostContent {
  id: string;
  index: number;
  type: string;
  url: string;
}

export interface InstagramAudio {
  audio_asset_id: string;
  ig_artist_id: string;
  ig_artist_username: string;
  original_audio_title: string;
}

export interface InstagramVideoDuration {
  url: string;
  video_duration: number;
}

// TikTok Types
export interface TikTokProfile {
  // Add TikTok profile structure based on BrightData response
  [key: string]: any;
}

// Facebook Types
export interface FacebookProfile {
  // Add Facebook profile structure based on BrightData response
  [key: string]: any;
}

// Twitter Types
export interface TwitterProfile {
  // Add Twitter profile structure based on BrightData response
  [key: string]: any;
}

// YouTube Types
export interface YouTubeProfile {
  // Add YouTube profile structure based on BrightData response
  [key: string]: any;
}

// Combined Social Media Data
export interface SocialMediaData {
  linkedin?: LinkedInProfile;
  linkedin_posts?: InstagramPost[];
  instagram?: any;
  instagram_posts?: InstagramPost[];
  tiktok?: TikTokProfile;
  facebook?: FacebookProfile;
  twitter?: TwitterProfile;
  youtube?: YouTubeProfile;
  scraped_at: string;
}

// BrightData Configuration
export interface BrightDataConfig {
  apiKey: string;
  datasets: {
    linkedin_profile: string;
    linkedin_posts: string;
    instagram_profile: string;
    instagram_posts: string;
    tiktok_profile: string;
    facebook_profile: string;
    twitter_profile: string;
    youtube_profile: string;
  };
}

// Scraping Request Types
export interface ScrapingRequest {
  url: string;
  [key: string]: any;
}

export interface ScrapingResponse {
  success: boolean;
  data?: any;
  error?: string;
  platform: string;
}
