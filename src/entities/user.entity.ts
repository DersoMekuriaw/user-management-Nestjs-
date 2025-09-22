import { ApiProperty } from '@nestjs/swagger';

import { Role } from 'src/shared/enums/role.enum';

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { PostEntity } from './post.entity';

@Entity('users')
export class UserEntity {
  @ApiProperty({ description: 'Unique ID of the user', example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Full name of the user', example: '' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Email address of the user', example: '' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'Role of the user', example: '' })
  @Column({type: 'enum', enum: Role, default: Role.USER })
  role: string;

  // 👇 One user can have many posts
  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];
}
