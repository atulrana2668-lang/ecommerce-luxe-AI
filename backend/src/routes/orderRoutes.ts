import { Router } from 'express';
import {
    createOrder,
    getMyOrders,
    getOrder,
    cancelOrder,
    updateOrderStatus,
    getAllOrders
} from '../controllers/orderController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
