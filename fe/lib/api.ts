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

export async function register(email: string, password: string, name: string, confirmPassword: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, confirmPassword }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registration failed');
  }
  return res.json();
}

// ==================== Messaging ====================

export async function uploadAttachment(token: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_URL}/api/upload/document`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to upload file');
  }
  return res.json() as Promise<{ url: string }>;
}

export async function sendMessage(
  token: string,
  data: {
    name: string;
    emailSubject?: string;
    emailMessage?: string;
    smsMessage?: string;
    whatsappMessage?: string;
    contacts: { name: string; phone: string; email: string }[];
    channels: string[];
    cost: number;
  }
) {
  const res = await fetch(`${API_URL}/api/messaging/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to send campaign');
  }
  return res.json();
}

export async function fetchCampaigns(token: string) {
  const res = await fetch(`${API_URL}/api/messaging/campaigns`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch campaigns');
  }
  return res.json();
}

// ==================== Payments (XentriPay) ====================

export async function createCheckoutSession(
  token: string,
  data: {
    campaignData: any;
    paymentMethod: 'momo' | 'cc';
    customerPhone?: string;
    customerName?: string;
    customerEmail?: string;
  }
) {
  const res = await fetch(`${API_URL}/api/payments/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }
  return res.json() as Promise<{
    sessionId: string;
    checkoutUrl: string;
    customerRef: string;
    status: string;
  }>;
}

export async function payCheckoutSession(
  token: string,
  data: {
    sessionId: string;
    customerRef: string;
    paymentMethod: 'momo' | 'cc';
    gatewayRedirectUrl?: string;
  }
) {
  const res = await fetch(`${API_URL}/api/payments/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to initiate payment');
  }
  return res.json() as Promise<{
    status: string;
    redirectTo: string;
    gatewayUrl: string;
    paymentMethod: string;
  }>;
}

export async function checkPaymentStatus(token: string, customerRef: string) {
  const res = await fetch(`${API_URL}/api/payments/status?customerRef=${encodeURIComponent(customerRef)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to check payment status');
  }
  return res.json() as Promise<{
    customerRef: string;
    status: string;
    pendingStatus: string;
    updatedAt: string;
  }>;
}

// ==================== Investments ====================

export async function fetchInvestments(params?: {
  category?: string;
  status?: string;
  search?: string;
  minBudget?: string;
  maxBudget?: string;
}) {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'All') query.set('category', params.category);
  if (params?.status && params.status !== 'All') query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.minBudget) query.set('minBudget', params.minBudget);
  if (params?.maxBudget) query.set('maxBudget', params.maxBudget);

  const qs = query.toString();
  const res = await fetch(`${API_URL}/api/investments${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch investments');
  return res.json();
}

export async function createInvestment(token: string, data: {
  title: string;
  category: string;
  summary: string;
  description?: string;
  minInvestment: number;
  maxInvestment: number;
  location: string;
  status?: string;
  roi: string;
  imageUrl?: string;
  featured?: boolean;
}) {
  const res = await fetch(`${API_URL}/api/investments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create investment');
  return res.json();
}

export async function deleteInvestment(token: string, id: string) {
  const res = await fetch(`${API_URL}/api/investments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete investment');
  return res.json();
}

// ==================== Businesses ====================

export async function fetchBusinesses(params?: {
  category?: string;
  search?: string;
}) {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'All') query.set('category', params.category);
  if (params?.search) query.set('search', params.search);

  const qs = query.toString();
  const res = await fetch(`${API_URL}/api/businesses${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch businesses');
  return res.json();
}

export async function createBusiness(token: string, data: {
  name: string;
  tagline?: string;
  category: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  registrationNumber?: string;
  taxId?: string;
  certifications?: string;
  services?: string[];
  operatingHours?: any;
  primaryCTA?: string;
  teamMembers?: any;
}) {
  const res = await fetch(`${API_URL}/api/businesses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create business');
  return res.json();
}

export async function deleteBusiness(token: string, id: string) {
  const res = await fetch(`${API_URL}/api/businesses/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete business');
  return res.json();
}
