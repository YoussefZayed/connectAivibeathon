import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CoreModule, HealthModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
