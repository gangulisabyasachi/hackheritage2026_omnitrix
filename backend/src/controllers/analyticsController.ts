import { Request, Response, NextFunction } from 'express';
import { cognitiveAnalyticsService } from '../services/analytics/cognitiveAnalyticsService';
import { Patient } from '../models';

export const getPatientAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: patientId } = req.params;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    const analytics = await cognitiveAnalyticsService.getPatientAnalytics(patientId);

    res.status(200).json({
      success: true,
      patientName: patient.name,
      ...analytics,
    });
  } catch (error) {
    next(error);
  }
};
