import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/entities/user.entity';

import { PostEntity } from '../../entities/post.entity';

import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
    controllers: [PostsController],
    providers: [PostsService]
})
export class PostsModule {}
 