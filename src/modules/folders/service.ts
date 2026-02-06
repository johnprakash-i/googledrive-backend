import { ApiError } from '../../common/errors/ApiError';
import {
  createFolder,
  findFolderById,
  updateFolderById,
  deleteFolderById,
  findFoldersByOwner,
} from './repository';
import { CreateFolderDTO, UpdateFolderDTO, ShareFolderDTO } from './types';
import Folder from './model';
import File from '../files/model';

export const createFolderService = async (
  ownerId: string,
  data: CreateFolderDTO,
) => {
  // Validate parent folder exists if provided
  if (data.parentId) {
    const parent = await findFolderById(data.parentId);
    if (!parent) throw new ApiError(404, 'Parent folder not found');
    if (parent.ownerId.toString() !== ownerId) {
      throw new ApiError(403, 'Cannot create folder in someone else\'s folder');
    }
  }

  // Check for duplicate folder name in the same parent
  const existingFolder = await Folder.findOne({
    name: data.name,
    ownerId,
    parentId: data.parentId || null,
    isDeleted: false,
  });

  if (existingFolder) {
    throw new ApiError(409, 'A folder with this name already exists in this location');
  }

  return createFolder({ ...data, ownerId });
};

export const listFoldersService = async (
  ownerId: string,
  parentId?: string | null,
  onlyTrashed: boolean = false
) => {
  const query: any = { ownerId, isDeleted: onlyTrashed };

  if (parentId !== undefined) {
    query.parentId = parentId;
  }

  return Folder.find(query).sort({ createdAt: -1 });
};

export const updateFolderService = async (
  ownerId: string,
  folderId: string,
  data: UpdateFolderDTO,
) => {
  const folder = await findFolderById(folderId);
  if (!folder) throw new ApiError(404, 'Folder not found');
  if (folder.ownerId.toString() !== ownerId) {
    throw new ApiError(403, 'You do not have permission to update this folder');
  }
  if (folder.isDeleted) {
    throw new ApiError(400, 'Cannot update a deleted folder');
  }

  // If renaming, check for duplicates
  if (data.name && data.name !== folder.name) {
    const existingFolder = await Folder.findOne({
      name: data.name,
      ownerId,
      parentId: folder.parentId,
      isDeleted: false,
      _id: { $ne: folderId },
    });

    if (existingFolder) {
      throw new ApiError(409, 'A folder with this name already exists in this location');
    }
  }

  return updateFolderById(folderId, data);
};

export const deleteFolderService = async (ownerId: string, folderId: string) => {
  const folder = await findFolderById(folderId);
  if (!folder) throw new ApiError(404, 'Folder not found');
  if (folder.ownerId.toString() !== ownerId) {
    throw new ApiError(403, 'You do not have permission to delete this folder');
  }

  // Recursively mark all subfolders and files as deleted
  await markFolderAndContentsAsDeleted(folderId);
  
  return { success: true };
};

const markFolderAndContentsAsDeleted = async (folderId: string) => {
  // Mark the folder as deleted
  await Folder.findByIdAndUpdate(folderId, { isDeleted: true });

  // Find all subfolders and recursively delete them
  const subfolders = await Folder.find({ parentId: folderId, isDeleted: false });
  for (const subfolder of subfolders) {
    await markFolderAndContentsAsDeleted(subfolder._id.toString());
  }

  // Mark all files in this folder as deleted
  await File.updateMany({ folderId, isDeleted: false }, { isDeleted: true });
};

export const restoreFolderService = async (ownerId: string, folderId: string) => {
  const folder = await Folder.findById(folderId);
  if (!folder) throw new ApiError(404, 'Folder not found');
  if (folder.ownerId.toString() !== ownerId) {
    throw new ApiError(403, 'You do not have permission to restore this folder');
  }
  if (!folder.isDeleted) {
    throw new ApiError(400, 'Folder is not in trash');
  }

  // Recursively restore folder and contents
  await restoreFolderAndContents(folderId);

  return Folder.findById(folderId);
};

