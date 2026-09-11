import request from 'supertest';
import app from '../server';
import { connectDB, disconnectDB } from '../config/db';
import { seedDatabase } from '../seed/seedData';
import { Patient, Game } from '../models';

describe('Smriti API Integration Tests', () => {
  let caregiverToken: string;
  let patientId: string;

  beforeAll(async () => {
    await connectDB();
    await seedDatabase(true);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'caregiver@smriti.org',
      password: 'REDACTED_DEMO_PASSWORD',
    });

    caregiverToken = loginRes.body.token;

    const patient = await Patient.findOne({ name: 'Mrs. Ananya Das' });
    patientId = patient!._id.toString();
  }, 30000);

  afterAll(async () => {
    await disconnectDB();
  });

  it('GET /api/health returns online status and medical disclaimer', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('online');
    expect(res.body.medicalDisclaimer).toContain('does not replace professional medical diagnosis');
  });

  it('POST /api/auth/login succeeds for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'caregiver@smriti.org',
      password: 'REDACTED_DEMO_PASSWORD',
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('caregiver');
  });

  it('GET /api/patients requires authorization', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.status).toBe(401);
  });

  it('GET /api/patients succeeds with caregiver token', async () => {
    const res = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${caregiverToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.patients.length).toBeGreaterThan(0);
  });

  it('GET /api/games returns active game catalog', async () => {
    const res = await request(app).get('/api/games');
    expect(res.status).toBe(200);
    expect(res.body.games.length).toBe(5);
  });

  it('POST /api/games/:id/session saves session and runs adaptive difficulty', async () => {
    const res = await request(app)
      .post('/api/games/memory-match/session')
      .send({
        patientId,
        difficulty: 1,
        score: 92,
        accuracy: 94,
        responseTime: 2.8,
        attempts: 1,
        mistakes: 0,
        completed: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.session).toBeDefined();
    expect(res.body.adaptiveRecommendation).toBeDefined();
    expect(res.body.adaptiveRecommendation.recommendedDifficulty).toBeGreaterThanOrEqual(1);
  });

  it('POST /api/ai/memory-assistant returns grounded response for patient', async () => {
    const res = await request(app)
      .post('/api/ai/memory-assistant')
      .send({
        patientId,
        query: 'What is my morning routine?',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.response.toLowerCase()).toContain('breakfast');
  });
});
