import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const userContract = c.router({
  addContact: {
    method: 'POST',
    path: '/users/add-contact',
    body: z.object({
      username: z.string(),
    }),
    responses: {
      201: z.object({
        id: z.number(),
        createdAt: z.date(),
        user_id: z.number(),
        contact_id: z.number(),
      }),
      404: z.object({
        message: z.string(),
      }),
      409: z.object({
        message: z.string(),
      }),
    },
    summary: 'Add a user to contacts',
  },
  getContacts: {
    method: 'GET',
    path: '/users/contacts',
    responses: {
      200: z.array(
        z.object({
          id: z.number(),
          username: z.string(),
          createdAt: z.date(),
          contactCreatedAt: z.date(),
        }),
      ),
    },
    summary: 'Get all user contacts',
  },
  createProfile: {
    method: 'POST',
    path: '/users/profile',
    body: z.object({
      fullName: z.string(),
      industry: z.string().optional(),
      hobbies: z.string().optional(),
      lookingFor: z.string().optional(),
      bio: z.string().optional(),
    }),
    responses: {
      201: z.object({
        id: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),
        user_id: z.number(),
        full_name: z.string(),
        industry: z.string().nullable(),
        hobbies: z.string().nullable(),
        looking_for: z.string().nullable(),
        bio: z.string().nullable(),
      }),
      400: z.object({
        message: z.string(),
      }),
      409: z.object({
        message: z.string(),
      }),
    },
    summary: 'Create or update user profile',
  },
  getProfile: {
    method: 'GET',
    path: '/users/profile',
    responses: {
      200: z.object({
        id: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),
        user_id: z.number(),
        full_name: z.string(),
        industry: z.string().nullable(),
        hobbies: z.string().nullable(),
        looking_for: z.string().nullable(),
        bio: z.string().nullable(),
      }),
      404: z.object({
        message: z.string(),
      }),
    },
    summary: 'Get user profile',
  },
  getSocialMediaUrls: {
    method: 'GET',
    path: '/users/social-media',
    responses: {
      200: z.object({
        facebook_url: z.string().nullable(),
        instagram_url: z.string().nullable(),
        linkedin_url: z.string().nullable(),
        tiktok_url: z.string().nullable(),
        twitter_url: z.string().nullable(),
        youtube_url: z.string().nullable(),
      }),
      404: z.object({
        message: z.string(),
      }),
    },
    summary: 'Get all social media URLs for the current user',
  },
  updateSocialMediaUrls: {
    method: 'POST',
    path: '/users/social-media',
    body: z.object({
      facebook_url: z.string().optional().nullable(),
      instagram_url: z.string().optional().nullable(),
      linkedin_url: z.string().optional().nullable(),
      tiktok_url: z.string().optional().nullable(),
      twitter_url: z.string().optional().nullable(),
      youtube_url: z.string().optional().nullable(),
    }),
    responses: {
      200: z.object({
        facebook_url: z.string().nullable(),
        instagram_url: z.string().nullable(),
        linkedin_url: z.string().nullable(),
        tiktok_url: z.string().nullable(),
        twitter_url: z.string().nullable(),
        youtube_url: z.string().nullable(),
      }),
      404: z.object({
        message: z.string(),
      }),
    },
    summary: 'Update social media URLs for the current user',
  },
});
