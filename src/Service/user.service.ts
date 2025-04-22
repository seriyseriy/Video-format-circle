import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUser(userId: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { user_id: userId } });

    if (!user) {
      user = this.userRepository.create({
        user_id: userId,
        count: 0,
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  async incrementUserCount(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    user.count += 1;
    await this.userRepository.save(user);
  }

  async resetUserCount(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });

    if (user) {
      user.count = 0;
      await this.userRepository.save(user);
    }
  }

  async setUserAsPaid(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    user.isPaid = true;
    await this.userRepository.save(user);
  }

  async isUserPaid(userId: string): Promise<boolean> {
    const user = await this.getUser(userId);
    return user.isPaid === true;
  }

  async updateUserVideoCount(userId: string): Promise<void> {
    await this.incrementUserCount(userId);
  }

  async createUser(createUserDto: Partial<User>): Promise<User> {
    const user = this.userRepository.create({
      user_id: createUserDto.user_id,
      count: createUserDto.count ?? 0,
      isPaid: createUserDto.isPaid ?? false,
    });
    return this.userRepository.save(user);
  }

  async getUserStats(userId: string): Promise<{ user_id: string; count: number; isPaid: boolean }> {
    const user = await this.getUser(userId);
    return {
      user_id: user.user_id,
      count: user.count,
      isPaid: user.isPaid === true,
    };
  }
}
