import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { HealthRepository } from './health.repository';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [HealthController],
  providers: [HealthService, HealthRepository],
})
export class HealthModule {}
