import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app';

const JWT_SECRET = process.env.JWT_SECRET || 'infopulse-super-secret-jwt-key-change-in-production';

export function generateToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export const TEST_USER = {
  id: 'test-user-id-001',
  email: 'testuser@example.com',
  role: 'USER',
};

export const TEST_POSTER = {
  id: 'test-poster-id-001',
  email: 'testposter@example.com',
  role: 'POSTER',
};

export const TEST_ADMIN = {
  id: 'test-admin-id-001',
  email: 'testadmin@example.com',
  role: 'ADMIN',
};

export function userToken(): string {
  return generateToken(TEST_USER);
}

export function posterToken(): string {
  return generateToken(TEST_POSTER);
}

export function adminToken(): string {
  return generateToken(TEST_ADMIN);
}

let testCounter = 0;

export async function registerAndLogin(role: string = 'POSTER'): Promise<{ token: string; userId: string; email: string }> {
  const unique = Date.now() + '-' + (testCounter++);
  const email = `test-${unique}@example.com`;
  const password = 'testpass123';

  const registerRes = await request(app)
    .post('/auth/register')
    .send({
      email,
      password,
      confirmPassword: password,
      name: `Test User ${unique}`,
      role,
    });

  if (registerRes.status !== 201) {
    throw new Error(`Failed to register test user: ${registerRes.status} ${JSON.stringify(registerRes.body)}`);
  }

  const loginRes = await request(app)
    .post('/auth/login')
    .send({ email, password });

  if (loginRes.status !== 200) {
    throw new Error(`Failed to login test user: ${loginRes.status} ${JSON.stringify(loginRes.body)}`);
  }

  return { token: loginRes.body.token, userId: loginRes.body.user.id, email };
}
