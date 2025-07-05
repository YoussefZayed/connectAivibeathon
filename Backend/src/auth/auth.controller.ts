import { Controller, UseGuards, Request } from '@nestjs/common';
import {
  TsRest,
  TsRestHandler,
  TsRestRequest,
  TsRestRequestShape,
} from '@ts-rest/nest';
import { authContract } from './auth.contract';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Prisma } from '@prisma/client';

type User = Prisma.userGetPayload<{
  select: { id: true; username: true; createdAt: true };
}>;

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @TsRest(authContract.register)
  async register(
    @TsRestRequest() { body }: TsRestRequestShape<typeof authContract.register>,
  ) {
    const user = await this.authService.register(body);
    return { status: 201 as const, body: user };
  }

  @TsRest(authContract.login)
  async login(
    @TsRestRequest() { body }: TsRestRequestShape<typeof authContract.login>,
  ) {
    const result = await this.authService.login(body);
    return { status: 200 as const, body: result };
  }

  @TsRest(authContract.me)
  @UseGuards(JwtAuthGuard)
  async me(@Request() req: { user: User }) {
    return { status: 200 as const, body: req.user };
  }
}
