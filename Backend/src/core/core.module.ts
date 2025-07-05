import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DbModule } from './db/db.module';
import { LoggerModule } from './logging/logging.module';

@Module({
  imports: [ConfigModule, DbModule, LoggerModule],
  exports: [ConfigModule, DbModule, LoggerModule],
})
export class CoreModule {}
