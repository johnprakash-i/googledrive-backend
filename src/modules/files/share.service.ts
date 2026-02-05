import { ApiError } from '../../common/errors/ApiError';
import User from '../users/model';
import { createShare, findShare, listSharedFiles } from './share.repository';
import { findFileByIdIncludingDeleted } from './repository';

export const shareFileService = async (
  ownerId: string,
  fileId: string,
  email: string,
  permission: 'VIEW' | 'EDIT' = 'VIEW',
) => {
  const file = await findFileByIdIncludingDeleted(fileId);
  if (!file || file.ownerId.toString() !== ownerId)
    throw new ApiError(403, 'Not file owner');

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  const existing = await findShare(fileId, user.id);
  if (existing) throw new ApiError(400, 'Already shared');

  return createShare({
    fileId,
    ownerId,
    sharedWith: user.id,
    permission,
  });
};

export const getSharedFilesService = async (userId: string) =>
  listSharedFiles(userId);
