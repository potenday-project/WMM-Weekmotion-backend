import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';
import { DiaryTagGroup } from './DiaryTagGroup';

@Entity('DIARY')
export class Diary extends BaseEntity {
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

  @OneToMany(() => DiaryTagGroup, TagGroup => TagGroup.diary)
  tags: DiaryTagGroup[];
}
