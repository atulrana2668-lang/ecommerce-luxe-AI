// Local Storage Management for E-commerce

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    description: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    sizes: string[];
    colors: string[];
    discount?: number;
}

export interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
    selectedColor: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    addresses: Address[];
}

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

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    address: Address;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
    paymentMethod: string;
}

// Initialize default products
export const initializeProducts = (): Product[] => {
    return [
        {
            id: '1',
            name: 'Premium Cotton T-Shirt',
            price: 1299,
            originalPrice: 2499,
            category: 'Men',
            image: '/images/tshirt_men_1766163705258.png',
            description: 'Ultra-soft premium cotton t-shirt with modern fit. Perfect for casual wear.',
            rating: 4.5,
            reviews: 234,
            inStock: true,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'White', 'Navy', 'Gray'],
            discount: 48
        },
        {
            id: '2',
            name: 'Slim Fit Denim Jeans',
            price: 2499,
            originalPrice: 4999,
            category: 'Men',
            image: '/images/jeans_blue_1766163736246.png',
            description: 'Classic slim fit denim jeans with stretch comfort. Timeless style.',
            rating: 4.7,
            reviews: 456,
            inStock: true,
            sizes: ['28', '30', '32', '34', '36'],
            colors: ['Blue', 'Black', 'Light Blue'],
            discount: 50
        },
        {
            id: '3',
            name: 'Floral Summer Dress',
            price: 1899,
            originalPrice: 3999,
            category: 'Women',
            image: '/images/dress_floral_1766163765040.png',
            description: 'Beautiful floral print summer dress. Light and breezy fabric.',
            rating: 4.8,
            reviews: 567,
            inStock: true,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['Pink', 'Blue', 'Yellow'],
            discount: 53
        },
        {
            id: '4',
            name: 'Casual Hoodie',
            price: 1799,
            originalPrice: 3499,
            category: 'Men',
            image: '/images/hoodie_casual_1766163787555.png',
            description: 'Comfortable hoodie with premium fleece lining. Perfect for winter.',
            rating: 4.6,
            reviews: 345,
            inStock: true,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'Gray', 'Navy', 'Maroon'],
            discount: 49
        },
        {
            id: '5',
            name: 'Elegant Blazer',
            price: 3999,
            originalPrice: 7999,
            category: 'Women',
            image: '/images/blazer_women_1766163858962.png',
            description: 'Professional blazer with tailored fit. Perfect for office wear.',
            rating: 4.9,
            reviews: 189,
            inStock: true,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['Black', 'Navy', 'Beige'],
            discount: 50
        },
        {
            id: '6',
            name: 'Sports Track Pants',
            price: 1499,
            originalPrice: 2999,
            category: 'Men',
            image: '/images/trackpants_sports_1766163889024.png',
            description: 'Comfortable track pants for sports and casual wear.',
            rating: 4.4,
            reviews: 278,
            inStock: true,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'Navy', 'Gray'],
            discount: 50
        },
        {
            id: '7',
            name: 'Silk Saree',
            price: 4999,
            originalPrice: 9999,
            category: 'Women',
            image: '/images/saree_silk_1766163907394.png',
            description: 'Traditional silk saree with intricate embroidery work.',
            rating: 4.9,
            reviews: 423,
            inStock: true,
            sizes: ['Free Size'],
            colors: ['Red', 'Blue', 'Green', 'Gold'],
            discount: 50
        },
        {
            id: '8',
            name: 'Leather Jacket',
            price: 5999,
            originalPrice: 11999,
            category: 'Men',
            image: '/images/jacket_leather_1766163926376.png',
            description: 'Premium leather jacket with modern design. Durable and stylish.',
            rating: 4.8,
            reviews: 312,
            inStock: true,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['Black', 'Brown'],
            discount: 50
        },
        {
            id: '9',
            name: 'Yoga Leggings',
            price: 999,
            originalPrice: 1999,
            category: 'Women',
            image: '/images/leggings_yoga_1766163954907.png',
            description: 'High-waist yoga leggings with moisture-wicking fabric.',
            rating: 4.7,
            reviews: 534,
            inStock: true,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['Black', 'Navy', 'Purple', 'Pink'],
            discount: 50
        },
        {
            id: '10',
            name: 'Formal Shirt',
            price: 1599,
            originalPrice: 2999,
            category: 'Men',
            image: '/images/shirt_formal_1766163988768.png',
            description: 'Classic formal shirt with wrinkle-free fabric.',
            rating: 4.5,
            reviews: 267,
            inStock: true,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['White', 'Blue', 'Pink', 'Black'],
            discount: 47
        },
        {
            id: '11',
            name: 'Maxi Skirt',
            price: 1399,
            originalPrice: 2799,
            category: 'Women',
            image: '/images/skirt_maxi_1766164008318.png',
            description: 'Flowing maxi skirt perfect for summer outings.',
            rating: 4.6,
            reviews: 198,
            inStock: true,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['Black', 'Navy', 'Floral'],
            discount: 50
        },
        {
            id: '12',
            name: 'Polo T-Shirt',
            price: 1199,
            originalPrice: 2399,
            category: 'Men',
            image: '/images/polo_tshirt_1766164047752.png',
            description: 'Classic polo t-shirt with collar. Smart casual style.',
            rating: 4.4,
            reviews: 345,
            inStock: true,
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            colors: ['White', 'Black', 'Navy', 'Red'],
            discount: 50
        }
    ];
};

