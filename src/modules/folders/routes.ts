import { Router } from 'express';
import { protect } from '../../common/middleware/auth.middleware';
import {
  createFolder,
  listFolders,
  updateFolder,
  deleteFolder,
  restoreFolder,
  permanentlyDeleteFolder,
  shareFolder,
  starFolder,
  listTrashedFolders,
  getSharedFolders
} from './controller';
import { validate } from '../../common/middleware/validate.middleware';
import {
  createFolderSchema,
  updateFolderSchema,
  shareFolderSchema,
} from './validation';

const router = Router();

// Folder CRUD
router.post('/', protect, validate(createFolderSchema), createFolder);
router.get('/', protect, listFolders);
router.patch('/:folderId', protect, validate(updateFolderSchema), updateFolder);

// Trash operations
router.delete('/:folderId', protect, deleteFolder);
router.post('/:folderId/restore', protect, restoreFolder);
router.delete('/:folderId/permanent', protect, permanentlyDeleteFolder);
router.get('/trash/list', protect, listTrashedFolders);

// Sharing & starring
router.post('/:folderId/share', protect, validate(shareFolderSchema), shareFolder);
router.patch('/:folderId/star', protect, starFolder);
router.get('/shared/list', protect, getSharedFolders);
export default router;