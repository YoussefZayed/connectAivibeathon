import { z } from 'zod';

export const healthRoutes = {
    healthCheck: {
        method: 'GET',
        path: '/health',
        responses: {
            200: z.object({
                status: z.string(),
                timestamp: z.string().datetime(),
            }),
        },
        summary: 'Performs a health check',
    },
} as const; 