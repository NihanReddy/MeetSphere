import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexus_workspace';

export async function connectDB() {
  try {
    console.log(`[Database] Connecting to MongoDB: ${MONGODB_URI}...`);
    
    // Mongoose standard connection options
    const options = {
      autoIndex: true,
    };

    mongoose.connection.on('connected', () => {
      console.log('[Database] MongoDB connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[Database] MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB disconnected');
    });

    await mongoose.connect(MONGODB_URI, options);
  } catch (err) {
    console.error('[Database] Critical error initializing database connection:', err);
    process.exit(1);
  }
}
