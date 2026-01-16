import express from 'express';
import { setupAdmin, listAdmins, demoteAdmin } from '../controllers/adminSetupController';

const router = express.Router();

// Setup admin routes (protected by secret key, not JWT)
router.post('/', setupAdmin);
router.get('/list', listAdmins);
router.post('/demote', demoteAdmin);

export default router;
