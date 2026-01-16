"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Protect routes - require authentication
const protect = async (req, res, next) => {
    try {
        let token;
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
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            // Get user from token
            const user = await User_1.default.findById(decoded.id).select('-password');
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
            return;
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
};
exports.protect = protect;
// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
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
exports.authorize = authorize;
// Optional auth - doesn't fail if no token, but attaches user if token exists
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies?.token) {
            token = req.cookies.token;
        }
        if (token) {
            try {
                const jwtSecret = process.env.JWT_SECRET;
                if (jwtSecret) {
                    const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
                    const user = await User_1.default.findById(decoded.id).select('-password');
                    if (user) {
                        req.user = user;
                    }
                }
            }
            catch (error) {
                // Token invalid, continue without user
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map