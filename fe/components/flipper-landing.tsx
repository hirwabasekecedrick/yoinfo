'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import IbiceriBadge from '@/components/ibiceri-badge';

const FILTERS = ['All', 'News', 'Deals', 'Jobs', 'Tenders'];
const FLIIPER_TAGS = ['News', 'Deals', 'Jobs', 'Tenders', 'Tourism', 'Hospitality', 'Business', 'Agriculture', 'Technology', 'Real Estate', 'Northern Province', 'Diaspora'];

const TOOL_CARDS = [
  {
    id: 'A',
    badge: 'YOINFO FLIIPER',
    badgeAlt: false,
    mediaClass: 'flip-card-media-a',
    title: "Tired of losing contacts at the show?",
    text: "Get a digital business card and visitor registration, and turn every handshake into a real lead.",
    bold: "Manage smarter. Follow up faster.",
    ctas: [
      { label: 'Visitors', action: 'Get yours →' },
      { label: 'Exhibitors', action: 'Log in →' },
    ],
    hashtags: '#Expo2026  #RITF  #SmartNetworking',
    context: {
      eyebrow: 'Meet yoInfo Fliiper',
      desc: <><strong>yoInfo <em>Fliiper</em> lets busy professionals flip through curated news, deals, tenders, and jobs in seconds</strong> — no noise, just what matters, in five languages.</>,
      primary: { label: 'Browse Feed', href: '/flipper' },
      secondary: { label: 'Create Free Account', href: '/auth?tab=signup' },
      stats: [
        { n: '2,400+', l: 'Active Investors' },
        { n: '850+', l: 'Businesses Listed' },
        { n: '12K+', l: 'Posts Published' },
        { n: '40K+', l: 'Messages Sent' },
      ],
    },
  },
  {
    id: 'B',
    badge: 'UPDATE WIZARD',
    badgeAlt: true,
    mediaClass: 'flip-card-media-b',
    title: 'Share updates in seconds',
    meta: 'yoInfo · Publish instantly',
    text: 'Post news, events, and announcements with images, links, and a call-to-action.',
    bold: 'One post. Everywhere.',
    ctas: [
      { label: 'Post', action: 'Create →' },
      { label: 'Track', action: 'Live →' },
    ],
    hashtags: '#Post  #Update  #Blast',
    context: {
      eyebrow: 'Meet yoInfo Update Wizard',
      desc: <><strong>Update Wizard lets you share news, events, and announcements with your audience</strong> — add images, links, and a call-to-action from one place.</>,
      primary: { label: 'Create a Post', href: '/poster/dashboard' },
      secondary: { label: 'Create Free Account', href: '/auth?tab=signup' },
      stats: [
        { n: '12K+', l: 'Posts Published' },
        { n: '850+', l: 'Businesses Posting' },
        { n: '5K+', l: 'Events Shared' },
        { n: '24/7', l: 'Instant Publishing' },
      ],
    },
  },
  {
    id: 'C',
    badge: 'BLAST WIZARD',
    badgeAlt: false,
    mediaClass: 'flip-card-media-a',
    title: 'Blast to WhatsApp, SMS & email',
    meta: 'yoInfo · One send, every inbox',
    text: 'Upload contacts, write once, and send everywhere at the same time.',
    bold: 'Write once. Blast everywhere.',
    ctas: [
      { label: 'WhatsApp', action: 'Send →' },
      { label: 'Email', action: 'Send →' },
    ],
    hashtags: '#BlastWizard  #Messaging',
    context: {
      eyebrow: 'Meet yoInfo Blast Wizard',
      desc: <><strong>Blast Wizard sends your message to WhatsApp, SMS, and email from one place</strong> — upload contacts, write once, and blast to everyone at once.</>,
      primary: { label: 'Send a Blast', href: '/messaging' },
      secondary: { label: 'Create Free Account', href: '/auth?tab=signup' },
      stats: [
        { n: '40K+', l: 'Messages Sent' },
        { n: '25K+', l: 'WhatsApp Delivered' },
        { n: '10K+', l: 'Emails Sent' },
        { n: '5K+', l: 'SMS Sent' },
      ],
    },
  },
  {
    id: 'D',
    badge: 'INVOICE WIZARD',
    badgeAlt: true,
    mediaClass: 'flip-card-media-b',
    title: 'RRA/EBM-compliant invoices',
    meta: 'yoInfo · Numbered automatically',
    text: 'Create compliant invoices and receipts, and submit to EBM automatically.',
    bold: 'Compliant by default.',
    ctas: [
      { label: 'Invoice', action: 'Create →' },
      { label: 'Receipt', action: 'Print →' },
    ],
    hashtags: '#Invoicing  #RRAEBM',
    context: {
      eyebrow: 'Meet yoInfo Invoice Wizard',
      desc: <><strong>Invoice Wizard creates RRA/EBM-compliant invoices and receipts, numbered automatically</strong> — and sends them by WhatsApp, Email, or SMS link.</>,
      primary: { label: 'Create an Invoice', href: '/invoices' },
      secondary: { label: 'Create Free Account', href: '/auth?tab=signup' },
      stats: [
        { n: '8K+', l: 'Invoices Created' },
        { n: '100%', l: 'RRA & EBM Ready' },
        { n: '850+', l: 'Businesses Invoicing' },
        { n: '15K+', l: 'Invoices Sent' },
      ],
    },
  },
  {
    id: 'E',
    badge: 'BUSINESS PROFILING',
    badgeAlt: false,
    mediaClass: 'flip-card-media-a',
    title: 'Your business, one clean page',
    text: 'A professional profile with your logo, services, and contact details.',
    bold: 'Look professional everywhere.',
    ctas: [
      { label: 'Business', action: 'Build →' },
    ],
    hashtags: '#BusinessProfile  #Growth',
    context: {
      eyebrow: 'Meet yoInfo Business Profiling',
      desc: <><strong>Business Profiling gives your business a professional profile</strong> — logo, services, and contact details, all in one place.</>,
      primary: { label: 'Build Your Profile', href: '/business' },
      secondary: { label: 'Create Free Account', href: '/auth?tab=signup' },
      stats: [
        { n: '850+', l: 'Businesses Listed' },
        { n: '1,200+', l: 'Profiles Created' },
        { n: '96%', l: 'Found On Search' },
        { n: '5', l: 'Languages Available' },
      ],
    },
  },
  {
    id: 'F',
    badge: 'INVESTMENTS',
    badgeAlt: true,
    mediaClass: 'flip-card-media-b',
    title: 'Browse vetted opportunities',
    meta: 'yoInfo · Real estate, energy & more',
    text: 'Real estate, agriculture, energy, and technology deals worth reviewing.',
    bold: 'Find your next move.',
    ctas: [
      { label: 'Deals', action: 'Browse →' },
    ],
    hashtags: '#Investments  #Opportunities',
    context: {
      eyebrow: 'Meet yoInfo Investments',
      desc: <><strong>yoInfo Investments brings you vetted opportunities</strong> across real estate, agriculture, energy, and more.</>,
      primary: { label: 'Browse Investments', href: '/investments' },
      secondary: { label: 'Create Free Account', href: '/auth?tab=signup' },
      stats: [
        { n: '50+', l: 'Opportunities Live' },
        { n: '2,400+', l: 'Active Investors' },
        { n: 'RWF 75M+', l: 'Capital Raised' },
        { n: '6', l: 'Sectors Covered' },
      ],
    },
  },
];

