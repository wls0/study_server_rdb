import { IAuthToken } from '../auth/interfaces/auth.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsString, IsUUID } from 'class-validator';

@Entity()
export class RefreshToken implements IAuthToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  @IsString()
  refreshToken: string;
}
