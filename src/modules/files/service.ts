import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ApiError } from '../../common/errors/ApiError';
import { uploadToS3 } from '../../common/utils/s3Upload';
import { s3 } from '../../config/s3.config';
import { env } from '../../config/env.config';
import { createFile, findFileById, listFiles } from './repository';
import { findShare } from './share.repository';

export const uploadFileService = async (
  file: Express.Multer.File,
  userId: string,
  folderId?: string,
) => {
  if (!file) throw new ApiError(400, 'File is required');

  const s3Key = await uploadToS3(file, userId, folderId);

  return createFile({
    name: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    s3Key,
    ownerId: userId,
    folderId: folderId || null,
  });
};

export const getDownloadUrlService = async (fileId: string, userId: string) => {
  const file = await findFileById(fileId);
  if (!file) throw new ApiError(404, 'File not found');

  const isOwner = file.ownerId.toString() === userId;
  const share = await findShare(fileId, userId);

  if (!isOwner && !share) throw new ApiError(403, 'Access denied');

  const command = new GetObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: file.s3Key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { url };
};
export const listFilesService = async (
  userId: string,
  search = '',
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;
  return listFiles(userId, search, skip, limit);
};


