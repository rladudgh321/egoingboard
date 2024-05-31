import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { SignUpReqDto } from 'src/user/dto/req.dto';
import { SignUpResDto } from 'src/user/dto/res.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @ApiPostResponse(SignUpResDto)
  @ApiBearerAuth()
  @Post('signup')
  async signup(
    @Body()
    { email, password, passwordConfirm, name, gender }: SignUpReqDto,
  ): Promise<SignUpResDto> {
    if (password !== passwordConfirm) throw new BadRequestException();
    const { id, accessToken, refreshToken } = await this.authService.signup(
      email,
      password,
      name,
      gender,
    );
    return { id, accessToken, refreshToken };
  }
}
