import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import {
  Patient,
  Routine,
  Medication,
  Appointment,
  FamilyMember,
  Memory,
  Reminder,
  MoodEntry,
} from '../models';
import { AuthRequest } from '../middleware/auth';

export const getPatients = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    let filter: any = {};
    if (user.role === 'caregiver') {
      filter = { caregiverIds: new mongoose.Types.ObjectId(user.userId) };
    } else if (user.role === 'patient') {
      filter = { userId: new mongoose.Types.ObjectId(user.userId) };
    }
    // Healthcare workers can view all registered patients

    let patients = await Patient.find(filter).sort({ createdAt: -1 });

    // Fallback if caregiver has no patient linked yet: return all or first patient for smooth demo experience
    if (patients.length === 0 && user.role === 'caregiver') {
      patients = await Patient.find().limit(5);
    }

    res.status(200).json({ success: true, count: patients.length, patients });
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid patient ID' });
      return;
    }

    const patient = await Patient.findById(id);
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    const [routines, medications, appointments, familyMembers, memories, reminders, recentMood] =
      await Promise.all([
        Routine.find({ patientId: patient._id, active: true }).sort({ order: 1, time: 1 }),
        Medication.find({ patientId: patient._id, active: true }),
        Appointment.find({ patientId: patient._id }).sort({ date: 1, time: 1 }),
        FamilyMember.find({ patientId: patient._id }),
        Memory.find({ patientId: patient._id }).sort({ createdAt: -1 }),
        Reminder.find({ patientId: patient._id }).sort({ scheduledTime: 1 }),
        MoodEntry.find({ patientId: patient._id }).sort({ date: -1 }).limit(1),
      ]);

    res.status(200).json({
      success: true,
      patient: {
        ...patient.toObject(),
        routines,
        medications,
        appointments,
        familyMembers,
        memories,
        reminders,
        todayMood: recentMood[0]?.mood || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createPatient = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      age,
      gender = 'female',
      preferredLanguage = 'as',
      preferences = {},
      medicalNotes = '',
      emergencyContact = {},
    } = req.body;

    if (!name || !age) {
      res.status(400).json({ success: false, message: 'Patient name and age are required.' });
      return;
    }

    const caregiverId = req.user?.userId ? new mongoose.Types.ObjectId(req.user.userId) : undefined;

    const patient = await Patient.create({
      name,
      age: Number(age),
      gender,
      preferredLanguage,
      preferences,
      medicalNotes,
      emergencyContact,
      caregiverIds: caregiverId ? [caregiverId] : [],
    });

    res.status(201).json({ success: true, message: 'Patient profile created successfully.', patient });
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const patient = await Patient.findByIdAndUpdate(id, updateData, { new: true });
    if (!patient) {
      res.status(404).json({ success: false, message: 'Patient not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Patient profile updated.', patient });
  } catch (error) {
    next(error);
  }
};
