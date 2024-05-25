import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(
    email: string,
    password: string,
    name: string,
    gender: string,
    posts: any,
    profile: any,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          email: true,
        },
      });
      if (user) throw new BadRequestException();

      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);

      const createUser = await this.prisma.user.create({
        data: {
          email,
          password: hash,
          name,
          gender,
          posts,
          profile,
        },
      });

      console.log('createUser', createUser);

      const accessToken = this.generateAccessToken(createUser.id);
      const refreshTokenEntity = await this.prisma.refreshToken.create({
        data: {
          refreshTokenId: createUser.id,
          token: this.generateRefreshToken(createUser.id),
        },
      });

      return {
        id: createUser.id,
        accessToken,
        refreshToken: refreshTokenEntity.token,
      };
    } catch (err) {
      console.error(err);
    }
  }

  async refresh(userId: string) {
    const refreshTokenEntity = await this.prisma.refreshToken.findUnique({
      where: { refreshTokenId: userId },
    });
    if (!refreshTokenEntity) throw new BadRequestException();
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = this.generateRefreshToken(userId);
    refreshTokenEntity.token = refreshToken;

    return { accessToken, refreshToken };
  }

  private generateAccessToken(userId: string) {
    const payload = { sub: userId, tokenType: 'access' };
    return this.jwtService.sign(payload, { expiresIn: '1d' });
  }

  private generateRefreshToken(userId: string) {
    const payload = { sub: userId, tokenType: 'refresh' };
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  private async createRefreshTokenUsingUser(
    userId: string,
    refreshToken: string,
  ) {
    let refresh = await this.prisma.refreshToken.findUnique({
      where: {
        refreshTokenId: userId,
      },
    });

    if (refresh) {
      refresh = await this.prisma.refreshToken.update({
        where: {
          refreshTokenId: userId,
        },
        data: {
          token: refreshToken,
        },
      });
    } else {
      refresh = await this.prisma.refreshToken.create({
        data: {
          refreshTokenId: userId,
          token: refreshToken,
        },
      });
    }
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    return user;
  }
}
