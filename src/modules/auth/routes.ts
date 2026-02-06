import { Router } from 'express';
import { register, login, activate, refresh, forgotPassword, resetPassword } from './controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/activate/:token', activate);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
export default router;
