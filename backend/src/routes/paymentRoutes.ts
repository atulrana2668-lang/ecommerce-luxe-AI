import express from 'express';
import { protect } from '../middleware/auth';
import {
    createPaymentOrder,
    verifyPayment,
    handleWebhook,
    getPaymentStatus,
    createOrder
} from '../controllers/paymentController';

const router = express.Router();

// Protected routes (require authentication)
router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.get('/:paymentId/status', protect, getPaymentStatus);

// Webhook route (public - called by Razorpay servers)
// Note: This should have raw body parsing for signature verification
router.post('/webhook', handleWebhook);

export default router;
