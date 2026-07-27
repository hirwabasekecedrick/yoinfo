import request from 'supertest';
import app from '../src/app';
import { registerAndLogin } from './helpers';

describe('Posts Endpoints', () => {
  let authToken: string;
  let postId: string;

  beforeAll(async () => {
    const { token } = await registerAndLogin();
    authToken = token;

    await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ content: 'Seed post for GET tests' });
  });

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const res = await request(app).get('/posts');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);

      const post = res.body[0];
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('author');
      expect(post.author).toHaveProperty('name');
    });
  });

  describe('POST /posts', () => {
    it('should create a post with valid token', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test post from integration test',
        });

      expect(res.status).toBe(201);
      expect(res.body.content).toBe('Test post from integration test');
      expect(res.body.id).toBeDefined();
      postId = res.body.id;
    });

    it('should reject without token', async () => {
      const res = await request(app)
        .post('/posts')
        .send({ content: 'Unauthorized post' });

      expect(res.status).toBe(401);
    });

    it('should create a post with tags', async () => {
      const tagsRes = await request(app).get('/api/tags');
      const tagId = tagsRes.body[0]?.id;

      if (tagId) {
        const res = await request(app)
          .post('/posts')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            content: 'Post with a tag',
            tags: [tagId],
          });

        expect(res.status).toBe(201);
        expect(res.body.tags.length).toBeGreaterThan(0);
      }
    });

    it('should create a post with links', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Post with a link',
          links: [{ url: 'https://example.com', title: 'Example' }],
        });

      expect(res.status).toBe(201);
      expect(res.body.links.length).toBe(1);
      expect(res.body.links[0].url).toBe('https://example.com');
    });
  });
});
