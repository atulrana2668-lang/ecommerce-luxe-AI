import { Request, Response } from 'express';
import User from '../models/User';

/**
 * @desc    Setup Admin - Create first admin or upgrade existing user
 * @route   POST /api/setup-admin
 * @access  Public (with secret key) - Should be disabled in production
 */
export const setupAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, secretKey } = req.body;

        // Verify secret key (set in environment)
        const adminSecretKey = process.env.ADMIN_SETUP_SECRET || 'luxe_admin_setup_2024';

        if (secretKey !== adminSecretKey) {
            res.status(403).json({
                success: false,
                message: 'Invalid secret key. Admin setup not authorized.'
            });
            return;
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // Upgrade existing user to admin
            user.role = 'admin';
            await user.save();

            res.status(200).json({
                success: true,
                message: `User ${email} has been upgraded to admin role`,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
            return;
        }

        // Create new admin user
        if (!password || !name) {
            res.status(400).json({
                success: false,
                message: 'Name and password are required to create a new admin'
            });
            return;
        }

        user = await User.create({
            name,
            email,
            password,
            role: 'admin',
            isEmailVerified: true
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'Admin user created successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });

    } catch (error: any) {
        console.error('Setup admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to setup admin',
            error: error.message
        });
    }
};

/**
 * @desc    Get all admins (for verification)
 * @route   GET /api/setup-admin/list
 * @access  Public (with secret key)
 */
export const listAdmins = async (req: Request, res: Response): Promise<void> => {
    try {
        const { secretKey } = req.query;

        const adminSecretKey = process.env.ADMIN_SETUP_SECRET || 'luxe_admin_setup_2024';

        if (secretKey !== adminSecretKey) {
            res.status(403).json({
                success: false,
                message: 'Invalid secret key'
            });
            return;
        }

        const admins = await User.find({ role: 'admin' }).select('name email role createdAt');

        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins
        });

    } catch (error: any) {
        console.error('List admins error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to list admins',
            error: error.message
        });
    }
};

/**
 * @desc    Demote admin back to user
 * @route   POST /api/setup-admin/demote
 * @access  Public (with secret key)
 */
export const demoteAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, secretKey } = req.body;

        const adminSecretKey = process.env.ADMIN_SETUP_SECRET || 'luxe_admin_setup_2024';

        if (secretKey !== adminSecretKey) {
            res.status(403).json({
                success: false,
                message: 'Invalid secret key'
            });
            return;
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        user.role = 'user';
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${email} has been demoted to regular user`,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error('Demote admin error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to demote admin',
            error: error.message
        });
    }
};
