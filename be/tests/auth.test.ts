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
          confirmPassword: 'testpass123',
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
          confirmPassword: 'testpass123',
          name: 'Duplicate User',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('User already exists');
    });

    it('should reject missing email', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ password: 'testpass123', confirmPassword: 'testpass123' });

      expect(res.status).toBe(400);
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'short@example.com', password: '123', confirmPassword: '123' });

      expect(res.status).toBe(400);
    });

    it('should reject mismatched passwords', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'mismatch@example.com', password: 'testpass123', confirmPassword: 'differentpass', name: 'Mismatch User' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Passwords do not match');
    });
  });

  describe('POST /auth/login', () => {
    const loginEmail = `login-test-${Date.now()}@example.com`;

    beforeAll(async () => {
      await request(app)
        .post('/auth/register')
        .send({
          email: loginEmail,
          password: 'password123',
          confirmPassword: 'password123',
          name: 'Login Test User',
        });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: loginEmail,
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(loginEmail);
      expect(res.body.user.password).toBeUndefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: loginEmail,
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
    const meEmail = `me-test-${Date.now()}@example.com`;
    let token: string;

    beforeAll(async () => {
      await request(app)
        .post('/auth/register')
        .send({
          email: meEmail,
          password: 'password123',
          confirmPassword: 'password123',
          name: 'Me Test User',
        });

      const loginRes = await request(app)
        .post('/auth/login')
        .send({ email: meEmail, password: 'password123' });

      token = loginRes.body.token;
    });

    it('should return user with valid token', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(meEmail);
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
