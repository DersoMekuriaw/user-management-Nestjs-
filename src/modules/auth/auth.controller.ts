import { Controller, Post, Body, HttpStatus, HttpCode, NotImplementedException } from '@nestjs/common';

import { AuthService } from './auth.service';

import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.authenticate(loginDto);
  }

}
