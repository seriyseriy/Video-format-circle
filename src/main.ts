import { NestFactory } from '@nestjs/core';
import { AppModule } from './Module/app.module';  // Импортируем модуль приложения

async function bootstrap() {
  const app = await NestFactory.create(AppModule);  // Создаем приложение с использованием модуля
  await app.listen(3000);
  console.log('Бот работает!');
}

bootstrap();
