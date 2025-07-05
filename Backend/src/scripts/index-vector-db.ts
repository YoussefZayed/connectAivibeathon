import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { VectorDbService } from '../vector-db/vector-db.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('IndexVectorDb');
  
  try {
    logger.log('Starting vector database indexing...');
    
    const app = await NestFactory.createApplicationContext(AppModule);
    const vectorDbService = app.get(VectorDbService);
    
    logger.log('Indexing users...');
    const userResult = await vectorDbService.indexAllUsers();
    logger.log(`User indexing complete: ${userResult.message}`);
    
    logger.log('Indexing knowledge base entries...');
    const knowledgeResult = await vectorDbService.indexAllKnowledgeBaseEntries();
    logger.log(`Knowledge base indexing complete: ${knowledgeResult.message}`);
    
    logger.log('All indexing complete!');
    
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Error during indexing: ${error.message}`);
    process.exit(1);
  }
}

bootstrap();
