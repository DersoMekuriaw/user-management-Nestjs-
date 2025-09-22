import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Title of the post', example: 'My first post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Content of the post', example: 'This is the content.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'User ID of the post author', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  userId: string;
}