import jwt from 'jsonwebtoken';

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
