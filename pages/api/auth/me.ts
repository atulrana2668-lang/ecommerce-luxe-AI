import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

interface JwtPayload {
    id: string;
    email: string;
    role: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please login.'
            });
        }

        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';

        // Verify token
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        await dbConnect();

        // Get user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
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
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });
    } catch (error: any) {
        console.error('Get profile error:', error);

        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching profile'
        });
    }
}
