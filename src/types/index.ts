/**
 * Shared TypeScript Types for LUXE E-commerce
 * These types match the Mongoose schemas in backend/src/models
 * Single source of truth for frontend type definitions
 */

// ============================================
// ADDRESS TYPES
// ============================================

export interface Address {
    id: string;
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

// ============================================
// USER TYPES
// ============================================

export interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role: 'user' | 'admin';
    addresses: Address[];
    wishlist?: string[];
    isEmailVerified?: boolean;
    createdAt: string;
    updatedAt?: string;
}

// ============================================
// PRODUCT TYPES
// ============================================

export type ProductCategory = 'Men' | 'Women' | 'Kids' | 'Accessories';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '28' | '30' | '32' | '34' | '36' | '38' | '40' | 'Free Size';

export interface Product {
    id: string;
    _id?: string;
    name: string;
    slug?: string;
    price: number;
    originalPrice?: number;
    category: ProductCategory | string;
    image: string;
    images?: string[];
    description: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    stockQuantity?: number;
    sizes: string[];
    colors: string[];
    discount?: number;
    featured?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

// ============================================
// ORDER TYPES
// ============================================

export interface OrderItem {
    product: string;
    name: string;
    price: number;
    quantity: number;
    selectedSize: string;
    selectedColor: string;
    image: string;
}

export interface ShippingAddress {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
}

export type PaymentMethod = 'cod' | 'card' | 'upi';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
    id: string;
    _id?: string;
    user: string;
    orderNumber: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    notes?: string;
    trackingNumber?: string;
    deliveredAt?: string;
    createdAt: string;
    updatedAt?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: any[];
}

export interface PaginationInfo {
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export interface ProductsResponse {
    products: Product[];
    pagination: PaginationInfo;
}

export interface ProductResponse {
    product: Product;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// ============================================
// LEGACY TYPES (for backward compatibility)
// ============================================

/**
 * @deprecated Use Order interface instead
 */
export interface LegacyOrder {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    address: Address;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
    paymentMethod: string;
}
