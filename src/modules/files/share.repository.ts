import FileShare from './share.model';

export const createShare = (data: any) => FileShare.create(data);

export const findShare = (fileId: string, userId: string) =>
  FileShare.findOne({ fileId, sharedWith: userId });

export const listSharedFiles = (userId: string) =>
  FileShare.find({ sharedWith: userId }).populate('fileId');
