import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'SEQ' })
  seq: number;

  @CreateDateColumn({ type: 'timestamp', name: 'REG_DATE' })
  regDate: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'MOD_DATE' })
  modDate: Date;
}
