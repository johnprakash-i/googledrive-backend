import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import {
  createFolderService,
  listFoldersService,
  updateFolderService,
  deleteFolderService,
  restoreFolderService,
  permanentlyDeleteFolderService,
  shareFolderService,
  starFolderService,
  getSharedFoldersService,
} from './service';
import { getSingleParam } from '../../common/utils/helper';

export const createFolder = async (req: AuthRequest, res: Response) => {
  const folder = await createFolderService(req.user.id, req.body);

  res.json({
    success: true,
    message: 'Folder created successfully',
    data: { folder },
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

export const updateFolder = async (req: AuthRequest, res: Response) => {
   const folderId = getSingleParam(req.params.folderId, 'folderId')
  const folder = await updateFolderService(req.user.id, folderId, req.body);

  res.json({
    success: true,
    message: 'Folder updated successfully',
    data: { folder },
  });
};

export const deleteFolder = async (req: AuthRequest, res: Response) => {
   const folderId = getSingleParam(req.params.folderId, 'folderId')
  await deleteFolderService(req.user.id, folderId);

  res.json({
    success: true,
    message: 'Folder moved to trash',
    data: {},
  });
};

export const restoreFolder = async (req: AuthRequest, res: Response) => {
   const folderId = getSingleParam(req.params.folderId, 'folderId')
  const folder = await restoreFolderService(req.user.id, folderId);

  res.json({
    success: true,
    message: 'Folder restored successfully',
    data: { folder },
  });
};

export const permanentlyDeleteFolder = async (req: AuthRequest, res: Response) => {
 const folderId = getSingleParam(req.params.folderId, 'folderId')
  await permanentlyDeleteFolderService(req.user.id, folderId);

  res.json({
    success: true,
    message: 'Folder permanently deleted',
    data: {},
  });
};

export const shareFolder = async (req: AuthRequest, res: Response) => {
   const folderId = getSingleParam(req.params.folderId, 'folderId')
  const folder = await shareFolderService(req.user.id, folderId, req.body);

  res.json({
    success: true,
    message: 'Folder shared successfully',
    data: { folder },
  });
};

export const starFolder = async (req: AuthRequest, res: Response) => {
   const folderId = getSingleParam(req.params.folderId, 'folderId')
  const folder = await starFolderService(req.user.id, folderId);

  res.json({
    success: true,
    message: folder.isStarred ? 'Folder starred' : 'Folder unstarred',
    data: { folder },
  });
};

export const listTrashedFolders = async (req: AuthRequest, res: Response) => {
  const folders = await listFoldersService(req.user.id, undefined, true);

  res.json({
    success: true,
    message: 'Trashed folders fetched successfully',
    data: folders,
  });
};

export const getSharedFolders = async (req: AuthRequest, res: Response) => {
  const folders = await getSharedFoldersService(req.user.id, req.user.email);

  res.json({
    success: true,
    message: 'Shared folders fetched successfully',
    data: folders,
  });
};