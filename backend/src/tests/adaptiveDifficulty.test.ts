import { adaptiveDifficultyService } from '../services/adaptive/adaptiveDifficultyService';
import mongoose from 'mongoose';

describe('Adaptive Difficulty Engine', () => {
  const dummyPatientId = new mongoose.Types.ObjectId().toString();

  it('should recommend increasing difficulty when performance is outstanding (accuracy >= 95%, fast response, 0 mistakes)', async () => {
    const result = await adaptiveDifficultyService.evaluatePerformance({
      patientId: dummyPatientId,
      gameId: 'memory-match',
      currentDifficulty: 2,
      accuracy: 95,
      responseTime: 2.1,
      attempts: 1,
      mistakes: 0,
      completed: true,
    });

    expect(result.currentDifficulty).toBe(2);
    expect(result.recommendedDifficulty).toBe(3);
    expect(result.performanceScore).toBeGreaterThanOrEqual(85);
    expect(result.reason).toContain('higher challenge');
  });

  it('should recommend maintaining difficulty when performance is balanced (accuracy around 70%)', async () => {
    const result = await adaptiveDifficultyService.evaluatePerformance({
      patientId: dummyPatientId,
      gameId: 'pattern-completion',
      currentDifficulty: 2,
      accuracy: 68,
      responseTime: 6.5,
      attempts: 1,
      mistakes: 2,
      completed: true,
    });

    expect(result.currentDifficulty).toBe(2);
    expect(result.recommendedDifficulty).toBe(2);
    expect(result.performanceScore).toBeGreaterThanOrEqual(50);
    expect(result.performanceScore).toBeLessThan(80);
    expect(result.reason).toBeDefined();
  });

  it('should recommend decreasing difficulty when patient struggles (low accuracy, multiple mistakes, slow response)', async () => {
    const result = await adaptiveDifficultyService.evaluatePerformance({
      patientId: dummyPatientId,
      gameId: 'memory-match',
      currentDifficulty: 3,
      accuracy: 35,
      responseTime: 16.0,
      attempts: 3,
      mistakes: 6,
      completed: false,
    });

    expect(result.currentDifficulty).toBe(3);
    expect(result.recommendedDifficulty).toBeLessThan(3);
    expect(result.performanceScore).toBeLessThan(45);
    expect(result.reason.toLowerCase()).toContain('eased');
  });

  it('should never drop below difficulty 1 or exceed difficulty 5', async () => {
    const minResult = await adaptiveDifficultyService.evaluatePerformance({
      patientId: dummyPatientId,
      gameId: 'memory-match',
      currentDifficulty: 1,
      accuracy: 10,
      responseTime: 20.0,
      attempts: 4,
      mistakes: 8,
      completed: false,
    });
    expect(minResult.recommendedDifficulty).toBe(1);

    const maxResult = await adaptiveDifficultyService.evaluatePerformance({
      patientId: dummyPatientId,
      gameId: 'memory-match',
      currentDifficulty: 5,
      accuracy: 100,
      responseTime: 1.5,
      attempts: 1,
      mistakes: 0,
      completed: true,
    });
    expect(maxResult.recommendedDifficulty).toBe(5);
  });
});
