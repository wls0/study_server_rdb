import { User } from 'src/model/user.model';

export const user: User = {
  id: '1',
  authId: 'authId',
  auth: 'apple',
  name: 'name',
  email: 'email',
  nickname: 'nickname',
  createdAt: new Date(),
  phone: '',
  fcmToken: '',
  deletedAt: null,
  financialPaymentSources: [],
  financialTags: [],
  financialRecords: [],
};
