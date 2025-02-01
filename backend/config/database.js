const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      const mongoUri = process.env.MONGODB_URI;

      if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined in environment variables.");
      }
      await mongoose.connect(mongoUri);
      console.log('MongoDB Connected...');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
      process.exit(1);
    }
  };
module.exports = connectDB;