import { initContract } from '@ts-rest/core';
import { healthRoutes } from '../health/health.contract';
import { authContract } from '../auth/auth.contract';

const c = initContract();

export const contract = c.router({
    ...healthRoutes,
    ...authContract,
}); 