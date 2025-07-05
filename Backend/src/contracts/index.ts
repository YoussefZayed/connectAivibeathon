import { initContract } from '@ts-rest/core';
import { healthRoutes } from '../health/health.contract';
import { authContract } from '../auth/auth.contract';
import { userContract } from '../user/user.contract';
import { eventsRoutes } from '../events/events.contract';
import { socialMediaContract } from './social-media.contract';
import { vectorDbContract } from '../vector-db/vector-db.contract';
import { knowledgeBaseContract } from '../knowledge-base/knowledge-base.contract';

const c = initContract();

export const contract = c.router({
  ...healthRoutes,
  ...authContract,
  ...userContract,
  ...eventsRoutes,
  ...socialMediaContract,
  vectorDb: vectorDbContract,
  knowledgeBase: knowledgeBaseContract,
});
