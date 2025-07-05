import { Injectable, NotFoundException } from '@nestjs/common';
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

    async addContact(userId: number, contactUsername: string) {
        const contactUser = await this.userRepository.findByUsername(contactUsername);

        if (!contactUser) {
            throw new NotFoundException('User to add not found');
        }

        return this.userRepository.addContact(userId, contactUser.id);
    }
} 