import { forwardRef, Module } from '@nestjs/common';
import { BotController } from '../Controller/botController';  // Импортируем контроллер
import { BotService } from '../Service/bot.service';  // Импортируем сервис
import { VideoModule } from './video.module';  // Подключаем VideoModule для обработки видео
import { TypeOrmModule } from '@nestjs/typeorm';  // Импортируем TypeOrmModule для работы с базой данных
import { User } from '../entity/user';  // Импортируем сущность User для работы с базой данных
import { UserModule } from './user.module';  // Импортируем UserModule
import { VideoService } from '../Service/video.service';
import { UserService } from '../Service/user.service';

@Module({
  imports: [
    forwardRef(() => VideoModule), // Подключаем VideoModule с использованием forwardRef
    TypeOrmModule.forFeature([User]), // Добавляем сущность User для работы с базой данных
    forwardRef(() => UserModule), // Импортируем UserModule, чтобы использовать UserService
  ],
  controllers: [BotController],  // Подключаем контроллер
  providers: [BotService],  // Подключаем сервисы
  exports: [BotService],  // Экспортируем сервисы
})
export class BotModule {}
