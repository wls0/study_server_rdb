import { SocialAuth } from '../enum/user.enum';

export interface IUser {
  id: string;
  authId: string;
  auth: SocialAuth;
  name: string;
  email: string;
  nickname: string;
  phone: string;
  fcmToken: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface IFindUserByAuthIdAndAuth {
  authId: string;
  auth: SocialAuth;
}

export interface IUpdateNickname {
  id: string;
  nickname: string;
}

export interface ICreateUser {
  authId: string;
  auth: SocialAuth;
  name: string;
  email: string;
  nickname: string;
}
