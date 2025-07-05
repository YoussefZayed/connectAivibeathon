import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Document } from 'langchain/document';
import { DatabaseService } from '../core/db/db.service';

@Injectable()
export class VectorDbService implements OnModuleInit {
  private embeddings: OpenAIEmbeddings;
  private vectorStore: PGVectorStore;
  private pool: Pool;
  private readonly logger = new Logger(VectorDbService.name);

  constructor(
    private configService: ConfigService,
    private readonly dbService: DatabaseService
  ) {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
    
    this.pool = new Pool({
      connectionString: this.configService.get<string>('DATABASE_URL'),
    });
  }

  async onModuleInit() {
    try {
      // Create pgvector extension if it doesn't exist
      await this.pool.query('CREATE EXTENSION IF NOT EXISTS vector');
      
      // Initialize the vector store
      this.vectorStore = await PGVectorStore.initialize(
        this.embeddings,
        {
          postgresConnectionOptions: {
            connectionString: this.configService.get<string>('DATABASE_URL'),
          },
          tableName: 'knowledge_vectors',
          columns: {
            idColumnName: 'id',
            vectorColumnName: 'embedding',
            contentColumnName: 'content',
            metadataColumnName: 'metadata',
          },
        }
      );
      
      this.logger.log('Vector database initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize vector database: ${error.message}`);
      // Don't throw here to allow the application to start even if vector DB setup fails
      // The service methods will handle errors individually
    }
  }

  /**
   * Index all users from the database into the vector database
   */
  async indexAllUsers() {
    try {
      if (!this.vectorStore) {
        throw new Error('Vector store not initialized');
      }
      
      // Fetch all users from the database
      const users = await this.dbService.db.selectFrom('user').selectAll().execute();
      
      if (!users.length) {
        this.logger.log('No users found to index');
        return {
          success: true,
          message: 'No users found to index',
          count: 0,
        };
      }
      
      // Convert users to documents for the vector store
      const docs = users.map(user => new Document({
        pageContent: `Username: ${user.username}`,
        metadata: { 
          userId: user.id.toString(),
          createdAt: user.createdAt.toISOString(),
          documentType: 'user',
        },
      }));
      
      // Add documents to the vector store
      await this.vectorStore.addDocuments(docs);
      
      this.logger.log(`Indexed ${users.length} users into the vector database`);
      
      return {
        success: true,
        message: `Indexed ${users.length} users into the vector database`,
        count: users.length,
      };
    } catch (error) {
      this.logger.error(`Error indexing users: ${error.message}`);
      throw new Error(`Failed to index users: ${error.message}`);
    }
  }

  /**
   * Index all knowledge base entries from the database into the vector database
   */
  async indexAllKnowledgeBaseEntries() {
    try {
      if (!this.vectorStore) {
        throw new Error('Vector store not initialized');
      }
      
      // Fetch all knowledge base entries from the database
      const entries = await this.dbService.db
        .selectFrom('knowledge_base_entry')
        .innerJoin('user', 'user.id', 'knowledge_base_entry.user_id')
        .select([
          'knowledge_base_entry.id',
          'knowledge_base_entry.title',
          'knowledge_base_entry.content',
          'knowledge_base_entry.source_platform',
          'knowledge_base_entry.source_type',
          'knowledge_base_entry.user_id',
          'knowledge_base_entry.summary',
          'knowledge_base_entry.keywords',
          'knowledge_base_entry.topics',
          'user.username',
        ])
        .execute();
      
      if (!entries.length) {
        this.logger.log('No knowledge base entries found to index');
        return {
          success: true,
          message: 'No knowledge base entries found to index',
          count: 0,
        };
      }
      
      // Convert entries to documents for the vector store
      const docs = entries.map(entry => {
        // Combine title and content for better semantic search
        const content = `${entry.title}\n\n${entry.content}`;
        
        // If there's a summary, add it to the content
        const fullContent = entry.summary 
          ? `${content}\n\nSummary: ${entry.summary}` 
          : content;
        
        return new Document({
          pageContent: fullContent,
          metadata: { 
            id: entry.id.toString(),
            userId: entry.user_id.toString(),
            username: entry.username,
            title: entry.title,
            sourcePlatform: entry.source_platform,
            sourceType: entry.source_type,
            keywords: entry.keywords,
            topics: entry.topics,
            documentType: 'knowledge_base_entry',
          },
        });
      });
      
      // Add documents to the vector store
      await this.vectorStore.addDocuments(docs);
      
      this.logger.log(`Indexed ${entries.length} knowledge base entries into the vector database`);
      
      return {
        success: true,
        message: `Indexed ${entries.length} knowledge base entries into the vector database`,
        count: entries.length,
      };
    } catch (error) {
      this.logger.error(`Error indexing knowledge base entries: ${error.message}`);
      throw new Error(`Failed to index knowledge base entries: ${error.message}`);
    }
  }

  /**
   * Store a knowledge base entry in the vector database
   */
  async storeKnowledgeBaseEntry(entry: {
    id: number;
    userId: number;
    username: string;
    title: string;
    content: string;
    sourcePlatform: string;
    sourceType: string;
    summary?: string;
    keywords?: any;
    topics?: any;
  }) {
    try {
      if (!this.vectorStore) {
        throw new Error('Vector store not initialized');
      }
      
      // Combine title and content for better semantic search
      const content = `${entry.title}\n\n${entry.content}`;
      
      // If there's a summary, add it to the content
      const fullContent = entry.summary 
        ? `${content}\n\nSummary: ${entry.summary}` 
        : content;
      
      const doc = new Document({
        pageContent: fullContent,
        metadata: { 
          id: entry.id.toString(),
          userId: entry.userId.toString(),
          username: entry.username,
          title: entry.title,
          sourcePlatform: entry.sourcePlatform,
          sourceType: entry.sourceType,
          keywords: entry.keywords,
          topics: entry.topics,
          documentType: 'knowledge_base_entry',
        },
      });
      
      await this.vectorStore.addDocuments([doc]);
      
      this.logger.log(`Stored knowledge base entry ${entry.id} for user ${entry.userId}`);
      
      return {
        success: true,
        message: 'Knowledge base entry stored successfully',
      };
    } catch (error) {
      this.logger.error(`Error storing knowledge base entry: ${error.message}`);
      throw new Error(`Failed to store knowledge base entry: ${error.message}`);
    }
  }

  /**
   * Query the vector database for similar content
   */
  async queryKnowledge(query: string, userId?: number, limit = 5) {
    try {
      if (!this.vectorStore) {
        throw new Error('Vector store not initialized');
      }
      
      const filter = userId ? { userId: userId.toString() } : undefined;
      
      const results = await this.vectorStore.similaritySearch(
        query,
        limit,
        filter,
      );
      
      return {
        results: results.map(doc => ({
          text: doc.pageContent,
          metadata: doc.metadata,
          score: doc.metadata.score,
        })),
      };
    } catch (error) {
      this.logger.error(`Error querying knowledge: ${error.message}`);
      throw new Error(`Failed to query knowledge: ${error.message}`);
    }
  }
}
