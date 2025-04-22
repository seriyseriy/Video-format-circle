// src/Module/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotModule } from './bot.module';
import { VideoModule } from './video.module';
import { User } from '../entity/user';
import { Video } from '../entity/video';
import { BotService } from '../Service/bot.service'
import { UserModule } from './user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // чтобы доступ был во всех модулях
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, UserModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432')),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'video_database'),
        entities: [User, Video],
        synchronize: true,
      }),
    }),
    UserModule,
    BotModule,
    VideoModule,
  ],
  providers: [BotService],
})
export class AppModule {}
