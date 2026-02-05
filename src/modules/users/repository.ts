import User from './model';

export const findUserById = (userId: string) =>
  User.findById(userId).select('-password');

export const updateUserById = (
  userId: string,
  data: Partial<{ firstName: string; lastName: string }>,
) => User.findByIdAndUpdate(userId, data, { new: true }).select('-password');
