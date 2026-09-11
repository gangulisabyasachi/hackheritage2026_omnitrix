import mongoose, { Document, Schema, Model } from 'mongoose';

// ==========================================
// 1. USER MODEL
// ==========================================
export type UserRole = 'patient' | 'caregiver' | 'healthcare_worker';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  language: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'caregiver', 'healthcare_worker'], default: 'caregiver' },
  language: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
});

// ==========================================
// 2. PATIENT MODEL
// ==========================================
export interface IPatientPreferences {
  favoriteFood?: string;
  favoriteActivity?: string;
  favoriteMusic?: string;
  favoritePlace?: string;
  hometown?: string;
}

export interface IPatient extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  age: number;
  gender?: string;
  preferredLanguage: string;
  profileImage?: string;
  caregiverIds: mongoose.Types.ObjectId[];
  healthcareWorkerIds: mongoose.Types.ObjectId[];
  preferences: IPatientPreferences;
  medicalNotes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, default: 'female' },
  preferredLanguage: { type: String, default: 'as' }, // default Assamese / regional
  profileImage: { type: String, default: '' },
  caregiverIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  healthcareWorkerIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  preferences: {
    favoriteFood: { type: String, default: '' },
    favoriteActivity: { type: String, default: '' },
    favoriteMusic: { type: String, default: '' },
    favoritePlace: { type: String, default: '' },
    hometown: { type: String, default: '' },
  },
  medicalNotes: { type: String, default: '' },
  emergencyContact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relationship: { type: String, default: '' },
  },
  createdAt: { type: Date, default: Date.now },
});

// ==========================================
// 3. FAMILY MEMBER MODEL
// ==========================================
export interface IFamilyMember extends Document {
  patientId: mongoose.Types.ObjectId;
  name: string;
  relationship: string;
  photo?: string;
  notes?: string;
  trivia?: string;
  phone?: string;
}

const FamilyMemberSchema = new Schema<IFamilyMember>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  photo: { type: String, default: '' },
  notes: { type: String, default: '' },
  trivia: { type: String, default: '' },
  phone: { type: String, default: '' },
});

// ==========================================
// 4. PERSONAL MEMORY MODEL
// ==========================================
export interface IMemory extends Document {
  patientId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'childhood' | 'family' | 'places' | 'culture' | 'achievements' | 'general';
  date?: string;
  photoUrl?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const MemorySchema = new Schema<IMemory>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['childhood', 'family', 'places', 'culture', 'achievements', 'general'],
    default: 'family',
  },
  date: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

// ==========================================
// 5. ROUTINE MODEL
// ==========================================
export interface IRoutine extends Document {
  patientId: mongoose.Types.ObjectId;
  time: string; // e.g. "08:00 AM"
  activity: string; // e.g. "Morning Walk"
  description?: string;
  recurrence: string; // "daily" | "weekdays" | "weekends"
  active: boolean;
  order: number;
}

const RoutineSchema = new Schema<IRoutine>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  time: { type: String, required: true },
  activity: { type: String, required: true },
  description: { type: String, default: '' },
  recurrence: { type: String, default: 'daily' },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

// ==========================================
// 6. MEDICATION MODEL
// ==========================================
export interface IMedication extends Document {
  patientId: mongoose.Types.ObjectId;
  name: string;
  dosage: string;
  schedule: string[]; // e.g. ["09:00 AM", "09:00 PM"]
  instructions?: string;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
  active: boolean;
}

const MedicationSchema = new Schema<IMedication>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  schedule: [{ type: String }],
  instructions: { type: String, default: 'Take with water after meals' },
  startDate: { type: Date },
  endDate: { type: Date },
  notes: { type: String, default: '' },
  active: { type: Boolean, default: true },
});

// ==========================================
// 7. APPOINTMENT MODEL
// ==========================================
export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  title: string;
  provider: string;
  date: string; // e.g. "2026-09-18"
  time: string; // e.g. "11:00 AM"
  location: string;
  notes?: string;
  completed: boolean;
}

const AppointmentSchema = new Schema<IAppointment>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  title: { type: String, required: true },
  provider: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, default: 'Clinic' },
  notes: { type: String, default: '' },
  completed: { type: Boolean, default: false },
});

// ==========================================
// 8. GAME MODEL (Catalog)
// ==========================================
export interface IGame extends Document {
  gameId: string; // 'memory-match' | 'object-recognition' | 'pattern-completion' | 'routine-recall' | 'family-memory'
  name: string;
  category: 'memory' | 'attention' | 'pattern' | 'recognition' | 'routine';
  description: string;
  difficultyLevels: number[];
  active: boolean;
}

