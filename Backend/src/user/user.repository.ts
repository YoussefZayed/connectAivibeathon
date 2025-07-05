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

  async addContact(userId: number, contactId: number) {
    return await this.db
      .insertInto('user_contacts')
      .values({ user_id: userId, contact_id: contactId })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async checkContactExists(userId: number, contactId: number) {
    return await this.db
      .selectFrom('user_contacts')
      .selectAll()
      .where('user_id', '=', userId)
      .where('contact_id', '=', contactId)
      .executeTakeFirst();
  }

  async addBidirectionalContact(userId: number, contactId: number) {
    // Use a transaction to ensure both contacts are created or none
    return await this.db.transaction().execute(async (trx) => {
      // Add user as contact of contactId
      const contact1 = await trx
        .insertInto('user_contacts')
        .values({ user_id: userId, contact_id: contactId })
        .returningAll()
        .executeTakeFirstOrThrow();

      // Add contactId as contact of user
      const contact2 = await trx
        .insertInto('user_contacts')
        .values({ user_id: contactId, contact_id: userId })
        .returningAll()
        .executeTakeFirstOrThrow();

      return { contact1, contact2 };
    });
  }

  async getUserContacts(userId: number) {
    console.log('Getting contacts for user ID:', userId);

    const result = await this.db
      .selectFrom('user_contacts')
      .innerJoin('user', 'user.id', 'user_contacts.contact_id')
      .select([
        'user.id',
        'user.username',
        'user.createdAt',
        'user_contacts.createdAt as contactCreatedAt',
      ])
      .where('user_contacts.user_id', '=', userId)
      .orderBy('user_contacts.createdAt', 'desc')
      .execute();

    console.log('Query result:', result);
    return result;
  }
}
