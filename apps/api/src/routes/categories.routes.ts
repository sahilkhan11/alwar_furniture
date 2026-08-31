import { Router } from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/categories.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCategories);

// Admin only routes
router.post('/', authenticate, requireAdmin, createCategory);
router.put('/:id', authenticate, requireAdmin, updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

export default router;
