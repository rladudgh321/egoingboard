import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class addpostResDto {
  @ApiProperty({ required: true, example: '유저아이디' })
  id: string;

  @ApiProperty({ required: true, example: '제목' })
  title: string;

  @ApiPropertyOptional({ example: '내용입니다' })
  content?: string;
}
