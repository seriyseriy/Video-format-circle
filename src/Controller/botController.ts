import { Controller, Post, Body } from '@nestjs/common';
import { Message } from 'node-telegram-bot-api';
import { VideoService } from '../Service/video.service';

@Controller('bot') // URL: POST /bot/video
export class BotController {
  constructor(private readonly videoService: VideoService) {}

  @Post('video')
  async onVideoReceived(@Body() msg: Message) {
    const userId = String(msg.from?.id);
    const video = msg.video;

    if (video?.file_id) {
      await this.videoService.handleVideo(userId, video);
    }
  }
}
