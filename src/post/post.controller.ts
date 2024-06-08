import { Body, Controller, Post } from '@nestjs/common';
import { addpostReqDto } from './dto/req.dto';
import { PostService } from './post.service';
import { addpostResDto } from './dto/res.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';

@ApiTags('post')
@ApiExtraModels(addpostResDto)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiPostResponse(addpostResDto)
  @ApiBearerAuth()
  @Post('/')
  async addpost(
    @Body() { title, content, token }: addpostReqDto,
  ): Promise<addpostResDto> {
    console.log('back token', token);
    const post = await this.postService.addpost(title, content, token);
    return { id: post.authorId, title: post.title, content: post.content };
  }
}
