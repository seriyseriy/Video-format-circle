// src/controllers/user.controller.ts

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from '../Service/user.service';
import { CreateUserDto } from '../DTO/create-user.dto';

@Controller('users') // URL: POST /users
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Создание нового пользователя
  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Получение информации о пользователе
  @Get(':userId')
  async getUserInfo(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  // Получение статистики пользователя
  @Get(':userId/stats')
  async getUserStats(@Param('userId') userId: string) {
    return this.userService.getUserStats(userId);
  }
}
