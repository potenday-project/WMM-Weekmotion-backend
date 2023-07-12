import { Column, Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'USER' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50, name: 'ID' })
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'PASSWORD', select: false })
  password: string;

  @Column({ type: 'varchar', length: 60, name: 'NAME' })
  name: string;

  @Column({ type: 'varchar', length: 50, name: 'EMAIL', nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 15, name: 'PHONE' })
  phone: string;
}
