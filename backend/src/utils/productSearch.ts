import Product from '../models/Product';

/**
 * Searches for products based on a query string specifically for AI chatbot usage.
 * Returns top 3 relevant results with minimal fields.
 * 
 * @param query The search term from the user
 * @returns Array of products with name, price, and stock status
 */
export const findProductsForAI = async (query: string) => {
    try {
        if (!query || query.trim() === '') {
            return [];
        }

        // Create a case-insensitive regex for partial matching
        const searchRegex = new RegExp(query.trim(), 'i');

        // Search in name or description
        const products = await Product.find({
            $or: [
                { name: { $regex: searchRegex } },
                { description: { $regex: searchRegex } }
            ]
        })
            .select('name price inStock stockQuantity') // Select essential fields
            .limit(3) // Limit to top 3 for lightweight data
            .lean(); // For better performance

        // Format for AI consuming
        return products.map(product => ({
            name: product.name,
            price: `₹${product.price}`,
            stockStatus: product.inStock ? 'In Stock' : 'Out of Stock'
        }));
    } catch (error) {
        console.error('Error in findProductsForAI:', error);
        return [];
    }
};
