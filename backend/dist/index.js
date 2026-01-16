"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Try to load environment variables from multiple possible locations
const envPaths = [
    path_1.default.join(__dirname, '../..', '.env'), // From dist folder
    path_1.default.join(__dirname, '../../..', '.env'), // From src folder (compiled)
    path_1.default.join(process.cwd(), '..', '.env'), // Parent of current working dir
    path_1.default.join(process.cwd(), '.env'), // Current working dir
];
let envLoaded = false;
for (const envPath of envPaths) {
    if (fs_1.default.existsSync(envPath)) {
        dotenv_1.default.config({ path: envPath });
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
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
// Connect to database
(0, database_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'LUXE E-commerce API is running',
        timestamp: new Date().toISOString()
    });
});
// Error handling
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
    console.log(`
🚀 LUXE E-commerce Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on port ${PORT}
📍 API URL: http://localhost:${PORT}/api
🔐 Auth: http://localhost:${PORT}/api/auth
📦 Products: http://localhost:${PORT}/api/products
🛒 Orders: http://localhost:${PORT}/api/orders
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});
exports.default = app;
//# sourceMappingURL=index.js.map