import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Memory, FamilyMember } from '../models';

// ==========================================
// MEMORIES CRUD
// ==========================================
export const getMemories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const memories = await Memory.find({ patientId: new mongoose.Types.ObjectId(patientId) }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, count: memories.length, memories });
  } catch (error) {
    next(error);
  }
};

export const createMemory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const { title, description, category = 'family', date, photoUrl } = req.body;

    if (!title || !description) {
      res.status(400).json({ success: false, message: 'Title and description are required.' });
      return;
    }

    const memory = await Memory.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      title,
      description,
      category,
      date,
      photoUrl,
    });

    res.status(201).json({ success: true, message: 'Memory recorded.', memory });
  } catch (error) {
    next(error);
  }
};

export const updateMemory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { memoryId } = req.params;
    const memory = await Memory.findByIdAndUpdate(memoryId, req.body, { new: true });
    if (!memory) {
      res.status(404).json({ success: false, message: 'Memory not found' });
      return;
    }
    res.status(200).json({ success: true, memory });
  } catch (error) {
    next(error);
  }
};

export const deleteMemory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { memoryId } = req.params;
    await Memory.findByIdAndDelete(memoryId);
    res.status(200).json({ success: true, message: 'Memory removed.' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// FAMILY MEMBERS CRUD
// ==========================================
export const getFamilyMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const familyMembers = await FamilyMember.find({
      patientId: new mongoose.Types.ObjectId(patientId),
    });
    res.status(200).json({ success: true, count: familyMembers.length, familyMembers });
  } catch (error) {
    next(error);
  }
};

export const createFamilyMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id: patientId } = req.params;
    const { name, relationship, photo, notes, trivia, phone } = req.body;

    if (!name || !relationship) {
      res.status(400).json({ success: false, message: 'Name and relationship are required.' });
      return;
    }

    const familyMember = await FamilyMember.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      name,
      relationship,
      photo,
      notes,
      trivia,
      phone,
    });

    res.status(201).json({ success: true, message: 'Family member profile added.', familyMember });
  } catch (error) {
    next(error);
  }
};

export const updateFamilyMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { familyId } = req.params;
    const familyMember = await FamilyMember.findByIdAndUpdate(familyId, req.body, { new: true });
    if (!familyMember) {
      res.status(404).json({ success: false, message: 'Family member not found' });
      return;
    }
    res.status(200).json({ success: true, familyMember });
  } catch (error) {
    next(error);
  }
};

export const deleteFamilyMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { familyId } = req.params;
    await FamilyMember.findByIdAndDelete(familyId);
    res.status(200).json({ success: true, message: 'Family member profile removed.' });
  } catch (error) {
    next(error);
  }
};
