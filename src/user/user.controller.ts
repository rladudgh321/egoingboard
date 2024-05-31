import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { SignUpReqDto } from './dto/req.dto';
import { SignUpResDto } from './dto/res.dto';
import { UserService } from './user.service';

@ApiTags('user')
@ApiExtraModels(SignUpResDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiPostResponse(SignUpResDto)
  @ApiBearerAuth()
  @Post('signup')
  async signup(
    @Body()
    { email, password, passwordConfirm, name, gender }: SignUpReqDto,
  ): Promise<SignUpResDto> {
    if (password !== passwordConfirm) throw new BadRequestException();
    const { id, accessToken, refreshToken } = await this.userService.signup(
      email,
      password,
      name,
      gender,
    );
    return { id, accessToken, refreshToken };
  }
}
