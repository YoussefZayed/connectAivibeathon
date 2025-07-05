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

  async createOrUpdateProfile(
    userId: number,
    profileData: {
      fullName: string;
      industry?: string;
      hobbies?: string;
      lookingFor?: string;
      bio?: string;
    },
  ) {
    const existingProfile = await this.userRepository.getUserProfile(userId);

    if (existingProfile) {
      // Update existing profile
      return this.userRepository.updateUserProfile(userId, profileData);
    } else {
      // Create new profile
      return this.userRepository.createUserProfile(userId, profileData);
    }
  }

  async getUserProfile(userId: number) {
    const profile = await this.userRepository.getUserProfile(userId);
    if (!profile) {
      throw new NotFoundException('User profile not found');
    }
    return profile;
  }

  async getSocialMediaUrls(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      facebook_url: user.facebook_url,
      instagram_url: user.instagram_url,
      linkedin_url: user.linkedin_url,
      tiktok_url: user.tiktok_url,
      twitter_url: user.twitter_url,
      youtube_url: user.youtube_url,
    };
  }

  async updateSocialMediaUrls(
    userId: number,
    socialMediaUrls: {
      facebook_url?: string | null;
      instagram_url?: string | null;
      linkedin_url?: string | null;
      tiktok_url?: string | null;
      twitter_url?: string | null;
      youtube_url?: string | null;
    },
  ) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.updateSocialMediaUrls(userId, socialMediaUrls);
  }
}
