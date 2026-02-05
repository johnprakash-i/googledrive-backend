import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import {
  uploadFileService,
  getDownloadUrlService,
  listFilesService,

} from './service';

export const uploadFile = async (req: AuthRequest, res: Response) => {
  const fileData = await uploadFileService(
    req.file!,
    req.user.id,
    req.body.folderId,
  );

  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: fileData,
  });
};

export const getDownloadUrl = async (req: AuthRequest, res: Response) => {
         const { fileId } = req.params;

  if (Array.isArray(fileId)) {
    return res.status(400).json({ success: false, message: 'Invalid file ID' });
  }

  const url = await getDownloadUrlService(fileId, req.user.id);

  res.json({
    success: true,
    message: 'Download URL generated',
    data: url,
  });
};

export const listFiles = async (req: AuthRequest, res: Response) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  const files = await listFilesService(
    req.user.id,
    search as string,
    Number(page),
    Number(limit),
  );

  res.json({
    success: true,
    message: 'Files fetched successfully',
    data: files,
  });
};