const FLIPPER_CARDS = [
  {
    id: 'A',
    badge: 'YOINFO FLIIPER',
    badgeAlt: false,
    mediaClass: 'flip-card-media-a',
    title: "Tired of losing contacts at the show?",
    text: "Get a digital business card and visitor registration, and turn every handshake into a real lead.",
    bold: "Manage smarter. Follow up faster.",
    ctas: [
      { label: 'Visitors', action: 'Get yours →' },
      { label: 'Exhibitors', action: 'Log in →' },
    ],
    hashtags: '#Expo2026  #RITF  #SmartNetworking',
    context: {
      eyebrow: 'Meet yoInfo Fliiper',
      desc: <><strong>yoInfo <em>Fliiper</em> lets busy professionals flip through curated news, deals, tenders, and jobs in seconds</strong> — no noise, just what matters, in five languages.</>,
      primary: { label: 'Browse Feed', href: '/flipper' },
      secondary: { label: 'Create Free Account', href: '/auth?tab=signup' },
      stats: [
        { n: '2,400+', l: 'Active Investors' },
        { n: '850+', l: 'Businesses Listed' },
        { n: '12K+', l: 'Posts Published' },
        { n: '40K+', l: 'Messages Sent' },
      ],
    },
  },
  {
    id: 'B',
    badge: 'RITF 2026',
    badgeAlt: true,
    mediaClass: 'flip-card-media-b',
    title: 'Kigali Today Starter',
    meta: 'Kigali Today · yoExpoGuide · 1 min ago',
    text: 'RWF 1,000,000 · Core visibility combined with an introductory media campaign.',
    ctas: [
      { label: 'Package', action: 'View Package →' },
    ],
    hashtags: '#RITF2026  #ExpoGuide',
    context: {
      eyebrow: 'Meet yoInfo Fliiper',
      desc: <><strong>yoInfo <em>Fliiper</em> lets busy professionals flip through curated news, deals, tenders, and jobs in seconds</strong> — no noise, just what matters, in five languages.</>,
      primary: { label: 'Browse Feed', href: '/flipper' },
      secondary: { label: 'Create Free Account', href: '/auth?tab=signup' },
      stats: [
        { n: '2,400+', l: 'Active Investors' },
        { n: '850+', l: 'Businesses Listed' },
        { n: '12K+', l: 'Posts Published' },
        { n: '40K+', l: 'Messages Sent' },
      ],
    },
  },
];

