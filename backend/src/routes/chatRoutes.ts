import express from 'express';
import { handleChat } from '../controllers/chatController';

const router = express.Router();

// Chat is public for now as it's a shopping assistant
router.post('/', handleChat);

export default router;
