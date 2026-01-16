import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import mongoose from 'mongoose';

// Using environment variable for security
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";

// Product interface for chat context
interface ChatProduct {
    name: string;
    price: string;
    originalPrice: string | null;
    category: string;
    sizes: string[];
    colors: string[];
    stock: string;
    discount: string | null;
    description: string;
}

// Extract keywords from user message for search
function extractKeywords(message: string): string[] {
    // Common fashion-related keywords to look for
    const fashionKeywords = [
        'shirt', 't-shirt', 'tshirt', 'dress', 'jeans', 'pants', 'jacket', 'coat',
        'shoes', 'sneakers', 'boots', 'sandals', 'heels',
        'bag', 'purse', 'handbag', 'backpack',
        'accessories', 'watch', 'sunglasses', 'belt',
        'men', 'women', 'kids', 'boy', 'girl',
        'casual', 'formal', 'party', 'office', 'wedding',
        'cotton', 'silk', 'denim', 'leather',
        'black', 'white', 'blue', 'red', 'green', 'pink', 'brown',
        'small', 'medium', 'large', 'xl', 'xxl',
        'cheap', 'affordable', 'premium', 'luxury', 'discount', 'sale', 'offer',
        'summer', 'winter', 'spring', 'autumn',
        'kurta', 'saree', 'lehenga', 'ethnic', 'traditional', 'western',
        'floral', 'striped', 'printed', 'plain', 'solid'
    ];

    const lowerMessage = message.toLowerCase();
    const words = lowerMessage.split(/\s+/);

    // Extract matching keywords
    const matchedKeywords = fashionKeywords.filter(keyword =>
        lowerMessage.includes(keyword)
    );

    // Also include significant words from the message (3+ chars, not common words)
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'have', 'been', 'some', 'what', 'when', 'who', 'will', 'more', 'want', 'looking', 'need', 'show', 'give', 'find', 'get', 'any', 'something', 'anything', 'please', 'thanks', 'thank', 'hello', 'help', 'like', 'about'];

    words.forEach(word => {
        if (word.length >= 3 && !commonWords.includes(word) && !matchedKeywords.includes(word)) {
            matchedKeywords.push(word);
        }
    });

    return matchedKeywords.slice(0, 10); // Limit to 10 keywords
}

