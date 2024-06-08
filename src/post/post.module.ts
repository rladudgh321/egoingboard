import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, JwtService],
})
export class PostModule {}
