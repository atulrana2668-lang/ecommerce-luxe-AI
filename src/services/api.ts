import axios from 'axios';
import type { Product, ApiResponse, ProductsResponse, ProductResponse } from '@/src/types';

// Use relative path - works for local dev and Vercel deployment
const API_BASE_URL = '/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// ==========================================
// PRODUCT API FUNCTIONS
// ==========================================

export const getAllProducts = async (params?: any) => {
    try {
        const response = await apiClient.get('/products', { params });
        // Map _id to id for frontend compatibility
        if (response.data.success && response.data.data.products) {
            response.data.data.products = response.data.data.products.map((p: any) => ({
                ...p,
                id: p._id
            }));
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProductById = async (id: string) => {
    try {
        const response = await apiClient.get(`/products/${id}`);
        // Map _id to id for frontend compatibility
        if (response.data.success && response.data.data.product) {
            response.data.data.product = {
                ...response.data.data.product,
                id: response.data.data.product._id
            };
        }
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        throw error;
    }
};

export interface CreateProductData {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    images?: string[];
    stockQuantity?: number;
    sizes?: string[];
    colors?: string[];
    featured?: boolean;
}

export const createProduct = async (productData: CreateProductData) => {
    try {
        const response = await apiClient.post('/products', productData);
        return response.data;
    } catch (error: any) {
        console.error('Error creating product:', error);
        // Return backend error message if available
        if (error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
};

export const updateProduct = async (id: string, productData: Partial<CreateProductData>) => {
    try {
        const response = await apiClient.put(`/products/${id}`, productData);
        return response.data;
    } catch (error: any) {
        console.error('Error updating product:', error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Error deleting product:', error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
};

// ==========================================
// PAYMENT API FUNCTIONS
// ==========================================

export interface PaymentOrderData {
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        selectedSize: string;
        selectedColor: string;
        image: string;
    }[];
    shippingAddress: {
        name: string;
        phone: string;
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    paymentMethod: 'cod' | 'card' | 'upi';
}

export const createPaymentOrder = async (orderData: PaymentOrderData) => {
    try {
        const response = await apiClient.post('/payments/create-order', orderData);
        return response.data;
    } catch (error: any) {
        console.error('Error creating payment order:', error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
};

export interface VerifyPaymentData {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderData: any;
}

export const verifyPayment = async (paymentData: VerifyPaymentData) => {
    try {
        const response = await apiClient.post('/payments/verify', paymentData);
        return response.data;
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
};

export const getPaymentStatus = async (paymentId: string) => {
    try {
        const response = await apiClient.get(`/payments/${paymentId}/status`);
        return response.data;
    } catch (error: any) {
        console.error('Error getting payment status:', error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
};

/**
 * Creates a simple Razorpay order ID on the backend
 */
export const createSimpleOrder = async (amount: number) => {
    try {
        const response = await apiClient.post('/payment/create-order', { amount });
        return response.data;
    } catch (error: any) {
        console.error('Error creating simple payment order:', error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
};

/**
 * Saves a finalized order to the database after successful payment
 */
export const saveFinalOrder = async (orderData: any) => {
    try {
        const response = await apiClient.post('/orders', orderData);
        return response.data;
    } catch (error: any) {
        console.error('Error saving final order:', error);
        if (error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
};

export default apiClient;


