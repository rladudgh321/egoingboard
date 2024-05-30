import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}
  async addpost(title: string, content: string) {
    const post = await this.prismaService.post.create({
      data: {
        title,
        content,
        authorId: 'temp1',
        // author: {
        //   create: {
        //     email: '111@gmail',
        //     password: '111',
        //     name: 'kkk',
        //     gender: '남성',
        //   },
        // },
      },
    });

    return post;
  }
}
