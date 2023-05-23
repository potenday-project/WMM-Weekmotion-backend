import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Tag } from './Tag';
import { Diary } from './Diary';

@Entity('DIARY_TAG_GROUP')
export class DiaryTagGroup extends BaseEntity {
  @Column({ type: 'int', name: 'DIARY_SEQ' })
  diarySeq: number;

  @Column({ type: 'int', name: 'TAG_SEQ' })
  tagSeq: number;

  @Column({ type: 'int', name: 'WRITER_SEQ' })
  writerSeq: number;

  @OneToOne(() => Tag)
  @JoinColumn([{ name: 'TAG_SEQ' }])
  tag: Tag;

  @ManyToOne(() => Diary)
  @JoinColumn([{ name: 'DIARY_SEQ' }])
  diary: Diary;
}
