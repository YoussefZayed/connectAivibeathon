import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DbModule } from '../core/db/db.module';
import { UserController } from './user.controller';

@Module({
    imports: [DbModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule { } 