import { ApiError } from '../../common/errors/ApiError';
import { createFolder, findFolderById, listFoldersByOwner } from './repository';
import { CreateFolderDTO } from './types';

export const createFolderService = async (
  ownerId: string,
  data: CreateFolderDTO,
) => {
  if (data.parentId) {
    const parent = await findFolderById(data.parentId);
    if (!parent) throw new ApiError(404, 'Parent folder not found');
  }

  return createFolder({ ...data, ownerId });
};

export const listFoldersService = async (ownerId: string) =>
  listFoldersByOwner(ownerId);
