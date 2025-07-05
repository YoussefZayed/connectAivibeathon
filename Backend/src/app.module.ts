import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EventsModule } from './events/events.module';
import { VectorDbModule } from './vector-db/vector-db.module';
import { KnowledgeBaseModule } from './knowledge-base/knowledge-base.module';

@Module({
  imports: [
    CoreModule,
    HealthModule,
    AuthModule,
    UserModule,
    EventsModule,
    VectorDbModule,
    KnowledgeBaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
