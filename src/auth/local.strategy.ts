import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'id'
    });
  }

  async validate(id: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(id, password);
    if (!user) {
      throw new UnauthorizedException('일치하는 정보가 없습니다.');
    }
    return user;
  }
}
