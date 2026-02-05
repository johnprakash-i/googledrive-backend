import { Router } from 'express';
import { getProfile, updateProfile } from './controller';
import { protect } from '../../common/middleware/auth.middleware';

const router = Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

export default router;
