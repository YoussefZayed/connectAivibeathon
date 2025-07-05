import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Env } from './core/config/env';
import { INestApplication } from '@nestjs/common';
import { contract } from './contracts';
import { generateOpenApi } from '@ts-rest/open-api';

function setupSwagger(app: INestApplication): void {
  const openApiDocument = generateOpenApi(
    contract,
    {
      info: {
        title: 'API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    { setOperationId: true },
  );

  // Manually filter out the 'authorization' header parameter from the /auth/me endpoint
  const path = openApiDocument.paths['/auth/me'];
  if (path && 'get' in path && path.get.parameters) {
    path.get.parameters = path.get.parameters.filter(
      (p) => !('name' in p && p.name === 'authorization'),
    );
  }

  SwaggerModule.setup('api', app, openApiDocument);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors();

  app.useLogger(app.get(Logger));

  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const port = configService.get('PORT');

  setupSwagger(app);

  app.enableShutdownHooks();

  await app.listen(port);
}
bootstrap();
