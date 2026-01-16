import { Request, Response } from 'express';
import { findProductsForAI } from '../utils/productSearch';

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";

/**
 * Handle AI Chat with Context Awareness
 * Triggered by POST /api/chat
 */
export const handleChat = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        if (!API_KEY) {
            return res.status(500).json({
                success: false,
                message: 'AI service not configured. Please set GEMINI_API_KEY.'
            });
        }

        // 1. Search for real-time products based on user query
        const products = await findProductsForAI(message);

        // 2. Construct a System Prompt dynamically
        const systemPrompt = `You are a helpful sales assistant for Luxe Store. Here is the real-time product availability based on the user's query: ${JSON.stringify(products)}. Answer strictly based on this data. If stock is 0, say it's out of stock. Be friendly, concise, and encourage the user to buy.`;

        // 3. Prepare Gemini API payload
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

        const payload = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser Question: ${message}\n\nLuxe Assistant:`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500
            }
        };

        // 4. Call Gemini API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data: any = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error.message);
            return res.status(500).json({ success: false, message: "AI Error", details: data.error.message });
        }

        if (!data.candidates || data.candidates.length === 0) {
            return res.status(200).json({
                success: true,
                text: "I'm sorry, I couldn't generate a response. Could you please rephrase?"
            });
        }

        const aiResponse = data.candidates[0].content.parts[0].text;

        // 5. Return response to frontend
        return res.status(200).json({
            success: true,
            text: aiResponse,
            products // Include products found for UI reference if needed
        });

    } catch (error: any) {
        console.error("Chat Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Connection Failed",
            details: error.message
        });
    }
};
