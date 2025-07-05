import { Controller, UseGuards, Request } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { userContract } from './user.contract';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { user } from '@prisma/client';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

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
} 