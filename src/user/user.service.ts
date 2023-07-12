import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entites/User';
import dayjs from 'dayjs';
import { Diary } from '../entites/Diary';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(Diary) private diaryRepository: Repository<Diary>, private datasource: DataSource) {}

  async join(createUserDto: CreateUserDto) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = createUserDto.toEntity();
    user.password = await bcrypt.hash(createUserDto.password, 12);

    let savedUser;

    try {
      savedUser = await this.userRepository.save(user);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    return { seq: savedUser.seq };
  }

  async getUserInfo(user: User) {
    if (!user) {
      throw new UnauthorizedException('로그인 후 이용해주세요.');
    }
    const today = dayjs(new Date()).format('YYYY.MM.DD');

    const userInfo = await this.userRepository.createQueryBuilder('user').where('user.seq = :seq', { seq: user.seq }).getOne();
    const todayDiary = await this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.writerSeq = :writerSeq', { writerSeq: user.seq })
      .andWhere('DATE_FORMAT(diary.diaryDate, "%Y.%m.%d") = :today', { today: today })
      .getOne();
    return { ...userInfo, isWriteToday: todayDiary ? 'Y' : 'N' };
  }

  async checkUserId(id: string) {
    const checkId = await this.userRepository.createQueryBuilder('user').where('user.id = :id', { id }).getOne();
    if (checkId) {
      return { duplication: true };
    }
    return { duplication: false };
  }

  async updateUserPassword(updateUserPasswordDto: UpdateUserPasswordDto, user: User) {
    const userInfo = await this.userRepository.createQueryBuilder('user').where('user.seq = :seq', { seq: user.seq }).addSelect('user.password').getOne();
    const passwordCompareResult = await bcrypt.compare(updateUserPasswordDto.password, userInfo.password);

    if (!passwordCompareResult) {
      throw new UnauthorizedException('일치하지 않은 비밀번호 입니다.');
    }

    const encryptedNewPassword = await bcrypt.hash(updateUserPasswordDto.newPassword, 12);

    await this.userRepository.createQueryBuilder('user').update().set({ password: encryptedNewPassword }).where({ seq: user.seq }).execute();

    return { seq: user.seq };
  }
}
