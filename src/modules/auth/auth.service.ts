import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/services/users.service';

type AuthInput = { email: string; password: string };
type SignInData = { userId: string; email: string };
type AuthResult = { accessToken: string; userId: string; email: string };

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    try {
      this.logger.log(`Authentication attempt for email: ${input.email}`);
      
      const user = await this.validateUser(input);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.signIn(user);
    } catch (error) {
      this.logger.error(`Authentication error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    try {
      this.logger.log(`Validating user: ${input.email}`);
      
      const user = await this.usersService.findByEmail(input.email);
      this.logger.log(`User found: ${!!user}`);

      if (!user) {
        this.logger.warn(`User not found for email: ${input.email}`);
        return null;
      }

      // Check if user has a password
      if (!user.password) {
        this.logger.error(`User ${user.id} has no password set`);
        return null;
      }

      this.logger.log(`Comparing passwords for user: ${user.id}`);
      const isPasswordValid = await bcrypt.compare(input.password, user.password);
      this.logger.log(`Password valid: ${isPasswordValid}`);

      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${user.id}`);
        return null;
      }

      return {
        userId: user.id,
        email: user.email,
      };
    } catch (error) {
      this.logger.error(`Validation error: ${error.message}`, error.stack);
      return null;
    }
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    try {
      const tokenPayload = {
        sub: user.userId,
        email: user.email,
      };

      const accessToken = await this.jwtService.signAsync(tokenPayload);
      this.logger.log(`Generated token for user: ${user.userId}`);

      return { accessToken, email: user.email, userId: user.userId };
    } catch (error) {
      this.logger.error(`SignIn error: ${error.message}`, error.stack);
      throw error;
    }
  }
}