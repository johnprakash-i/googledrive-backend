import File from './model';

export const createFile = (data: any) => File.create(data);

export const findFileById = (fileId: string) =>
  File.findOne({ _id: fileId, isDeleted: false });

export const listFiles = (
  ownerId: string,
  search: string,
  skip: number,
  limit: number,
  folderId?: string | null,
) => {
  const query: any = {
    ownerId,
    isDeleted: false,
  };
  
  // Add search filter if provided
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  
  // Add folderId filter if provided
  if (folderId !== undefined) {
    query.folderId = folderId;
  }
  
  return File.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
};

export const findFileByIdIncludingDeleted = (fileId: string) =>
  File.findById(fileId);
