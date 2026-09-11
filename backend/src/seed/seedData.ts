import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {
  User,
  Patient,
  FamilyMember,
  Memory,
  Routine,
  Medication,
  Appointment,
  Game,
  GameSession,
  CognitivePerformance,
  Reminder,
  MoodEntry,
  Notification,
} from '../models';

export const seedDatabase = async (force: boolean = false) => {
  if (!force) {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('ℹ️ Database already contains data. Skipping seed.');
      return;
    }
  }

  console.log('🌱 Seeding Smriti NER database with demo accounts and data...');

  // 1. Clear existing collections if force
  if (force) {
    await Promise.all([
      User.deleteMany({}),
      Patient.deleteMany({}),
      FamilyMember.deleteMany({}),
      Memory.deleteMany({}),
      Routine.deleteMany({}),
      Medication.deleteMany({}),
      Appointment.deleteMany({}),
      Game.deleteMany({}),
      GameSession.deleteMany({}),
      CognitivePerformance.deleteMany({}),
      Reminder.deleteMany({}),
      MoodEntry.deleteMany({}),
      Notification.deleteMany({}),
    ]);
  }

  // 2. Hash default passwords
  const salt = await bcrypt.genSalt(10);
  const caregiverPassword = await bcrypt.hash('REDACTED_DEMO_PASSWORD', salt);
  const doctorPassword = await bcrypt.hash('REDACTED_DEMO_PASSWORD', salt);
  const patientPassword = await bcrypt.hash('REDACTED_DEMO_PASSWORD', salt);

  // 3. Create Users
  const caregiverUser = await User.create({
    name: 'Priyadarshini Das',
    email: 'caregiver@smriti.org',
    passwordHash: caregiverPassword,
    role: 'caregiver',
    language: 'en',
  });

  const doctorUser = await User.create({
    name: 'Dr. Hemen Barua',
    email: 'doctor@smriti.org',
    passwordHash: doctorPassword,
    role: 'healthcare_worker',
    language: 'en',
  });

  const patientUser = await User.create({
    name: 'Mrs. Ananya Das',
    email: 'patient@smriti.org',
    passwordHash: patientPassword,
    role: 'patient',
    language: 'as',
  });

  // 4. Create Demo Patient
  const patient = await Patient.create({
    userId: patientUser._id,
    name: 'Mrs. Ananya Das',
    age: 74,
    gender: 'female',
    preferredLanguage: 'as',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    caregiverIds: [caregiverUser._id],
    healthcareWorkerIds: [doctorUser._id],
    preferences: {
      favoriteFood: 'Assamese Masor Tenga (tangy fish curry) and warm Rice',
      favoriteActivity: 'Walking in the veranda and listening to Bihu flute music',
      favoriteMusic: 'Bhupen Hazarika classical songs',
      favoritePlace: 'Tezpur tea gardens and Brahmaputra riverfront',
      hometown: 'Guwahati, Assam',
    },
    medicalNotes:
      'Mild cognitive impairment observed. Highly responsive to familiar regional memories, visual cues, and gentle routines.',
    emergencyContact: {
      name: 'Priyadarshini Das (Daughter)',
      phone: '+91 98765 43210',
      relationship: 'Daughter / Primary Caregiver',
    },
  });

  // 5. Create Family Members
  await FamilyMember.create([
    {
      patientId: patient._id,
      name: 'Priyadarshini Das',
      relationship: 'Daughter',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      notes: 'Lives in Delhi, works as a professor. Calls every evening at 4:30 PM.',
      trivia: 'Loves cooking traditional meals when she visits Guwahati.',
      phone: '+91 98765 43210',
    },
    {
      patientId: patient._id,
      name: 'Rahul Das',
      relationship: 'Son',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      notes: 'Software engineer living in Bengaluru. Visits during Durga Puja.',
      trivia: 'Loves playing guitar and drinking freshly brewed Assam CTC tea.',
      phone: '+91 98765 12345',
    },
    {
      patientId: patient._id,
      name: 'Meera Das',
      relationship: 'Granddaughter',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
      notes: '12 years old, 7th grade. Sends colorful hand-drawn greeting cards.',
      trivia: 'Always asks grandmother to tell stories about Kaziranga rhinos.',
      phone: '',
    },
    {
      patientId: patient._id,
      name: 'Late Bhaskar Das',
      relationship: 'Husband (Loving Memory)',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      notes: 'Retired high school principal in Jorhat. Loved books and gardening.',
      trivia: 'Planted the two beloved lemon (Kaji Nemu) trees in the garden.',
      phone: '',
    },
  ]);

  // 6. Create Personal Memories
  await Memory.create([
    {
      patientId: patient._id,
      title: 'Spring Tea Garden Harvest in Tezpur',
      description:
        'Walking amidst lush green tea bushes during spring morning mist with Bhaskar. The fresh aroma of tea leaves and song of cuckoo birds.',
      category: 'places',
      date: 'Spring 1984',
      photoUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80',
      createdBy: caregiverUser._id,
    },
    {
      patientId: patient._id,
      title: 'Kaziranga National Park Family Trip',
      description:
        'A wonderful road trip where the whole family saw wild one-horned rhinos grazing near the water bodies. Rahul and Priyadarshini were so excited!',
      category: 'family',
      date: 'Winter 1998',
      photoUrl: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600&q=80',
      createdBy: caregiverUser._id,
    },
    {
      patientId: patient._id,
      title: 'Rongali Bihu Sweets & Pitha Making',
      description:
        'Preparing Til Pitha and Narikol Ladoo together in the kitchen while listening to the sweet melody of the Pepa and Bihu Dhol in the neighborhood.',
      category: 'culture',
      date: 'April 2012',
      photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
      createdBy: caregiverUser._id,
    },
    {
      patientId: patient._id,
      title: "Priyadarshini's Master's Degree Convocation",
      description:
        'A proud day celebrating daughter Priyadarshini graduating with honors in Delhi. We wore traditional Muga silk mekhela sador.',
      category: 'achievements',
      date: 'December 2016',
      photoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
      createdBy: caregiverUser._id,
    },
  ]);

  // 7. Create Daily Routine
  await Routine.create([
    {
      patientId: patient._id,
      time: '07:30 AM',
      activity: 'Morning Gentle Walk',
      description: 'Stroll in the veranda garden with fresh morning air.',
      recurrence: 'daily',
      active: true,
      order: 1,
    },
    {
      patientId: patient._id,
      time: '08:30 AM',
      activity: 'Healthy Breakfast',
      description: 'Warm porridge or pitha with fresh Assam CTC tea.',
      recurrence: 'daily',
      active: true,
      order: 2,
    },
    {
      patientId: patient._id,
      time: '09:15 AM',
      activity: 'Morning Medication',
      description: 'Donepezil 5mg & multivitamin with a tall glass of water.',
      recurrence: 'daily',
      active: true,
      order: 3,
    },
    {
      patientId: patient._id,
      time: '10:30 AM',
      activity: 'Cognitive Game & Memory Time',
      description: 'Play Memory Match or Object Recognition on Smriti platform.',
      recurrence: 'daily',
      active: true,
      order: 4,
    },
    {
      patientId: patient._id,
      time: '01:00 PM',
      activity: 'Wholesome Lunch & Rest',
      description: 'Steamed rice with dal, vegetables, and post-lunch afternoon nap.',
      recurrence: 'daily',
      active: true,
      order: 5,
    },
    {
      patientId: patient._id,
      time: '04:30 PM',
      activity: 'Evening Tea & Family Call',
      description: 'Call Priyadarshini and Rahul over tea.',
      recurrence: 'daily',
      active: true,
      order: 6,
    },
    {
      patientId: patient._id,
      time: '08:00 PM',
      activity: 'Nutritious Dinner',
      description: 'Light dinner and pleasant conversation.',
      recurrence: 'daily',
      active: true,
      order: 7,
    },
    {
      patientId: patient._id,
      time: '09:00 PM',
      activity: 'Night Medication & Bedtime',
      description: 'Blood pressure medication and restful sleep.',
      recurrence: 'daily',
      active: true,
      order: 8,
    },
  ]);

  // 8. Create Medications
  await Medication.create([
    {
      patientId: patient._id,
      name: 'Donepezil',
      dosage: '5mg tablet',
      schedule: ['09:15 AM'],
      instructions: 'Take once daily after breakfast with plenty of water.',
      notes: 'Prescribed by Dr. Hemen Barua for cognitive memory support.',
      active: true,
    },
    {
      patientId: patient._id,
      name: 'Multivitamin & B-Complex',
      dosage: '1 capsule',
      schedule: ['09:15 AM'],
      instructions: 'Take with morning breakfast.',
      notes: 'General vitality and neurological support.',
      active: true,
    },
    {
      patientId: patient._id,
      name: 'Calcium & Vitamin D3',
      dosage: '500mg chewable',
      schedule: ['01:30 PM'],
      instructions: 'Take after lunch.',
      notes: 'Bone strength and daily mineral balance.',
      active: true,
    },
    {
      patientId: patient._id,
      name: 'Amlodipine',
      dosage: '5mg tablet',
      schedule: ['09:00 PM'],
      instructions: 'Take before sleeping.',
      notes: 'Blood pressure maintenance.',
      active: true,
    },
  ]);

  // 9. Create Appointments
  await Appointment.create([
    {
      patientId: patient._id,
      title: 'Neurological Follow-up & Cognitive Review',
      provider: 'Dr. Hemen Barua (Neurologist)',
      date: '2026-09-22',
      time: '11:00 AM',
      location: 'Apollo Hospitals, Christian Basti, G.S. Road, Guwahati',
      notes: 'Bring recent game engagement summaries from Smriti caregiver portal.',
      completed: false,
    },
    {
      patientId: patient._id,
      title: 'Routine Eye & Vision Check',
      provider: 'Dr. P. Kakati',
      date: '2026-10-05',
      time: '03:30 PM',
      location: 'Guwahati Eye Care Clinic',
      notes: 'Annual reading glass power review.',
      completed: false,
    },
  ]);

  // 10. Create 5 Game Catalog entries
  await Game.create([
    {
      gameId: 'memory-match',
      name: 'Memory Match (স্মৃতি মিলোৱা)',
      category: 'memory',
      description: 'Flip and pair familiar cultural and everyday objects from the North East.',
      difficultyLevels: [1, 2, 3, 4, 5],
      active: true,
    },
    {
      gameId: 'object-recognition',
      name: 'Object Recognition (বস্তু চিনাকি)',
      category: 'recognition',
      description: 'Identify familiar household, cultural, and natural items with large readable choices.',
      difficultyLevels: [1, 2, 3, 4, 5],
      active: true,
    },
    {
      gameId: 'pattern-completion',
      name: 'Pattern Completion (বিন্যাস সম্পূৰ্ণ কৰা)',
      category: 'pattern',
      description: 'Spot the sequence of harmonious colors, shapes, and regional symbols.',
      difficultyLevels: [1, 2, 3, 4, 5],
      active: true,
    },
    {
      gameId: 'routine-recall',
      name: 'Daily Routine Recall (দৈনিক ক্ৰম মনত পেলোৱা)',
      category: 'routine',
      description: 'Answer simple, reassuring questions about your own personal daily schedule.',
      difficultyLevels: [1, 2, 3],
      active: true,
    },
    {
      gameId: 'family-memory',
      name: 'Family & Loved Ones Memory (পৰিয়ালৰ স্মৃতি)',
      category: 'memory',
      description: 'Connect with beloved family photographs, names, and cherished relationships.',
      difficultyLevels: [1, 2, 3],
      active: true,
    },
  ]);

  // 11. Create 15+ Historical Game Sessions spread over past 14 days
  const now = new Date();
  const gameSessionsToCreate = [];
  const cognitivePerformances = [];

  const gameIds = [
    'memory-match',
    'object-recognition',
    'pattern-completion',
    'routine-recall',
    'family-memory',
  ];

  for (let i = 14; i >= 0; i--) {
    const sessionDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000);
    // 1-2 sessions per day
    const gId = gameIds[i % gameIds.length];
    const difficulty = i > 7 ? 1 : i > 2 ? 2 : 2;
    const accuracy = 75 + Math.round(Math.random() * 20); // 75 - 95
    const responseTime = Number((3.5 + Math.random() * 4).toFixed(1)); // 3.5s - 7.5s
    const score = Math.round(0.6 * accuracy + 0.4 * (100 - responseTime * 8));

    const sess = await GameSession.create({
      patientId: patient._id,
      gameId: gId,
      difficulty,
      score: Math.max(55, Math.min(100, score)),
      accuracy,
      responseTime,
      attempts: 1,
      mistakes: accuracy > 85 ? 0 : 1,
      completed: true,
      startedAt: new Date(sessionDate.getTime() - Math.round(responseTime * 1000)),
      completedAt: sessionDate,
    });

    cognitivePerformances.push({
      patientId: patient._id,
      category: gId === 'memory-match' || gId === 'family-memory' ? 'memory' : gId === 'object-recognition' ? 'recognition' : gId === 'pattern-completion' ? 'pattern' : 'routine',
      score: sess.score,
      date: sessionDate,
      sourceGameSessions: [sess._id],
    });
  }

  await CognitivePerformance.insertMany(cognitivePerformances);

  // 12. Create Reminders for Today
  const todayStr = new Date().toISOString().split('T')[0];
  await Reminder.create([
    {
      patientId: patient._id,
      type: 'medicine',
      title: 'Morning Medicine (Donepezil & Multivitamin)',
      description: 'Take after breakfast with a full glass of water.',
      scheduledTime: '09:15 AM',
      recurrence: 'daily',
      status: 'completed',
      date: todayStr,
    },
    {
      patientId: patient._id,
      type: 'hydration',
      title: 'Hydration: Fresh Glass of Water',
      description: 'Stay refreshed and hydrated throughout the morning.',
      scheduledTime: '11:00 AM',
      recurrence: 'daily',
      status: 'completed',
      date: todayStr,
    },
    {
      patientId: patient._id,
      type: 'activity',
      title: 'Brain Exercise Time on Smriti',
      description: 'Spend 10 minutes enjoying Memory Match.',
      scheduledTime: '11:30 AM',
      recurrence: 'daily',
      status: 'completed',
      date: todayStr,
    },
    {
      patientId: patient._id,
      type: 'hydration',
      title: 'Hydration: Afternoon Warm Water or Tea',
      description: 'A comforting cup of warm water or light herbal tea.',
      scheduledTime: '03:30 PM',
      recurrence: 'daily',
      status: 'pending',
      date: todayStr,
    },
    {
      patientId: patient._id,
      type: 'medicine',
      title: 'Evening Blood Pressure Tablet (Amlodipine)',
      description: 'Take with water before resting.',
      scheduledTime: '09:00 PM',
      recurrence: 'daily',
      status: 'pending',
      date: todayStr,
    },
  ]);

  // 13. Create Mood History
  await MoodEntry.create([
    {
      patientId: patient._id,
      mood: 'good',
      optionalNote: 'Felt cheerful after morning garden walk and tea.',
      date: new Date(),
    },
    {
      patientId: patient._id,
      mood: 'good',
      optionalNote: 'Enjoyed looking at Kaziranga photo album.',
      date: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      patientId: patient._id,
      mood: 'okay',
      optionalNote: 'Slight fatigue in the afternoon, rested comfortably.',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);

  // 14. Create Notifications / Alerts
  await Notification.create([
    {
      patientId: patient._id,
      caregiverId: caregiverUser._id,
      type: 'milestone',
      title: 'Consistent Activity Milestone',
      message: 'Mrs. Ananya Das has completed daily cognitive exercises for 7 consecutive days!',
      read: false,
    },
    {
      patientId: patient._id,
      caregiverId: caregiverUser._id,
      type: 'reminder',
      title: 'Upcoming Neurologist Consultation',
      message: 'Appointment with Dr. Hemen Barua is scheduled for Tuesday, 2026-09-22 at 11:00 AM.',
      read: true,
    },
  ]);

  console.log('✅ Seed completed successfully!');
  console.log('----------------------------------------------------');
  console.log('DEMO ACCOUNTS READY:');
  console.log('1. Caregiver:         caregiver@smriti.org  /  REDACTED_DEMO_PASSWORD');
  console.log('2. Healthcare Worker: doctor@smriti.org     /  REDACTED_DEMO_PASSWORD');
  console.log('3. Patient:           patient@smriti.org    /  REDACTED_DEMO_PASSWORD');
  console.log('Demo Patient:         Mrs. Ananya Das (ID: ' + patient._id + ')');
  console.log('----------------------------------------------------');
};

export const seedDatabaseIfEmpty = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await seedDatabase(false);
  }
};
