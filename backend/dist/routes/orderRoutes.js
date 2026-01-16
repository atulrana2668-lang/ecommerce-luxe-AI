"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.protect);
// User routes
router.post('/', orderController_1.createOrder);
router.get('/', orderController_1.getMyOrders);
router.get('/:id', orderController_1.getOrder);
router.put('/:id/cancel', orderController_1.cancelOrder);
// Admin routes
router.get('/admin/all', (0, auth_1.authorize)('admin'), orderController_1.getAllOrders);
router.put('/:id/status', (0, auth_1.authorize)('admin'), orderController_1.updateOrderStatus);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map