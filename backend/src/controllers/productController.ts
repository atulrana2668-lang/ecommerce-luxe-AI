import { Request, Response } from 'express';
import Product from '../models/Product';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            sortBy,
            search,
            featured,
            limit = 50,
            page = 1
        } = req.query;

        // Build query
        let query: any = {};

        // Category filter
        if (category && category !== 'All') {
            query.category = category;
        }

        // Price filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Featured filter
        if (featured === 'true') {
            query.featured = true;
        }

        // Only show in-stock products
        query.inStock = true;

        // Build sort
        let sort: any = { createdAt: -1 };
        if (sortBy === 'price-low') sort = { price: 1 };
        else if (sortBy === 'price-high') sort = { price: -1 };
        else if (sortBy === 'rating') sort = { rating: -1 };
        else if (sortBy === 'popular') sort = { reviews: -1 };
        else if (sortBy === 'newest') sort = { createdAt: -1 };

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / Number(limit)),
                    limit: Number(limit)
                }
            }
        });
    } catch (error: any) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: { product }
        });
    } catch (error: any) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product }
        });
    } catch (error: any) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: { product }
        });
    } catch (error: any) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error: any) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Product.distinct('category');

        res.status(200).json({
            success: true,
            data: { categories }
        });
    } catch (error: any) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};
