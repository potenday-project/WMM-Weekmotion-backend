import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from '../common/decorators/user.decorator';
import { User } from '../entites/User';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post()
  join(@Body() createUserDto: CreateUserDto) {
    return this.userService.join(createUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getMemberInfo(@UserDecorator() user: User) {
    return this.userService.getUserInfo(user);
  }

  @ApiOperation({ summary: '아이디 중복확인' })
  @Get('check/id/:id')
  checkUserId(@Param('id') id: string) {
    return this.userService.checkUserId(id);
  }
}
