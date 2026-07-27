'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '@/lib/api';
import Link from 'next/link';

const COUNTRY_CODES = [
  { code: '+250', country: 'RW', label: 'Rwanda' },
  { code: '+254', country: 'KE', label: 'Kenya' },
  { code: '+256', country: 'UG', label: 'Uganda' },
  { code: '+255', country: 'TZ', label: 'Tanzania' },
  { code: '+243', country: 'CD', label: 'DR Congo' },
  { code: '+242', country: 'CG', label: 'Congo' },
  { code: '+257', country: 'BI', label: 'Burundi' },
  { code: '+253', country: 'DJ', label: 'Djibouti' },
  { code: '+251', country: 'ET', label: 'Ethiopia' },
  { code: '+252', country: 'SO', label: 'Somalia' },
  { code: '+260', country: 'ZM', label: 'Zambia' },
  { code: '+263', country: 'ZW', label: 'Zimbabwe' },
  { code: '+27', country: 'ZA', label: 'South Africa' },
  { code: '+234', country: 'NG', label: 'Nigeria' },
  { code: '+233', country: 'GH', label: 'Ghana' },
  { code: '+212', country: 'MA', label: 'Morocco' },
  { code: '+216', country: 'TN', label: 'Tunisia' },
  { code: '+20', country: 'EG', label: 'Egypt' },
  { code: '+1', country: 'US', label: 'United States' },
  { code: '+44', country: 'GB', label: 'United Kingdom' },
  { code: '+33', country: 'FR', label: 'France' },
  { code: '+49', country: 'DE', label: 'Germany' },
  { code: '+91', country: 'IN', label: 'India' },
  { code: '+86', country: 'CN', label: 'China' },
  { code: '+971', country: 'AE', label: 'UAE' },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneCode, setPhoneCode] = useState('+250');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      if (isLogin) {
        const data = await login(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/poster/dashboard');
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        const fullPhone = phone ? `${phoneCode}${phone.replace(/\s/g, '')}` : undefined;
        await register(email, password, name, confirmPassword, fullPhone);
        setSuccess('Account created successfully! Please sign in.');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.message || (isLogin ? 'Failed to sign in.' : 'Failed to register.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6F9] flex flex-col">
      {/* ── Top Nav ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#f0e4ec]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/YoINFOlogo.png" alt="yoInfo" className="h-8" />
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors">
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Auth Card ───────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-[#f0e4ec] shadow-xl shadow-[#C1027D]/5 p-8">
            {/* Tab Switcher */}
            <div className="flex bg-[#FDF4FA] rounded-2xl p-1 mb-8">
              <button
                onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isLogin
                    ? 'bg-white text-[#C1027D] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  !isLogin
                    ? 'bg-white text-[#C1027D] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Register
              </button>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-sm text-gray-500">
                {isLogin ? 'Sign in to access your dashboard.' : 'Join yoInfo and start growing.'}
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2.5 bg-[#D93F9E]/5 border border-[#D93F9E]/20 text-[#C1027D] px-4 py-3 rounded-xl text-sm mb-5">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCode}
                      onChange={(e) => setPhoneCode(e.target.value)}
                      className="input shrink-0"
                      style={{ width: '100px' }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.country} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input flex-1 min-w-0"
                      placeholder="7XX XXX XXX"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  {isLogin && (
                    <button type="button" className="text-xs text-[#C1027D] font-semibold hover:text-[#8A0260] transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input pr-10"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-[#f0e4ec] text-[#C1027D] focus:ring-[#C1027D]" />
                  <label htmlFor="remember" className="text-sm text-gray-500">Remember me</label>
                </div>
              )}

              <button
                id={isLogin ? 'btn-signin' : 'btn-register'}
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#C1027D] text-white font-bold py-3 rounded-xl hover:bg-[#8A0260] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2 shadow-lg shadow-[#C1027D]/25"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isLogin ? 'Signing in...' : 'Registering...'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Login' : 'Register'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Switch */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                className="text-sm font-semibold text-[#C1027D] hover:text-[#8A0260] transition-colors"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
