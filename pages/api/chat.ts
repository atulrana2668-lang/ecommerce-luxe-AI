import type { NextApiRequest, NextApiResponse } from 'next';
import { initializeProducts } from '../../utils/storage';

const API_KEY = "AIzaSyARmcyhleGUvddFqcrP8T0V6MYxz3gIO1Y";
// Switching to gemini-1.5-flash as requested by the user.
const MODEL = "gemini-1.5-flash";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    // Prepare Context from Inventory
    const products = initializeProducts().map(p => ({
        name: p.name,
        price: `₹${p.price}`,
        category: p.category,
        stock: p.inStock ? "In Stock" : "Out of Stock"
    }));

    const systemPrompt = `You are a helpful assistant for my store LUXE. 
    Our current inventory is: ${JSON.stringify(products)}. 
    If a user asks for something we have, tell them the price. 
    If we don't have it, suggest something similar or tell them to check back later.
    
    User Question: ${message}`;

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt
                    }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error.message);
            return res.status(500).json({
                message: "AI Error",
                details: data.error.message
            });
        }

        if (!data.candidates || data.candidates.length === 0) {
            return res.status(500).json({ message: "No response from AI, possibly filtered." });
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ text: aiResponse });

    } catch (error: any) {
        console.error("Connection Error:", error);
        return res.status(500).json({
            message: "Connection Failed",
            details: error.message
        });
    }
}
