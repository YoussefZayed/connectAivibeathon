import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DbModule } from '../core/db/db.module';

@Module({
    imports: [DbModule],
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule { } 