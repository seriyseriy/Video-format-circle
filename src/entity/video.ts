// src/entities/video.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user'; // путь может отличаться

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  file_id!: string;

  @Column({ nullable: true })
  caption!: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => User, { eager: true })
  user!: User;
}
