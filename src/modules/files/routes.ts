import { Router } from 'express';
import { protect } from '../../common/middleware/auth.middleware';
import { upload } from '../../common/utils/s3Upload';
import {
  uploadFile,
  getDownloadUrl,
  listFiles,
} from './controller';
import { shareFile, listSharedFiles } from './share.controller';
import { validate } from '../../common/middleware/validate.middleware';
import { shareFileSchema } from './validation';

const router = Router();

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/', protect, listFiles);
router.get('/download/:fileId', protect, getDownloadUrl);
router.post('/:fileId/share', protect, validate(shareFileSchema), shareFile);
router.get('/shared-with-me', protect, listSharedFiles);
export default router;
