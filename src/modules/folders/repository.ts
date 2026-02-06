import Folder from './model';

export const createFolder = (data: any) => Folder.create(data);

export const findFolderById = (folderId: string) =>
  Folder.findOne({ _id: folderId, isDeleted: false });

export const findFoldersByOwner = (ownerId: string) =>
  Folder.find({ ownerId, isDeleted: false }).sort({ createdAt: -1 });

export const findFoldersByParent = (ownerId: string, parentId: string | null) =>
  Folder.find({ ownerId, parentId, isDeleted: false }).sort({ createdAt: -1 });

export const updateFolderById = (folderId: string, data: any) =>
  Folder.findByIdAndUpdate(folderId, data, { new: true });

export const deleteFolderById = (folderId: string) =>
  Folder.findByIdAndUpdate(folderId, { isDeleted: true });

export const findTrashedFolders = (ownerId: string) =>
  Folder.find({ ownerId, isDeleted: true }).sort({ updatedAt: -1 });

export const permanentlyDeleteFolder = (folderId: string) =>
  Folder.findByIdAndDelete(folderId);