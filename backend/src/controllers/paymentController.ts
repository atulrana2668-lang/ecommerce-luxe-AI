import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order';
import Product from '../models/Product';

// Initialize Razorpay instance only if keys are configured
let razorpay: Razorpay | null = null;

const initRazorpay = () => {
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_123';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'secret';

    razorpay = new Razorpay({
        key_id,
        key_secret
    });
    console.log(`✅ Razorpay initialized with ${key_id === 'rzp_test_123' ? 'DUMMY' : 'CONFIGURED'} keys`);
};

// Initialize on module load
initRazorpay();


// Interface for order items
interface OrderItemInput {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    image: string;
}

// Interface for shipping address
interface ShippingAddressInput {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
}

/**
 * @desc    Create a Razorpay payment order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
export const createPaymentOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod
        }: {
            items: OrderItemInput[];
            shippingAddress: ShippingAddressInput;
            paymentMethod: 'cod' | 'card' | 'upi';
        } = req.body;

        // Validate required fields
        if (!items || items.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Cart items are required'
            });
            return;
        }

        if (!shippingAddress) {
            res.status(400).json({
                success: false,
                message: 'Shipping address is required'
            });
            return;
        }

        // Calculate order totals
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            // Verify product exists and get latest price
            const product = await Product.findById(item.productId);
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
                return;
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                image: product.image
            });
        }

        // Calculate shipping and tax
        const shippingCost = subtotal >= 999 ? 0 : 99; // Free shipping over ₹999
        const taxRate = 0.18; // 18% GST
        const tax = Math.round(subtotal * taxRate);
        const total = subtotal + shippingCost + tax;

        // Handle Cash on Delivery
        if (paymentMethod === 'cod') {
            // Create order directly for COD
            const order = await Order.create({
                user: (req as any).user._id,
                items: orderItems,
                shippingAddress,
                paymentMethod: 'cod',
                paymentStatus: 'pending',
                orderStatus: 'confirmed',
                subtotal,
                shippingCost,
                tax,
                total
            });

            res.status(201).json({
                success: true,
                message: 'Order placed successfully (Cash on Delivery)',
                data: {
                    order,
                    paymentMethod: 'cod'
                }
            });
            return;
        }

        // Check if Razorpay is configured for online payments
        if (!razorpay) {
            res.status(503).json({
                success: false,
                message: 'Online payments are not configured. Please use Cash on Delivery or contact support.'
            });
            return;
        }

        // Create Razorpay order for online payment
        const razorpayOrder = await razorpay.orders.create({
            amount: total * 100, // Amount in paise
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            notes: {
                userId: (req as any).user._id.toString(),
                itemCount: items.length.toString()
            }
        });

        // Store pending order data in session/temp storage
        // In production, you might use Redis or a temp collection
        const pendingOrderData = {
            razorpayOrderId: razorpayOrder.id,
            userId: (req as any).user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            tax,
            total
        };

        res.status(200).json({
            success: true,
            message: 'Payment order created',
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                keyId: process.env.RAZORPAY_KEY_ID,
                pendingOrderData // Send back for verification
            }
        });

    } catch (error: any) {
        console.error('Create payment order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message
        });
    }
};

/**
 * @desc    Verify Razorpay payment and create order
 * @route   POST /api/payments/verify
 * @access  Private
 */
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body)
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed - Invalid signature'
            });
            return;
        }

        // Payment is verified, create the order
        const order = await Order.create({
            user: (req as any).user._id,
            items: orderData.items,
            shippingAddress: orderData.shippingAddress,
            paymentMethod: orderData.paymentMethod,
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
            subtotal: orderData.subtotal,
            shippingCost: orderData.shippingCost,
            tax: orderData.tax,
            total: orderData.total,
            notes: `Razorpay Payment ID: ${razorpay_payment_id}`
        });

        // Update product stock (optional)
        for (const item of orderData.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stockQuantity: -item.quantity }
            });
        }

        res.status(201).json({
            success: true,
            message: 'Payment verified and order created successfully',
            data: {
                order,
                paymentId: razorpay_payment_id
            }
        });

    } catch (error: any) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message
        });
    }
};

/**
 * @desc    Razorpay Webhook handler
 * @route   POST /api/payments/webhook
 * @access  Public (Razorpay servers)
 */
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

        // Verify webhook signature
        const signature = req.headers['x-razorpay-signature'] as string;
        const body = JSON.stringify(req.body);

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('Webhook signature verification failed');
            res.status(400).json({ success: false, message: 'Invalid signature' });
            return;
        }

        const event = req.body.event;
        const payload = req.body.payload;

        console.log('Razorpay Webhook Event:', event);

        switch (event) {
            case 'payment.captured':
                // Payment was successful
                const paymentId = payload.payment.entity.id;
                const orderId = payload.payment.entity.order_id;

                console.log(`Payment captured: ${paymentId} for order: ${orderId}`);

                // Update order status if exists
                await Order.findOneAndUpdate(
                    { notes: { $regex: orderId } },
                    {
                        paymentStatus: 'paid',
                        orderStatus: 'confirmed'
                    }
                );
                break;

            case 'payment.failed':
                // Payment failed
                const failedPaymentId = payload.payment.entity.id;
                console.log(`Payment failed: ${failedPaymentId}`);

                await Order.findOneAndUpdate(
                    { notes: { $regex: failedPaymentId } },
                    {
                        paymentStatus: 'failed',
                        orderStatus: 'cancelled'
                    }
                );
                break;

            case 'refund.created':
                // Refund was initiated
                const refundId = payload.refund.entity.id;
                console.log(`Refund created: ${refundId}`);
                break;

            default:
                console.log(`Unhandled webhook event: ${event}`);
        }

        res.status(200).json({ success: true, received: true });

    } catch (error: any) {
        console.error('Webhook error:', error);
        res.status(500).json({
            success: false,
            message: 'Webhook processing failed',
            error: error.message
        });
    }
};

/**
 * @desc    Get payment status
 * @route   GET /api/payments/:paymentId/status
 * @access  Private
 */
export const getPaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!razorpay) {
            res.status(503).json({
                success: false,
                message: 'Payment service is not configured'
            });
            return;
        }

        const { paymentId } = req.params;

        const payment = await razorpay.payments.fetch(paymentId);

        res.status(200).json({
            success: true,
            data: {
                id: payment.id,
                status: payment.status,
                amount: (payment.amount as number) / 100,
                currency: payment.currency,
                method: payment.method,
                createdAt: new Date((payment.created_at as number) * 1000)
            }
        });

    } catch (error: any) {
        console.error('Get payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment status',
            error: error.message
        });
    }
};

/**
 * @desc    Initialize a simple Razorpay order (for specific task requirement)
 * @route   POST /api/payment/create-order
 * @access  Private
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { amount } = req.body;

        if (!amount) {
            res.status(400).json({ success: false, message: 'Amount is required' });
            return;
        }

        if (!razorpay) {
            res.status(500).json({ success: false, message: 'Razorpay not initialized' });
            return;
        }

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error: any) {
        console.error('Simple create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create Razorpay order',
            error: error.message
        });
    }
};
