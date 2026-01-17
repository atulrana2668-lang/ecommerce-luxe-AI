import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { findProductsForAI } from '../utils/productSearch';

/**
 * Handle AI Chat with Context Awareness
 * Triggered by POST /api/chat
 */
export const handleChat = async (req: Request, res: Response) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        if (!API_KEY) {
            console.error('❌ CHAT ERROR: GEMINI_API_KEY is missing');
            return res.status(500).json({
                success: false,
                message: 'AI service not configured.'
            });
        }

        console.log(`💬 AI Chat: "${message}"`);

        // Search for relevant products
        const products = await findProductsForAI(message);
        console.log(`🔍 Found ${products.length} query-related products`);

        // Initialize Gemini SDK
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const systemPrompt = `You are the LUXE Store Assistant. Recommend products only from this list: ${JSON.stringify(products)}. If nothing matches, say you couldn't find exactly that but offer general help.`;

        const prompt = `${systemPrompt}\n\nUser: ${message}`;

        // Generate content using SDK
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = response.text();

        if (!aiResponse) {
            console.error('❌ AI ERROR: No response generated');
            return res.status(500).json({ success: false, message: 'No AI response' });
        }

        console.log('✅ AI responded successfully');
        return res.status(200).json({
            success: true,
            text: aiResponse,
            reply: aiResponse // for compatibility
        });

    } catch (error: any) {
        console.error('❌ CHAT CONTROLLER ERROR:', error.message);
        return res.status(500).json({
            success: false,
            message: 'AI Service Error',
            details: error.message
        });
    }
};

