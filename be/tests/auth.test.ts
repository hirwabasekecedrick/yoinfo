import request from 'supertest';
import app from '../src/app';

describe('Auth Endpoints', () => {
  const uniqueEmail = `auth-test-${Date.now()}@example.com`;

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: uniqueEmail,
          password: 'testpass123',
          name: 'Auth Test User',
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User created successfully');
    });

    it('should reject duplicate email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: uniqueEmail,
          password: 'testpass123',
          name: 'Duplicate User',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('User already exists');
    });

    it('should reject missing email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ password: 'testpass123' });

      expect(res.status).toBe(400);
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'short@example.com', password: '123' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('alice@example.com');
      expect(res.body.user.password).toBeUndefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'alice@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid email or password');
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid email or password');
    });
  });

  describe('GET /auth/me', () => {
    it('should return user with valid token', async () => {
      const loginRes = await request(app)
        .post('/auth/login')
        .send({ email: 'alice@example.com', password: 'password123' });

      const token = loginRes.body.token;

      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('alice@example.com');
    });

    it('should reject without token', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.status).toBe(401);
    });

    it('should reject with invalid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(res.status).toBe(400);
    });
  });
});
