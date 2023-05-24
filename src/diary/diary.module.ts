import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from '../entites/Diary';
import { DiaryTagGroup } from '../entites/DiaryTagGroup';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, DiaryTagGroup])],
  controllers: [DiaryController],
  providers: [DiaryService]
})
export class DiaryModule {}
