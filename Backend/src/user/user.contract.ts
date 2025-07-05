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
});
