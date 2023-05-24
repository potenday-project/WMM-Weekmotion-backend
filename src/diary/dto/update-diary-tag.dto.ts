import { ApiProperty } from '@nestjs/swagger';
import { DiaryTagGroup } from '../../entites/DiaryTagGroup';

export class UpdateDiaryTagDto {
  @ApiProperty({ description: '수정 태그 그룹 고유번호' })
  seq: number;

  @ApiProperty({ description: '수정태그 고유번호' })
  tagSeq: number;

  @ApiProperty({ description: '수정/삭제 여부', enum: ['U', 'D'] })
  type: string;

  toEntity() {
    const entity = new DiaryTagGroup();
    entity.tagSeq = this.tagSeq;

    return entity;
  }
}
