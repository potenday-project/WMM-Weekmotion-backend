import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthenticationMiddleware } from './common/middleweres/jwt-authentication.middlewere';
import { LoggerMiddleware } from './common/middleweres/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [],
      charset: 'utf8mb4',
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      keepConnectionAlive: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(JwtAuthenticationMiddleware)
      .exclude({ path: 'member', method: RequestMethod.POST }, { path: 'auth/login', method: RequestMethod.POST }, { path: 'auth/refresh', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
