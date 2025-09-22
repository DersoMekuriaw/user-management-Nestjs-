import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: '' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email address of the user', example: '' })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Role of the user', 
    enum: ['admin', 'user', 'viewer'],
    example: 'user'
  })
  @IsEnum(['admin', 'user', 'viewer'], {
    message: 'Valid role values are admin, user, viewer',
  })
  role: 'admin' | 'user' | 'viewer';
}
