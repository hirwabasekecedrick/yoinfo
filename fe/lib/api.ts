import { API_URL } from './config';

// ==================== Posts ====================

export async function fetchPosts() {
  const res = await fetch(`${API_URL}/posts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function createPost(
  content: string,
  token: string,
  title?: string,
  imageUrl?: string,
  tags?: string[],
  links?: { url: string; title?: string }[],
  eventId?: string
) {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, content, imageUrl, tags, links, eventId }),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
}

// ==================== Tags ====================

export async function fetchTags() {
  const res = await fetch(`${API_URL}/api/tags`);
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

// ==================== Events ====================

export async function fetchEvents() {
  const res = await fetch(`${API_URL}/api/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function createEvent(token: string, data: { title: string; description?: string; date: string; location?: string }) {
  const res = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create event');
  return res.json();
}

export async function registerForEvent(eventId: string, name: string, email: string) {
  const res = await fetch(`${API_URL}/api/events/${eventId}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registration failed');
  }
  return res.json();
}

// ==================== Auth ====================

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login failed');
  }
  return res.json();
}

export async function register(email: string, password: string, name: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registration failed');
  }
  return res.json();
}
