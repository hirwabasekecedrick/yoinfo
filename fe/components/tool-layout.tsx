'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface ToolLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  navItems: { label: string; href: string; icon: string }[];
}

export default function ToolLayout({ children, title, subtitle, navItems }: ToolLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleLogout = useCallback(() => {
    setDropdownOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  }, [router]);

  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="app-layout">
      {/* ── Mobile overlay ──────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[90] md:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo-section">
          <Link href="/" onClick={() => setSidebarOpen(false)}>
            <img src="/YoINFOlogo.png" alt="yoInfo" className="h-7" />
          </Link>
          <div className="logo-sub">Update. Publish. Blast.</div>
        </div>

        <nav>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                   style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-500))', color: '#fff' }}>
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{user.name || 'User'}</div>
                <div className="text-xs capitalize" style={{ color: 'var(--green-400)' }}>{user.role?.toLowerCase()}</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────── */}
      <div className="app-main">
        {/* ── Header ───────────────────────────────────── */}
        <header
          className="flex items-center justify-between flex-shrink-0 z-[80] border-b"
          style={{
            height: 56,
            padding: '0 16px',
            background: '#fff',
            borderColor: '#f0e4ec',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-1 min-w-0">
            <button
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
              style={{ color: '#555' }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => router.back()} className="back-btn">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back
              </button>
              {/* <Link href="/" className="back-btn">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Home
              </Link> */}
            </div>
          </div>

          {/* Center */}
          <div className="flex-1 min-w-0 px-2 md:text-left md:px-4">
            <h1 className="font-bold text-sm md:text-base text-gray-900 truncate">{title}</h1>
            {subtitle && <p className="text-[11px] text-gray-400 truncate">{subtitle}</p>}
          </div>

          {/* Right — user dropdown */}
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-gray-100"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-500))', boxShadow: '0 2px 8px rgba(193,2,125,0.25)' }}
              >
                {userInitial}
              </div>
              <span className="text-[13px] font-semibold text-gray-600 hidden sm:block">{user?.name || 'User'}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl border z-[200] py-1.5"
                style={{
                  background: '#fff',
                  borderColor: '#f0e4ec',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                  animation: 'fadeInUp 0.18s ease-out',
                }}
              >
                <div className="flex items-center gap-3 px-4 pb-3 pt-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-500))' }}
                  >
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    <span
                      className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                      style={{ color: 'var(--green-600)', background: 'var(--green-50)' }}
                    >
                      {user?.role?.toLowerCase()}
                    </span>
                  </div>
                </div>
                <div className="h-px mx-3" style={{ background: '#f0e4ec' }} />
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                  onClick={() => { setDropdownOpen(false); router.push('/poster/dashboard'); }}
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Profile
                </button>
                <div className="h-px mx-3" style={{ background: '#f0e4ec' }} />
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* ── Content ─────────────────────────────────── */}
        <div className="app-content">
          {children}
        </div>
      </div>
    </div>
  );
}
