// src/utils/db.ts
import { DataSource } from 'typeorm';
import { User } from '../entity/user'; // подключаем сущность User

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1994sergei1994',
  database: 'video_database',
  synchronize: true, // создаст таблицу автоматически
  entities: [User],
});

export const initDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Подключение к базе данных успешно!');
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
  }
};


initDB();
