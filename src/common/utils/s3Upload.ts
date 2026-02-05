import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../../config/s3.config';
import { env } from '../../config/env.config';
import { v4 as uuid } from 'uuid';

export const upload = multer({ storage: multer.memoryStorage() });

export const uploadToS3 = async (
  file: Express.Multer.File,
  userId: string,
  folderId?: string,
) => {
  const key = `${userId}/${folderId || 'root'}/${uuid()}-${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return key;
};
