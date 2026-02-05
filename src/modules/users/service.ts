import { ApiError } from '../../common/errors/ApiError';
import { findUserById, updateUserById } from './repository';
import { UpdateProfileDTO } from './types';

export const getProfileService = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updateProfileService = async (
  userId: string,
  data: UpdateProfileDTO,
) => {
  const updated = await updateUserById(userId, data);
  if (!updated) throw new ApiError(404, 'User not found');
  return updated;
};
