import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { VectorDbService } from '../vector-db/vector-db.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('TestVectorDb');
  
  try {
    logger.log('Starting vector database test...');
    
    const app = await NestFactory.createApplicationContext(AppModule);
    const vectorDbService = app.get(VectorDbService);
    
    // Test 1: Index knowledge base entries
    logger.log('Test 1: Indexing knowledge base entries...');
    const indexResult = await vectorDbService.indexAllKnowledgeBaseEntries();
    logger.log(`Indexing result: ${JSON.stringify(indexResult)}`);
    
    // Test 2: Query the vector database
    logger.log('Test 2: Querying the vector database...');
    const queryResult = await vectorDbService.queryKnowledge('web development experience');
    logger.log(`Query result: ${JSON.stringify(queryResult)}`);
    
    // Test 3: Query with a different topic
    logger.log('Test 3: Querying with a different topic...');
    const queryResult2 = await vectorDbService.queryKnowledge('hobbies and interests');
    logger.log(`Query result 2: ${JSON.stringify(queryResult2)}`);
    
    logger.log('All tests completed successfully!');
    
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Error during testing: ${error.message}`);
    process.exit(1);
  }
}

bootstrap();
