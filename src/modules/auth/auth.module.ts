import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      // global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key', // Use env variable in production
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  
  // providers: [AuthService],
  //   exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
