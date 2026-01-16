import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try to load environment variables from multiple possible locations
const envPaths = [
    path.join(__dirname, '../..', '.env'),      // From dist folder
    path.join(__dirname, '../../..', '.env'),   // From src folder (compiled)
    path.join(process.cwd(), '..', '.env'),     // Parent of current working dir
    path.join(process.cwd(), '.env'),           // Current working dir
];

let envLoaded = false;
for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        console.log(`✅ Loaded .env from: ${envPath}`);
        envLoaded = true;
        break;
    }
}

if (!envLoaded) {
    console.log('⚠️ No .env file found, using default environment variables');
    // Set defaults if not loaded
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not set! Please create a .env file.');
    }
}

import connectDB from './config/database';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminSetupRoutes from './routes/adminSetupRoutes';
import chatRoutes from './routes/chatRoutes';
import { createOrder } from './controllers/paymentController';
import { protect } from './middleware/auth';
import { errorHandler, notFound } from './middleware/errorHandler';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/setup-admin', adminSetupRoutes);
app.use('/api/chat', chatRoutes);
app.post('/api/payment/create-order', protect, createOrder);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'LUXE E-commerce API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
    console.log(`
🚀 LUXE E-commerce Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on port ${PORT}
📍 API URL: http://localhost:${PORT}/api
🔐 Auth: http://localhost:${PORT}/api/auth
📦 Products: http://localhost:${PORT}/api/products
🛒 Orders: http://localhost:${PORT}/api/orders
💳 Payments: http://localhost:${PORT}/api/payments
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});

export default app;
