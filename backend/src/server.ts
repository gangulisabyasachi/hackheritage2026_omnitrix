import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { seedDatabaseIfEmpty } from './seed/seedData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API Routes
app.use('/api', routes);

// Central Error Handler
app.use(errorHandler);

export const startServer = async () => {
  try {
    await connectDB();
    await seedDatabaseIfEmpty();

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🌸 SMRITI NER - Cognitive Gaming & Memory Platform 🌸`);
      console.log(`🚀 Backend API Server running on port: ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });

    return server;
  } catch (error) {
    console.error('Fatal: Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
