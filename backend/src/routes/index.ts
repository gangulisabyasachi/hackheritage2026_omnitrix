import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
} from '../controllers/patientController';
import {
  getGames,
  getGameById,
  submitGameSession,
  getPatientGameSessions,
} from '../controllers/gameController';
import {
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  getFamilyMembers,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} from '../controllers/memoryController';
import {
  getRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/routineController';
import {
  getReminders,
  createReminder,
  updateReminderStatus,
  submitMood,
  getMoodHistory,
  getNotifications,
} from '../controllers/reminderController';
import { getPatientAnalytics } from '../controllers/analyticsController';
import {
  askMemoryAssistant,
  generateCaregiverSummary,
  getActivityRecommendation,
} from '../controllers/aiController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// ==========================================
// HEALTH CHECK
// ==========================================
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Smriti Cognitive Platform API',
    region: 'North Eastern Region (NER) Accessibility Edition',
    timestamp: new Date().toISOString(),
    medicalDisclaimer:
      'This platform is designed for cognitive engagement, memory assistance, and activity monitoring. It does not replace professional medical diagnosis or treatment.',
  });
});

// ==========================================
// AUTH ROUTES
// ==========================================
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', requireAuth, getMe);

// ==========================================
// PATIENTS ROUTES
// ==========================================
router.get('/patients', requireAuth, getPatients);
router.get('/patients/:id', requireAuth, getPatientById);
router.post('/patients', requireAuth, createPatient);
router.put('/patients/:id', requireAuth, updatePatient);

// Public/Elderly friendly direct patient fetch for quick demo access
router.get('/public/patient/:id', getPatientById);

// ==========================================
// GAMES ROUTES
// ==========================================
router.get('/games', getGames);
router.get('/games/:id', getGameById);
router.post('/games/:id/session', submitGameSession);
router.get('/patients/:id/game-sessions', getPatientGameSessions);

// ==========================================
// ANALYTICS ROUTES
// ==========================================
router.get('/patients/:id/analytics', getPatientAnalytics);

// ==========================================
// MEMORIES & FAMILY ROUTES
// ==========================================
router.get('/patients/:id/memories', getMemories);
router.post('/patients/:id/memories', createMemory);
router.put('/memories/:memoryId', updateMemory);
router.delete('/memories/:memoryId', deleteMemory);

router.get('/patients/:id/family', getFamilyMembers);
router.post('/patients/:id/family', createFamilyMember);
router.put('/family/:familyId', updateFamilyMember);
router.delete('/family/:familyId', deleteFamilyMember);

// ==========================================
// ROUTINES, MEDICATIONS & APPOINTMENTS
// ==========================================
router.get('/patients/:id/routines', getRoutines);
router.post('/patients/:id/routines', createRoutine);
router.put('/routines/:routineId', updateRoutine);
router.delete('/routines/:routineId', deleteRoutine);

router.get('/patients/:id/medications', getMedications);
router.post('/patients/:id/medications', createMedication);
router.put('/medications/:medicationId', updateMedication);
router.delete('/medications/:medicationId', deleteMedication);

router.get('/patients/:id/appointments', getAppointments);
router.post('/patients/:id/appointments', createAppointment);
router.put('/appointments/:appointmentId', updateAppointment);
router.delete('/appointments/:appointmentId', deleteAppointment);

// ==========================================
// REMINDERS & MOOD ROUTES
// ==========================================
router.get('/patients/:id/reminders', getReminders);
router.post('/patients/:id/reminders', createReminder);
router.put('/reminders/:reminderId/status', updateReminderStatus);

router.post('/patients/:id/mood', submitMood);
router.get('/patients/:id/mood-history', getMoodHistory);
router.get('/patients/:id/notifications', getNotifications);

// ==========================================
// AI ASSISTANT ROUTES
// ==========================================
router.post('/ai/memory-assistant', askMemoryAssistant);
router.post('/ai/chat', askMemoryAssistant);
router.post('/ai/caregiver-summary', generateCaregiverSummary);
router.post('/ai/activity-recommendation', getActivityRecommendation);

export default router;
