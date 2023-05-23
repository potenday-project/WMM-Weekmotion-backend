import { Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { UserDecorator } from '../common/decorators/user.decorator';
import { User } from '../entites/User';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    schema: {
      properties: {
        id: { type: 'string', default: 'test' },
        password: { type: 'string', default: 'test' }
      }
    }
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: '토큰 재발급' })
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(@Req() req, @UserDecorator() user: User) {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
    } else {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    return this.authService.refresh(token, user);
  }
}
