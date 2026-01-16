import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }

        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
            return;
        }

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            phone
        });

        // Generate token
        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    createdAt: user.createdAt
                },
                token
            }
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
            return;
        }

        const { email, password } = req.body;

        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }

        // Generate token
        const token = user.generateAuthToken();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    addresses: user.addresses,
                    createdAt: user.createdAt
                },
                token
            }
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    addresses: user.addresses,
                    wishlist: user.wishlist,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });
    } catch (error: any) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { name, phone },
            { new: true, runValidators: true }
        );

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    addresses: user.addresses
                }
            }
        });
    } catch (error: any) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user?._id).select('+password');

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
            return;
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Generate new token
        const token = user.generateAuthToken();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
            data: { token }
        });
    } catch (error: any) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

// @desc    Add address
// @route   POST /api/auth/address
// @access  Private
export const addAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, street, city, state, pincode, isDefault } = req.body;

        const user = await User.findById(req.user?._id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // If this is the default address, remove default from others
        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // Add new address
        const newAddress = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            name,
            phone,
            street,
            city,
            state,
            pincode,
            isDefault: isDefault || user.addresses.length === 0
        };

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: { addresses: user.addresses }
        });
    } catch (error: any) {
        console.error('Add address error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding address',
            error: error.message
        });
    }
};

// @desc    Delete address
// @route   DELETE /api/auth/address/:addressId
// @access  Private
export const deleteAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { addressId } = req.params;

        const user = await User.findById(req.user?._id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        user.addresses = user.addresses.filter(addr => addr.id !== addressId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
            data: { addresses: user.addresses }
        });
    } catch (error: any) {
        console.error('Delete address error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting address',
            error: error.message
        });
    }
};

// @desc    Logout user (client-side handles token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
