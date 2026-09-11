import { GameSession, IGameSession } from '../../models';
import mongoose from 'mongoose';

export interface AdaptiveEvaluationInput {
  patientId: string | mongoose.Types.ObjectId;
  gameId: string;
  currentDifficulty: number;
  accuracy: number; // 0 - 100
  responseTime: number; // in seconds (e.g., 2.5s)
  attempts: number;
  mistakes: number;
  completed: boolean;
}

export interface AdaptiveEvaluationResult {
  currentDifficulty: number;
  recommendedDifficulty: number;
  performanceScore: number;
  metrics: {
    accuracyScore: number;
    speedScore: number;
    completionScore: number;
    consistencyScore: number;
  };
  reason: string;
}

export class AdaptiveDifficultyService {
  /**
   * Evaluates the session performance and recommends the next difficulty level.
   *
   * Formula:
   * Performance Score = 40% Accuracy + 25% Speed + 20% Completion + 15% Consistency
   */
  public async evaluatePerformance(
    input: AdaptiveEvaluationInput
  ): Promise<AdaptiveEvaluationResult> {
    const { currentDifficulty, accuracy, responseTime, attempts, mistakes, completed, patientId, gameId } = input;

    // 1. Accuracy Score (0 - 100)
    const accuracyScore = Math.max(0, Math.min(100, accuracy));

    // 2. Speed Score (0 - 100)
    // Benchmark: under 3 seconds = 100, over 15 seconds = 20
    let speedScore = 100;
    if (responseTime > 3) {
      speedScore = Math.max(10, 100 - (responseTime - 3) * 7.5);
    }
    speedScore = Math.min(100, Math.round(speedScore));

    // 3. Completion Score (0 - 100)
    const completionScore = completed ? 100 : 30;

    // 4. Consistency & Mistakes Score (0 - 100)
    // 0 mistakes = 100, each mistake reduces by 12 points
    let consistencyScore = Math.max(10, 100 - mistakes * 12 - (attempts > 1 ? (attempts - 1) * 10 : 0));

    // Incorporate recent session history (last 5 sessions) for historical smoothing
    let historicalAccuracyBonus = 0;
    if (mongoose.connection.readyState === 1) {
      try {
        const recentSessions = await GameSession.find({
          patientId: new mongoose.Types.ObjectId(patientId.toString()),
          gameId,
        })
          .sort({ completedAt: -1 })
          .limit(5)
          .lean();

        if (recentSessions.length >= 2) {
          const avgHistAccuracy =
            recentSessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / recentSessions.length;
          if (avgHistAccuracy >= 85) historicalAccuracyBonus = 5;
          else if (avgHistAccuracy < 50) historicalAccuracyBonus = -5;
        }
      } catch {
        // Historical lookup is supplementary; ignore if db fails
      }
    }

    // Weighted Performance Score Calculation
    // 40% Accuracy + 25% Response Speed + 20% Completion + 15% Consistency
    const rawScore =
      0.4 * accuracyScore +
      0.25 * speedScore +
      0.2 * completionScore +
      0.15 * consistencyScore +
      historicalAccuracyBonus;

    const performanceScore = Math.max(0, Math.min(100, Math.round(rawScore)));

    // Recommendation logic based on transparent thresholds
    let recommendedDifficulty = currentDifficulty;
    let reason = '';

    if (performanceScore >= 90) {
      recommendedDifficulty = Math.min(5, currentDifficulty + 1);
      reason =
        recommendedDifficulty > currentDifficulty
          ? `Outstanding performance! Accuracy of ${accuracyScore}% and swift response speed (${responseTime.toFixed(1)}s) indicate readiness for higher challenge.`
          : `Consistently exceptional performance at maximum challenge level (Level ${currentDifficulty}).`;
    } else if (performanceScore >= 75) {
      if (accuracyScore >= 80 && mistakes <= 1) {
        recommendedDifficulty = Math.min(5, currentDifficulty + 1);
        reason = `Strong cognitive response (${accuracyScore}% accuracy with minimal hesitation). Advancing challenge slightly.`;
      } else {
        recommendedDifficulty = currentDifficulty;
        reason = `Very steady engagement score of ${performanceScore}%. Maintaining current level to consolidate comfort.`;
      }
    } else if (performanceScore >= 60) {
      recommendedDifficulty = currentDifficulty;
      reason = `Balanced activity engagement (${accuracyScore}% accuracy). Optimal comfort zone maintained.`;
    } else if (performanceScore >= 40) {
      recommendedDifficulty = Math.max(1, currentDifficulty - 1);
      reason =
        recommendedDifficulty < currentDifficulty
          ? `Mild hesitation observed (${mistakes} mistakes, ${responseTime.toFixed(1)}s speed). Adjusting to a gentler pace.`
          : `Gently pacing at Level 1 to encourage effortless and joyful participation.`;
    } else {
      recommendedDifficulty = Math.max(1, currentDifficulty - (currentDifficulty > 2 ? 2 : 1));
      reason = `Activities eased significantly to prioritize comfort, reduce cognitive load, and keep participation pleasant.`;
    }

    return {
      currentDifficulty,
      recommendedDifficulty,
      performanceScore,
      metrics: {
        accuracyScore,
        speedScore,
        completionScore,
        consistencyScore,
      },
      reason,
    };
  }
}

export const adaptiveDifficultyService = new AdaptiveDifficultyService();
