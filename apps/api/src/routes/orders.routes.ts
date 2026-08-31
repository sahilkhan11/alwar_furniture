import { Router } from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orders.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// User routes
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);

// Admin only routes
router.get('/', authenticate, requireAdmin, getAllOrders);
router.put('/:id/status', authenticate, requireAdmin, updateOrderStatus);

export default router;
