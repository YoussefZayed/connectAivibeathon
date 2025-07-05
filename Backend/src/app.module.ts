import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [CoreModule, HealthModule, AuthModule, UserModule, EventsModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
