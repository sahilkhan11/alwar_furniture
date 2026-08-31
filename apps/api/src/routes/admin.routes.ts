import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/stats', authenticate, requireAdmin, getDashboardStats);

export default router;
