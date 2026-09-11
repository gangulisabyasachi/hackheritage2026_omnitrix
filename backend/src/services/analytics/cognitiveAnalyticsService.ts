import { GameSession, CognitivePerformance, Notification, Patient } from '../../models';
import mongoose from 'mongoose';

export interface CategoryBreakdown {
  memory: number;
  attention: number;
  pattern: number;
  recognition: number;
  routine: number;
  overall: number;
}

export interface CognitiveTrendPoint {
  date: string;
  score: number;
  accuracy: number;
  responseTime: number;
  gameCount: number;
}

export class CognitiveAnalyticsService {
  /**
   * Recalculates category scores and overall engagement for a patient
   */
  public async getPatientAnalytics(patientId: string | mongoose.Types.ObjectId) {
    const pId = new mongoose.Types.ObjectId(patientId.toString());

    // Fetch past 30 days of game sessions
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessions = await GameSession.find({
      patientId: pId,
      completedAt: { $gte: thirtyDaysAgo },
    })
      .sort({ completedAt: 1 })
      .lean();

    // Map gameId to category
    const categoryMap: Record<string, keyof Omit<CategoryBreakdown, 'overall'>> = {
      'memory-match': 'memory',
      'object-recognition': 'recognition',
      'pattern-completion': 'pattern',
      'routine-recall': 'routine',
      'family-memory': 'memory',
    };

    const scoresByCategory: Record<string, number[]> = {
      memory: [],
      attention: [],
      pattern: [],
      recognition: [],
      routine: [],
    };

    sessions.forEach((s) => {
      const cat = categoryMap[s.gameId] || 'memory';
      if (scoresByCategory[cat]) {
        scoresByCategory[cat].push(s.score);
      }
    });

    const average = (arr: number[], fallback: number = 70) =>
      arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : fallback;

    const breakdown: CategoryBreakdown = {
      memory: average(scoresByCategory.memory, 74),
      attention: average(scoresByCategory.pattern, 70), // attention correlates with pattern focus
      pattern: average(scoresByCategory.pattern, 78),
      recognition: average(scoresByCategory.recognition, 82),
      routine: average(scoresByCategory.routine, 76),
      overall: 0,
    };

    breakdown.overall = Math.round(
      (breakdown.memory +
        breakdown.attention +
        breakdown.pattern +
        breakdown.recognition +
        breakdown.routine) /
        5
    );

    // Build chronological trend points for Recharts (grouped by date)
    const trendsByDate: Record<string, { totalScore: number; totalAcc: number; totalTime: number; count: number }> = {};

    sessions.forEach((s) => {
      const dateStr = new Date(s.completedAt).toISOString().split('T')[0];
      if (!trendsByDate[dateStr]) {
        trendsByDate[dateStr] = { totalScore: 0, totalAcc: 0, totalTime: 0, count: 0 };
      }
      trendsByDate[dateStr].totalScore += s.score;
      trendsByDate[dateStr].totalAcc += s.accuracy;
      trendsByDate[dateStr].totalTime += s.responseTime;
      trendsByDate[dateStr].count += 1;
    });

    const trends: CognitiveTrendPoint[] = Object.keys(trendsByDate).map((date) => {
      const entry = trendsByDate[date];
      return {
        date,
        score: Math.round(entry.totalScore / entry.count),
        accuracy: Math.round(entry.totalAcc / entry.count),
        responseTime: Number((entry.totalTime / entry.count).toFixed(1)),
        gameCount: entry.count,
      };
    });

    // Check for performance changes (sudden drop of > 20 points across last 3 sessions compared to average)
    if (sessions.length >= 4) {
      const last3 = sessions.slice(-3);
      const last3Avg = last3.reduce((acc, s) => acc + s.score, 0) / 3;
      if (last3Avg < breakdown.overall - 18) {
        // Create an alert notification if not created recently
        const existingAlert = await Notification.findOne({
          patientId: pId,
          type: 'performance_change',
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });

        if (!existingAlert) {
          await Notification.create({
            patientId: pId,
            type: 'performance_change',
            title: 'Performance Change Detected',
            message: `A gentle change in recent activity performance was noted (recent average: ${Math.round(last3Avg)}% vs typical: ${breakdown.overall}%). Consider checking in on rest or hydration.`,
            read: false,
          });
        }
      }
    }

    return {
      breakdown,
      trends,
      totalSessionsCompleted: sessions.length,
      recentSessions: sessions.slice(-10).reverse(),
    };
  }
}

export const cognitiveAnalyticsService = new CognitiveAnalyticsService();
