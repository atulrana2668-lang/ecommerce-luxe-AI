import mongoose, { Document } from 'mongoose';
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
declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Product;
//# sourceMappingURL=Product.d.ts.map