import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class VideoDto {
  @IsString()
  @IsNotEmpty()
  userId: string = ''; // Инициализируем пустой строкой, чтобы избежать ошибки

  @IsObject()
  video: { file_id: string } = { file_id: '' }; // Инициализируем объект с пустым file_id
}
