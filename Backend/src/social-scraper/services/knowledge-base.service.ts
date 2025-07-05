import { Injectable, Logger } from '@nestjs/common';
import {
  SocialMediaData,
  LinkedInProfile,
  InstagramPost,
} from '../types/social-media.types';

export interface KnowledgeBaseEntry {
  userId: number;
  platform: string;
  dataType: string;
  content: string;
  metadata: any;
  createdAt: Date;
}

export interface UserInsights {
  userId: number;
  professionalSummary: string;
  interests: string[];
  skills: string[];
  companies: string[];
  education: string[];
  recentActivity: string[];
  engagementMetrics: {
    totalFollowers: number;
    totalPosts: number;
    averageLikes: number;
  };
}

@Injectable()
export class KnowledgeBaseService {
  private readonly logger = new Logger(KnowledgeBaseService.name);

  buildKnowledgeBase(
    socialMediaData: SocialMediaData,
    userId: number,
  ): KnowledgeBaseEntry[] {
    this.logger.debug(`Building knowledge base for user ${userId}`);
    const entries: KnowledgeBaseEntry[] = [];

    // Process LinkedIn data
    if (socialMediaData.linkedin) {
      entries.push(
        ...this.processLinkedInData(socialMediaData.linkedin, userId),
      );
    }

    // Process LinkedIn posts
    if (socialMediaData.linkedin_posts) {
      entries.push(
        ...this.processLinkedInPosts(socialMediaData.linkedin_posts, userId),
      );
    }

    // Process Instagram data
    if (socialMediaData.instagram) {
      entries.push(
        ...this.processInstagramData(socialMediaData.instagram, userId),
      );
    }

    // Process Instagram posts
    if (socialMediaData.instagram_posts) {
      entries.push(
        ...this.processInstagramPosts(socialMediaData.instagram_posts, userId),
      );
    }

    // Process TikTok data
    if (socialMediaData.tiktok) {
      entries.push(...this.processTikTokData(socialMediaData.tiktok, userId));
    }

    this.logger.log(
      `Built knowledge base with ${entries.length} entries for user ${userId}`,
    );
    return entries;
  }

  generateUserInsights(
    socialMediaData: SocialMediaData,
    userId: number,
  ): UserInsights {
    const insights: UserInsights = {
      userId,
      professionalSummary: '',
      interests: [],
      skills: [],
      companies: [],
      education: [],
      recentActivity: [],
      engagementMetrics: {
        totalFollowers: 0,
        totalPosts: 0,
        averageLikes: 0,
      },
    };

    // Extract LinkedIn insights
    if (socialMediaData.linkedin) {
      const linkedin = socialMediaData.linkedin;

      // Professional summary
      if (linkedin.about) {
        insights.professionalSummary = linkedin.about;
      }

      // Skills from experience
      if (linkedin.experience) {
        linkedin.experience.forEach((exp) => {
          if (exp.company) insights.companies.push(exp.company);
          if (exp.title) insights.skills.push(exp.title);
        });
      }

      // Education
      if (linkedin.education) {
        linkedin.education.forEach((edu) => {
          if (edu.title) insights.education.push(edu.title);
        });
      }

      // Recent activity
      if (linkedin.activity) {
        linkedin.activity.slice(0, 5).forEach((activity) => {
          if (activity.title) insights.recentActivity.push(activity.title);
        });
      }

      // Engagement metrics
      if (linkedin.followers) {
        insights.engagementMetrics.totalFollowers += linkedin.followers;
      }
    }

    // Extract Instagram insights
    if (socialMediaData.instagram_posts) {
      const posts = socialMediaData.instagram_posts;

      // Interests from hashtags
      posts.forEach((post) => {
        if (post.hashtags) {
          insights.interests.push(...post.hashtags);
        }
      });

      // Engagement metrics
      insights.engagementMetrics.totalPosts += posts.length;
      const totalLikes = posts.reduce(
        (sum, post) => sum + (post.likes || 0),
        0,
      );
      insights.engagementMetrics.averageLikes =
        posts.length > 0 ? totalLikes / posts.length : 0;
    }

    // Remove duplicates
    insights.interests = [...new Set(insights.interests)];
    insights.skills = [...new Set(insights.skills)];
    insights.companies = [...new Set(insights.companies)];
    insights.education = [...new Set(insights.education)];

    this.logger.log(`Generated insights for user ${userId}`);
    return insights;
  }

