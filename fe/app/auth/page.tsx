'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '@/lib/api';

const INTERESTS = [
  { tag: 'News', emoji: '📰' },
  { tag: 'Deals', emoji: '🏷️' },
  { tag: 'Jobs', emoji: '💼' },
  { tag: 'Tenders', emoji: '📋' },
  { tag: 'Tourism', emoji: '🗺️' },
  { tag: 'Hospitality', emoji: '🏨' },
  { tag: 'Business', emoji: '💡' },
  { tag: 'Agriculture', emoji: '🌾' },
  { tag: 'Technology', emoji: '💻' },
  { tag: 'Real Estate', emoji: '🏗️' },
  { tag: 'Northern Province', emoji: '📍' },
  { tag: 'Diaspora', emoji: '🌍' },
];

export default function AuthPage() {
  const router = useRouter();
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [signupStep, setSignupStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [role, setRole] = useState('Investor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (tag: string) => {
    setSelectedInterests(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/messaging');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await register(email, password, name, password);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      router.push('/messaging');
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-tabs">
          <div
            className={`auth-tab${authTab === 'signin' ? ' active' : ''}`}
            onClick={() => { setAuthTab('signin'); setError(''); }}
          >
            Sign in
          </div>
          <div
            className={`auth-tab${authTab === 'signup' ? ' active' : ''}`}
            onClick={() => { setAuthTab('signup'); setError(''); setSignupStep(1); }}
          >
            Create account
          </div>
        </div>

        {/* ── SIGN IN ── */}
        {authTab === 'signin' && (
          <form onSubmit={handleSignin}>
            {error && (
              <div style={{ background: '#FBEAE7', border: '1px solid #E8A196', color: '#8A2A1E', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <div className="field-group">
              <label className="field-label">Email</label>
              <input type="email" placeholder="you@company.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="field-group" style={{ marginTop: 12 }}>
              <label className="field-label">Password</label>
              <input type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn-solid" style={{ width: '100%', marginTop: 18, padding: 12 }} type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
            <div className="auth-footnote">
              New to yoInfo? <a onClick={() => { setAuthTab('signup'); setSignupStep(1); }}>Create a free account</a>
            </div>
          </form>
        )}

        {/* ── SIGN UP ── */}
        {authTab === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="step-indicator">
              <div className={`step-dot${signupStep === 1 ? ' active' : ''}${signupStep === 2 ? ' done' : ''}`}>1</div>
              <div className="step-line" />
              <div className={`step-dot${signupStep === 2 ? ' active' : ''}`}>2</div>
            </div>
            <div className="step-labels">
              <span className={signupStep === 1 ? 'active' : ''}>Account details</span>
              <span className={signupStep === 2 ? 'active' : ''}>Your interests</span>
            </div>

            {error && (
              <div style={{ background: '#FBEAE7', border: '1px solid #E8A196', color: '#8A2A1E', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                {error}
              </div>
            )}

            {/* Step 1: Account details */}
            {signupStep === 1 && (
              <div>
                <div className="field-group">
                  <label className="field-label">I am joining as</label>
                  <select value={role} onChange={e => setRole(e.target.value)}>
                    <option>Investor</option>
                    <option>Business owner</option>
                    <option>Content creator</option>
                  </select>
                </div>
                <div className="field-group" style={{ marginTop: 12 }}>
                  <label className="field-label">Full name</label>
                  <input type="text" placeholder="Jane Uwase" required value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="field-group" style={{ marginTop: 12 }}>
                  <label className="field-label">Email</label>
                  <input type="email" placeholder="you@company.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="field-group" style={{ marginTop: 12 }}>
                  <label className="field-label">Password</label>
                  <input type="password" placeholder="At least 8 characters" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="button" className="btn-solid" style={{ width: '100%', marginTop: 18, padding: 12 }} onClick={() => setSignupStep(2)}>
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Interests */}
            {signupStep === 2 && (
              <div>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 500, marginBottom: 14 }}>
                  yoInfo <em>Fliiper</em> is free to use. Pick what you want to see, and you&apos;ll only get updates that match — nothing else.
                </p>
                <div className="interest-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {INTERESTS.map(interest => (
                    <div
                      key={interest.tag}
                      className={`interest-chip${selectedInterests.includes(interest.tag) ? ' selected' : ''}`}
                      onClick={() => toggleInterest(interest.tag)}
                    >
                      {interest.emoji} #{interest.tag}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                  <button type="button" className="btn-ghost" style={{ flex: 1, padding: 12 }} onClick={() => setSignupStep(1)}>
                    Back
                  </button>
                  <button className="btn-solid" style={{ flex: 2, padding: 12 }} type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create account'}
                  </button>
                </div>
              </div>
            )}

            <div className="auth-footnote">
              Already have an account? <a onClick={() => { setAuthTab('signin'); setError(''); }}>Sign in</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
