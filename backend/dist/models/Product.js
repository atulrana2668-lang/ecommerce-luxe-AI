"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Product Schema
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Men', 'Women', 'Kids', 'Accessories']
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    images: [{
            type: String
        }],
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
    },
    reviews: {
        type: Number,
        default: 0,
        min: [0, 'Reviews count cannot be negative']
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 100,
        min: [0, 'Stock quantity cannot be negative']
    },
    sizes: [{
            type: String,
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', 'Free Size']
        }],
    colors: [{
            type: String
        }],
    discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Generate slug from name before saving
ProductSchema.pre('save', function (next) {
    if (this.isModified('name') || !this.slug) {
        const baseSlug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        // Add unique suffix using timestamp and random string
        const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
        this.slug = `${baseSlug}-${uniqueSuffix}`;
    }
    next();
});
// Calculate discount percentage
ProductSchema.pre('save', function (next) {
    if (this.originalPrice && this.price < this.originalPrice) {
        this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    next();
});
// Update inStock based on stockQuantity
ProductSchema.pre('save', function (next) {
    this.inStock = this.stockQuantity > 0;
    next();
});
const Product = mongoose_1.default.model('Product', ProductSchema);
exports.default = Product;
//# sourceMappingURL=Product.js.map