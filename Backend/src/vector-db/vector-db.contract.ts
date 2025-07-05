import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const vectorDbContract = c.router({
  indexAllUsers: {
    method: 'POST',
    path: '/vector-db/index-users',
    responses: {
      200: z.object({
        success: z.boolean(),
        message: z.string(),
        count: z.number(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
    body: z.object({}),
    summary: 'Index all users from the database into the vector database',
  },

  indexAllKnowledgeBaseEntries: {
    method: 'POST',
    path: '/vector-db/index-knowledge',
    responses: {
      200: z.object({
        success: z.boolean(),
        message: z.string(),
        count: z.number(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
    body: z.object({}),
    summary:
      'Index all knowledge base entries from the database into the vector database',
  },

  storeKnowledgeBaseEntry: {
    method: 'POST',
    path: '/vector-db/store-knowledge',
    responses: {
      201: z.object({
        success: z.boolean(),
        message: z.string(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
    body: z.object({
      id: z.number(),
      userId: z.number(),
      username: z.string(),
      title: z.string(),
      content: z.string(),
      sourcePlatform: z.string(),
      sourceType: z.string(),
      summary: z.string().optional(),
      keywords: z.any().optional(),
      topics: z.any().optional(),
    }),
    summary: 'Store a knowledge base entry in the vector database',
  },

  vectorQueryKnowledge: {
    method: 'POST',
    path: '/vector-db/query',
    responses: {
      200: z.object({
        results: z.array(
          z.object({
            text: z.string(),
            metadata: z.record(z.any()),
            score: z.number().optional(),
          }),
        ),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
    body: z.object({
      query: z.string(),
      userId: z.number().optional(),
      limit: z.number().optional(),
    }),
    summary: 'Query the vector database for similar content',
  },
});
