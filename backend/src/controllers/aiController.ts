import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai/AIService';
import { Patient } from '../models';
import { cognitiveAnalyticsService } from '../services/analytics/cognitiveAnalyticsService';

export const askMemoryAssistant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patientId, query, language = 'en' } = req.body;

    if (!patientId || !query) {
      res.status(400).json({ success: false, message: 'patientId and query are required.' });
      return;
    }

    const result = await aiService.askMemoryAssistant(patientId, query, language);

    res.status(200).json({
      success: true,
      query,
      response: result.response,
      provider: result.provider,
    });
  } catch (error) {
    next(error);
  }
};

export const generateCaregiverSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patientId } = req.body;
    if (!patientId) {
      res.status(400).json({ success: false, message: 'patientId is required.' });
      return;
    }

    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    const analytics = await cognitiveAnalyticsService.getPatientAnalytics(patientId);
    const summary = await aiService.generateCaregiverSummary(
      patient.name,
      analytics.breakdown,
      analytics.recentSessions
    );

    res.status(200).json({
      success: true,
      patientName: patient.name,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityRecommendation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { patientId } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    const analytics = await cognitiveAnalyticsService.getPatientAnalytics(patientId);
    const recommendation = await aiService.generateActivityRecommendation(
      patient.name,
      analytics.breakdown
    );

    res.status(200).json({
      success: true,
      recommendation,
    });
  } catch (error) {
    next(error);
  }
};
