import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entites/User';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Diary } from '../entites/Diary';

@Module({
  imports: [TypeOrmModule.forFeature([User, Diary])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
