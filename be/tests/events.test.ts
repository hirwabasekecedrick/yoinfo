import request from 'supertest';
import app from '../src/app';

describe('Events Endpoints', () => {
  let authToken: string;
  let eventId: string;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'password123' });
    authToken = loginRes.body.token;
  });

  describe('GET /api/events', () => {
    it('should return all events', async () => {
      const res = await request(app).get('/api/events');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/events', () => {
    it('should create event with valid token', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Tech Conference',
          description: 'A test conference',
          date: '2026-12-01T10:00:00.000Z',
          location: 'Kigali Convention Centre',
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Tech Conference');
      expect(res.body.id).toBeDefined();
      eventId = res.body.id;
    });

    it('should reject without token', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({ title: 'Unauthorized Event', date: '2026-12-01' });

      expect(res.status).toBe(401);
    });

    it('should reject with missing title', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ date: '2026-12-01' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/events/:eventId/register', () => {
    it('should register for an event', async () => {
      const res = await request(app)
        .post(`/api/events/${eventId}/register`)
        .send({
          name: 'Test Registrant',
          email: `registrant-${Date.now()}@example.com`,
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Test Registrant');
    });

    it('should reject duplicate registration', async () => {
      const email = `dup-${Date.now()}@example.com`;

      await request(app)
        .post(`/api/events/${eventId}/register`)
        .send({ name: 'First', email });

      const res = await request(app)
        .post(`/api/events/${eventId}/register`)
        .send({ name: 'Second', email });

      expect(res.status).toBe(409);
    });

    it('should reject with missing fields', async () => {
      const res = await request(app)
        .post(`/api/events/${eventId}/register`)
        .send({ name: 'Only Name' });

      expect(res.status).toBe(400);
    });
  });
});
