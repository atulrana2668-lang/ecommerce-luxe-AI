"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrders = exports.updateOrderStatus = exports.cancelOrder = exports.getOrder = exports.getMyOrders = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, notes } = req.body;
        if (!items || items.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No order items'
            });
            return;
        }
        // Validate items and calculate totals
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await Product_1.default.findById(item.productId);
            if (!product) {
                res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`
                });
                return;
            }
            if (!product.inStock || product.stockQuantity < item.quantity) {
                res.status(400).json({
                    success: false,
                    message: `Insufficient stock for: ${product.name}`
                });
                return;
            }
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
                selectedColor: item.selectedColor,
                image: product.image
            });
            subtotal += product.price * item.quantity;
            // Update stock
            product.stockQuantity -= item.quantity;
            await product.save();
        }
        // Calculate shipping and tax
        const shippingCost = subtotal >= 999 ? 0 : 99; // Free shipping over ₹999
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + shippingCost + tax;
        // Create order
        const order = await Order_1.default.create({
            user: req.user?._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            tax,
            total,
            notes,
            paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
            orderStatus: 'confirmed'
        });
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: { order }
        });
    }
    catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};
exports.createOrder = createOrder;
// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({ user: req.user?._id })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name image');
        res.status(200).json({
            success: true,
            data: { orders }
        });
    }
    catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};
exports.getMyOrders = getMyOrders;
// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id)
            .populate('items.product', 'name image');
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found'
            });
            return;
        }
        // Check if order belongs to user or user is admin
        if (order.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: { order }
        });
    }
    catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};
exports.getOrder = getOrder;
// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found'
            });
            return;
        }
        // Check if order belongs to user
        if (order.user.toString() !== req.user?._id.toString()) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this order'
            });
            return;
        }
        // Can only cancel pending or confirmed orders
        if (!['pending', 'confirmed'].includes(order.orderStatus)) {
            res.status(400).json({
                success: false,
                message: 'Order cannot be cancelled at this stage'
            });
            return;
        }
        // Restore stock
        for (const item of order.items) {
            const product = await Product_1.default.findById(item.product);
            if (product) {
                product.stockQuantity += item.quantity;
                await product.save();
            }
        }
        order.orderStatus = 'cancelled';
        order.paymentStatus = order.paymentStatus === 'paid' ? 'refunded' : 'pending';
        await order.save();
        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: { order }
        });
    }
    catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling order',
            error: error.message
        });
    }
};
exports.cancelOrder = cancelOrder;
// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, trackingNumber } = req.body;
        const order = await Order_1.default.findById(req.params.id);
        if (!order) {
            res.status(404).json({
                success: false,
                message: 'Order not found'
            });
            return;
        }
        order.orderStatus = orderStatus;
        if (trackingNumber)
            order.trackingNumber = trackingNumber;
        if (orderStatus === 'delivered')
            order.deliveredAt = new Date();
        await order.save();
        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: { order }
        });
    }
    catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};
exports.updateOrderStatus = updateOrderStatus;
// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        let query = {};
        if (status)
            query.orderStatus = status;
        const orders = await Order_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate('user', 'name email')
            .populate('items.product', 'name image');
        const total = await Order_1.default.countDocuments(query);
        res.status(200).json({
            success: true,
            data: {
                orders,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};
exports.getAllOrders = getAllOrders;
//# sourceMappingURL=orderController.js.map