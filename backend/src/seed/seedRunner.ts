import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db';
import { seedDatabase } from './seedData';

dotenv.config();

const run = async () => {
  try {
    console.log('🌱 Starting manual database seeding script...');
    await connectDB();
    await seedDatabase(true); // force reseed
    console.log('✨ Seeding finished.');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

run();
