'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BusinessProfileForm from '@/components/business-profile-form';
import ProtectedRoute from '@/components/protected-route';

const BIZ_CATS = ['All', 'Hospitality', 'Retail', 'Cooperatives', 'Services'];

const BIZ_LISTINGS = [
  { cat: 'Hospitality', title: 'Karisimbi Lodge & Retreat', desc: 'Boutique lodge with mountain views, guided hikes, and a farm-to-table restaurant.', rating: '4.8', loc: 'Musanze', media: 'b' },
  { cat: 'Cooperatives', title: 'Abahuzamugambi Coffee Co-op', desc: 'Farmer-owned cooperative producing specialty washed Arabica for export and local roasters.', rating: '4.9', loc: 'Huye', media: 'c' },
  { cat: 'Services', title: 'Karisimbi Development Group', desc: 'Real estate developer delivering mixed-use residential and retail projects across Kigali.', rating: '4.6', loc: 'Kigali', media: 'd' },
  { cat: 'Retail', title: 'Isoko Handmade Crafts', desc: 'Artisan cooperative selling woven baskets, jewelry, and home decor made in Rwanda.', rating: '4.7', loc: 'Kigali', media: 'a' },
  { cat: 'Hospitality', title: 'Lake Kivu Eco-Lodge', desc: 'Solar-powered lakeside retreat offering kayaking, birdwatching, and wellness retreats.', rating: '4.9', loc: 'Rubavu', media: 'b' },
  { cat: 'Cooperatives', title: 'Virunga Farmers Alliance', desc: 'Aggregating produce from 12 cooperatives to supply hotels and restaurants in the Northern Province.', rating: '4.5', loc: 'Musanze', media: 'c' },
];

export default function BusinessPage() {
  return (
    <ProtectedRoute>
      <BusinessContent />
    </ProtectedRoute>
  );
}

