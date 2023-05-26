import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagCategory } from '../entites/TagCategory';
import { Tag } from '../entites/Tag';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, TagCategory])],
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule {}
