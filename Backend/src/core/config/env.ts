import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('debug'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
  TAVILY_API_KEY: z.string(),
  OPENAI_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
