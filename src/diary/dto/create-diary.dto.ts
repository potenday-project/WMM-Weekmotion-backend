import { ApiProperty } from '@nestjs/swagger';
import { Diary } from '../../entites/Diary';

export class CreateDiaryDto {
  @ApiProperty({ description: '일기 일자', pattern: 'YYYY.MM.DD' })
  diaryDate: string;

  @ApiProperty({ description: '타이틀' })
  title: string;

  @ApiProperty({ description: '컨텐츠' })
  contents: string;

  @ApiProperty({ description: '캘린더 표출 여부' })
  calenderYn: string;

  @ApiProperty({ description: '등록 태그 고유번호 목록', type: () => Array(Number) })
  tagSeq: number[];

  toEntity() {
    const entity = new Diary();
    entity.diaryDate = this.diaryDate;
    entity.title = this.title;
    entity.contents = this.contents;
    entity.calenderYn = this.calenderYn;

    return entity;
  }
}
