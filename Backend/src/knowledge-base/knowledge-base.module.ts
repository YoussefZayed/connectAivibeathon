import { Module } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { VectorDbModule } from '../vector-db/vector-db.module';

@Module({
  imports: [VectorDbModule],
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService],
  exports: [KnowledgeBaseService],
})
export class KnowledgeBaseModule {}
