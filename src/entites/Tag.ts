import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { TagCategory } from './TagCategory';

@Entity('TAG')
export class Tag extends BaseEntity {
  @Column({ type: 'varchar', length: 50, name: 'TAG_NAME' })
  tagName: string;

  @Column({ type: 'int', name: 'TAG_CATEGORY_SEQ' })
  tagCategorySeq: number;

  @ManyToOne(() => TagCategory)
  @JoinColumn([{ name: 'TAG_CATEGORY_SEQ' }])
  tagCategory: TagCategory;
}
