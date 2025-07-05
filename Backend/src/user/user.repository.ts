import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../../prisma/src/generated/types';
import { DatabaseService } from '../core/db/db.service';

@Injectable()
export class UserRepository {
    private readonly db: Kysely<DB>;
    constructor(private readonly databaseService: DatabaseService) {
        this.db = this.databaseService.db as Kysely<DB>;
    }

    async create(createUserDto: any) {
        return await this.db
            .insertInto('user')
            .values(createUserDto)
            .returningAll()
            .executeTakeFirstOrThrow();
    }

    async findByUsername(username: string) {
        return await this.db
            .selectFrom('user')
            .selectAll()
            .where('username', '=', username)
            .executeTakeFirst();
    }

    async findById(id: number) {
        return await this.db
            .selectFrom('user')
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();
    }
} 