import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { StandardResponseInterceptor } from './common/interceptors/standard-response.interceptor';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: true
  });
  app.setGlobalPrefix('api/v1');
  const port = process.env.PORT || 3002;
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new StandardResponseInterceptor());
  const config = new DocumentBuilder()
    .addServer('api/v1')
    .setTitle('API')
    .setDescription('API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('user', '회원 관련')
    .addTag('auth', '회원 인증 관련')
    .addTag('tag', '감정 태그 관련')
    .build();
  const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true });
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  console.log(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
    console.log('hot reload.....');
  }
}
bootstrap();
