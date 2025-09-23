import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/modules/auth/auth.guard';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../services/users.service';
import { UserEntity } from '../../../entities/user.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('users') // Groups endpoints in Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get Users with Pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return all users',
    type: [UserEntity],
  })
  findAll(@Query('role') role?: 'admin' | 'user' | 'viewer') {
    return this.userService.findAll(role);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return a user by ID',
    type: UserEntity,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiBody({
    description: 'User Creation',
    type: UserEntity,
  })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserEntity,
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: UserEntity,
  })
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
