'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const FILTERS = ['All', 'News', 'Deals', 'Jobs', 'Tenders'];

const CARDS = [
  {
    id: 'A',
    badge: 'YOINFO FLIIPER',
    badgeAlt: false,
    mediaClass: 'media-a',
    title: "Tired of losing contacts at the show?",
    text: "Get a digital business card and visitor registration, and turn every handshake into a real lead.",
    bold: "Manage smarter. Follow up faster.",
    ctas: [
      { label: 'Visitors', action: 'Get yours →' },
      { label: 'Exhibitors', action: 'Log in →' },
    ],
    hashtags: '#Expo2026  #RITF  #SmartNetworking',
  },
  {
    id: 'B',
    badge: 'UPDATE WIZARD',
    badgeAlt: true,
    mediaClass: 'media-b',
    title: 'Share updates in seconds',
    meta: 'yoInfo · Publish instantly',
    text: 'Post news, events, and announcements with images, links, and a call-to-action.',
    bold: 'One post. Everywhere.',
    ctas: [
      { label: 'Post', action: 'Create →' },
      { label: 'Track', action: 'Live →' },
    ],
    hashtags: '#Post  #Update  #Blast',
  },
  {
    id: 'C',
    badge: 'BLAST WIZARD',
    badgeAlt: false,
    mediaClass: 'media-a',
    title: 'Blast to WhatsApp, SMS & email',
    meta: 'yoInfo · One send, every inbox',
    text: 'Upload contacts, write once, and send everywhere at the same time.',
    bold: 'Write once. Blast everywhere.',
    ctas: [
      { label: 'WhatsApp', action: 'Send →' },
      { label: 'Email', action: 'Send →' },
    ],
    hashtags: '#BlastWizard  #Messaging',
  },
  {
    id: 'D',
    badge: 'MSME BIZ WIZARD',
    badgeAlt: true,
    mediaClass: 'media-b',
    title: 'Stock, sales & RRA/EBM invoices',
    meta: 'yoInfo · Numbered automatically',
    text: 'Track inventory, record sales, and create compliant invoices with tax estimates.',
    bold: 'Compliant by default.',
    ctas: [
      { label: 'Invoice', action: 'Create →' },
      { label: 'Receipt', action: 'Print →' },
    ],
    hashtags: '#Invoicing  #RRAEBM  #Stock',
  },
  {
    id: 'E',
    badge: 'COMMS NEWSROOM',
    badgeAlt: false,
    mediaClass: 'media-a',
    title: 'Your content studio, powered by AI',
    text: 'Write, schedule, and publish news across channels — with built-in media boosts.',
    bold: 'Publish like a pro.',
    ctas: [
      { label: 'Newsroom', action: 'Open →' },
    ],
    hashtags: '#Comms  #Publishing  #Media',
  },
  {
    id: 'F',
    badge: 'INVESTMENTS',
    badgeAlt: true,
    mediaClass: 'media-b',
    title: 'Browse vetted opportunities',
    meta: 'yoInfo · Real estate, energy & more',
    text: 'Real estate, agriculture, energy, and technology deals worth reviewing.',
    bold: 'Find your next move.',
    ctas: [
      { label: 'Deals', action: 'Browse →' },
    ],
    hashtags: '#Investments  #Opportunities',
  },
];

const STATSets = [
  { n: '2,400+', l: 'Active Investors' },
  { n: '850+', l: 'Businesses Listed' },
  { n: '12K+', l: 'Posts Published' },
  { n: '40K+', l: 'Messages Sent' },
];

