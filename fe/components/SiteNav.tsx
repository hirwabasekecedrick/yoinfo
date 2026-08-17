'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useIbiceri } from '@/components/ibiceri-provider';

export default function SiteNav() {
  const pathname = usePathname();
  const { balance } = useIbiceri();
  const isTool = ['/messaging', '/invoices', '/flipper', '/admin', '/super_admin', '/user', '/poster', '/newsroom'].some(p => pathname.startsWith(p));

  if (isTool) return null;

  return (
    <nav className="topnav">
      <div className="topnav-utility">
        <div className="topnav-utility-inner">
          <Link href="/about" className="util-link">About Fliiper</Link>
          <Link href="/developers" className="util-link">Developers</Link>
          <div className="util-spacer" />
          <div className="lang-switch">
            <span className="lang-opt active">EN</span>
            <span className="lang-opt">RW</span>
          </div>
          <Link href="/wallet" className="ibiceri-badge" title="Ibiceri balance">
            <svg width="15" height="15" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#E8B04B" stroke="#8A5A00" strokeWidth="1.2" />
              <circle cx="12" cy="12" r="6.4" fill="none" stroke="#8A5A00" strokeWidth="1" />
              <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A5A00" fontFamily="Montserrat,sans-serif">i</text>
            </svg>
            <span>{balance}</span>
          </Link>
          <Link href="/auth" className="util-link">Sign in</Link>
        </div>
      </div>

      <div className="topnav-inner">
        <div className="nav-left">
          <div className="nav-travel">
            <Link href="/" className="travel-btn" title="Home">⌂</Link>
          </div>
          <Link href="/" className="brand">
            <div className="brand-mark">I</div>
          </Link>
        </div>
        <div className="nav-links-top">
          <Link href="/messaging" className="item">
            <span className="item-icon">📣</span>
            <span>Update Wizard</span>
          </Link>
          <Link href="/messaging?tab=blast" className="item">
            <span className="item-icon">✉️</span>
            <span>Blast Wizard</span>
          </Link>
          <Link href="/invoices" className="item">
            <span className="item-icon">🧾</span>
            <span>MSME Biz Wizard</span>
          </Link>
          <Link href="/newsroom" className="item">
            <span className="item-icon">📰</span>
            <span>Comms Newsroom</span>
          </Link>
        </div>
        <div className="nav-actions">
          <Link href="/auth" className="btn-solid" style={{ textDecoration: 'none' }}>Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
