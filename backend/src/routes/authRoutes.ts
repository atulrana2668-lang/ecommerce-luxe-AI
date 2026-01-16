import { Router } from 'express';
import { body } from 'express-validator';
import {
    register,
    login,
    getMe,
    updateProfile,
    changePassword,
    addAddress,
    deleteAddress,
    logout
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

// Validation rules
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    body('phone')
        .optional()
        .matches(/^[0-9]{10}$/).withMessage('Phone must be a 10-digit number')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
];

const addressValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').matches(/^[0-9]{10}$/).withMessage('Phone must be a 10-digit number'),
    body('street').trim().notEmpty().withMessage('Street address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('pincode').matches(/^[0-9]{6}$/).withMessage('Pincode must be a 6-digit number')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/address', protect, addressValidation, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/logout', protect, logout);

export default router;
