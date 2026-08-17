'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isTool = ['/messaging', '/invoices', '/flipper', '/admin', '/super_admin', '/user', '/poster', '/newsroom'].some(p => pathname.startsWith(p));

  if (isTool) return null;

  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <Link href="/" className="brand">
          <div className="brand-mark">I</div>
          <div><div className="brand-name">yoInfo</div></div>
        </Link>
        <div className="footer-links">
          <Link href="/about">About Fliiper</Link>
          <Link href="/messaging">Update Wizard</Link>
          <Link href="/messaging?tab=blast">Blast Wizard</Link>
          <Link href="/invoices">MSME Biz Wizard</Link>
          <Link href="/newsroom">Comms Newsroom</Link>
          <Link href="/developers">Developers</Link>
          <Link href="/wallet">Ibiceri Wallet</Link>
        </div>
      </div>
      <div className="wrap footer-bottom-note">© 2026 yoInfo. All rights reserved.</div>
    </footer>
  );
}
