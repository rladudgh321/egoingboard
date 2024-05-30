import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class addpostReqDto {
  @ApiProperty({ required: true, example: '제목' })
  title: string;

  @ApiPropertyOptional({ example: '내용입니다' })
  content?: string;
}
