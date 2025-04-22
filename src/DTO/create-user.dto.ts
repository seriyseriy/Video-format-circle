// src/user/dto/create-user.dto.ts
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: '1234567890', description: 'Telegram user ID' })
  @IsString()
  user_id!: string;

  @ApiPropertyOptional({ example: 0, description: 'Количество использований' })
  @IsOptional()
  @IsInt()
  count?: number;

  @ApiPropertyOptional({ example: true, description: 'Оплатил ли пользователь' })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
