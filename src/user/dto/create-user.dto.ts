import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entites/User';

export class CreateUserDto {
  @ApiProperty({ description: '아이디' })
  id: string;

  @ApiProperty({ description: '비밀번호' })
  password: string;

  @ApiProperty({ description: '이름' })
  name: string;

  @ApiProperty({ description: '이메일' })
  email: string;

  @ApiProperty({ description: '연락처' })
  phone: string;

  toEntity() {
    const entity = new User();
    entity.id = this.id;
    entity.email = this?.email;
    entity.name = this?.name;
    entity.phone = this?.phone;

    return entity;
  }
}
