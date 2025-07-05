import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VectorDbService } from './vector-db.service';
import { VectorDbController } from './vector-db.controller';
import { DbModule } from '../core/db/db.module';

@Module({
  imports: [ConfigModule, DbModule],
  controllers: [VectorDbController],
  providers: [VectorDbService],
  exports: [VectorDbService],
})
export class VectorDbModule {}