const FEATURED_ITEMS = [
  { id: 1, title: 'Kigali Heights Office Space', category: 'Real Estate', amount: 'RWF 150M', location: 'Kigali', status: 'Open' },
  { id: 2, title: 'AgriTech Rwanda Expansion', category: 'Agriculture', amount: 'RWF 75M', location: 'Eastern Province', status: 'Closing Soon' },
  { id: 3, title: 'Solar Grid Kigali Phase 2', category: 'Energy', amount: 'RWF 200M', location: 'Kigali', status: 'Open' },
  { id: 4, title: 'FinTech Startup Bridge Loan', category: 'Finance', amount: 'RWF 30M', location: 'Kigali', status: 'Coming Soon' },
  { id: 5, title: 'Kivu Eco-Lodge Development', category: 'Tourism', amount: 'RWF 85M', location: 'Western Province', status: 'Open' },
  { id: 6, title: 'Rwanda Coding Academy', category: 'Technology', amount: 'RWF 50M', location: 'Nyamata', status: 'Open' },
];

const embedCode = `<div id="yoinfo-fliiper"\n     data-theme="light"\n     data-category="deals"></div>\n<script src="https://cdn.yoinfo.africa/fliiper-widget.js" async></script>`;

const apiCode = `curl https://api.yoinfo.africa/v1/feed?category=deals \\\n  -H "Authorization: Bearer YOUR_API_KEY"`;

