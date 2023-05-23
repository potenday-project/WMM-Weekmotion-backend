import { Column, Entity, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Tag } from './Tag';
import { User } from './User';
import { DiaryTagGroup } from './DiaryTagGroup';

@Entity('DIARY')
export class Diary extends BaseEntity {
  @Column({ type: 'varchar', length: 250, name: 'TITLE' })
  title: string;

  @Column({ type: 'blob', name: 'CONTENTS' })
  contents: string;

  @Column({
    type: 'char',
    name: 'CALENDER_YN',

    length: 1,
    default: 'Y'
  })
  calenderYn: string;

  @Column({ type: 'int', name: 'TAG1_SEQ', nullable: true })
  tag1Seq: number;

  @Column({ type: 'int', name: 'TAG2_SEQ', nullable: true })
  tag2Seq: number;

  @Column({ type: 'int', name: 'TAG3_SEQ', nullable: true })
  tag3Seq: number;

  @Column({ type: 'int', name: 'WRITER_SEQ' })
  writerSeq: number;

  @OneToOne(() => Tag)
  @JoinColumn([{ name: 'TAG1_SEQ' }])
  tag1: Tag;

  @OneToOne(() => Tag)
  @JoinColumn([{ name: 'TAG2_SEQ' }])
  tag2: Tag;

  @OneToOne(() => Tag)
  @JoinColumn([{ name: 'TAG3_SEQ' }])
  tag3: Tag;

  @ManyToOne(() => User)
  @JoinColumn([{ name: 'WRITER_SEQ' }])
  writer: User;

  // @OneToMany(() => DiaryTagGroup, TagGroup => TagGroup.diary)
  // tags: DiaryTagGroup[];
}
