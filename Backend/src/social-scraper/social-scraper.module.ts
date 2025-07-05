import { Module } from '@nestjs/common';
import { SocialScraperService } from './social-scraper.service';
import { SocialScraperController } from './social-scraper.controller';
import { BrightDataService } from './services/brightdata.service';
import { KnowledgeBaseService } from './services/knowledge-base.service';
import { DbModule } from '../core/db/db.module';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [DbModule],
  controllers: [SocialScraperController],
  providers: [
    SocialScraperService,
    BrightDataService,
    KnowledgeBaseService,
    UserRepository,
  ],
  exports: [SocialScraperService],
})
export class SocialScraperModule {}
