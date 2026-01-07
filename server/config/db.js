const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Support multiple env var names and provide a sensible default for local dev
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DB_URI || 'mongodb://127.0.0.1:27017/smartwallet';

    if (!uri || typeof uri !== 'string') {
      throw new Error('MongoDB connection URI is not defined or invalid. Set MONGODB_URI in your .env');
    }

    const conn = await mongoose.connect(uri);
    console.log(`\x1b[32m%s\x1b[0m`, `✅ [SmartWallet AI] Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `❌ [SmartWallet AI] DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
