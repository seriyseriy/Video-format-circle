// src/controllers/video.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { VideoService } from '../Service/video.service';
import { VideoDto } from '../DTO/video.dto';

@Controller('videos') // URL: POST /videos
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('process')
  async processVideo(@Body() videoDto: VideoDto) {
    return this.videoService.handleVideo(videoDto.userId, videoDto.video);
  }
}
