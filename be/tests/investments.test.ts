import request from 'supertest';
import app from '../src/app';

describe('Investments Endpoints', () => {
  let authToken: string;
  let investmentId: string;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'password123' });
    authToken = loginRes.body.token;
  });

  describe('GET /api/investments', () => {
    it('should return all investments', async () => {
      const res = await request(app).get('/api/investments');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      const inv = res.body[0];
      expect(inv).toHaveProperty('id');
      expect(inv).toHaveProperty('title');
      expect(inv).toHaveProperty('category');
      expect(inv).toHaveProperty('minInvestment');
      expect(inv).toHaveProperty('maxInvestment');
      expect(inv).toHaveProperty('status');
      expect(inv).toHaveProperty('author');
    });

    it('should filter by category', async () => {
      const res = await request(app).get('/api/investments?category=Technology');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((inv: any) => {
        expect(inv.category).toBe('Technology');
      });
    });

    it('should filter by status', async () => {
      const res = await request(app).get('/api/investments?status=Open');

      expect(res.status).toBe(200);
      res.body.forEach((inv: any) => {
        expect(inv.status).toBe('Open');
      });
    });

    it('should search by title', async () => {
      const res = await request(app).get('/api/investments?search=Tech');

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should filter by budget range', async () => {
      const res = await request(app).get('/api/investments?minBudget=50000&maxBudget=500000');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/investments/:id', () => {
    it('should return a specific investment', async () => {
      const listRes = await request(app).get('/api/investments');
      const id = listRes.body[0].id;

      const res = await request(app).get(`/api/investments/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body).toHaveProperty('title');
    });

    it('should return 404 for non-existent id', async () => {
      const res = await request(app).get('/api/investments/non-existent-id');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/investments', () => {
    it('should create investment with valid token', async () => {
      const res = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Investment',
          category: 'Technology',
          summary: 'A test investment opportunity',
          minInvestment: 10000,
          maxInvestment: 100000,
          location: 'Kigali, Rwanda',
          roi: '15% annually',
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Investment');
      expect(res.body.id).toBeDefined();
      investmentId = res.body.id;
    });

    it('should reject without token', async () => {
      const res = await request(app)
        .post('/api/investments')
        .send({
          title: 'Unauthorized Investment',
          category: 'Technology',
          summary: 'Should fail',
          minInvestment: 10000,
          maxInvestment: 100000,
          location: 'Kigali',
          roi: '10%',
        });

      expect(res.status).toBe(401);
    });

    it('should reject with missing required fields', async () => {
      const res = await request(app)
        .post('/api/investments')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Incomplete' });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/investments/:id', () => {
    it('should update own investment', async () => {
      const res = await request(app)
        .put(`/api/investments/${investmentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Test Investment' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Test Investment');
    });

    it('should reject update without token', async () => {
      const res = await request(app)
        .put(`/api/investments/${investmentId}`)
        .send({ title: 'Should Fail' });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/investments/:id', () => {
    it('should delete own investment', async () => {
      const res = await request(app)
        .delete(`/api/investments/${investmentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Investment deleted');
    });

    it('should return 404 for already deleted investment', async () => {
      const res = await request(app)
        .delete(`/api/investments/${investmentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });
});
