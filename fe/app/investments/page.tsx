'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/protected-route';

const INV_CATS = ['All', 'Real Estate', 'Agriculture', 'Technology', 'Hospitality'];
const INV_LISTINGS = [
  { id: 1, title: 'Kimihurura Mixed-Use Tower', cat: 'Real Estate', loc: 'Kigali, Rwanda', min: 'RWF 5,000,000', media: 'a', raised: '62%', ret: '14.5%', term: '36 mo', investors: '128' },
  { id: 2, title: 'Musanze Coffee Cooperative Expansion', cat: 'Agriculture', loc: 'Musanze, Rwanda', min: 'RWF 1,200,000', media: 'c', raised: '41%', ret: '11%', term: '18 mo', investors: '64' },
  { id: 3, title: 'FinPay Mobile Wallet Seed Round', cat: 'Technology', loc: 'Kigali, Rwanda', min: 'RWF 3,500,000', media: 'd', raised: '78%', ret: '22%', term: '48 mo', investors: '53' },
  { id: 4, title: 'Lake Kivu Eco-Lodge', cat: 'Hospitality', loc: 'Rubavu, Rwanda', min: 'RWF 8,000,000', media: 'b', raised: '35%', ret: '13%', term: '60 mo', investors: '31' },
  { id: 5, title: 'Huye Passion Fruit Processing Plant', cat: 'Agriculture', loc: 'Huye, Rwanda', min: 'RWF 2,400,000', media: 'c', raised: '55%', ret: '12.5%', term: '24 mo', investors: '47' },
  { id: 6, title: 'Nyarugenge Retail Plaza', cat: 'Real Estate', loc: 'Kigali, Rwanda', min: 'RWF 6,750,000', media: 'a', raised: '90%', ret: '15%', term: '36 mo', investors: '142' },
  { id: 7, title: 'AgriTrack Supply Chain SaaS', cat: 'Technology', loc: 'Kigali, Rwanda', min: 'RWF 2,000,000', media: 'd', raised: '29%', ret: '20%', term: '42 mo', investors: '38' },
  { id: 8, title: 'Volcanoes Boutique Guesthouse', cat: 'Hospitality', loc: 'Musanze, Rwanda', min: 'RWF 4,300,000', media: 'b', raised: '48%', ret: '13.5%', term: '30 mo', investors: '56' },
  { id: 9, title: 'Rubavu Fish Farming Cooperative', cat: 'Agriculture', loc: 'Rubavu, Rwanda', min: 'RWF 1,800,000', media: 'c', raised: '66%', ret: '11.5%', term: '20 mo', investors: '71' },
];

export default function InvestmentsPage() {
  return (
    <ProtectedRoute>
      <InvestmentsContent />
    </ProtectedRoute>
  );
}

function InvestmentsContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<'opportunities' | 'investment-detail'>('opportunities');
  const [activeCat, setActiveCat] = useState(searchParams.get('category') || 'All');
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [selected, setSelected] = useState<typeof INV_LISTINGS[number] | null>(null);

  const filtered = INV_LISTINGS.filter(l =>
    (activeCat === 'All' || l.cat === activeCat) &&
    (query === '' || l.title.toLowerCase().includes(query.toLowerCase()))
  );

  const openDetail = (l: typeof INV_LISTINGS[number]) => {
    setSelected(l);
    setView('investment-detail');
  };

  return (
    <section className="section">
      <div className="wrap">
        <div className="topbar">
          <div>
            <h1>{view === 'opportunities' ? 'Opportunities' : 'Opportunity'}</h1>
            <p>{view === 'opportunities' ? 'Search by category, location, and budget.' : 'Full details, funding progress, and sponsor information.'}</p>
          </div>
        </div>

        {view === 'opportunities' ? (
          <>
            <div className="filter-bar">
              {INV_CATS.map(c => (
                <div key={c} className={`filter-chip${activeCat === c ? ' active' : ''}`} onClick={() => setActiveCat(c)}>{c}</div>
              ))}
              <div className="search-input" style={{ marginLeft: 'auto', maxWidth: 220 }}>
                <input type="text" placeholder="Search opportunities…" value={query} onChange={e => setQuery(e.target.value)} />
              </div>
            </div>
            <div className="listing-grid" style={{ marginTop: 20 }}>
              {filtered.map(l => (
                <div key={l.id} className="listing-card" onClick={() => openDetail(l)}>
                  <div className={`listing-media ${l.media}`}><span className="listing-tag">{l.cat}</span></div>
                  <div className="listing-body">
                    <div className="listing-title">{l.title}</div>
                    <div className="listing-desc">Minimum entry, projected returns, and full documentation available on the opportunity page.</div>
                    <div className="listing-meta"><span className="listing-price">{l.min}</span><span className="listing-loc">{l.loc}</span></div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)', padding: '60px 0' }}>
                  No matching opportunities. Try a different category or search term.
                </div>
              )}
            </div>
          </>
        ) : selected && (
          <>
            <div className="mbreadcrumb"><a onClick={() => setView('opportunities')}>Opportunities</a> / <span>{selected.cat}</span></div>
            <div className="detail-grid" style={{ marginTop: 14 }}>
              <div>
                <div className={`detail-hero-media listing-media ${selected.media}`} />
                <h1 className="mpage-title" style={{ fontSize: 24, marginBottom: 4 }}>{selected.title}</h1>
                <p className="mpage-sub" style={{ marginBottom: 18 }}>{selected.loc}</p>
                <div className="stat-strip">
                  <div className="stat-cell"><div className="num">{selected.raised}</div><div className="lbl">Funded</div></div>
                  <div className="stat-cell"><div className="num">{selected.ret}</div><div className="lbl">Target return</div></div>
                  <div className="stat-cell"><div className="num">{selected.term}</div><div className="lbl">Term</div></div>
                  <div className="stat-cell"><div className="num">{selected.investors}</div><div className="lbl">Investors</div></div>
                </div>
                <div className="sub-h">About this opportunity</div>
                <p style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 500, lineHeight: 1.7 }}>
                  A well-positioned {selected.cat.toLowerCase()} project in {selected.loc}. Funds raised go toward development, with returns distributed quarterly.
                </p>
                <div style={{ margin: '16px 0' }}>
                  <span className="badge sent">KYC verified</span>
                  <span className="badge" style={{ background: '#FAF3F8', color: 'var(--muted)' }}>Escrow protected</span>
                  <span className="badge" style={{ background: '#FAF3F8', color: 'var(--muted)' }}>Quarterly payouts</span>
                </div>
                <div className="sub-h">Sponsor</div>
                <div className="list-row">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="avatar-sq" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{selected.title.split(' ')[0]} Development Group</div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>4 active projects · {selected.loc.split(',')[0]}</div>
                    </div>
                  </div>
                  <Link href="/business" className="btn-ghost">View profile</Link>
                </div>
              </div>
              <div>
                <div className="card" style={{ position: 'sticky', top: 90 }}>
                  <div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 6 }}>Minimum entry</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 18 }}>{selected.min}</div>
                  <div className="field-group">
                    <label className="field-label">Investment amount (RWF)</label>
                    <input type="number" className="input" placeholder="5,000,000" />
                  </div>
                  <button className="btn-solid" style={{ width: '100%', padding: 12, marginTop: 6 }}>Invest Now</button>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginTop: 10, textAlign: 'center' }}>You won&apos;t be charged until you confirm on the next step.</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
