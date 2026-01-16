"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sortBy, search, featured, limit = 50, page = 1 } = req.query;
        // Build query
        let query = {};
        // Category filter
        if (category && category !== 'All') {
            query.category = category;
        }
        // Price filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice)
                query.price.$gte = Number(minPrice);
            if (maxPrice)
                query.price.$lte = Number(maxPrice);
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
        let sort = { createdAt: -1 };
        if (sortBy === 'price-low')
            sort = { price: 1 };
        else if (sortBy === 'price-high')
            sort = { price: -1 };
        else if (sortBy === 'rating')
            sort = { rating: -1 };
        else if (sortBy === 'popular')
            sort = { reviews: -1 };
        else if (sortBy === 'newest')
            sort = { createdAt: -1 };
        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        const products = await Product_1.default.find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));
        const total = await Product_1.default.countDocuments(query);
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
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
};
exports.getProducts = getProducts;
// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
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
    }
    catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};
exports.getProduct = getProduct;
// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const product = await Product_1.default.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product }
        });
    }
    catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};
exports.createProduct = createProduct;
// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
    }
    catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};
exports.updateProduct = updateProduct;
// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};
exports.deleteProduct = deleteProduct;
// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await Product_1.default.distinct('category');
        res.status(200).json({
            success: true,
            data: { categories }
        });
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};
exports.getCategories = getCategories;
//# sourceMappingURL=productController.js.map