function BusinessContent() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [activeCat, setActiveCat] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<typeof BIZ_LISTINGS[number] | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const filtered = BIZ_LISTINGS.filter(b =>
    (activeCat === 'All' || b.cat === activeCat) &&
    (query === '' || b.title.toLowerCase().includes(query.toLowerCase()))
  );

  const openDetail = (b: typeof BIZ_LISTINGS[number]) => {
    setSelected(b);
    setView('detail');
  };

  return (
    <section className="section">
      <div className="wrap">
        <div className="topbar">
          <div>
            <h1>{view === 'list' ? 'Business Directory' : 'Business Profile'}</h1>
            <p>{view === 'list' ? 'Browse profiles, services, and reviews.' : 'Services, team, hours, and testimonials.'}</p>
          </div>
          {user && (
            <div>
              <button className="btn-solid" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Close Form' : 'Profile Your Business'}
              </button>
            </div>
          )}
        </div>

        {showForm && user && (
          <div style={{ marginBottom: 24 }}>
            <BusinessProfileForm onSave={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {view === 'list' ? (
          <>
            <div className="filter-bar">
              {BIZ_CATS.map(c => (
                <div key={c} className={`filter-chip${activeCat === c ? ' active' : ''}`} onClick={() => setActiveCat(c)}>{c}</div>
              ))}
              <div className="search-input" style={{ marginLeft: 'auto', maxWidth: 220 }}>
                <input type="text" placeholder="Search businesses…" value={query} onChange={e => setQuery(e.target.value)} />
              </div>
            </div>
            <div className="listing-grid" style={{ marginTop: 20 }}>
              {filtered.map((b, i) => (
                <div key={i} className="listing-card" onClick={() => openDetail(b)}>
                  <div className={`listing-media ${b.media}`}><span className="listing-tag">{b.cat}</span></div>
                  <div className="listing-body">
                    <div className="listing-title">{b.title}</div>
                    <div className="listing-desc">{b.desc}</div>
                    <div className="listing-meta"><span className="listing-price">★ {b.rating}</span><span className="listing-loc">{b.loc}</span></div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)', padding: '60px 0' }}>
                  No matching businesses. Try a different category or search term.
                </div>
              )}
            </div>
            <div className="final-cta" style={{ background: '#FAF3F8', color: 'var(--ink)', textAlign: 'center', marginTop: 40, border: '1px solid var(--line)' }}>
              <h2 style={{ color: 'var(--ink)' }}>Don&apos;t see your business?</h2>
              <p style={{ color: 'var(--muted)' }}>Claim your free profile and start reaching investors and customers today.</p>
              <Link href="/auth" className="btn-solid btn-lg">Create Business Profile</Link>
            </div>
          </>
        ) : selected && (
          <>
            <div className="mbreadcrumb"><a onClick={() => setView('list')}>Business Directory</a> / {selected.cat}</div>
            <h1 className="mpage-title" style={{ fontSize: 24, margin: '14px 0 4px' }}>{selected.title}</h1>
            <p className="mpage-sub" style={{ marginBottom: 18 }}>{selected.desc} ★ {selected.rating} · {selected.loc}, Rwanda</p>
            <div className="detail-grid">
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
                  <div className={`listing-media ${selected.media}`} style={{ height: 200, borderRadius: 12, gridRow: 'span 2' }} />
                  <div className={`listing-media ${selected.media === 'b' ? 'c' : 'b'}`} style={{ height: 96, borderRadius: 12 }} />
                  <div className={`listing-media ${selected.media === 'b' ? 'd' : 'a'}`} style={{ height: 96, borderRadius: 12 }} />
                  <div className={`listing-media ${selected.media === 'b' ? 'a' : 'd'}`} style={{ height: 96, borderRadius: 12 }} />
                  <div className={`listing-media ${selected.media}`} style={{ height: 96, borderRadius: 12 }} />
                </div>
                <div className="sub-h">About</div>
                <p style={{ color: 'var(--muted)', fontSize: 13, fontWeight: 500, lineHeight: 1.7 }}>{selected.desc} We pride ourselves on quality service and customer satisfaction.</p>
                <div className="sub-h">Services</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span className="badge" style={{ background: '#FAF3F8', color: 'var(--muted)' }}>Customer service</span>
                  <span className="badge" style={{ background: '#FAF3F8', color: 'var(--muted)' }}>Consultation</span>
                  <span className="badge" style={{ background: '#FAF3F8', color: 'var(--muted)' }}>{selected.cat}</span>
                </div>
                <div className="sub-h">Team</div>
                <div className="list-row">
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div className="avatar-sq" />
                    <div><div style={{ fontWeight: 700, fontSize: 13.5 }}>Manager</div><div style={{ fontSize: 11.5, color: 'var(--muted)', fontWeight: 600 }}>General Manager</div></div>
                  </div>
                </div>
                <div className="sub-h">Testimonials</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="testimonial-box">&quot;Excellent service and friendly staff.&quot;<div className="who">— Grace T., Kigali</div></div>
                  <div className="testimonial-box">&quot;Highly recommend for anyone visiting the area.&quot;<div className="who">— Daniel O., Nairobi</div></div>
                </div>
              </div>
              <div>
                <div className="card" style={{ position: 'sticky', top: 90 }}>
                  <div style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 12 }}>Operating hours</div>
                  <div className="list-row" style={{ padding: '7px 0', fontSize: 12.5, fontWeight: 600 }}><span>Mon – Fri</span><span>7:00 – 21:00</span></div>
                  <div className="list-row" style={{ padding: '7px 0', fontSize: 12.5, fontWeight: 600 }}><span>Sat – Sun</span><span>7:00 – 22:00</span></div>
                  <button className="btn-solid" style={{ width: '100%', marginTop: 14, padding: 12 }}>Contact Business</button>
                  <button className="btn-ghost" style={{ width: '100%', marginTop: 8, padding: 12 }} onClick={() => setView('list')}>Back to directory</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
