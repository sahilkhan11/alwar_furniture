import { Router } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/products.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/', authenticate, requireAdmin, upload.array('images', 5), createProduct);
router.put('/:id', authenticate, requireAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

export default router;
