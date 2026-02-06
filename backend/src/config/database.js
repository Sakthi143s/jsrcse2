const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn('WARNING: MONGODB_URI is not defined in environment variables.');
            return;
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // In some cloud environments, we might want to keep the process alive 
        // to show logs or provide a health check "degraded" status.
        // For now, we'll log it clearly.
    }
};

module.exports = connectDB;
