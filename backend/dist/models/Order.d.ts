import mongoose, { Document } from 'mongoose';
export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    image: string;
}
export interface IShippingAddress {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
}
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
declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Order;
//# sourceMappingURL=Order.d.ts.map