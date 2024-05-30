import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Post } from '@prisma/client';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export enum GENDER {
  man = '남성',
  woman = '여성',
}

export class SignUpReqDto {
  @ApiProperty({ example: '111@gmail.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: '111' })
  password: string;

  @ApiProperty({ required: true, example: '111' })
  passwordConfirm: string;

  @ApiPropertyOptional({ example: '홍길동' })
  @IsString()
  name?: string;

  @ApiProperty({
    example: '남성',
    required: true,
    title: '성별',
    type: 'enum',
    enum: GENDER,
  })
  @IsEnum(GENDER)
  gender: GENDER;

  posts?: Post[];
}
