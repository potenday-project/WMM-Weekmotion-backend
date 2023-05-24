import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../common/decorators/user.decorator';
import { User } from '../entites/User';
import { SearchDiaryDto } from './dto/search-diary.dto';

@ApiTags('diary')
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: '감정 게시글 등록' })
  @Post()
  createDiary(@Body() createDiaryDto: CreateDiaryDto, @UserDecorator() user: User) {
    return this.diaryService.createDiary(createDiaryDto, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '감정 게시글 목록 조회' })
  @Get()
  getDiaryList(@Query() searchParams: SearchDiaryDto, @UserDecorator() user: User) {
    return this.diaryService.getDiaryList(searchParams, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '감정 게시글 상세 조회' })
  @Get(':seq')
  getDiary(@Param('seq') seq: number, @UserDecorator() user: User) {
    return this.diaryService.getDiary(+seq, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '감정 게시글 수정' })
  @Patch(':seq')
  update(@Param('seq') seq: number, @Body() updateDiaryDto: UpdateDiaryDto, @UserDecorator() user: User) {
    return this.diaryService.updateDiary(+seq, updateDiaryDto, user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '감정 게시글 삭제' })
  @Delete(':seq')
  remove(@Param('seq') id: number, @UserDecorator() user: User) {
    return this.diaryService.deleteDiary(+id, user);
  }
}
