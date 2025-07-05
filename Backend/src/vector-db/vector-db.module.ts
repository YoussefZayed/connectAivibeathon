import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VectorDbService } from './vector-db.service';
import { VectorDbController } from './vector-db.controller';

@Module({
  imports: [ConfigModule],
  controllers: [VectorDbController],
  providers: [VectorDbService],
  exports: [VectorDbService],
})
export class VectorDbModule {}
