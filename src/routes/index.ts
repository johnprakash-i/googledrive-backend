import { Router } from 'express';
import authRoutes from '../modules/auth/routes';
import userRoutes from '../modules/users/routes';
import folderRoutes from '../modules/folders/routes';
import fileRoutes from '../modules/files/routes';
const router = Router();

router.use('/auth', authRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running' });
});
router.use('/users', userRoutes);

router.use('/folders', folderRoutes);

router.use('/files', fileRoutes);

export default router;
