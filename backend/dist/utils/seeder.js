"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../../', '.env') });
const products = [
    {
        name: 'Premium Cotton T-Shirt',
        price: 1299,
        originalPrice: 2499,
        category: 'Men',
        image: '/images/tshirt_men_1766163705258.png',
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
        image: '/images/jeans_blue_1766163736246.png',
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
        image: '/images/dress_floral_1766163765040.png',
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
        image: '/images/hoodie_casual_1766163787555.png',
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
        image: '/images/blazer_women_1766163858962.png',
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
        image: '/images/trackpants_sports_1766163889024.png',
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
        image: '/images/saree_silk_1766163907394.png',
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
        image: '/images/jacket_leather_1766163926376.png',
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
        image: '/images/leggings_yoga_1766163954907.png',
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
        image: '/images/shirt_formal_1766163988768.png',
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
        image: '/images/skirt_maxi_1766164008318.png',
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
        image: '/images/polo_tshirt_1766164047752.png',
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
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined');
        }
        await mongoose_1.default.connect(mongoURI);
        console.log('✅ Connected to MongoDB');
        // Clear existing data
        await Product_1.default.deleteMany({});
        await User_1.default.deleteMany({});
        console.log('🗑️  Cleared existing data');
        // Seed products one by one to trigger pre-save hooks
        console.log('📦 Seeding products...');
        let productCount = 0;
        for (const productData of products) {
            await Product_1.default.create(productData);
            productCount++;
            process.stdout.write(`\r   Created ${productCount}/${products.length} products`);
        }
        console.log(`\n📦 Seeded ${productCount} products`);
        // Create admin user
        const admin = await User_1.default.create({
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
    }
    catch (error) {
        console.error('❌ Database seeding failed:', error);
        process.exit(1);
    }
};
seedDatabase();
//# sourceMappingURL=seeder.js.map