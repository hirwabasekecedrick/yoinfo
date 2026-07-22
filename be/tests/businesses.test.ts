import request from 'supertest';
import app from '../src/app';

describe('Businesses Endpoints', () => {
  let authToken: string;
  let businessId: string;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'password123' });
    authToken = loginRes.body.token;
  });

  describe('GET /api/businesses', () => {
    it('should return all businesses', async () => {
      const res = await request(app).get('/api/businesses');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      const biz = res.body[0];
      expect(biz).toHaveProperty('id');
      expect(biz).toHaveProperty('name');
      expect(biz).toHaveProperty('category');
      expect(biz).toHaveProperty('author');
    });

    it('should filter by category', async () => {
      const res = await request(app).get('/api/businesses?category=Technology');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((biz: any) => {
        expect(biz.category).toBe('Technology');
      });
    });

    it('should search by name', async () => {
      const res = await request(app).get('/api/businesses?search=HeHe');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('HeHe Labs');
    });

    it('should search by description', async () => {
      const res = await request(app).get('/api/businesses?search=coffee');

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/businesses/:id', () => {
    it('should return a specific business', async () => {
      const listRes = await request(app).get('/api/businesses');
      const id = listRes.body[0].id;

      const res = await request(app).get(`/api/businesses/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body).toHaveProperty('name');
    });

    it('should return 404 for non-existent id', async () => {
      const res = await request(app).get('/api/businesses/non-existent-id');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/businesses', () => {
    it('should create business with valid token', async () => {
      const res = await request(app)
        .post('/api/businesses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Business',
          category: 'Technology',
          tagline: 'A test business',
          description: 'Test business description',
          phone: '+250 788 000 000',
          email: 'test@business.rw',
          city: 'Kigali',
          country: 'Rwanda',
          services: ['Service A', 'Service B'],
        });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Test Business');
      expect(res.body.id).toBeDefined();
      businessId = res.body.id;
    });

    it('should reject without token', async () => {
      const res = await request(app)
        .post('/api/businesses')
        .send({ name: 'Unauthorized Biz', category: 'Tech' });

      expect(res.status).toBe(401);
    });

    it('should reject with missing required fields', async () => {
      const res = await request(app)
        .post('/api/businesses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Incomplete' });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/businesses/:id', () => {
    it('should update own business', async () => {
      const res = await request(app)
        .put(`/api/businesses/${businessId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Test Business' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Test Business');
    });

    it('should reject update without token', async () => {
      const res = await request(app)
        .put(`/api/businesses/${businessId}`)
        .send({ name: 'Should Fail' });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/businesses/:id', () => {
    it('should delete own business', async () => {
      const res = await request(app)
        .delete(`/api/businesses/${businessId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Business deleted');
    });

    it('should return 404 for already deleted business', async () => {
      const res = await request(app)
        .delete(`/api/businesses/${businessId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });
});
