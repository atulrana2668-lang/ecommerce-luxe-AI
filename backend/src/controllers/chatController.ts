import { Request, Response } from 'express';
import { findProductsForAI } from '../utils/productSearch';


const MODEL = "gemini-pro";

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

        const systemPrompt = `You are the LUXE Store Assistant. Recommend products only from this list: ${JSON.stringify(products)}. If nothing matches, say you couldn't find exactly that but offer general help.`;

        const payload = {
            contents: [{
                parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }]
            }]
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data: any = await response.json();

        if (data.error) {
            console.error('❌ GEMINI ERROR:', data.error.message);
            return res.status(500).json({
                success: false,
                message: 'AI Error',
                details: data.error.message
            });
        }

        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            console.error('❌ AI ERROR: No response in payload', JSON.stringify(data));
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
            message: 'Connection Failed',
            details: error.message
        });
    }
};
