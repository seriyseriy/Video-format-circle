import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BotService } from './bot.service';
import { UserService } from './user.service';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import fetch from 'node-fetch';

const VIDEO_LIMIT = 5;
const videoDir = path.resolve(__dirname, '../../videos');

if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir);
}

@Injectable()
export class VideoService {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => BotService))
    private readonly botService: BotService,
  ) {}

  private async waitForBotInit(): Promise<import('node-telegram-bot-api')> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const bot = this.botService.getBot();
        if (bot) {
          clearInterval(interval);
          resolve(bot);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Бот не инициализировался вовремя.'));
      }, 5000);
    });
  }

  async handleVideo(userId: string, video: { file_id: string }): Promise<'LIMIT_EXCEEDED' | 'SUCCESS' | 'ERROR'> {
    try {
      const user = await this.userService.getUser(userId);

      if (user.count > VIDEO_LIMIT) {
        return 'LIMIT_EXCEEDED';
      }

      const bot = await this.waitForBotInit();
      const file = await bot.getFile(video.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;
      const inputPath = path.join(videoDir, `${nanoid()}.mp4`);
      const outputPath = path.join(videoDir, `${nanoid()}.mp4`);

      await this.downloadVideo(fileUrl, inputPath);
      await this.convertToVideoNote(inputPath, outputPath);

      await bot.sendVideoNote(Number(userId), outputPath);
      await this.userService.incrementUserCount(userId);

      fs.unlinkSync(inputPath);

      return 'SUCCESS';
    } catch (err) {
      console.error('Ошибка при обработке видео:', err);
      return 'ERROR';
    }
  }

  private async downloadVideo(fileUrl: string, inputPath: string) {
    const res = await fetch(fileUrl);
    const stream = fs.createWriteStream(inputPath);
    await new Promise<void>((resolve, reject) => {
      res.body?.pipe(stream);
      res.body?.on('error', reject);
      stream.on('finish', resolve);
    });
  }

  private async convertToVideoNote(inputPath: string, outputPath: string) {
    return new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .size('640x640')
        .aspect('1:1')
        .autopad()
        .videoCodec('libx264')
        .format('mp4')
        .outputOptions('-preset veryfast')
        .duration(59)
        .on('end', () => resolve())
        .on('error', reject)
        .save(outputPath);
    });
  }
}
