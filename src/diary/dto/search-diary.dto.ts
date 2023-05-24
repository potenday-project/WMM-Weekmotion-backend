import { ApiProperty } from '@nestjs/swagger';

export class SearchDiaryDto {
  @ApiProperty({ description: '캘린터 표출 여부', default: 'Y', enum: ['Y', 'N'] })
  calenderYn = 'Y';

  @ApiProperty({ description: '조회년월(YYYY-MM)', required: false })
  yearMonth: string;

  @ApiProperty({ description: '시작 조회년월(YYYY-MM-DD)', required: false })
  fromDate: string;

  @ApiProperty({ description: '종료 조회년월(YYYY-MM-DD)', required: false })
  toDate: string;
}
