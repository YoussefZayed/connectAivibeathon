import { initContract } from '@ts-rest/core';
import { healthRoutes } from '../health/health.contract';
import { authContract } from '../auth/auth.contract';
import { userContract } from '../user/user.contract';
import { eventsRoutes } from '../events/events.contract';
import { socialMediaContract } from './social-media.contract';

const c = initContract();

export const contract = c.router({
  ...healthRoutes,
  ...authContract,
  ...userContract,
  ...eventsRoutes,
  ...socialMediaContract,
});
