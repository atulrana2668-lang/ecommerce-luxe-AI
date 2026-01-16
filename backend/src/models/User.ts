import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Interface for Address subdocument
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

// Interface for User document
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

// Address Schema
const AddressSchema = new Schema<IAddress>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

// User Schema
const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    addresses: [AddressSchema],
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    isEmailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function (): string {
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    const jwtExpire = process.env.JWT_EXPIRE || '7d';

    const token = jwt.sign(
        {
            id: this._id.toString(),
            email: this.email,
            role: this.role
        },
        jwtSecret,
        { expiresIn: jwtExpire } as jwt.SignOptions
    );

    return token;
};

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
