import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from '../entites/Diary';
import { Repository } from 'typeorm';
import { Tag } from '../entites/Tag';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  getTagList() {
    return this.tagRepository.createQueryBuilder('tag').leftJoinAndSelect('tag.tagCategory', 'tagCategory').orderBy('FIELD(tagCategory.tagCategoryCode, "PSTV", "NGTV", "ETC")').getMany();
  }
}
