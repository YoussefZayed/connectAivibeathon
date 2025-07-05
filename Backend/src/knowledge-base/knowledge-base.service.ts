import { Injectable, Logger } from '@nestjs/common';
import { VectorDbService } from '../vector-db/vector-db.service';
import { DatabaseService } from '../core/db/db.service';

@Injectable()
export class KnowledgeBaseService {
  private readonly logger = new Logger(KnowledgeBaseService.name);

  constructor(
    private readonly dbService: DatabaseService,
    private readonly vectorDbService: VectorDbService,
  ) {}

  /**
   * Create a new knowledge base entry and index it in the vector database
   */
  async createKnowledgeBaseEntry(data: {
    userId: number;
    title: string;
    content: string;
    sourcePlatform: string;
    sourceType: string;
    sourceId?: string;
    sourceUrl?: string;
    summary?: string;
    keywords?: string[];
    sentiment?: string;
    topics?: string[];
    confidenceScore?: number;
  }) {
    try {
      // Store in the relational database
      const result = await this.dbService.db
        .insertInto('knowledge_base_entry')
        .values({
          user_id: data.userId,
          title: data.title,
          content: data.content,
          source_platform: data.sourcePlatform,
          source_type: data.sourceType,
          source_id: data.sourceId || null,
          source_url: data.sourceUrl || null,
          summary: data.summary || null,
          keywords: data.keywords ? JSON.stringify(data.keywords) : null,
          sentiment: data.sentiment || null,
          topics: data.topics ? JSON.stringify(data.topics) : null,
          confidence_score: data.confidenceScore || null,
          is_processed: true,
          updatedAt: new Date(),
        })
        .returning(['id'])
        .executeTakeFirstOrThrow();

      // Get the username for the user
      const user = await this.dbService.db
        .selectFrom('user')
        .where('id', '=', data.userId)
        .select(['username'])
        .executeTakeFirstOrThrow();

      // Index in the vector database
      await this.vectorDbService.storeKnowledgeBaseEntry({
        id: result.id,
        userId: data.userId,
        username: user.username,
        title: data.title,
        content: data.content,
        sourcePlatform: data.sourcePlatform,
        sourceType: data.sourceType,
        summary: data.summary,
        keywords: data.keywords,
        topics: data.topics,
      });

      this.logger.log(
        `Created and indexed knowledge base entry for user ${data.userId}`,
      );

      return {
        success: true,
        message: 'Knowledge base entry created and indexed successfully',
        id: result.id,
      };
    } catch (error) {
      this.logger.error(
        `Error creating knowledge base entry: ${error.message}`,
      );
      throw new Error(
        `Failed to create knowledge base entry: ${error.message}`,
      );
    }
  }

  /**
   * Get all knowledge base entries for a specific user
   */
  async getKnowledgeBaseEntries(userId: number) {
    try {
      const entries = await this.dbService.db
        .selectFrom('knowledge_base_entry')
        .where('user_id', '=', userId)
        .selectAll()
        .execute();

      return entries;
    } catch (error) {
      this.logger.error(
        `Error getting knowledge base entries: ${error.message}`,
      );
      throw new Error(`Failed to get knowledge base entries: ${error.message}`);
    }
  }

  /**
   * Get a specific knowledge base entry by ID
   */
  async getKnowledgeBaseEntry(id: number) {
    try {
      const entry = await this.dbService.db
        .selectFrom('knowledge_base_entry')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();

      if (!entry) {
        throw new Error(`Knowledge base entry with ID ${id} not found`);
      }

      return entry;
    } catch (error) {
      this.logger.error(`Error getting knowledge base entry: ${error.message}`);
      throw new Error(`Failed to get knowledge base entry: ${error.message}`);
    }
  }

  /**
   * Query the vector database for similar knowledge base entries
   */
  async queryKnowledge(query: string, userId?: number, limit = 5) {
    try {
      const results = await this.vectorDbService.queryKnowledge(
        query,
        userId,
        limit,
      );

      return results;
    } catch (error) {
      this.logger.error(`Error querying knowledge: ${error.message}`);
      throw new Error(`Failed to query knowledge: ${error.message}`);
    }
  }
}
