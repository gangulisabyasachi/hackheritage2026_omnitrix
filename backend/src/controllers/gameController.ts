import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Game, GameSession, CognitivePerformance } from '../models';
import { adaptiveDifficultyService } from '../services/adaptive/adaptiveDifficultyService';

export const getGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const games = await Game.find({ active: true });
    res.status(200).json({ success: true, games });
  } catch (error) {
    next(error);
  }
};

export const getGameById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const game = await Game.findOne({ gameId: id });
    if (!game) {
      res.status(404).json({ success: false, message: 'Game not found' });
      return;
    }
    res.status(200).json({ success: true, game });
  } catch (error) {
    next(error);
  }
};

export const submitGameSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: gameId } = req.params;
    const {
      patientId,
      difficulty = 1,
      score,
      accuracy,
      responseTime,
      attempts = 1,
      mistakes = 0,
      completed = true,
      metadata = {},
    } = req.body;

    if (!patientId || score === undefined || accuracy === undefined || responseTime === undefined) {
      res.status(400).json({
        success: false,
        message: 'patientId, score, accuracy, and responseTime are required.',
      });
      return;
    }

    // 1. Run our Adaptive Difficulty Engine
    const adaptiveResult = await adaptiveDifficultyService.evaluatePerformance({
      patientId,
      gameId,
      currentDifficulty: Number(difficulty),
      accuracy: Number(accuracy),
      responseTime: Number(responseTime),
      attempts: Number(attempts),
      mistakes: Number(mistakes),
      completed: Boolean(completed),
    });

    // 2. Persist session to MongoDB
    const session = await GameSession.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      gameId,
      difficulty: Number(difficulty),
      score: Number(score),
      accuracy: Number(accuracy),
      responseTime: Number(responseTime),
      attempts: Number(attempts),
      mistakes: Number(mistakes),
      completed: Boolean(completed),
      startedAt: new Date(Date.now() - Math.round(Number(responseTime) * 1000)),
      completedAt: new Date(),
      metadata,
    });

    // 3. Map category & update cognitive performance
    const categoryMap: Record<string, 'memory' | 'attention' | 'pattern' | 'recognition' | 'routine'> = {
      'memory-match': 'memory',
      'object-recognition': 'recognition',
      'pattern-completion': 'pattern',
      'routine-recall': 'routine',
      'family-memory': 'memory',
    };

    const category = categoryMap[gameId] || 'memory';

    await CognitivePerformance.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      category,
      score: Number(score),
      date: new Date(),
      sourceGameSessions: [session._id],
    });

    res.status(201).json({
      success: true,
      message: 'Game activity recorded successfully.',
      session,
      adaptiveRecommendation: {
        currentDifficulty: adaptiveResult.currentDifficulty,
        recommendedDifficulty: adaptiveResult.recommendedDifficulty,
        performanceScore: adaptiveResult.performanceScore,
        metrics: adaptiveResult.metrics,
        reason: adaptiveResult.reason,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPatientGameSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const { limit = 20 } = req.query;

    const sessions = await GameSession.find({
      patientId: new mongoose.Types.ObjectId(patientId),
    })
      .sort({ completedAt: -1 })
      .limit(Number(limit));

    res.status(200).json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    next(error);
  }
};
