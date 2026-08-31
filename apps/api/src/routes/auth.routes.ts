import { Router } from 'express';
import { register, login, getProfile, firebaseLogin } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/firebase-login', firebaseLogin);
router.get('/me', authenticate, getProfile);

export default router;
