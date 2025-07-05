import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { knowledgeBaseContract } from './knowledge-base.contract';
import { KnowledgeBaseService } from './knowledge-base.service';

@Controller()
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  @TsRestHandler(knowledgeBaseContract.createKnowledgeBaseEntry)
  async createKnowledgeBaseEntry() {
    return tsRestHandler(knowledgeBaseContract.createKnowledgeBaseEntry, async ({ body }) => {
      try {
        const result = await this.knowledgeBaseService.createKnowledgeBaseEntry(body);
        return {
          status: 201,
          body: result,
        };
      } catch (error) {
        return {
          status: 400,
          body: {
            message: error.message,
          },
        };
      }
    });
  }

  @TsRestHandler(knowledgeBaseContract.getKnowledgeBaseEntries)
  async getKnowledgeBaseEntries() {
    return tsRestHandler(knowledgeBaseContract.getKnowledgeBaseEntries, async ({ params }) => {
      try {
        const entries = await this.knowledgeBaseService.getKnowledgeBaseEntries(params.userId);
        return {
          status: 200,
          body: entries.map(entry => ({
            ...entry,
            createdAt: entry.createdAt.toISOString(),
            updatedAt: entry.updatedAt.toISOString(),
          })),
        };
      } catch (error) {
        return {
          status: 400,
          body: {
            message: error.message,
          },
        };
      }
    });
  }

  @TsRestHandler(knowledgeBaseContract.getKnowledgeBaseEntry)
  async getKnowledgeBaseEntry() {
    return tsRestHandler(knowledgeBaseContract.getKnowledgeBaseEntry, async ({ params }) => {
      try {
        const entry = await this.knowledgeBaseService.getKnowledgeBaseEntry(params.id);
        
        if (!entry) {
          return {
            status: 404,
            body: {
              message: `Knowledge base entry with ID ${params.id} not found`,
            },
          };
        }
        
        return {
          status: 200,
          body: {
            ...entry,
            createdAt: entry.createdAt.toISOString(),
            updatedAt: entry.updatedAt.toISOString(),
          },
        };
      } catch (error) {
        if (error.message.includes('not found')) {
          return {
            status: 404,
            body: {
              message: error.message,
            },
          };
        }
        
        return {
          status: 400,
          body: {
            message: error.message,
          },
        };
      }
    });
  }

  @TsRestHandler(knowledgeBaseContract.queryKnowledge)
  async queryKnowledge() {
    return tsRestHandler(knowledgeBaseContract.queryKnowledge, async ({ body }) => {
      try {
        const results = await this.knowledgeBaseService.queryKnowledge(
          body.query,
          body.userId,
          body.limit,
        );
        return {
          status: 200,
          body: results,
        };
      } catch (error) {
        return {
          status: 400,
          body: {
            message: error.message,
          },
        };
      }
    });
  }
}
