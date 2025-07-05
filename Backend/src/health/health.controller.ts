import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { healthRoutes } from './health.contract';
import { HealthService } from './health.service';
import { initContract } from '@ts-rest/core';

const c = initContract();
const healthContract = c.router(healthRoutes);

@Controller()
export class HealthController {
    constructor(private readonly healthService: HealthService) { }

    @TsRestHandler(healthContract.healthCheck)
    async healthCheck() {
        return tsRestHandler(healthContract.healthCheck, async () => {
            const result = await this.healthService.checkHealth();

            return {
                status: 200,
                body: result,
            };
        });
    }
} 