import mongoose, { Document } from 'mongoose';
export interface IAddress {
    id: string;
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone?: string;
    avatar?: string;
    role: 'user' | 'admin';
    addresses: IAddress[];
    wishlist: mongoose.Types.ObjectId[];
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map