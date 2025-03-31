import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

//@nestjs/config 사용하지 않는 경우
// dotenv.config({
//   path: path.resolve(
//     process.env.NODE_ENV === 'development' ? '.env.local' : ''
//   )
// })

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    //class-transformer 적용
    transform: true
  }))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
