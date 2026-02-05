import { Router } from 'express';
import { protect } from '../../common/middleware/auth.middleware';
import { createFolder, listFolders } from './controller';

const router = Router();

router.post('/', protect, createFolder);
router.get('/', protect, listFolders);

export default router;
