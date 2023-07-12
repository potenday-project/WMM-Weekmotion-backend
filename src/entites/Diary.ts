import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { DiaryTagGroup } from './DiaryTagGroup';
import dayjs from 'dayjs';

@Entity('DIARY')
export class Diary extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 10,
    name: 'DIARY_DATE'
  })
  diaryDate: string;

  @Column({ type: 'varchar', length: 250, name: 'TITLE' })
  title: string;

  @Column({
    type: 'blob',
    name: 'CONTENTS',
    transformer: {
      to: (value: string) => Buffer.from(value),
      from: (value: Buffer) => value.toString()
    }
  })
  contents: string;

  @Column({
    type: 'char',
    name: 'CALENDER_YN',

    length: 1,
    default: 'Y'
  })
  calenderYn: string;

  @Column({ type: 'int', name: 'WRITER_SEQ' })
  writerSeq: number;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'WRITER_SEQ' }])
  writer: User;

  @OneToMany(() => DiaryTagGroup, TagGroup => TagGroup.diary, { onDelete: 'CASCADE' })
  tags: DiaryTagGroup[];
}
