import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

interface JwtPayload {
    id: string;
    email: string;
    role: string;
}

// Protect routes - require authentication
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | undefined;

        // Check for token in Authorization header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Also check cookies
        else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.'
            });
            return;
        }

        try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                throw new Error('JWT_SECRET is not defined');
            }

            // Verify token
            const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
            return;
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
            return;
        }

        next();
    };
};

// Optional auth - doesn't fail if no token, but attaches user if token exists
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string | undefined;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (token) {
            try {
                const jwtSecret = process.env.JWT_SECRET;
                if (jwtSecret) {
                    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
                    const user = await User.findById(decoded.id).select('-password');
                    if (user) {
                        req.user = user;
                    }
                }
            } catch (error) {
                // Token invalid, continue without user
            }
        }

        next();
    } catch (error) {
        next();
    }
};
