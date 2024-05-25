import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { SignUpReqDto } from './dto/req.dto';
import { SignUpResDto } from './dto/res.dto';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiPostResponse(SignUpResDto)
  @ApiBearerAuth()
  @Post('signup')
  async signup(
    @Body()
    {
      email,
      password,
      passwordConfirm,
      name,
      gender,
      posts,
      profile,
    }: SignUpReqDto,
  ): Promise<SignUpResDto> {
    if (password !== passwordConfirm) throw new BadRequestException();
    const { id, accessToken, refreshToken } = await this.userService.signup(
      email,
      password,
      name,
      gender,
      posts,
      profile,
    );
    return { id, accessToken, refreshToken };
  }
}