// Build MongoDB search query from keywords
function buildSearchQuery(keywords: string[]) {
    if (keywords.length === 0) {
        return {}; // Return all products if no keywords
    }

    // Create regex patterns for flexible matching
    const regexPatterns = keywords.map(keyword => new RegExp(keyword, 'i'));

    return {
        $or: [
            { name: { $in: regexPatterns } },
            { description: { $in: regexPatterns } },
            { category: { $in: regexPatterns } },
            { colors: { $in: keywords.map(k => new RegExp(k, 'i')) } }
        ]
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    if (!API_KEY) {
        return res.status(500).json({
            message: 'AI service not configured. Please set GEMINI_API_KEY in environment variables.'
        });
    }

    try {
        // Connect to MongoDB
        await dbConnect();

        // Extract keywords from user message
        const keywords = extractKeywords(message);
        console.log('Chat keywords extracted:', keywords);

        // Build search query
        const searchQuery = buildSearchQuery(keywords);

        // Fetch relevant products from MongoDB (top 5)
        // Use raw MongoDB query since we're in Next.js API
        const db = mongoose.connection.db;
        let products: ChatProduct[] = [];

        if (db) {
            const productsCollection = db.collection('products');

            // Fetch products matching keywords, or all if no keywords
            const rawProducts = await productsCollection
                .find(searchQuery)
                .limit(10)
                .toArray();

            // Map to chat-friendly format
            products = rawProducts.map((p: any) => ({
                name: p.name,
                price: `₹${p.price?.toLocaleString() || 'N/A'}`,
                originalPrice: p.originalPrice ? `₹${p.originalPrice.toLocaleString()}` : null,
                category: p.category || 'General',
                sizes: p.sizes || [],
                colors: p.colors || [],
                stock: p.inStock !== false ? "In Stock" : "Out of Stock",
                discount: p.discount ? `${p.discount}% off` : null,
                description: p.description?.substring(0, 100) || ''
            }));

            console.log(`Found ${products.length} relevant products for chat context`);
        }

        // If no products found with keywords, fetch random products as fallback
        if (products.length === 0 && db) {
            const productsCollection = db.collection('products');
            const fallbackProducts = await productsCollection
                .find({})
                .limit(5)
                .toArray();

            products = fallbackProducts.map((p: any) => ({
                name: p.name,
                price: `₹${p.price?.toLocaleString() || 'N/A'}`,
                originalPrice: p.originalPrice ? `₹${p.originalPrice.toLocaleString()}` : null,
                category: p.category || 'General',
                sizes: p.sizes || [],
                colors: p.colors || [],
                stock: p.inStock !== false ? "In Stock" : "Out of Stock",
                discount: p.discount ? `${p.discount}% off` : null,
                description: p.description?.substring(0, 100) || ''
            }));
        }

        // Build enhanced system prompt with real database data
        const systemPrompt = `You are a helpful and friendly sales assistant for LUXE, a premium fashion e-commerce store in India.

IMPORTANT: Answer based ONLY on the following product availability from our database. Do not make up products that are not listed below.

## Current Product Inventory (from database):
${products.length > 0 ? JSON.stringify(products, null, 2) : 'No products currently available in the searched category.'}

## Your Guidelines:
1. If a user asks about a specific product we have in the inventory above, share its details including price, available sizes, colors, and any discounts.
2. If we don't have what they're looking for in our current inventory, politely say so and suggest browsing our website for more options.
3. Provide styling tips when relevant to the products shown.
4. Be concise but friendly - use emojis sparingly (1-2 per response max).
5. For orders, returns, or shipping questions, mention:
   - Free shipping on orders over ₹999
   - Easy 30-day returns
   - Cash on Delivery available
6. Always encourage users to visit our website to see the full collection.
7. If asked about price, be specific with the ₹ amounts shown above.
8. Never hallucinate products that aren't in the inventory list above.

## User's Question:
${message}

## Your Response (be helpful, accurate, and friendly):`;

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: systemPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("Gemini API Error:", data.error.message);

            // Check if it's a rate limit error
            if (data.error.message?.includes('rate') || data.error.message?.includes('limit') || data.error.message?.includes('quota')) {
                // Provide a helpful fallback response with real product data
                const fallbackResponse = generateFallbackResponse(message, products);
                return res.status(200).json({
                    text: fallbackResponse,
                    _debug: {
                        keywordsUsed: keywords,
                        productsFound: products.length,
                        fallback: true
                    }
                });
            }

            return res.status(500).json({
                message: "AI Error",
                details: data.error.message
            });
        }

        if (!data.candidates || data.candidates.length === 0) {
            // Fallback response if no AI response
            const fallbackResponse = generateFallbackResponse(message, products);
            return res.status(200).json({
                text: fallbackResponse,
                _debug: {
                    keywordsUsed: keywords,
                    productsFound: products.length,
                    fallback: true
                }
            });
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        return res.status(200).json({
            text: aiResponse,
            // Include metadata for debugging (optional)
            _debug: {
                keywordsUsed: keywords,
                productsFound: products.length
            }
        });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return res.status(500).json({
            message: "Connection Failed",
            details: error.message
        });
    }
}

// Fallback response generator when AI is unavailable
function generateFallbackResponse(message: string, products: ChatProduct[]): string {
    const lowerMessage = message.toLowerCase();

    if (products.length === 0) {
        return `Hi there! 👋 I found some products that might interest you in our store. Please browse our collection at LUXE for the latest fashion! We offer free shipping on orders over ₹999 and easy 30-day returns.`;
    }

    // Check for specific queries
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
        const productList = products.slice(0, 3).map(p =>
            `• ${p.name}: ${p.price}${p.discount ? ` (${p.discount})` : ''}`
        ).join('\n');
        return `Here are some products with prices:\n\n${productList}\n\nWould you like more details on any of these?`;
    }

    if (lowerMessage.includes('dress') || lowerMessage.includes('shirt') || lowerMessage.includes('jeans')) {
        const relevantProducts = products.slice(0, 3);
        const productList = relevantProducts.map(p =>
            `• ${p.name} - ${p.price} (${p.category})`
        ).join('\n');
        return `Great choice! Here's what we have:\n\n${productList}\n\nAll items come with free shipping over ₹999! 🛍️`;
    }

    // Default response with product list
    const productList = products.slice(0, 5).map(p =>
        `• ${p.name}: ${p.price}${p.discount ? ` (${p.discount})` : ''} - ${p.stock}`
    ).join('\n');

    return `Hi! 👋 Here's what we have in stock:\n\n${productList}\n\nFeel free to ask about any specific product! We offer:\n• Free shipping on orders over ₹999\n• Easy 30-day returns\n• Cash on Delivery available`;
}

