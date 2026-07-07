'use client';

import { useState } from 'react';
import { registerForEvent } from '@/lib/api';

export default function EventRegistration({ eventId }: { eventId: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsRegistering(true);
    setError('');
    try {
      await registerForEvent(eventId, name, email);
      setRegistered(true);
      setName('');
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  if (registered) {
    return (
      <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        You&apos;re registered for this event!
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-2">
      <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Register for this event:</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          required
          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-md border border-amber-200 dark:border-amber-800 bg-white dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 placeholder:text-amber-400 dark:placeholder:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-md border border-amber-200 dark:border-amber-800 bg-white dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 placeholder:text-amber-400 dark:placeholder:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={isRegistering || !name.trim() || !email.trim()}
          className="px-3 py-1.5 rounded-md bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isRegistering ? 'Registering...' : 'Register'}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </form>
  );
}
