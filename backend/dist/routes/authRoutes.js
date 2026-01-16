"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Validation rules
const registerValidation = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
    (0, express_validator_1.body)('phone')
        .optional()
        .matches(/^[0-9]{10}$/).withMessage('Phone must be a 10-digit number')
];
const loginValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
];
const addressValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('phone').matches(/^[0-9]{10}$/).withMessage('Phone must be a 10-digit number'),
    (0, express_validator_1.body)('street').trim().notEmpty().withMessage('Street address is required'),
    (0, express_validator_1.body)('city').trim().notEmpty().withMessage('City is required'),
    (0, express_validator_1.body)('state').trim().notEmpty().withMessage('State is required'),
    (0, express_validator_1.body)('pincode').matches(/^[0-9]{6}$/).withMessage('Pincode must be a 6-digit number')
];
// Public routes
router.post('/register', registerValidation, authController_1.register);
router.post('/login', loginValidation, authController_1.login);
// Protected routes
router.get('/me', auth_1.protect, authController_1.getMe);
router.put('/profile', auth_1.protect, authController_1.updateProfile);
router.put('/password', auth_1.protect, authController_1.changePassword);
router.post('/address', auth_1.protect, addressValidation, authController_1.addAddress);
router.delete('/address/:addressId', auth_1.protect, authController_1.deleteAddress);
router.post('/logout', auth_1.protect, authController_1.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map