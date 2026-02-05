import File from './model';

export const createFile = (data: any) => File.create(data);

export const findFileById = (fileId: string) =>
  File.findOne({ _id: fileId, isDeleted: false });

export const listFiles = (
  ownerId: string,
  search: string,
  skip: number,
  limit: number,
) =>
  File.find({
    ownerId,
    isDeleted: false,
    name: { $regex: search, $options: 'i' },
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

export const findFileByIdIncludingDeleted = (fileId: string) =>
  File.findById(fileId);
