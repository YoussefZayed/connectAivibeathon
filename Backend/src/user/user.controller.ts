import { Controller, UseGuards, Request } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { userContract } from './user.contract';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { user } from '@prisma/client';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @TsRestHandler(userContract.addContact)
  @UseGuards(JwtAuthGuard)
  async addContact(@Request() req: { user: user }) {
    return tsRestHandler(userContract.addContact, async ({ body }) => {
      const createdContact = await this.userService.addContact(
        req.user.id,
        body.username,
      );
      return {
        status: 201 as const,
        body: createdContact,
      };
    });
  }

  @TsRestHandler(userContract.getContacts)
  @UseGuards(JwtAuthGuard)
  async getContacts(@Request() req: { user: user }) {
    return tsRestHandler(userContract.getContacts, async () => {
      console.log('Controller: User requesting contacts:', req.user);
      const contacts = await this.userService.getUserContacts(req.user.id);
      console.log('Controller: Returning contacts:', contacts);
      return {
        status: 200 as const,
        body: contacts,
      };
    });
  }

  @TsRestHandler(userContract.createProfile)
  @UseGuards(JwtAuthGuard)
  async createProfile(@Request() req: { user: user }) {
    return tsRestHandler(userContract.createProfile, async ({ body }) => {
      console.log('Controller: Creating profile for user:', req.user.id);
      console.log('Controller: Profile data received:', body);

      const profile = await this.userService.createOrUpdateProfile(
        req.user.id,
        {
          fullName: body.fullName,
          industry: body.industry,
          hobbies: body.hobbies,
          lookingFor: body.lookingFor,
          bio: body.bio,
        },
      );

      console.log('Controller: Profile created/updated successfully:', profile);

      return {
        status: 201 as const,
        body: profile,
      };
    });
  }

  @TsRestHandler(userContract.getProfile)
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: { user: user }) {
    return tsRestHandler(userContract.getProfile, async () => {
      const profile = await this.userService.getUserProfile(req.user.id);
      return {
        status: 200 as const,
        body: profile,
      };
    });
  }

  @TsRestHandler(userContract.getSocialMediaUrls)
  @UseGuards(JwtAuthGuard)
  async getSocialMediaUrls(@Request() req: { user: user }) {
    return tsRestHandler(userContract.getSocialMediaUrls, async () => {
      try {
        const socialMediaUrls = await this.userService.getSocialMediaUrls(req.user.id);
        return {
          status: 200 as const,
          body: socialMediaUrls,
        };
      } catch (error) {
        if (error.status === 404) {
          return {
            status: 404 as const,
            body: { message: error.message },
          };
        }
        throw error;
      }
    });
  }

  @TsRestHandler(userContract.updateSocialMediaUrls)
  @UseGuards(JwtAuthGuard)
  async updateSocialMediaUrls(@Request() req: { user: user }) {
    return tsRestHandler(userContract.updateSocialMediaUrls, async ({ body }) => {
      try {
        const updatedUrls = await this.userService.updateSocialMediaUrls(req.user.id, body);
        return {
          status: 200 as const,
          body: updatedUrls,
        };
      } catch (error) {
        if (error.status === 404) {
          return {
            status: 404 as const,
            body: { message: error.message },
          };
        }
        throw error;
      }
    });
  }
}
