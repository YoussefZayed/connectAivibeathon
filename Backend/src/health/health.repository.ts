import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core/db/db.service';

@Injectable()
export class HealthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createHealthRecord() {
    return await this.databaseService.db
      .insertInto('health')
      .defaultValues() // Let the DB handle default values
      .returning('createdAt')
      .executeTakeFirstOrThrow();
  }
}
