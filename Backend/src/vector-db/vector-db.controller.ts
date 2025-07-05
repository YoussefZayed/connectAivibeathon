import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { vectorDbContract } from './vector-db.contract';
import { VectorDbService } from './vector-db.service';

@Controller()
export class VectorDbController {
  constructor(private readonly vectorDbService: VectorDbService) {}

  @TsRestHandler(vectorDbContract.indexAllUsers)
  async indexAllUsers() {
    return tsRestHandler(vectorDbContract.indexAllUsers, async ({ body }) => {
      try {
        const result = await this.vectorDbService.indexAllUsers();
        return {
          status: 200,
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

  @TsRestHandler(vectorDbContract.indexAllKnowledgeBaseEntries)
  async indexAllKnowledgeBaseEntries() {
    return tsRestHandler(
      vectorDbContract.indexAllKnowledgeBaseEntries,
      async ({ body }) => {
        try {
          const result =
            await this.vectorDbService.indexAllKnowledgeBaseEntries();
          return {
            status: 200,
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
      },
    );
  }

  @TsRestHandler(vectorDbContract.storeKnowledgeBaseEntry)
  async storeKnowledgeBaseEntry() {
    return tsRestHandler(
      vectorDbContract.storeKnowledgeBaseEntry,
      async ({ body }) => {
        try {
          const result =
            await this.vectorDbService.storeKnowledgeBaseEntry(body);
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
      },
    );
  }

  @TsRestHandler(vectorDbContract.vectorQueryKnowledge)
  async vectorQueryKnowledge() {
    return tsRestHandler(
      vectorDbContract.vectorQueryKnowledge,
      async ({ body }) => {
        try {
          const results = await this.vectorDbService.queryKnowledge(
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
      },
    );
  }
}
