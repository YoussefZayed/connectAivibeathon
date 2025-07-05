import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect, QueryCreator } from 'kysely';
import * as DBExcer from '../../../prisma/src/generated/types';
import { Pool } from 'pg';
import { Env } from '../config/env';
import { URL } from 'node:url';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
    private readonly _db: Kysely<DBExcer.DB>;
    private readonly pool: Pool;
    private readonly schema: string;

    constructor(private readonly configService: ConfigService<Env, true>) {
        const connectionString = this.configService.get('DATABASE_URL');

        // Kysely uses the `search_path` for its schema. We extract it from the URL
        // to make it explicit in our queries and avoid ambiguity.
        const url = new URL(connectionString);
        this.schema = url.searchParams.get('schema') ?? 'public';

        this.pool = new Pool({
            connectionString,
        });

        this._db = new Kysely<DBExcer.DB>({
            dialect: new PostgresDialect({
                pool: this.pool,
            }),
        });
    }

    /**
     * Returns a Kysely QueryCreator scoped to the schema defined
     * in the DATABASE_URL.
     */
    get db(): QueryCreator<DBExcer.DB> {
        return this._db.withSchema(this.schema);
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
} 