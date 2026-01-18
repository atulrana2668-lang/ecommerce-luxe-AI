import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import mongoose from 'mongoose';

// Product Schema for MongoDB
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 100 },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    discount: { type: Number },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

// Get or create Product model
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        await dbConnect();

        if (req.method === 'GET') {
            // Get query parameters
            const { category, minPrice, maxPrice, sort, limit = 50, page = 1 } = req.query;

            // Build query
            const query: any = {};

            if (category && category !== 'All') {
                query.category = { $regex: new RegExp(category as string, 'i') };
            }

            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = Number(minPrice);
                if (maxPrice) query.price.$lte = Number(maxPrice);
            }

            // Build sort
            let sortOption: any = { createdAt: -1 };
            if (sort === 'price-low') sortOption = { price: 1 };
            else if (sort === 'price-high') sortOption = { price: -1 };
            else if (sort === 'rating') sortOption = { rating: -1 };

            // Execute query
            const skip = (Number(page) - 1) * Number(limit);

            const products = await Product.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit))
                .lean();

            const total = await Product.countDocuments(query);

            // Map _id to id for frontend compatibility
            const mappedProducts = products.map((p: any) => ({
                ...p,
                id: p._id.toString(),
                _id: undefined
            }));

            return res.status(200).json({
                success: true,
                data: {
                    products: mappedProducts,
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / Number(limit))
                }
            });

        } else if (req.method === 'POST') {
            // Create new product (requires auth in production)
            const productData = req.body;

            const product = new Product(productData);
            await product.save();

            return res.status(201).json({
                success: true,
                data: { product }
            });

        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }

    } catch (error: any) {
        console.error('Products API Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}
