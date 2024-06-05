import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiPostResponse } from 'src/common/decorator/swagger.decorator';
import { User, UserAfterAuth } from 'src/common/decorator/user.decorator';
import { AuthService } from './auth.service';
import { SignUpReqDto, SigninReqDto } from './dto/req.dto';
import { RefreshTokenResDto, SignUpResDto } from './dto/res.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiTags('auth')
@ApiExtraModels(SignUpReqDto, SignUpResDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPostResponse(SignUpResDto)
  @Public()
  @ApiBearerAuth()
  @Post('signup')
  async signup(
    @Body()
    { email, password, passwordConfirm, name, gender }: SignUpReqDto,
  ): Promise<SignUpResDto> {
    if (password !== passwordConfirm)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    const { id, accessToken, refreshToken } = await this.authService.signup(
      email,
      password,
      name,
      gender,
    );
    return { id, accessToken, refreshToken };
  }

  @ApiPostResponse(SigninReqDto)
  @Public()
  @Post('signin')
  async signin(@Body() { email, password }: SigninReqDto) {
    return this.authService.signin(email, password);
  }

  @ApiPostResponse(RefreshTokenResDto)
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(
    @Headers('authorization') authorization,
    @User() user: UserAfterAuth,
  ) {
    const token = /Bearer\s(.+)/.exec(authorization)[1];
    const { id, accessToken, refreshToken } = await this.authService.refresh(
      user.id,
      token,
    );
    return { id, accessToken, refreshToken };
  }

  // router.post("/logout", isLoggedIn, (req, res) => {
  //   req.logout();
  //   req.session.destroy();
  //   res.send("ok");
  // });

  // @ApiBearerAuth()
  // @Post('logout')
  // async logout(@Req() request, @Res() res): Promise<any> {
  //   console.log("request.user", request.user);
  //   // console.log('request', request);
  //   request.logout();
  //   return res.send('ok');
  // }

  @Public()
  @Post('logout')
  async logOut(@Res({ passthrough: true }) res: Response) {
    // const token = await this.authService.logOut();
    // localStorage.removeItem('authorized');
    // const data = localStorage.getItem('authorized');
    global.localStorage.clear();
    // console.log('data', data);
    res.send('ok');
  }
  
}
