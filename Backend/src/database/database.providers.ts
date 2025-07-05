import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from '../../prisma/src/generated/types';

export const KYSELY = 'KYSELY';

export const databaseProviders: Provider[] = [
  {
    provide: KYSELY,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const connectionString = configService.get<string>('DATABASE_URL');
      
      if (!connectionString) {
        throw new Error('DATABASE_URL is not defined in environment variables');
      }
      
      const dialect = new PostgresDialect({
        pool: new Pool({
          connectionString,
        }),
      });
      
      return new Kysely<DB>({
        dialect,
      });
    },
  },
];