const GameSchema = new Schema<IGame>({
  gameId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['memory', 'attention', 'pattern', 'recognition', 'routine'],
    required: true,
  },
  description: { type: String, required: true },
  difficultyLevels: { type: [Number], default: [1, 2, 3, 4, 5] },
  active: { type: Boolean, default: true },
});

// ==========================================
// 9. GAME SESSION MODEL
// ==========================================
export interface IGameSession extends Document {
  patientId: mongoose.Types.ObjectId;
  gameId: string;
  difficulty: number;
  score: number; // 0 - 100
  accuracy: number; // percentage 0 - 100
  responseTime: number; // seconds
  attempts: number;
  mistakes: number;
  completed: boolean;
  startedAt: Date;
  completedAt: Date;
  metadata?: Record<string, any>;
}

const GameSessionSchema = new Schema<IGameSession>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  gameId: { type: String, required: true, index: true },
  difficulty: { type: Number, required: true, default: 1 },
  score: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  attempts: { type: Number, default: 1 },
  mistakes: { type: Number, default: 0 },
  completed: { type: Boolean, default: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed },
});

// ==========================================
// 10. COGNITIVE PERFORMANCE MODEL
// ==========================================
export interface ICognitivePerformance extends Document {
  patientId: mongoose.Types.ObjectId;
  category: 'memory' | 'attention' | 'pattern' | 'recognition' | 'routine' | 'overall';
  score: number;
  date: Date;
  sourceGameSessions: mongoose.Types.ObjectId[];
}

const CognitivePerformanceSchema = new Schema<ICognitivePerformance>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  category: {
    type: String,
    enum: ['memory', 'attention', 'pattern', 'recognition', 'routine', 'overall'],
    required: true,
  },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now, index: true },
  sourceGameSessions: [{ type: Schema.Types.ObjectId, ref: 'GameSession' }],
});

// ==========================================
// 11. REMINDER MODEL
// ==========================================
export interface IReminder extends Document {
  patientId: mongoose.Types.ObjectId;
  type: 'medicine' | 'hydration' | 'activity' | 'appointment';
  title: string;
  description?: string;
  scheduledTime: string;
  recurrence: string;
  status: 'pending' | 'completed' | 'missed' | 'snoozed';
  date: string;
}

const ReminderSchema = new Schema<IReminder>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  type: {
    type: String,
    enum: ['medicine', 'hydration', 'activity', 'appointment'],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  scheduledTime: { type: String, required: true },
  recurrence: { type: String, default: 'daily' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'missed', 'snoozed'],
    default: 'pending',
  },
  date: { type: String, required: true },
});

// ==========================================
// 12. MOOD ENTRY MODEL
// ==========================================
export interface IMoodEntry extends Document {
  patientId: mongoose.Types.ObjectId;
  mood: 'good' | 'okay' | 'not_well';
  date: Date;
  optionalNote?: string;
}

const MoodEntrySchema = new Schema<IMoodEntry>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  mood: { type: String, enum: ['good', 'okay', 'not_well'], required: true },
  date: { type: Date, default: Date.now },
  optionalNote: { type: String, default: '' },
});

// ==========================================
// 13. NOTIFICATION / ALERT MODEL
// ==========================================
export interface INotification extends Document {
  patientId: mongoose.Types.ObjectId;
  caregiverId?: mongoose.Types.ObjectId;
  type: 'performance_change' | 'missed_activity' | 'reminder' | 'milestone';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
  caregiverId: { type: Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['performance_change', 'missed_activity', 'reminder', 'milestone'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Export Models
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Patient: Model<IPatient> = mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
export const FamilyMember: Model<IFamilyMember> = mongoose.models.FamilyMember || mongoose.model<IFamilyMember>('FamilyMember', FamilyMemberSchema);
export const Memory: Model<IMemory> = mongoose.models.Memory || mongoose.model<IMemory>('Memory', MemorySchema);
export const Routine: Model<IRoutine> = mongoose.models.Routine || mongoose.model<IRoutine>('Routine', RoutineSchema);
export const Medication: Model<IMedication> = mongoose.models.Medication || mongoose.model<IMedication>('Medication', MedicationSchema);
export const Appointment: Model<IAppointment> = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
export const Game: Model<IGame> = mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);
export const GameSession: Model<IGameSession> = mongoose.models.GameSession || mongoose.model<IGameSession>('GameSession', GameSessionSchema);
export const CognitivePerformance: Model<ICognitivePerformance> = mongoose.models.CognitivePerformance || mongoose.model<ICognitivePerformance>('CognitivePerformance', CognitivePerformanceSchema);
export const Reminder: Model<IReminder> = mongoose.models.Reminder || mongoose.model<IReminder>('Reminder', ReminderSchema);
export const MoodEntry: Model<IMoodEntry> = mongoose.models.MoodEntry || mongoose.model<IMoodEntry>('MoodEntry', MoodEntrySchema);
export const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
