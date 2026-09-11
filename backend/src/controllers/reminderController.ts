import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Reminder, MoodEntry, Notification } from '../models';

// ==========================================
// REMINDERS
// ==========================================
export const getReminders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const reminders = await Reminder.find({
      patientId: new mongoose.Types.ObjectId(patientId),
    }).sort({ scheduledTime: 1 });
    res.status(200).json({ success: true, count: reminders.length, reminders });
  } catch (error) {
    next(error);
  }
};

export const createReminder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const { type, title, description = '', scheduledTime, recurrence = 'daily' } = req.body;

    if (!type || !title || !scheduledTime) {
      res.status(400).json({ success: false, message: 'Type, title, and scheduledTime are required.' });
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const reminder = await Reminder.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      type,
      title,
      description,
      scheduledTime,
      recurrence,
      status: 'pending',
      date: todayStr,
    });

    res.status(201).json({ success: true, message: 'Reminder created.', reminder });
  } catch (error) {
    next(error);
  }
};

export const updateReminderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reminderId } = req.params;
    const { status } = req.body;

    const reminder = await Reminder.findByIdAndUpdate(reminderId, { status }, { new: true });
    if (!reminder) {
      res.status(404).json({ success: false, message: 'Reminder not found' });
      return;
    }
    res.status(200).json({ success: true, reminder });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// MOOD CHECK-IN
// ==========================================
export const submitMood = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const { mood, optionalNote = '' } = req.body;

    if (!['good', 'okay', 'not_well'].includes(mood)) {
      res.status(400).json({ success: false, message: 'Mood must be "good", "okay", or "not_well".' });
      return;
    }

    const moodEntry = await MoodEntry.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      mood,
      optionalNote,
      date: new Date(),
    });

    res.status(201).json({ success: true, message: 'Mood recorded.', moodEntry });
  } catch (error) {
    next(error);
  }
};

export const getMoodHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const moods = await MoodEntry.find({
      patientId: new mongoose.Types.ObjectId(patientId),
    })
      .sort({ date: -1 })
      .limit(14);

    res.status(200).json({ success: true, moods });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// NOTIFICATIONS / ALERTS
// ==========================================
export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const notifications = await Notification.find({
      patientId: new mongoose.Types.ObjectId(patientId),
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: notifications.length, notifications });
  } catch (error) {
    next(error);
  }
};
