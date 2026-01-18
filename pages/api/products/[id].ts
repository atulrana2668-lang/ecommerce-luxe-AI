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
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    try {
        await dbConnect();

        if (req.method === 'GET') {
            // Check if id is a valid MongoDB ObjectId
            let product;

            if (mongoose.Types.ObjectId.isValid(id)) {
                product = await Product.findById(id).lean();
            }

            // If not found by _id, try to find by a custom id field
            if (!product) {
                product = await Product.findOne({ id: id }).lean();
            }

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            // Map _id to id
            const mappedProduct = {
                ...product,
                id: (product as any)._id.toString(),
                _id: undefined
            };

            return res.status(200).json({
                success: true,
                data: { product: mappedProduct }
            });

        } else if (req.method === 'PUT') {
            const updateData = req.body;

            const product = await Product.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).lean();

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            return res.status(200).json({
                success: true,
                data: { product }
            });

        } else if (req.method === 'DELETE') {
            const product = await Product.findByIdAndDelete(id);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });

        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }

    } catch (error: any) {
        console.error('Product API Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}
