import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { User } from '../entites/User';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, @InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) {}

  async validateUser(id: string, password: string) {
    const user = await this.userRepository.createQueryBuilder('user').select().addSelect('user.password').where({ id }).getOne();

    if (!user) {
      return null;
    }
    const result = await bcrypt.compare(password, user.password);

    if (result) {
      const { ...userWithoutPassword } = user;

      return userWithoutPassword;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, seq: user.seq };
    const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_PRIVATE_KEY });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d', secret: process.env.JWT_PUBLIC_KEY });
    await this.cacheManager.set(user.id, refreshToken, 0);

    return { accessToken, refreshToken };
  }

  async refresh(token: string, user: User) {
    const cachedRefreshToken = (await this.cacheManager.get(user.id))?.toString();

    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(cachedRefreshToken, { secret: process.env.JWT_PUBLIC_KEY });
    } catch (e) {
      throw new UnauthorizedException('만료된 리프레시 토큰입니다.');
    }
    const userInfo = await this.userRepository.findOne({
      where: { seq: decodedToken.seq },
      select: ['seq', 'id']
    });
    const payload = { seq: userInfo.seq, email: user.id };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1m', secret: process.env.JWT_PRIVATE_KEY })
    };
  }
}
