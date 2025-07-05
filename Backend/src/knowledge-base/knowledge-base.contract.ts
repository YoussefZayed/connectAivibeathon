import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

export const knowledgeBaseContract = c.router({
  createKnowledgeBaseEntry: {
    method: 'POST',
    path: '/knowledge-base',
    responses: {
      201: z.object({
        success: z.boolean(),
        message: z.string(),
        id: z.number(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
    body: z.object({
      userId: z.number(),
      title: z.string(),
      content: z.string(),
      sourcePlatform: z.string(),
      sourceType: z.string(),
      sourceId: z.string().optional(),
      sourceUrl: z.string().optional(),
      summary: z.string().optional(),
      keywords: z.array(z.string()).optional(),
      sentiment: z.string().optional(),
      topics: z.array(z.string()).optional(),
      confidenceScore: z.number().optional(),
    }),
    summary:
      'Create a new knowledge base entry and index it in the vector database',
  },

  getKnowledgeBaseEntries: {
    method: 'GET',
    path: '/knowledge-base/user/:userId',
    responses: {
      200: z.array(
        z.object({
          id: z.number(),
          createdAt: z.string(),
          updatedAt: z.string(),
          user_id: z.number(),
          title: z.string(),
          content: z.string(),
          source_platform: z.string(),
          source_type: z.string(),
          source_id: z.string().nullable(),
          source_url: z.string().nullable(),
          summary: z.string().nullable(),
          keywords: z.any().nullable(),
          sentiment: z.string().nullable(),
          topics: z.any().nullable(),
          confidence_score: z.number().nullable(),
          is_processed: z.boolean(),
          processing_error: z.string().nullable(),
        }),
      ),
      400: z.object({
        message: z.string(),
      }),
    },
    pathParams: z.object({
      userId: z.string().transform((val) => parseInt(val, 10)),
    }),
    summary: 'Get all knowledge base entries for a specific user',
  },

  getKnowledgeBaseEntry: {
    method: 'GET',
    path: '/knowledge-base/:id',
    responses: {
      200: z.object({
        id: z.number(),
        createdAt: z.string(),
        updatedAt: z.string(),
        user_id: z.number(),
        title: z.string(),
        content: z.string(),
        source_platform: z.string(),
        source_type: z.string(),
        source_id: z.string().nullable(),
        source_url: z.string().nullable(),
        summary: z.string().nullable(),
        keywords: z.any().nullable(),
        sentiment: z.string().nullable(),
        topics: z.any().nullable(),
        confidence_score: z.number().nullable(),
        is_processed: z.boolean(),
        processing_error: z.string().nullable(),
      }),
      400: z.object({
        message: z.string(),
      }),
      404: z.object({
        message: z.string(),
      }),
    },
    pathParams: z.object({
      id: z.string().transform((val) => parseInt(val, 10)),
    }),
    summary: 'Get a specific knowledge base entry by ID',
  },

  queryKnowledge: {
    method: 'POST',
    path: '/knowledge-base/query',
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
    summary: 'Query the vector database for similar knowledge base entries',
  },
});
