import { Body, Controller, Post } from '@nestjs/common';
import { addpostReqDto } from './dto/req.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  async addpost(@Body() { title, content }: addpostReqDto) {
    const post = await this.postService.addpost(title, content);
    return { title: post.title, content: post.content };
  }
}
