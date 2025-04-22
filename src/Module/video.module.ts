import { forwardRef, Module } from '@nestjs/common';
import { VideoService } from '../Service/video.service';
import { UserService } from '../Service/user.service';
import { BotModule } from './bot.module';
import { TypeOrmModule } from '@nestjs/typeorm'; // Импортируем TypeOrmModule
import { User } from '../entity/user'; // Импортируем сущность User
import { Video } from '../entity/video';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, User]), // <-- Вот здесь подключается Video
    forwardRef(() => BotModule), // Подключаем BotModule с использованием forwardRef
    // TypeOrmModule.forFeature([User]), // Добавляем сущность User для работы с базой данных
  ],
  providers: [VideoService, UserService],  // Подключаем сервисы
  exports: [VideoService],  // Экспортируем VideoService, чтобы его могли использовать другие модули
})
export class VideoModule {}
