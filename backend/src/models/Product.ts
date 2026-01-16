import mongoose, { Document, Schema } from 'mongoose';

// Interface for Product document
export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    category: 'Men' | 'Women' | 'Kids' | 'Accessories';
    image: string;
    images: string[];
    description: string;
    rating: number;
    reviews: number;
    inStock: boolean;
    stockQuantity: number;
    sizes: string[];
    colors: string[];
    discount?: number;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Product Schema
const ProductSchema = new Schema<IProduct>({
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

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
