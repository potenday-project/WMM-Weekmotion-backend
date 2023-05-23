import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entites/User';

const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, private datasource: DataSource) {}

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
    return await this.userRepository.createQueryBuilder('user').where('user.seq = :seq', { seq: user.seq }).getOne();
  }

  async checkUserId(id: string) {
    const checkId = await this.userRepository.createQueryBuilder('user').where('user.id = :id', { id }).getOne();
    if (checkId) {
      return { duplication: true };
    }
    return { duplication: false };
  }
}
