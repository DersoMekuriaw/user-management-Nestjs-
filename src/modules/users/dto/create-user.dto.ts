import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

import { Role } from 'src/shared/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: '' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Username of the user', example: '' })
  username: string;

  @ApiProperty({ description: 'Password of the user', example: '' })
  password: string;

  @ApiProperty({ description: 'Email address of the user', example: '' })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Role of the user', 
    enum: Role,
    example: 'user'
  })
  @IsEnum(['admin', 'user', 'viewer'], {
    message: 'Valid role values are admin, user, viewer',
  })
  role: 'admin' | 'user' | 'viewer';
}
