import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class addpostReqDto {
  @ApiProperty({ required: true, example: '제목' })
  title: string;

  @ApiPropertyOptional({ example: '내용입니다' })
  content?: string;

  @ApiProperty({
    title: 'token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5NTNkY2I1OS0wNWU2LTRmZmMtODBjMC01MGRhMDIwYzE0ZWIiLCJ0b2tlblR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MTc4MTAwNTUsImV4cCI6MTcxNzg5NjQ1NX0.vNX8WwING54eSicUgzvmgKBQttMY56INV9KlRskhDQ8',
  })
  token: string;
}
