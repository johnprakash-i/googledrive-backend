import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { createFolderService, listFoldersService } from './service';

export const createFolder = async (req: AuthRequest, res: Response) => {
  const folder = await createFolderService(req.user.id, req.body);

  res.json({
    success: true,
    message: 'Folder created successfully',
    data: folder,
  });
};

export const listFolders = async (req: AuthRequest, res: Response) => {
  const { parentId } = req.query;
  
  const folders = await listFoldersService(
    req.user.id, 
    parentId as string | undefined
  );

  res.json({
    success: true,
    message: 'Folders fetched successfully',
    data: folders,
  });
};
