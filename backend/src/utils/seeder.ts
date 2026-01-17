import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product';
import User from '../models/User';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../', '.env') });

interface ProductData {
    name: string;
    price: number;
    originalPrice: number;
    category: 'Men' | 'Women' | 'Kids' | 'Accessories';
    image: string;
    description: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    stockQuantity: number;
    sizes: string[];
    colors: string[];
    featured: boolean;
}

const products: ProductData[] = [
    {
        name: 'Premium Cotton T-Shirt',
        price: 1299,
        originalPrice: 2499,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        description: 'Ultra-soft premium cotton t-shirt with modern fit. Perfect for casual wear.',
        rating: 4.5,
        reviews: 234,
        inStock: true,
        stockQuantity: 150,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Navy', 'Gray'],
        featured: true
    },
    {
        name: 'Slim Fit Denim Jeans',
        price: 2499,
        originalPrice: 4999,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80',
        description: 'Classic slim fit denim jeans with stretch comfort. Timeless style.',
        rating: 4.7,
        reviews: 456,
        inStock: true,
        stockQuantity: 200,
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Blue', 'Black', 'Light Blue'],
        featured: true
    },
    {
        name: 'Floral Summer Dress',
        price: 1899,
        originalPrice: 3999,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        description: 'Beautiful floral print summer dress. Light and breezy fabric.',
        rating: 4.8,
        reviews: 567,
        inStock: true,
        stockQuantity: 120,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Pink', 'Blue', 'Yellow'],
        featured: true
    },
    {
        name: 'Casual Hoodie',
        price: 1799,
        originalPrice: 3499,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
        description: 'Comfortable hoodie with premium fleece lining. Perfect for winter.',
        rating: 4.6,
        reviews: 345,
        inStock: true,
        stockQuantity: 180,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Gray', 'Navy', 'Maroon'],
        featured: false
    },
    {
        name: 'Elegant Blazer',
        price: 3999,
        originalPrice: 7999,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=800&q=80',
        description: 'Professional blazer with tailored fit. Perfect for office wear.',
        rating: 4.9,
        reviews: 189,
        inStock: true,
        stockQuantity: 80,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Beige'],
        featured: true
    },
    {
        name: 'Sports Track Pants',
        price: 1499,
        originalPrice: 2999,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
        description: 'Comfortable track pants for sports and casual wear.',
        rating: 4.4,
        reviews: 278,
        inStock: true,
        stockQuantity: 220,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Navy', 'Gray'],
        featured: false
    },
    {
        name: 'Silk Saree',
        price: 4999,
        originalPrice: 9999,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        description: 'Traditional silk saree with intricate embroidery work.',
        rating: 4.9,
        reviews: 423,
        inStock: true,
        stockQuantity: 50,
        sizes: ['Free Size'],
        colors: ['Red', 'Blue', 'Green', 'Gold'],
        featured: true
    },
    {
        name: 'Leather Jacket',
        price: 5999,
        originalPrice: 11999,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
        description: 'Premium leather jacket with modern design. Durable and stylish.',
        rating: 4.8,
        reviews: 312,
        inStock: true,
        stockQuantity: 60,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Brown'],
        featured: true
    },
    {
        name: 'Yoga Leggings',
        price: 999,
        originalPrice: 1999,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80',
        description: 'High-waist yoga leggings with moisture-wicking fabric.',
        rating: 4.7,
        reviews: 534,
        inStock: true,
        stockQuantity: 250,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Purple', 'Pink'],
        featured: false
    },
    {
        name: 'Formal Shirt',
        price: 1599,
        originalPrice: 2999,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
        description: 'Classic formal shirt with wrinkle-free fabric.',
        rating: 4.5,
        reviews: 267,
        inStock: true,
        stockQuantity: 180,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Blue', 'Pink', 'Black'],
        featured: false
    },
    {
        name: 'Maxi Skirt',
        price: 1399,
        originalPrice: 2799,
        category: 'Women',
        image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
        description: 'Flowing maxi skirt perfect for summer outings.',
        rating: 4.6,
        reviews: 198,
        inStock: true,
        stockQuantity: 140,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Floral'],
        featured: false
    },
    {
        name: 'Polo T-Shirt',
        price: 1199,
        originalPrice: 2399,
        category: 'Men',
        image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=800&q=80',
        description: 'Classic polo t-shirt with collar. Smart casual style.',
        rating: 4.4,
        reviews: 345,
        inStock: true,
        stockQuantity: 200,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Black', 'Navy', 'Red'],
        featured: false
    }
];

const seedDatabase = async (): Promise<void> => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined');
        }

        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Seed products one by one to trigger pre-save hooks
        console.log('📦 Seeding products...');
        let productCount = 0;
        for (const productData of products) {
            await Product.create(productData);
            productCount++;
            process.stdout.write(`\r   Created ${productCount}/${products.length} products`);
        }
        console.log(`\n📦 Seeded ${productCount} products`);

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@luxe.com',
            password: 'Admin@123',
            phone: '9876543210',
            role: 'admin'
        });
        console.log(`👤 Created admin user: ${admin.email}`);

        console.log('\n✨ Database seeding completed successfully!');
        console.log('\n📝 Admin Credentials:');
        console.log(`   Email: admin@luxe.com`);
        console.log(`   Password: Admin@123`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
