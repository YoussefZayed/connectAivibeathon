import { initContract } from '@ts-rest/core';
import { healthRoutes } from '../health/health.contract';
import { authContract } from '../auth/auth.contract';
import { vectorDbContract } from '../vector-db/vector-db.contract';
import { knowledgeBaseContract } from '../knowledge-base/knowledge-base.contract';

const c = initContract();

export const contract = c.router({
    ...healthRoutes,
    ...authContract,
    vectorDb: vectorDbContract,
    knowledgeBase: knowledgeBaseContract,
}); 
