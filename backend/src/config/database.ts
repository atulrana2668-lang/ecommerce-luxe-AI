import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        console.log('🔄 Connecting to MongoDB...');

        // Add connection options for better reliability
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10s
            socketTimeoutMS: 45000, // Close sockets after 45s
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

export default connectDB;
