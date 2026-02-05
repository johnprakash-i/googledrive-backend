import Folder from './model';

export const createFolder = (data: any) => Folder.create(data);

export const findFolderById = (folderId: string) =>
  Folder.findOne({ _id: folderId, isDeleted: false });

export const listFoldersByOwner = (ownerId: string) =>
  Folder.find({ ownerId, isDeleted: false });
