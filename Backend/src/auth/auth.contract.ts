import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    createdAt: z.date(),
});

const UserWithTokenSchema = z.object({
    accessToken: z.string(),
    user: UserSchema,
});

export const authContract = c.router({
    register: {
        method: 'POST',
        path: '/auth/register',
        body: z.object({
            username: z.string(),
            password: z.string(),
        }),
        responses: {
            201: UserSchema,
        },
        summary: 'Register a new user',
    },
    login: {
        method: 'POST',
        path: '/auth/login',
        body: z.object({
            username: z.string(),
            password: z.string(),
        }),
        responses: {
            200: UserWithTokenSchema,
        },
        summary: 'Login a user',
    },
    me: {
        method: 'GET',
        path: '/auth/me',
        responses: {
            200: UserSchema,
        },
        headers: z.object({
            authorization: z.string(),
        }),
        summary: 'Get user info from access token',
    },
}); 