export default function FlipperLanding() {
  const [activeFilter, setActiveFilter] = useState('Deals');
  const [currentCard, setCurrentCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard(prev => (prev + 1) % CARDS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const card = CARDS[currentCard];

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-flex">
            {/* Figure (left) */}
            <div className="hero-figure">
              <img src="/man_standing_sending_message6.png" alt="yoInfo Fliiper user" className="hero-figure-img" />
            </div>

            {/* Text (center) */}
            <div>
              <div className="eyebrow"><span className="dot" /> Fliiper</div>
              <h1 className="hero-title">
                Update. Publish. <span>Blast.</span>
              </h1>
              <p className="hero-sub">
                Share updates instantly — everywhere, all at once. Blast to WhatsApp, SMS, and email from one place. Flip through curated news, deals, tenders, and jobs.
              </p>
              <div className="hero-actions">
                <Link href="/auth" className="btn-solid btn-lg">Create Free Account</Link>
                <Link href="/flipper" className="btn-ghost btn-lg">Browse Feed →</Link>
              </div>
              <div className="stat-row" style={{ marginBottom: 0 }}>
                {STATSets.map(s => (
                  <div key={s.l} className="stat-card">
                    <div className="n">{s.n}</div>
                    <div className="l">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone mockup (right) */}
            <div className="hero-visual">
              <div className="phone-mockup">
                <div className="phone-notch" />
                <div className="phone-screen flip-screen">
                  <div className="flip-topbar">
                    <div className="flip-brand">
                      <div className="flip-brand-icon">F</div>
                      <div>
                        <div className="flip-brand-name">yoInfo</div>
                        <div className="flip-brand-tag">stay in the loop</div>
                      </div>
                    </div>
                    <div className="flip-topbar-right">
                      <div className="flip-counter">{currentCard + 1} / {CARDS.length}</div>
                      <Link href="/auth" className="flip-visit-btn">Visit →</Link>
                    </div>
                  </div>
                  <div className="flip-subtitle">Business information &amp; promotions</div>

                  <div className="flip-filters">
                    {FILTERS.map(f => (
                      <button key={f} className={`flip-filter${f === activeFilter ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>
                        {f}
                      </button>
                    ))}
                  </div>

                  <div className="flip-dots">
                    {CARDS.map((_, i) => (
                      <span key={i} className={`flip-dot${i === currentCard ? ' on' : ''}`} />
                    ))}
                  </div>

                  <div className="flip-card-stage">
                    {CARDS.map((c, i) => (
                      <div key={c.id} className={`flip-card${i === currentCard ? ' show' : ''}`}>
                        <div className={`flip-card-media ${c.mediaClass}`} />
                        <div className={`flip-badge${c.badgeAlt ? ' alt' : ''}`}>{c.badge}</div>
                        <div className="flip-card-body">
                          <div className="flip-card-title">{c.title}</div>
                          {c.meta && <div className="flip-card-meta">{c.meta}</div>}
                          <div className="flip-card-text">{c.text}</div>
                          {c.bold && <div className="flip-card-bold">{c.bold}</div>}
                          <div className={`flip-cta-row${c.ctas.length === 1 ? ' single' : ''}`}>
                            {c.ctas.map((cta, ci) => (
                              <div key={ci} className="flip-cta-item">
                                <span>{cta.label}</span>
                                <span className="flip-cta-btn">{cta.action}</span>
                              </div>
                            ))}
                          </div>
                          {c.hashtags && <div className="flip-hashtags">{c.hashtags}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flip-swipe-hint">swipe up for next</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR BUSINESSES ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="section-tag">For businesses</div>
            <h2 className="section-sub-strong">
              Whether you&apos;re growing capital, growing an audience, or growing a customer list — these are the tools that get your business in front of yoInfo&apos;s readers.
            </h2>
          </div>

          <div className="option-grid">
            <Link href="/investments" className="option-card">
              <div className="option-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C1027D" strokeWidth="1.8"><path d="M3 17l6-6 4 4 8-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 6h6v6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="option-title">Investment Profiler</div>
              <div className="option-desc">Discover high-potential investments across real estate, tech, agriculture, and more.</div>
              <div className="option-meta"><span className="option-tag">50+ opportunities</span><span className="option-arrow">→</span></div>
            </Link>

            <Link href="/messaging" className="option-card featured">
              <div className="option-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D0231" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="option-title">Blast Wizard</div>
              <div className="option-desc">Run Email, SMS and WhatsApp marketing campaigns to your contacts, all from one place.</div>
              <div className="channel-row">
                <span className="channel-pill wa"><span className="dot" />WhatsApp</span>
                <span className="channel-pill em"><span className="dot" />Email</span>
                <span className="channel-pill sm"><span className="dot" />SMS</span>
              </div>
              <div className="option-meta"><span className="option-tag">New</span><span className="option-arrow">→</span></div>
            </Link>

            <Link href="/messaging" className="option-card">
              <div className="option-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C1027D" strokeWidth="1.8"><path d="M3 11l18-7-7 18-2.5-7.5L3 11z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="option-title">Update Wizard</div>
              <div className="option-desc">Share news, events, and announcements with a customizable call-to-action.</div>
              <div className="channel-row">
                <span className="channel-pill yi"><span className="dot" />yoInfo Fliiper</span>
                <span className="channel-pill ig"><span className="dot" />Instagram</span>
                <span className="channel-pill fb"><span className="dot" />Facebook</span>
                <span className="channel-pill tt"><span className="dot" />TikTok</span>
              </div>
              <div className="option-meta"><span className="option-tag">Share &amp; engage</span><span className="option-arrow">→</span></div>
            </Link>

            <Link href="/invoices" className="option-card">
              <div className="option-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C1027D" strokeWidth="1.8"><path d="M9 7h6M9 11h6M9 15h3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="option-title">MSME Biz Wizard</div>
              <div className="option-desc">Track stock, record sales, and create RRA/EBM-compliant invoices with tax estimates.</div>
              <div className="option-meta"><span className="option-tag">RRA &amp; EBM ready</span><span className="option-arrow">→</span></div>
            </Link>

            <Link href="/flipper" className="option-card">
              <div className="option-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C1027D" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round"/><path d="M7 7h10M7 12h10M7 17h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="option-title">Comms Newsroom</div>
              <div className="option-desc">Your content studio — write, schedule, and publish news with built-in media boosts.</div>
              <div className="option-meta"><span className="option-tag">Content studio</span><span className="option-arrow">→</span></div>
            </Link>

            <Link href="/wallet" className="option-card">
              <div className="option-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C1027D" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="option-title">Ibiceri Wallet</div>
              <div className="option-desc">Top up your Ibiceri balance to unlock paid actions across all yoInfo tools.</div>
              <div className="option-meta"><span className="option-tag">Token wallet</span><span className="option-arrow">→</span></div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="final-cta">
            <h2>Ready to get started?</h2>
            <p>Join thousands of investors, businesses, and creators already growing on yoInfo.</p>
            <div className="final-actions">
              <Link href="/auth" className="btn-on-dark">Create Free Account</Link>
              <Link href="/about" className="btn-outline-dark">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
