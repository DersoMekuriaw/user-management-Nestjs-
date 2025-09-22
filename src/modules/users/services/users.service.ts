import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
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
    private readonly userRepository: Repository<UserEntity>
  ){}
 
  // Hash password before saving to DB
  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
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

  // Get one user by ID
  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

// Create new user
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const plainPassword = createUserDto.password;
    createUserDto.password = await this.hashPassword(plainPassword);  
    const newUser = this.userRepository.create(createUserDto); // prepare entity
    return this.userRepository.save(newUser); // INSERT into db
  }

  // Update user by ID
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id); // will throw 404 if not found
    const updatedUser = Object.assign(user, updateUserDto);
    return this.userRepository.save(updatedUser); // UPDATE in db
  }

  // Delete user by ID
  async delete(id: string): Promise<UserEntity> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user); // DELETE from db
    return user;
  }
}