export default function FlipperLanding({ variant = 'landing' }: { variant?: 'landing' | 'feed' }) {
  const cards = variant === 'feed' ? FLIPPER_CARDS : TOOL_CARDS;
  const [activeFilter, setActiveFilter] = useState('Deals');
  const [currentCard, setCurrentCard] = useState(0);
  const [flipperTags, setFlipperTags] = useState<string[]>(['Deals', 'Business']);
  const [customTag, setCustomTag] = useState('');
  const [devTab, setDevTab] = useState<'embed' | 'api'>('embed');
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard(prev => (prev + 1) % cards.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [cards.length]);

  const feedItems = FEATURED_ITEMS.filter(item =>
    activeFilter === 'All' || item.category === activeFilter
  );

  const toggleTag = useCallback((tag: string) => {
    setFlipperTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#f0e4ec]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/YoINFOlogo.png" alt="yoInfo" className="h-8" />
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/flipper" className="text-sm font-semibold text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg bg-[#FBEAF5] transition-colors">
              Fliiper
            </Link>
            <Link href="/investments" className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block">
              Investments
            </Link>
            <Link href="/invoices" className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block">
              Invoices
            </Link>
            <Link href="/messaging" className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block">
              Blast Wizard
            </Link>
            <IbiceriBadge />
            <Link
              href="/auth"
              className="text-sm font-semibold bg-[#C1027D] text-white px-5 py-2 rounded-lg hover:bg-[#8A0260] transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero Section */}
        <div className="hero-dots rounded-[2rem] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 px-6 sm:px-10 py-12 sm:py-16">
          <div>
            <img src="/YoINFOlogo.png" alt="yoInfo" className="h-8 mb-5" />
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8A0260] bg-[#FBEAF5] px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6FB5]" />
              {cards[currentCard].context.eyebrow}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.08] mb-4">
              Update. Publish. <span className="text-[#C1027D]">Blast.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg mb-6">
              {cards[currentCard].context.desc}
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link href={cards[currentCard].context.primary.href} className="inline-flex items-center gap-2 bg-[#C1027D] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8A0260] transition-all shadow-lg shadow-[#C1027D]/25">
                {cards[currentCard].context.primary.label}
              </Link>
              <Link href={cards[currentCard].context.secondary.href} className="inline-flex items-center gap-2 bg-white text-[#8A0260] font-bold px-6 py-3 rounded-xl border border-[#f0e4ec] hover:border-[#D93F9E] transition-colors">
                {cards[currentCard].context.secondary.label}
              </Link>
            </div>
            <div className="stat-row mt-8">
              {cards[currentCard].context.stats.map(s => (
                <div key={s.l} className="stat-card">
                  <div className="n">{s.n}</div>
                  <div className="l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone Mockup + Figure */}
          <div className="flex justify-center items-stretch gap-6">
            <div className="flip-hero-figure">
              <img src="/man_standing_sending_message2.png" alt="yoInfo Fliiper user" className="flip-hero-figure-img" />
            </div>
            <div className="flip-phone-mockup">
              <div className="flip-phone-notch" />
              <div className="flip-phone-screen">
                <div className="flip-topbar">
                  <div className="flex items-center gap-2">
                    <div className="flip-brand-icon">i</div>
                    <div>
                      <div className="flip-brand-name">yoInfo</div>
                      <div className="flip-brand-tag">stay in the loop</div>
                    </div>
                  </div>
                  <div className="flip-topbar-right">
                    <div className="flip-counter">{currentCard + 1} / {cards.length}</div>
                  </div>
                </div>
                <div className="flip-subtitle">Business information &amp; promotions</div>

                <div className="flip-filters">
                  {FILTERS.map(f => (
                    <button key={f} className={`flip-filter ${f === activeFilter ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
                      {f}
                    </button>
                  ))}
                </div>

                <div className="flip-dots">
                  {cards.map((_, i) => (
                    <span key={i} className={`flip-dot ${i === currentCard ? 'on' : ''}`} />
                  ))}
                </div>

                <div className="flip-card-stage">
                  {cards.map((card, i) => (
                    <div key={card.id} className={`flip-card ${i === currentCard ? 'show' : ''}`}>
                      <div className={`flip-card-media ${card.mediaClass}`}>
                        <div className={`flip-badge ${card.badgeAlt ? 'flip-badge-alt' : ''}`}>{card.badge}</div>
                      </div>
                      <div className="flip-card-body">
                        <div className="flip-card-title">{card.title}</div>
                        {card.meta && <div className="flip-card-meta">{card.meta}</div>}
                        <div className="flip-card-text">{card.text}</div>
                        {card.bold && <div className="flip-card-bold">{card.bold}</div>}
                        <div className={`flip-cta-row ${card.ctas.length === 1 ? 'single' : ''}`}>
                          {card.ctas.map((cta, ci) => (
                            <div key={ci} className="flip-cta-item">
                              <span>{cta.label}</span>
                              <span className="flip-cta-btn">{cta.action}</span>
                            </div>
                          ))}
                        </div>
                        {card.hashtags && <div className="flip-hashtags">{card.hashtags}</div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flip-swipe-hint">swipe up for next</div>
              </div>
            </div>
          </div>
        </div>

        {/* For businesses */}
        <section className="mb-20">
          <div className="max-w-2xl mb-8">
            <div className="text-xs font-bold text-[#8A0260] bg-[#FBEAF5] px-3 py-1 rounded-full inline-block mb-3 uppercase tracking-wider">For businesses</div>
            <p className="text-lg sm:text-xl font-extrabold text-gray-900 leading-relaxed">Whether you&apos;re growing capital, growing an audience, or growing a customer list — these are the tools that get your business in front of yoInfo&apos;s readers.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/investments" className="group option-card">
              <div className="flex gap-4">
                <div className="w-20 sm:w-24 shrink-0 self-stretch rounded-xl overflow-hidden">
                  <img src="/card1.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-3.5 flex-1">
                  <div className="option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C1027D" strokeWidth="1.8"><path d="M3 17l6-6 4 4 8-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 6h6v6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="option-title">Investment Profiler</div>
                  <div className="option-desc">Discover high-potential investments across real estate, tech, agriculture, and more.</div>
                  <div className="option-meta"><span className="option-tag">50+ opportunities</span><span className="option-arrow">→</span></div>
                </div>
              </div>
            </Link>

            <Link href="/poster/dashboard" className="group option-card">
              <div className="flex gap-4">
                <div className="w-20 sm:w-24 shrink-0 self-stretch rounded-xl overflow-hidden">
                  <img src="/card2.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-3.5 flex-1">
                  <div className="option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C1027D" strokeWidth="1.8"><path d="M3 11l18-7-7 18-2.5-7.5L3 11z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="option-title">Update Wizard</div>
                  <div className="option-desc">Share news, events, and announcements with a customizable call-to-action.</div>
                  <div className="channel-row">
                    <span className="channel-pill yi"><span className="dot"></span>yoInfo Fliiper</span>
                    <span className="channel-pill ig"><span className="dot"></span>Instagram</span>
                    <span className="channel-pill fb"><span className="dot"></span>Facebook</span>
                    <span className="channel-pill tt"><span className="dot"></span>TikTok</span>
                  </div>
                  <div className="option-meta"><span className="option-tag">Share &amp; engage</span><span className="option-arrow">→</span></div>
                </div>
              </div>
            </Link>

            <Link href="/messaging" className="group option-card featured">
              <div className="flex gap-4">
                <div className="w-20 sm:w-24 shrink-0 self-stretch rounded-xl overflow-hidden">
                  <img src="/card3.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-3.5 flex-1">
                  <div className="option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D0231" strokeWidth="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="option-title">Blast Wizard</div>
                  <div className="option-desc">Run Email, SMS and WhatsApp marketing campaigns to your contacts, all from one place.</div>
                  <div className="channel-row">
                    <span className="channel-pill wa"><span className="dot"></span>WhatsApp</span>
                    <span className="channel-pill em"><span className="dot"></span>Email</span>
                    <span className="channel-pill sm"><span className="dot"></span>SMS</span>
                  </div>
                  <div className="option-meta"><span className="option-tag">New</span><span className="option-arrow">→</span></div>
                </div>
              </div>
            </Link>

            <Link href="/invoices" className="group option-card">
              <div className="flex gap-4">
                <div className="w-20 sm:w-24 shrink-0 self-stretch rounded-xl overflow-hidden">
                  <img src="/card4.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-3.5 flex-1">
                  <div className="option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C1027D" strokeWidth="1.8"><path d="M9 7h6M9 11h6M9 15h3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="option-title">Invoice Wizard</div>
                  <div className="option-desc">Create RRA/EBM-compliant invoices and receipts, and send them by WhatsApp, Email, or SMS link.</div>
                  <div className="option-meta"><span className="option-tag">RRA &amp; EBM ready</span><span className="option-arrow">→</span></div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured Feed */}
        {/* <section className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-bold text-[#8A0260] bg-[#FBEAF5] px-3 py-1 rounded-full inline-block mb-2 uppercase tracking-wider">Live Feed</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">What&apos;s happening now</h2>
            </div>
            <div className="flex gap-2">
              {['All', 'Deals', 'Real Estate', 'Technology'].map(f => (
                <button key={f} className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                  activeFilter === f ? 'bg-[#C1027D] text-white border-[#C1027D]' : 'bg-white text-gray-500 border-[#f0e4ec] hover:border-[#D93F9E]'
                }`} onClick={() => setActiveFilter(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedItems.map(item => (
              <div key={item.id} className="bg-white border border-[#f0e4ec] rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'Open' ? 'bg-green-50 text-green-600' :
                    item.status === 'Closing Soon' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                  }`}>{item.status}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#C1027D]">{item.amount}</span>
                  <span className="text-gray-400">{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* Interests */}
        {/* <section className="mb-20">
          <div className="text-center mb-8">
            <div className="text-xs font-bold text-[#8A0260] bg-[#FBEAF5] px-3 py-1 rounded-full inline-block mb-2 uppercase tracking-wider">Personalize</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Choose your interests</h2>
            <p className="text-gray-500 mt-2">Pick what matters to you, and Fliiper will only show updates that match.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {FLIIPER_TAGS.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)} className={`text-sm font-bold px-4 py-2 rounded-full border transition-colors ${
                flipperTags.includes(tag)
                  ? 'bg-[#C1027D] text-white border-[#C1027D]'
                  : 'bg-white text-gray-500 border-[#f0e4ec] hover:border-[#D93F9E]'
              }`}>
                #{tag}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4 gap-2">
            <input type="text" value={customTag} onChange={e => setCustomTag(e.target.value)} placeholder="Add custom interest..." className="input max-w-xs" onKeyDown={e => {
              if (e.key === 'Enter' && customTag.trim()) {
                const formatted = customTag.trim().charAt(0).toUpperCase() + customTag.trim().slice(1);
                if (!flipperTags.includes(formatted)) setFlipperTags(prev => [...prev, formatted]);
                setCustomTag('');
              }
            }} />
            <button className="btn btn-outline" onClick={() => {
              if (customTag.trim()) {
                const formatted = customTag.trim().charAt(0).toUpperCase() + customTag.trim().slice(1);
                if (!flipperTags.includes(formatted)) setFlipperTags(prev => [...prev, formatted]);
                setCustomTag('');
              }
            }}>Add</button>
          </div>
          {flipperTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {flipperTags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 text-sm font-bold bg-[#FBEAF5] text-[#8A0260] px-3 py-1.5 rounded-full">
                  #{tag}
                  <button onClick={() => toggleTag(tag)} className="font-extrabold opacity-60 hover:opacity-100">&times;</button>
                </span>
              ))}
            </div>
          )}
        </section> */}

        {/* Developers */}
        {/* {variant === 'landing' && (
          <section className="mb-20" id="developers">
            <div className="mb-6">
              <div className="text-xs font-bold text-[#8A0260] bg-[#FBEAF5] px-3 py-1 rounded-full inline-block mb-2 uppercase tracking-wider">Developers &amp; Partners</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Embed yoInfo <i>Fliiper</i> anywhere</h2>
              <p className="text-gray-500 mt-2">Drop the Fliiper feed into your own website with a single script tag, or pull the same data into your product with our REST API.</p>
            </div>

            <div className="dev-grid">
              <div className="dev-side">
                <div className="dev-feature"><div className="dev-feature-icon">⚡</div><div><div className="dev-feature-title">One line to embed</div><div className="dev-feature-desc">A single script tag renders a live, auto-updating Fliiper widget wherever you paste it.</div></div></div>
                <div className="dev-feature"><div className="dev-feature-icon">🎨</div><div><div className="dev-feature-title">Themeable</div><div className="dev-feature-desc">Light or dark, and filtered to the categories your audience cares about — News, Deals, Jobs, or Tenders.</div></div></div>
                <div className="dev-feature"><div className="dev-feature-icon">🔌</div><div><div className="dev-feature-title">Full REST API</div><div className="dev-feature-desc">Query the same feed programmatically and build your own experience on top of it.</div></div></div>
                <div className="dev-feature"><div className="dev-feature-icon">🔒</div><div><div className="dev-feature-title">Scoped API keys</div><div className="dev-feature-desc">Every partner gets their own key with usage limits, so access stays secure and accountable.</div></div></div>
                <button className="bg-[#C1027D] text-white font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#8A0260] transition-colors mt-2" onClick={() => alert('Thanks — our partnerships team will reach out with your API key')}>Request API Access</button>
              </div>

              <div className="dev-panel">
                <div className="dev-tabs">
                  <div className={`dev-tab ${devTab === 'embed' ? 'active' : ''}`} onClick={() => setDevTab('embed')}>Embed Script</div>
                  <div className={`dev-tab ${devTab === 'api' ? 'active' : ''}`} onClick={() => setDevTab('api')}>REST API</div>
                </div>

                {devTab === 'embed' && (
                  <div className="dev-tab-content show">
                    <p className="dev-panel-note">Paste this where you want the widget to appear. It loads asynchronously and won&apos;t slow down your page.</p>
                    <div className="code-block">
                      <div className="code-block-head"><span>HTML</span><button className="code-copy-btn" onClick={() => { navigator.clipboard.writeText(embedCode); setCopied('embed'); setTimeout(() => setCopied(null), 2000); }}>{copied === 'embed' ? 'Copied!' : 'Copy'}</button></div>
                      <pre>{embedCode}</pre>
                    </div>
                    <p className="dev-panel-note">Available <code>data-category</code> values: <code>all</code>, <code>news</code>, <code>deals</code>, <code>jobs</code>, <code>tenders</code>.</p>
                  </div>
                )}

                {devTab === 'api' && (
                  <div className="dev-tab-content show">
                    <p className="dev-panel-note">Authenticate with a Bearer token and query the same feed that powers Fliiper and the embed widget.</p>
                    <div className="code-block">
                      <div className="code-block-head"><span>cURL</span><button className="code-copy-btn" onClick={() => { navigator.clipboard.writeText(apiCode); setCopied('api'); setTimeout(() => setCopied(null), 2000); }}>{copied === 'api' ? 'Copied!' : 'Copy'}</button></div>
                      <pre>{apiCode}</pre>
                    </div>
                    <p className="dev-panel-note">Returns paginated JSON — title, summary, image, category, call-to-action, and expiry for each item. Rate limit: 120 requests/minute per key.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )} */}

        {/* CTA */}
        {variant === 'landing' && (
          <section className="bg-[#3D0231] rounded-2xl p-10 sm:p-14 text-center text-white mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to get started ?</h2>
            <p className="text-[#D98DBB] max-w-md mx-auto mb-6">Join thousands of investors, businesses, and creators already growing on yoInfo.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/auth?tab=signup" className="bg-white text-[#3D0231] font-bold px-6 py-3 rounded-xl hover:bg-[#FF97CC] transition-colors">
                Create Free Account
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-[#f0e4ec] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <img src="/YoINFOlogo.png" alt="yoInfo" className="h-6" />
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/flipper" className="hover:text-[#8A0260]">About Fliiper</Link>
            <Link href="/investments" className="hover:text-[#8A0260]">Investment Profiler</Link>
            <Link href="/poster/dashboard" className="hover:text-[#8A0260]">Update Wizard</Link>
            <Link href="/messaging" className="hover:text-[#8A0260]">Blast Wizard</Link>
            <Link href="/invoices" className="hover:text-[#8A0260]">Invoice Wizard</Link>
            <Link href="/#developers" className="hover:text-[#8A0260]">Developers</Link>
            <Link href="/wallet" className="hover:text-[#8A0260]">Ibiceri Wallet</Link>
          </div>
          <div className="text-xs text-gray-400 w-full text-center sm:w-auto">&copy; 2026 yoInfo. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
