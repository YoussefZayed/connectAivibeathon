import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
    const contactUser =
      await this.userRepository.findByUsername(contactUsername);

    if (!contactUser) {
      throw new NotFoundException('User to add not found');
    }

    // Prevent users from adding themselves
    if (contactUser.id === userId) {
      throw new ConflictException('Cannot add yourself as a contact');
    }

    // Check if contact already exists
    const existingContact = await this.userRepository.checkContactExists(
      userId,
      contactUser.id,
    );
    if (existingContact) {
      throw new ConflictException('Contact already exists');
    }

    // Create bidirectional contact relationship
    const result = await this.userRepository.addBidirectionalContact(
      userId,
      contactUser.id,
    );

    // Return the contact relationship from the requesting user's perspective
    return result.contact1;
  }

  async getUserContacts(userId: number) {
    console.log('UserService: Getting contacts for user ID:', userId);
    const contacts = await this.userRepository.getUserContacts(userId);
    console.log('UserService: Retrieved contacts:', contacts);
    return contacts;
  }
}
