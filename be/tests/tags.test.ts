import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/db';

describe('Tags Endpoints', () => {
  beforeAll(async () => {
    await prisma.tag.upsert({
      where: { name: 'test_seed_tag' },
      update: {},
      create: { name: 'test_seed_tag', label: 'Test Seed Tag' },
    });
    await prisma.tag.upsert({
      where: { name: 'alpha_tag' },
      update: {},
      create: { name: 'alpha_tag', label: 'Alpha Tag' },
    });
  });

  describe('GET /api/tags', () => {
    it('should return all tags', async () => {
      const res = await request(app).get('/api/tags');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      const tag = res.body[0];
      expect(tag).toHaveProperty('id');
      expect(tag).toHaveProperty('name');
      expect(tag).toHaveProperty('label');
    });

    it('should return tags sorted by label', async () => {
      const res = await request(app).get('/api/tags');

      expect(res.status).toBe(200);
      const labels = res.body.map((t: any) => t.label);
      const sorted = [...labels].sort();
      expect(labels).toEqual(sorted);
    });
  });
});
