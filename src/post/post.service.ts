import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async addpost(title: string, content: string, token: string) {
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

  async getPosts() {
    const post = await this.prismaService.post.findMany();
    return post;
  }

  async removePost(id: string, data: string) {
    const post = await this.prismaService.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('게시글이 존재하지 않습니다');

    const decoded = this.jwtService.decode(data);
    if (post.authorId !== decoded.sub)
      throw new UnauthorizedException('허용되지 않은 방법입니다');
    const removePost = await this.prismaService.post.delete({ where: { id } });
    return removePost;
  }
}
