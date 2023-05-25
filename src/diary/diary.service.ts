import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { User } from '../entites/User';
import { DataSource, Repository } from 'typeorm';
import { Diary } from '../entites/Diary';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryTagGroup } from '../entites/DiaryTagGroup';
import { SearchDiaryDto } from './dto/search-diary.dto';
import dayjs from 'dayjs';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary) private diaryRepository: Repository<Diary>,
    @InjectRepository(DiaryTagGroup) private diaryTagGroupRepository: Repository<DiaryTagGroup>,
    private datasource: DataSource
  ) {}

  async createDiary(createDiaryDto: CreateDiaryDto, user: User) {
    if (!user) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }

    const diary = createDiaryDto.toEntity();
    diary.writerSeq = user.seq;

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let savedDiary;

    try {
      savedDiary = await queryRunner.manager.getRepository(Diary).save(diary);

      if (createDiaryDto.tagSeq.length > 0) {
        for (const seq of createDiaryDto.tagSeq) {
          const diaryTagGroup = new DiaryTagGroup();
          diaryTagGroup.diarySeq = savedDiary.seq;
          diaryTagGroup.tagSeq = seq;
          diaryTagGroup.writerSeq = user.seq;
          await queryRunner.manager.getRepository(DiaryTagGroup).save(diaryTagGroup);
        }
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }

    return { seq: savedDiary.seq };
  }

  getDiaryList(searchParams: SearchDiaryDto, user: User) {
    if (!user) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }

    const qb = this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.tags', 'tags')
      .leftJoinAndSelect('tags.tag', 'tag')
      .leftJoinAndSelect('tag.tagCategory', 'tagCategory')
      .where('diary.writerSeq = :writerSeq', { writerSeq: user.seq })
      .andWhere('diary.calenderYn = :calenderYn', { calenderYn: searchParams.calenderYn });

    if (searchParams.yearMonth) {
      const fromDate = dayjs(searchParams.yearMonth).startOf('month').format('YYYY-MM-DD');
      const toDate = dayjs(searchParams.yearMonth).endOf('month').format('YYYY-MM-DD');

      qb.andWhere('DATE_FORMAT(diary.regDate, "%Y-%m-%d") >= :fromDate', { fromDate: fromDate });
      qb.andWhere('DATE_FORMAT(diary.regDate, "%Y-%m-%d") <= :toDate', { toDate: toDate });
    }

    if (searchParams.fromDate && searchParams.toDate) {
      const fromDate = dayjs(searchParams.fromDate).startOf('date').format('YYYY-MM-DD');
      const toDate = dayjs(searchParams.toDate).endOf('date').format('YYYY-MM-DD');

      qb.andWhere('DATE_FORMAT(diary.regDate, "%Y-%m-%d") >= :fromDate', { fromDate: fromDate });
      qb.andWhere('DATE_FORMAT(diary.regDate, "%Y-%m-%d") <= :toDate', { toDate: toDate });
    }
    return qb.orderBy('diary.regDate', 'DESC').getMany();
  }

  async getDiary(seq: number, user: User) {
    if (!user) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }

    const diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.tags', 'tags')
      .leftJoinAndSelect('tags.tag', 'tag')
      .leftJoinAndSelect('tag.tagCategory', 'tagCategory')
      .where('diary.seq = :seq', { seq })
      .getOne();

    if (!diary) {
      throw new NotFoundException('존재하지 않는 리소스입니다.');
    }

    if (user.seq !== diary.writerSeq) {
      throw new UnauthorizedException('허용되지 않은 접근입니다.');
    }

    return diary;
  }

  async updateDiary(seq: number, updateDiaryDto: UpdateDiaryDto, user) {
    await this.getDiary(seq, user);

    const diary = updateDiaryDto.toEntity();

    diary.seq = seq;

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(Diary).update({ seq: seq }, diary);

      if (updateDiaryDto.tags.length > 0) {
        for (const tagDto of updateDiaryDto.tags) {
          const diaryTagGroup = new DiaryTagGroup();
          if (!tagDto.seq) {
            diaryTagGroup.diarySeq = seq;
            diaryTagGroup.tagSeq = tagDto.tagSeq;
            diaryTagGroup.writerSeq = user.seq;
            await queryRunner.manager.getRepository(DiaryTagGroup).save(diaryTagGroup);
          } else if (tagDto.type === 'U') {
            diaryTagGroup.seq = tagDto.seq;
            diaryTagGroup.tagSeq = tagDto.tagSeq;
            await queryRunner.manager.getRepository(DiaryTagGroup).update({ seq: tagDto.seq }, diaryTagGroup);
          } else if (tagDto.type === 'D') {
            await this.diaryTagGroupRepository.delete(tagDto.seq);
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('서버에서 에러가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }

    return { seq };
  }

  async deleteDiary(seq: number, user: User) {
    await this.getDiary(seq, user);
    await this.diaryRepository.delete(seq);

    return { seq };
  }
}
