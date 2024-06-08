import { Body, Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';
import { addpostReqDto, removePostReqDto } from './dto/req.dto';
import { PostService } from './post.service';
import { addpostResDto } from './dto/res.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { Public } from 'src/common/decorator/public.decorator';

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
    const post = await this.postService.addpost(title, content, token);
    return { id: post.authorId, title: post.title, content: post.content };
  }

  @Public()
  @ApiBearerAuth()
  @Get('getposts')
  async getPosts() {
    const post = await this.postService.getPosts();
    return post;
  }

  @ApiBearerAuth()
  @Delete(':id')
  async removePost(
    @Param() { id }: removePostReqDto,
    @Body() { data }: { data: string },
  ) {
    console.log('delete', id);
    const post = await this.postService.removePost(id, data);
    return post;
  }
}
