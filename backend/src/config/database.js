const mongoose = require('mongoose');

mongoose.connection.on('error', err => {
    console.error('Mongo runtime error ❌', err);
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        console.log("MongoDB Connected ✅");
    } catch (err) {
        console.error("MongoDB Connection Failed ❌", err);
        process.exit(1);
    }
};

module.exports = connectDB;
