import { ApiProperty } from '@nestjs/swagger';
import { Diary } from '../../entites/Diary';
import { UpdateDiaryTagDto } from './update-diary-tag.dto';

export class UpdateDiaryDto {
  @ApiProperty({ description: '타이틀' })
  title: string;

  @ApiProperty({ description: '컨텐츠' })
  contents: string;

  @ApiProperty({ description: '캘린더 표출 여부' })
  calenderYn: string;

  @ApiProperty({ description: '수정 태그 목록', type: () => Array(UpdateDiaryTagDto) })
  tags: UpdateDiaryTagDto[];

  toEntity() {
    const entity = new Diary();
    entity.title = this.title;
    entity.contents = this.contents;
    entity.calenderYn = this.calenderYn;

    return entity;
  }
}
