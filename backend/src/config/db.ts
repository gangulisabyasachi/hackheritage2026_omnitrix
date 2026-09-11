import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<string> => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim().length > 0) {
    try {
      console.log('🔄 Attempting connection to external MongoDB Atlas...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB Atlas successfully.');
      return uri;
    } catch (error: any) {
      console.warn(`⚠️ Could not connect to external MongoDB Atlas: ${error.message}`);
      console.log('🔄 Falling back to embedded in-memory MongoDB for local development/evaluation...');
    }
  } else {
    console.log('ℹ️ No MONGODB_URI provided in .env. Starting embedded in-memory MongoDB instance...');
  }

  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✅ Connected to Embedded In-Memory MongoDB successfully (${memoryUri}).`);
    return memoryUri;
  } catch (memError: any) {
    console.error('❌ Failed to start embedded MongoDB:', memError);
    throw memError;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('MongoDB disconnected cleanly.');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error);
  }
};