  private processLinkedInData(
    linkedin: LinkedInProfile,
    userId: number,
  ): KnowledgeBaseEntry[] {
    const entries: KnowledgeBaseEntry[] = [];

    // Basic profile information
    entries.push({
      userId,
      platform: 'linkedin',
      dataType: 'profile',
      content: `Name: ${linkedin.name}, Position: ${linkedin.position}, Location: ${linkedin.city}`,
      metadata: {
        followers: linkedin.followers,
        connections: linkedin.connections,
        country: linkedin.country_code,
      },
      createdAt: new Date(),
    });

    // Experience
    if (linkedin.experience) {
      linkedin.experience.forEach((exp, index) => {
        entries.push({
          userId,
          platform: 'linkedin',
          dataType: 'experience',
          content: `${exp.title} at ${exp.company} - ${exp.duration}`,
          metadata: {
            company: exp.company,
            title: exp.title,
            duration: exp.duration,
            location: exp.location,
            index,
          },
          createdAt: new Date(),
        });
      });
    }

    // Education
    if (linkedin.education) {
      linkedin.education.forEach((edu, index) => {
        entries.push({
          userId,
          platform: 'linkedin',
          dataType: 'education',
          content: `${edu.degree} from ${edu.title} (${edu.start_year}-${edu.end_year})`,
          metadata: {
            institution: edu.title,
            degree: edu.degree,
            startYear: edu.start_year,
            endYear: edu.end_year,
            index,
          },
          createdAt: new Date(),
        });
      });
    }

    return entries;
  }

  private processLinkedInPosts(
    posts: InstagramPost[],
    userId: number,
  ): KnowledgeBaseEntry[] {
    return posts.map((post, index) => ({
      userId,
      platform: 'linkedin',
      dataType: 'post',
      content: post.description || 'LinkedIn post',
      metadata: {
        likes: post.likes,
        comments: post.num_comments,
        datePosted: post.date_posted,
        index,
      },
      createdAt: new Date(),
    }));
  }

  private processInstagramData(
    instagram: any,
    userId: number,
  ): KnowledgeBaseEntry[] {
    const entries: KnowledgeBaseEntry[] = [];

    // Basic profile information
    entries.push({
      userId,
      platform: 'instagram',
      dataType: 'profile',
      content: `Instagram profile: ${instagram.username || 'Unknown'}`,
      metadata: {
        followers: instagram.followers,
        posts: instagram.posts_count,
        verified: instagram.is_verified,
      },
      createdAt: new Date(),
    });

    return entries;
  }

  private processInstagramPosts(
    posts: InstagramPost[],
    userId: number,
  ): KnowledgeBaseEntry[] {
    return posts.map((post, index) => ({
      userId,
      platform: 'instagram',
      dataType: 'post',
      content: post.description || 'Instagram post',
      metadata: {
        likes: post.likes,
        comments: post.num_comments,
        hashtags: post.hashtags,
        datePosted: post.date_posted,
        contentType: post.content_type,
        index,
      },
      createdAt: new Date(),
    }));
  }

  private processTikTokData(tiktok: any, userId: number): KnowledgeBaseEntry[] {
    const entries: KnowledgeBaseEntry[] = [];

    // Basic profile information
    entries.push({
      userId,
      platform: 'tiktok',
      dataType: 'profile',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      content: `TikTok profile: ${tiktok.username || 'Unknown'}`,
      metadata: {
        followers: tiktok.followers,
        posts: tiktok.posts_count,
        verified: tiktok.is_verified,
      },
      createdAt: new Date(),
    });

    return entries;
  }
}
