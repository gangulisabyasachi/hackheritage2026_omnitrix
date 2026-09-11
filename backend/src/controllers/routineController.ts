import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Routine, Medication, Appointment } from '../models';

// ==========================================
// ROUTINE CRUD
// ==========================================
export const getRoutines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const routines = await Routine.find({ patientId: new mongoose.Types.ObjectId(patientId) }).sort({
      order: 1,
      time: 1,
    });
    res.status(200).json({ success: true, count: routines.length, routines });
  } catch (error) {
    next(error);
  }
};

export const createRoutine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const { time, activity, description = '', recurrence = 'daily', order = 0 } = req.body;

    if (!time || !activity) {
      res.status(400).json({ success: false, message: 'Time and activity are required.' });
      return;
    }

    const routine = await Routine.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      time,
      activity,
      description,
      recurrence,
      order,
    });

    res.status(201).json({ success: true, message: 'Routine item scheduled.', routine });
  } catch (error) {
    next(error);
  }
};

export const updateRoutine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { routineId } = req.params;
    const routine = await Routine.findByIdAndUpdate(routineId, req.body, { new: true });
    if (!routine) {
      res.status(404).json({ success: false, message: 'Routine item not found' });
      return;
    }
    res.status(200).json({ success: true, routine });
  } catch (error) {
    next(error);
  }
};

export const deleteRoutine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { routineId } = req.params;
    await Routine.findByIdAndDelete(routineId);
    res.status(200).json({ success: true, message: 'Routine item deleted.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// MEDICATION CRUD
// ==========================================
export const getMedications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const medications = await Medication.find({ patientId: new mongoose.Types.ObjectId(patientId) });
    res.status(200).json({ success: true, count: medications.length, medications });
  } catch (error) {
    next(error);
  }
};

export const createMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const { name, dosage, schedule = [], instructions = '', notes = '' } = req.body;

    if (!name || !dosage) {
      res.status(400).json({ success: false, message: 'Medicine name and dosage are required.' });
      return;
    }

    const medication = await Medication.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      name,
      dosage,
      schedule: Array.isArray(schedule) ? schedule : [schedule],
      instructions,
      notes,
    });

    res.status(201).json({ success: true, message: 'Medication added.', medication });
  } catch (error) {
    next(error);
  }
};

export const updateMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { medicationId } = req.params;
    const medication = await Medication.findByIdAndUpdate(medicationId, req.body, { new: true });
    if (!medication) {
      res.status(404).json({ success: false, message: 'Medication not found' });
      return;
    }
    res.status(200).json({ success: true, medication });
  } catch (error) {
    next(error);
  }
};

export const deleteMedication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { medicationId } = req.params;
    await Medication.findByIdAndDelete(medicationId);
    res.status(200).json({ success: true, message: 'Medication removed.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// APPOINTMENT CRUD
// ==========================================
export const getAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const appointments = await Appointment.find({
      patientId: new mongoose.Types.ObjectId(patientId),
    }).sort({ date: 1, time: 1 });
    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    next(error);
  }
};

export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const { title, provider, date, time, location = 'Clinic', notes = '' } = req.body;

    if (!title || !provider || !date || !time) {
      res.status(400).json({ success: false, message: 'Title, provider, date, and time are required.' });
      return;
    }

    const appointment = await Appointment.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      title,
      provider,
      date,
      time,
      location,
      notes,
    });

    res.status(201).json({ success: true, message: 'Appointment scheduled.', appointment });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, req.body, { new: true });
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }
    res.status(200).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ success: true, message: 'Appointment cancelled/removed.' });
  } catch (error) {
    next(error);
  }
};
