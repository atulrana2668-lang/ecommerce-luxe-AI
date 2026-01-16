import mongoose, { Document, Schema } from 'mongoose';

// Interface for Order Item
export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    image: string;
}

// Interface for Shipping Address
export interface IShippingAddress {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
}

// Interface for Order document
export interface IOrder extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    orderNumber: string;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: 'cod' | 'card' | 'upi';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    notes?: string;
    trackingNumber?: string;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Order Item Schema
const OrderItemSchema = new Schema<IOrderItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    selectedSize: { type: String, required: true },
    selectedColor: { type: String, required: true },
    image: { type: String, required: true }
});

// Shipping Address Schema
const ShippingAddressSchema = new Schema<IShippingAddress>({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
});

// Order Schema
const OrderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true
    },
    items: [OrderItemSchema],
    shippingAddress: ShippingAddressSchema,
    paymentMethod: {
        type: String,
        enum: ['cod', 'card', 'upi'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    shippingCost: {
        type: Number,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        maxlength: 500
    },
    trackingNumber: {
        type: String
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Generate order number before saving
OrderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.orderNumber = `LUXE-${timestamp}-${random}`;
    }
    next();
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
