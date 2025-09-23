import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // Hash password utility method
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  // Find user by email (including password for authentication)
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'fullName', 'username', 'role'],
    });
  }

  // Get all users (optionally filter by role)
  async findAll(role?: string): Promise<UserEntity[]> {
    if (role) {
      const users = await this.userRepository.find({ where: { role } });
      if (!users.length) {
        throw new NotFoundException(`No users with role ${role} found`);
      }
      return users;
    }
    return this.userRepository.find();
  }

  // Get one user by ID (without password for security)
  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Create new user with hashed password
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('User with this email already exists');
      }
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('User with this username already exists');
      }
    }

    // Hash password before saving
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // Update user by ID with optional password hashing
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id); // will throw 404 if not found

    // If password is being updated, hash the new password
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    // Check for email/username conflicts if they're being updated
    if (updateUserDto.email || updateUserDto.username) {
      const existingUser = await this.userRepository.findOne({
        where: [
          ...(updateUserDto.email ? [{ email: updateUserDto.email }] : []),
          ...(updateUserDto.username
            ? [{ username: updateUserDto.username }]
            : []),
        ],
      });

      if (existingUser && existingUser.id !== id) {
        if (updateUserDto.email && existingUser.email === updateUserDto.email) {
          throw new ConflictException(
            'Another user with this email already exists',
          );
        }
        if (
          updateUserDto.username &&
          existingUser.username === updateUserDto.username
        ) {
          throw new ConflictException(
            'Another user with this username already exists',
          );
        }
      }
    }

    // Update user
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(updatedUser);
  }

  // Delete user by ID
  async delete(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'User deleted successfully' };
  }

}
