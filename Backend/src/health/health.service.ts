import { Injectable } from '@nestjs/common';
import { HealthRepository } from './health.repository';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class HealthService {
  constructor(
    private readonly healthRepository: HealthRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(HealthService.name);
  }

  async checkHealth() {
    this.logger.info('Performing health check...');
    const result: { createdAt: Date } =
      await this.healthRepository.createHealthRecord();
    this.logger.info('Health check successful.');
    this.logger.debug('DEBUG: Health check successful.');

    return {
      status: 'ok',
      timestamp: result.createdAt.toISOString(),
    };
  }
}