const restoreFolderAndContents = async (folderId: string) => {
  // Restore the folder
  await Folder.findByIdAndUpdate(folderId, { isDeleted: false });

  // Find all subfolders and recursively restore them
  const subfolders = await Folder.find({ parentId: folderId, isDeleted: true });
  for (const subfolder of subfolders) {
    await restoreFolderAndContents(subfolder._id.toString());
  }

  // Restore all files in this folder
  await File.updateMany({ folderId, isDeleted: true }, { isDeleted: false });
};

export const permanentlyDeleteFolderService = async (
  ownerId: string,
  folderId: string,
) => {
  const folder = await Folder.findById(folderId);
  if (!folder) throw new ApiError(404, 'Folder not found');
  if (folder.ownerId.toString() !== ownerId) {
    throw new ApiError(403, 'You do not have permission to delete this folder');
  }
  if (!folder.isDeleted) {
    throw new ApiError(400, 'Folder must be in trash before permanent deletion');
  }

  // Recursively delete folder and all contents permanently
  await permanentlyDeleteFolderAndContents(folderId);

  return { success: true };
};

const permanentlyDeleteFolderAndContents = async (folderId: string) => {
  // Find and delete all subfolders
  const subfolders = await Folder.find({ parentId: folderId });
  for (const subfolder of subfolders) {
    await permanentlyDeleteFolderAndContents(subfolder._id.toString());
  }

  // Delete all files in this folder (you might want to delete from S3 too)
  const files = await File.find({ folderId });
  for (const file of files) {
    // TODO: Delete from S3/storage
    await File.findByIdAndDelete(file._id);
  }

  // Delete the folder itself
  await Folder.findByIdAndDelete(folderId);
};

export const shareFolderService = async (
  ownerId: string,
  folderId: string,
  data: ShareFolderDTO,
) => {
  const folder = await findFolderById(folderId);
  if (!folder) throw new ApiError(404, 'Folder not found');
  if (folder.ownerId.toString() !== ownerId) {
    throw new ApiError(403, 'You do not have permission to share this folder');
  }

  // TODO: Validate that the user exists
  // const user = await User.findOne({ email: data.email });
  // if (!user) throw new ApiError(404, 'User not found');

  // Add or update sharing
  const existingShareIndex = folder.sharedWith?.findIndex(
    (share: any) => share.email === data.email
  );

  if (existingShareIndex !== undefined && existingShareIndex >= 0) {
    // Update existing share
    folder.sharedWith[existingShareIndex].permission = data.permission;
  } else {
    // Add new share
    if (!folder.sharedWith) folder.sharedWith = [];
    folder.sharedWith.push({
      email: data.email,
      permission: data.permission,
      sharedAt: new Date(),
    });
  }

  await folder.save();
  return folder;
};

export const starFolderService = async (ownerId: string, folderId: string) => {
  const folder = await findFolderById(folderId);
  if (!folder) throw new ApiError(404, 'Folder not found');
  if (folder.ownerId.toString() !== ownerId) {
    throw new ApiError(403, 'You do not have permission to star this folder');
  }

  folder.isStarred = !folder.isStarred;
  await folder.save();

  return folder;
};

export const getSharedFoldersService = async (ownerId: string, userEmail: string) => {
  // Folders shared with me
  const sharedWithMe = await Folder.find({
    'sharedWith.email': userEmail,
    isDeleted: false,
  }).sort({ updatedAt: -1 });

  // Folders I shared
  const sharedByMe = await Folder.find({
    ownerId,
    'sharedWith.0': { $exists: true }, // Has at least one share
    isDeleted: false,
  }).sort({ updatedAt: -1 });

  return {
    sharedWithMe,
    sharedByMe,
    all: [...sharedWithMe, ...sharedByMe].filter(
      (folder, index, self) => index === self.findIndex(f => f._id.toString() === folder._id.toString())
    ),
  };
};