// Local Storage Helper Functions
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
};

export const setToStorage = <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
    }
};

// Product Functions
export const getProducts = (): Product[] => {
    // Always reinitialize to ensure latest images are loaded
    const defaultProducts = initializeProducts();
    setToStorage('products', defaultProducts);
    return defaultProducts;
};

export const getProductById = (id: string): Product | undefined => {
    const products = getProducts();
    return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
    const products = getProducts();
    return products.filter(p => p.category === category);
};

// Cart Functions
export const getCart = (): CartItem[] => {
    return getFromStorage<CartItem[]>('cart', []);
};

export const addToCart = (product: Product, size: string, color: string, quantity: number = 1): void => {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(
        item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity,
            selectedSize: size,
            selectedColor: color
        });
    }

    setToStorage('cart', cart);
};

export const updateCartItemQuantity = (id: string, size: string, color: string, quantity: number): void => {
    const cart = getCart();
    const itemIndex = cart.findIndex(
        item => item.id === id && item.selectedSize === size && item.selectedColor === color
    );

    if (itemIndex > -1) {
        if (quantity <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = quantity;
        }
        setToStorage('cart', cart);
    }
};

export const removeFromCart = (id: string, size: string, color: string): void => {
    const cart = getCart();
    const updatedCart = cart.filter(
        item => !(item.id === id && item.selectedSize === size && item.selectedColor === color)
    );
    setToStorage('cart', updatedCart);
};

export const clearCart = (): void => {
    setToStorage('cart', []);
};

export const getCartTotal = (): number => {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = (): number => {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
};

// Wishlist Functions
export const getWishlist = (): Product[] => {
    return getFromStorage<Product[]>('wishlist', []);
};

export const addToWishlist = (product: Product): void => {
    const wishlist = getWishlist();
    if (!wishlist.find(p => p.id === product.id)) {
        wishlist.push(product);
        setToStorage('wishlist', wishlist);
    }
};

export const removeFromWishlist = (productId: string): void => {
    const wishlist = getWishlist();
    const updatedWishlist = wishlist.filter(p => p.id !== productId);
    setToStorage('wishlist', updatedWishlist);
};

export const isInWishlist = (productId: string): boolean => {
    const wishlist = getWishlist();
    return wishlist.some(p => p.id === productId);
};

// User Functions
export const getCurrentUser = (): User | null => {
    return getFromStorage<User | null>('currentUser', null);
};

export const setCurrentUser = (user: User | null): void => {
    setToStorage('currentUser', user);
};

export const updateUserAddresses = (addresses: Address[]): void => {
    const user = getCurrentUser();
    if (user) {
        user.addresses = addresses;
        setCurrentUser(user);
    }
};

// Order Functions
export const getOrders = (): Order[] => {
    return getFromStorage<Order[]>('orders', []);
};

export const addOrder = (order: Order): void => {
    const orders = getOrders();
    orders.unshift(order);
    setToStorage('orders', orders);
};

export const getOrderById = (orderId: string): Order | undefined => {
    const orders = getOrders();
    return orders.find(o => o.id === orderId);
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
        orders[orderIndex].status = status;
        setToStorage('orders', orders);
    }
};

// Search Functions
export const searchProducts = (query: string): Product[] => {
    const products = getProducts();
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
};

// Filter Functions
export const filterProducts = (
    category?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: 'price-low' | 'price-high' | 'rating' | 'popular'
): Product[] => {
    let products = getProducts();

    if (category && category !== 'All') {
        products = products.filter(p => p.category === category);
    }

    if (minPrice !== undefined) {
        products = products.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
        products = products.filter(p => p.price <= maxPrice);
    }

    if (sortBy) {
        switch (sortBy) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => b.rating - a.rating);
                break;
            case 'popular':
                products.sort((a, b) => b.reviews - a.reviews);
                break;
        }
    }

    return products;
};
