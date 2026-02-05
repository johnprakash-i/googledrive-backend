import User from '../users/model';

export const findUserByEmail = (email: string) =>
  User.findOne({ email });

export const createUser = (data: any) =>
  User.create(data);

export const activateUser = (userId: string) =>
  User.findByIdAndUpdate(userId, { isActive: true });
