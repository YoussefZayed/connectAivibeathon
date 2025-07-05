import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: any) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.userService.create({
            username: registerDto.username,
            password: hashedPassword,
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }

    async login(loginDto: any) {
        const user = await this.userService.findByUsername(loginDto.username);
        if (user && (await bcrypt.compare(loginDto.password, user.password))) {
            const payload = { username: user.username, sub: user.id };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...userResult } = user;
            return {
                accessToken: this.jwtService.sign(payload),
                user: userResult,
            };
        }
        throw new UnauthorizedException('Invalid credentials');
    }
} 