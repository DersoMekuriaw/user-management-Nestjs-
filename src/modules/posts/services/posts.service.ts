import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostEntity } from '../../../entities/post.entity';
import { UserEntity } from '../../../entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity) 
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ){}
 
  async findAll(): Promise<PostEntity[]> {
    return this.postRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<PostEntity> {
    const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    return post;
  }

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const author = await this.userRepository.findOne({ where: { id: createPostDto.userId } });
    if (!author) throw new NotFoundException('Author not found');
    const newPost = this.postRepository.create({
      ...createPostDto,
      author,
    });
    return this.postRepository.save(newPost);
  }

  // Update post by ID
  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.findOne(id); // will throw 404 if not found
    const updatedPost = Object.assign(post, updatePostDto);
    return this.postRepository.save(updatedPost); // UPDATE in db
  }

  // Delete post by ID
  async delete(id: string): Promise<PostEntity> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post); // DELETE from db
    return post;
  }
}
