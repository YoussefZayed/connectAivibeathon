import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async create(createUserDto: any) {
        return this.userRepository.create(createUserDto);
    }

    async findByUsername(username: string) {
        return this.userRepository.findByUsername(username);
    }

    async findById(id: number) {
        return this.userRepository.findById(id);
    }
} 