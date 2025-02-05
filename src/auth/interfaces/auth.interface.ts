export interface IAuthToken {
  id: string;
  userId: string;
  refreshToken: string;
}

export interface ICreateRefreshToken {
  userId: string;
  refreshToken: string;
}
