import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('TAG_CATEGORY')
export class TagCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 50, name: 'TAG_CATEGORY_NAME' })
  tagCategoryName: string;
}
