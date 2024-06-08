import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async addpost(title: string, content: string, token: string) {
    console.log('token', token);
    const decoded = this.jwtService.decode(token);
    const user = await this.prismaService.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new NotFoundException('작성자를 찾을 수 없습니다.');
    }

    const post = await this.prismaService.post.create({
      data: {
        title,
        content,
        author: { connect: { id: user.id } },
      },
    });

    return post;
  }
}
