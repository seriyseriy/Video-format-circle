import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';  // Импортируем TypeOrmModule
import { UserService } from '../Service/user.service';  // Импортируем UserService
import { User } from '../entity/user';  // Импортируем сущность User

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Регистрация UserRepository для работы с сущностью User
  ],
  providers: [UserService],
  exports: [UserService],  // Экспортируем, чтобы использовать в других модулях
})
export class UserModule {}
