import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Message } from 'node-telegram-bot-api';
import TelegramBot from 'node-telegram-bot-api';
import { VideoService } from './video.service';
import { UserService } from './user.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BotService implements OnModuleInit {
  private static botInstance: TelegramBot | null = null;
  private bot!: TelegramBot;

  constructor(
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  onModuleInit() {
    if (BotService.botInstance) {
      console.warn('⚠️ Бот уже был запущен. Повторный запуск предотвращён.');
      return;
    }

    const TOKEN = process.env.BOT_TOKEN;
    if (!TOKEN) {
      throw new Error('BOT_TOKEN не найден в .env!');
    }

    this.bot = new TelegramBot(TOKEN, { polling: true });
    BotService.botInstance = this.bot;

    console.log('🤖 Бот запущен!');
    this.handleEvents();
  }

  private handleEvents() {
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, `Привет! 👋\nОтправь мне видео — я его обработаю.`);
    });

    this.bot.on('video', async (msg: Message) => {
      const chatId = msg.chat.id;
      const userId = String(msg.from?.id);
      const video = msg.video;

      if (!video?.file_id) return;

      console.log(`Получено видео от пользователя ${userId}`);

      try {
        const result = await this.videoService.handleVideo(userId, video);

        if (result === 'LIMIT_EXCEEDED') {
          this.bot.sendMessage(chatId, 'Лимит бесплатного использования (5 видео) исчерпан. Чтобы продолжить, нужно произвести оплату.');
        } else if (result === 'ERROR') {
          this.bot.sendMessage(chatId, 'Не удалось обработать видео.');
        }
      } catch (error) {
        console.error('Неожиданная ошибка при обработке видео:', error);
        this.bot.sendMessage(chatId, 'Произошла ошибка.');
      }
    });
  }

  getBot(): TelegramBot {
    return this.bot;
  }
}
