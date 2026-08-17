'use client';

import { useState, useRef } from 'react';
import ProtectedRoute from '@/components/protected-route';
import { useIbiceri } from '@/components/ibiceri-provider';

type View = 'dashboard' | 'library' | 'media' | 'new' | 'settings';

interface ContentItem {
  title: string;
  cat: string;
  date: string;
  status: string;
  media: string;
}

interface MediaAsset {
  name: string;
  type: string;
  media: string;
}

const SEED_CONTENT: ContentItem[] = [
  { title: 'yoInfo announces expansion to five languages', cat: 'News & Announcements', date: '14 Aug 2026', status: 'Published', media: 'a' },
  { title: 'Statement on RITF 2026 exhibitor turnout', cat: 'Press Releases', date: '10 Aug 2026', status: 'Published', media: 'b' },
  { title: 'Update Wizard now supports scheduled multi-channel posts', cat: 'Products & Services', date: '05 Aug 2026', status: 'Published', media: 'c' },
  { title: 'Why local information beats global noise', cat: 'Thought Leadership', date: '29 Jul 2026', status: 'Published', media: 'd' },
  { title: 'Request for proposals: regional distribution partner', cat: 'Tenders & Opportunities', date: '22 Jul 2026', status: 'Draft', media: 'a' },
  { title: 'yoInfo at the Kigali Innovation Summit', cat: 'Events', date: '18 Jul 2026', status: 'Published', media: 'b' },
  { title: 'Meet our Head of Partnerships', cat: 'Executive & Corporate Profiles', date: '11 Jul 2026', status: 'Draft', media: 'c' },
];

const SEED_MEDIA: MediaAsset[] = [
  { name: 'yoInfo_logo_primary.png', type: 'Logos', media: 'a' },
  { name: 'RITF2026_launch_photo.jpg', type: 'Photos', media: 'b' },
  { name: 'partner_signing_event.mp4', type: 'Videos', media: 'c' },
  { name: 'press_kit_2026.pdf', type: 'Documents', media: 'd' },
  { name: 'founder_interview_ep3.mp3', type: 'Podcasts', media: 'a' },
  { name: 'stall_activation_reel.mp4', type: 'Videos', media: 'b' },
];

const SIDEBAR = [
  { view: 'dashboard' as View, label: 'Dashboard' },
  { view: 'library' as View, label: 'Content Library' },
  { view: 'media' as View, label: 'Media Library' },
  { view: 'new' as View, label: 'New Content' },
  { view: 'settings' as View, label: 'Settings' },
];

const CATEGORIES = ['News & Announcements', 'Press Releases', 'Products & Services', 'Thought Leadership', 'Tenders & Opportunities', 'Events', 'Executive & Corporate Profiles'];
const MEDIA_CATS = ['Photos', 'Videos', 'Logos', 'Documents', 'Podcasts'];

const BOOST_OPTIONS = [
  { key: 'djMention', label: 'KT Radio DJ mention', cost: 2, qty: true },
  { key: 'ktIg', label: 'KT Instagram boost', cost: 2, qty: false },
  { key: 'ktX', label: 'KT X (Twitter) boost', cost: 2, qty: false },
  { key: 'ktFb', label: 'KT Facebook boost', cost: 2, qty: false },
  { key: 'ktPress', label: 'Press release — KT Press (English)', cost: 2, qty: false },
  { key: 'kigaliToday', label: 'Press release — Kigali Today (Kinyarwanda)', cost: 2, qty: false },
  { key: 'radioJingle', label: 'Radio announcement, your own jingle', cost: 10, qty: true },
];

export default function NewsroomPage() {
  const { balance, spend } = useIbiceri();
  const [view, setView] = useState<View>('dashboard');
  const [toast, setToast] = useState<string | null>(null);
  const [content, setContent] = useState<ContentItem[]>(SEED_CONTENT);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(SEED_MEDIA);
  const [libCat, setLibCat] = useState('all');
  const [libSearch, setLibSearch] = useState('');
  const [mediaCat, setMediaCat] = useState('all');

  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [distFliiper, setDistFliiper] = useState(true);
  const [distSocial, setDistSocial] = useState(false);
  const [boosts, setBoosts] = useState<Record<string, { on: boolean; qty: number }>>({});
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');

  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');
  const [orgEmail, setOrgEmail] = useState('');

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const newMediaInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const goHome = () => { window.location.href = '/'; };

  const viewTitle = (
    view === 'dashboard' ? 'Dashboard' :
    view === 'library' ? 'Content Library' :
    view === 'media' ? 'Media Library' :
    view === 'new' ? 'New Content' : 'Settings'
  );
  const viewSub = (
    view === 'dashboard' ? "Your organisation's content depository, at a glance." :
    view === 'library' ? 'Browse and manage all published and draft content.' :
    view === 'media' ? 'Upload and organise photos, videos, logos, and documents.' :
    view === 'new' ? 'Create a new press release, article, or announcement.' :
    "Configure your organisation's public profile."
  );

  const filteredContent = content.filter(c =>
    (libCat === 'all' || c.cat === libCat) &&
    (libSearch === '' || c.title.toLowerCase().includes(libSearch.toLowerCase()))
  );

  const filteredMedia = mediaAssets.filter(m => mediaCat === 'all' || m.type === mediaCat);

  const toggleBoost = (key: string) => {
    setBoosts(prev => {
      const current = prev[key] || { on: false, qty: 1 };
      return { ...prev, [key]: { ...current, on: !current.on } };
    });
  };

  const setBoostQty = (key: string, qty: number) => {
    setBoosts(prev => ({ ...prev, [key]: { ...(prev[key] || { on: false, qty: 1 }), qty: Math.max(1, qty) } }));
  };

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, '');
    if (tag && !hashtags.includes(tag)) {
      setHashtags(prev => [...prev, tag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(prev => prev.filter(t => t !== tag));
  };

  const calcCost = () => {
    let total = 0;
    if (distFliiper) total += 1;
    if (distSocial) total += 1;
    for (const opt of BOOST_OPTIONS) {
      const b = boosts[opt.key];
      if (b?.on) total += opt.cost * (opt.qty ? (b.qty || 1) : 1);
    }
    return total;
  };

  const publish = () => {
    if (!newTitle.trim()) { showToast('Add a title before publishing'); return; }
    const cost = calcCost();
    if (cost > 0 && !spend(cost, 'Newsroom publish')) return;
    const item: ContentItem = {
      title: newTitle.trim(),
      cat: newCategory,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Published',
      media: 'a',
    };
    setContent(prev => [item, ...prev]);
    showToast(`Published: ${newTitle.trim()}${cost > 0 ? ` — ${cost} Ibiceri spent` : ''}`);
    setNewTitle('');
    setNewBody('');
    setView('library');
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const type = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? 'Photos' :
                 ['mp4', 'mov', 'avi'].includes(ext) ? 'Videos' :
                 ['pdf', 'doc', 'docx'].includes(ext) ? 'Documents' : 'Documents';
    setMediaAssets(prev => [...prev, { name: file.name, type, media: 'a' }]);
    showToast(file.name + ' uploaded');
  };

  return (
    <ProtectedRoute>
      <div className="app">
        <aside className="sidebar">
          <div className="wizard-nav-row">
            <div className="wizard-nav-btn" onClick={goHome}>← Back</div>
            <div className="wizard-nav-btn" onClick={goHome}>⌂ Home</div>
          </div>
          <div className="brand">
            <div className="brand-mark">CN</div>
            <div>
              <div className="brand-name">Comms Newsroom</div>
              <div className="brand-sub">Your organisation&apos;s digital newsroom</div>
            </div>
          </div>
          <nav>
            {SIDEBAR.map(item => (
              <div key={item.view}
                className={`tool-nav-item ${view === item.view ? 'active' : ''}`}
                onClick={() => setView(item.view)}>
                <span className="nav-dot" />
                {item.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-foot">A single, always-available source of verified information for journalists, partners, and the public.</div>
        </aside>

        <main>
          <div className="topbar">
            <div>
              <h1>{viewTitle}</h1>
              <p>{viewSub}</p>
            </div>
          </div>

          <div className="content">
            {/* ═══════════════ DASHBOARD ═══════════════ */}
            {view === 'dashboard' && (
              <>
                <div className="stat-strip mb-5">
                  <div className="stat-cell"><div className="num">{content.filter(c => c.status === 'Published').length}</div><div className="lbl">Published items</div></div>
                  <div className="stat-cell"><div className="num">{content.filter(c => c.cat === 'Press Releases').length}</div><div className="lbl">Press releases this month</div></div>
                  <div className="stat-cell"><div className="num">{mediaAssets.length}</div><div className="lbl">Media assets</div></div>
                  <div className="stat-cell"><div className="num">{content.filter(c => c.status === 'Published').length}</div><div className="lbl">Distributed to Fliiper</div></div>
                </div>

                <div className="flex gap-3 mb-5 flex-wrap">
                  <button className="btn btn-primary" onClick={() => setView('new')}>+ New Content</button>
                  <button className="btn btn-outline" onClick={() => setView('library')}>Browse Content Library</button>
                  <button className="btn btn-outline" onClick={() => setView('media')}>Open Media Library</button>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Recently published</h3>
                    <button className="text-xs font-bold text-[#C1027D]" onClick={() => setView('library')}>View all →</button>
                  </div>
                  {content.slice(0, 5).map((c, i) => (
                    <div key={i} className="list-row">
                      <div>
                        <div className="font-bold text-sm">{c.title}</div>
                        <div className="text-xs text-gray-400">{c.cat} · {c.date}</div>
                      </div>
                      <span className={`badge ${c.status === 'Published' ? 'success' : 'info'}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ═══════════════ CONTENT LIBRARY ═══════════════ */}
            {view === 'library' && (
              <>
                <div className="filter-bar mb-5">
                  <div className={`filter-chip ${libCat === 'all' ? 'active' : ''}`} onClick={() => setLibCat('all')}>All</div>
                  {CATEGORIES.map(cat => (
                    <div key={cat} className={`filter-chip ${libCat === cat ? 'active' : ''}`} onClick={() => setLibCat(cat)}>{cat}</div>
                  ))}
                  <div className="search-input ml-auto" style={{ maxWidth: 220 }}>
                    <input type="text" placeholder="Search content…" value={libSearch} onChange={e => setLibSearch(e.target.value)} />
                  </div>
                </div>
                <div className="listing-grid">
                  {filteredContent.length === 0 ? (
                    <div className="text-center text-gray-400 py-16 col-span-full">No content matches this filter.</div>
                  ) : filteredContent.map((c, i) => (
                    <div key={i} className="listing-card">
                      <div className={`listing-media ${c.media}`}><span className="listing-tag">{c.cat}</span></div>
                      <div className="listing-body">
                        <div className="listing-title">{c.title}</div>
                        <div className="listing-desc">{c.date}</div>
                        <div className="listing-meta">
                          <span className="listing-price" style={{ color: c.status === 'Published' ? 'var(--ok)' : 'var(--muted)' }}>{c.status}</span>
                          <span className="listing-loc">{c.cat}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ═══════════════ MEDIA LIBRARY ═══════════════ */}
            {view === 'media' && (
              <>
                <div className="filter-bar mb-5">
                  <div className={`filter-chip ${mediaCat === 'all' ? 'active' : ''}`} onClick={() => setMediaCat('all')}>All</div>
                  {MEDIA_CATS.map(cat => (
                    <div key={cat} className={`filter-chip ${mediaCat === cat ? 'active' : ''}`} onClick={() => setMediaCat(cat)}>{cat}</div>
                  ))}
                </div>

                <div className="field-group mb-5" style={{ maxWidth: 460 }}>
                  <label className="dropzone" onClick={() => mediaInputRef.current?.click()}>
                    <svg className="dropzone-illustration" viewBox="0 0 48 48" fill="none">
                      <rect x="6" y="20" width="36" height="20" rx="4" fill="#FBEAF5"/>
                      <path d="M24 6v22M24 6l-8 8M24 6l8 8" stroke="#C1027D" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="main-txt">Click to upload media</div>
                    <div className="sub-txt">or drag photos, videos, or documents here</div>
                  </label>
                  <input type="file" accept="image/*,video/*,.pdf,.doc,.docx" ref={mediaInputRef} className="hidden" onChange={handleMediaUpload} />
                </div>

                <div className="listing-grid">
                  {filteredMedia.length === 0 ? (
                    <div className="text-center text-gray-400 py-16 col-span-full">No media in this category yet.</div>
                  ) : filteredMedia.map((m, i) => (
                    <div key={i} className="listing-card">
                      <div className={`listing-media ${m.media}`}><span className="listing-tag">{m.type}</span></div>
                      <div className="listing-body">
                        <div className="listing-title text-xs break-all">{m.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ═══════════════ NEW CONTENT ═══════════════ */}
            {view === 'new' && (
              <div className="detail-grid">
                <div>
                  <div className="card">
                    <h3 className="font-bold mb-4">Content details</h3>
                    <div className="field-group">
                      <label className="field-label">Category</label>
                      <select className="input" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                        {CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="field-group mt-3">
                      <label className="field-label">Title</label>
                      <input type="text" className="input" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. yoInfo announces partnership with..." />
                    </div>
                    <div className="field-group mt-3">
                      <label className="field-label">Body</label>
                      <textarea className="textarea" style={{ minHeight: 140 }} value={newBody} onChange={e => setNewBody(e.target.value)} placeholder="Write the full announcement, statement, or article…" />
                    </div>
                    <div className="field-group mt-3">
                      <label className="field-label">Attach media</label>
                      <label className="dropzone" onClick={() => newMediaInputRef.current?.click()}>
                        <svg className="dropzone-illustration" viewBox="0 0 48 48" fill="none">
                          <rect x="6" y="20" width="36" height="20" rx="4" fill="#FBEAF5"/>
                          <path d="M24 6v22M24 6l-8 8M24 6l8 8" stroke="#C1027D" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="main-txt">Click to attach a photo or document</div>
                        <div className="sub-txt">or drag it here</div>
                      </label>
                      <input type="file" accept="image/*,video/*,.pdf" ref={newMediaInputRef} className="hidden" onChange={() => showToast('Media attached')} />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="card" style={{ position: 'sticky', top: 90 }}>
                    <h3 className="font-bold mb-2">Distribution</h3>
                    <p className="text-xs text-gray-400 mb-3">Publishing to the Newsroom requires Ibiceri. You can also distribute it further through the yoInfo ecosystem.</p>

                    <div className="flex flex-col gap-2 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm">
                        <input type="checkbox" checked={distFliiper} onChange={e => setDistFliiper(e.target.checked)} className="accent-[#C1027D]" />
                        yoInfo Fliiper
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm">
                        <input type="checkbox" checked={distSocial} onChange={e => setDistSocial(e.target.checked)} className="accent-[#C1027D]" />
                        Go Social
                      </label>
                    </div>

                    {distFliiper && (
                      <div className="field-group mb-4">
                        <label className="field-label">Hashtags <span className="text-red-500">*required for Fliiper</span></label>
                        <div className="flex gap-2 flex-wrap mb-1">
                          {hashtags.map(tag => (
                            <span key={tag} className="bg-[#FBEAF5] text-[#C1027D] text-xs font-bold px-2 py-1 rounded-full cursor-pointer" onClick={() => removeHashtag(tag)}>#{tag} ×</span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input type="text" className="input flex-1" value={hashtagInput} onChange={e => setHashtagInput(e.target.value)} placeholder="Type hashtag and press Enter" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHashtag(); } }} />
                          <button className="btn btn-outline btn-sm" onClick={addHashtag}>Add</button>
                        </div>
                      </div>
                    )}

                    <h4 className="font-bold text-sm mb-2 mt-4">Media Boost <span className="text-gray-400 font-normal text-xs">(optional, via KT &amp; Kigali Today)</span></h4>
                    <div className="flex flex-col gap-2">
                      {BOOST_OPTIONS.map(opt => {
                        const b = boosts[opt.key] || { on: false, qty: 1 };
                        return (
                          <div key={opt.key} className="flex items-center justify-between gap-2">
                            <label className="flex items-center gap-2 cursor-pointer font-semibold text-sm flex-1">
                              <input type="checkbox" checked={b.on} onChange={() => toggleBoost(opt.key)} className="accent-[#C1027D]" />
                              {opt.label}
                            </label>
                            {opt.qty && b.on && (
                              <input type="number" className="input w-16 text-center" value={b.qty} min={1} onChange={e => setBoostQty(opt.key, parseInt(e.target.value) || 1)} />
                            )}
                            <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">{opt.cost} Ibiceri{opt.qty ? ' each' : ''}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Need a long-term contract instead? Call <b>0793 903 844</b> to discuss.</p>

                    <div className="card mt-4" style={{ padding: '12px 14px' }}>
                      <h4 className="font-bold text-xs mb-2">Cost breakdown</h4>
                      {distFliiper && <div className="flex justify-between text-xs"><span>yoInfo Fliiper</span><span className="font-semibold">1 Ibiceri</span></div>}
                      {distSocial && <div className="flex justify-between text-xs"><span>Go Social</span><span className="font-semibold">1 Ibiceri</span></div>}
                      {BOOST_OPTIONS.map(opt => {
                        const b = boosts[opt.key];
                        if (!b?.on) return null;
                        const cost = opt.cost * (opt.qty ? (b.qty || 1) : 1);
                        return (
                          <div key={opt.key} className="flex justify-between text-xs">
                            <span>{opt.label}{opt.qty && (b.qty || 1) > 1 ? ` ×${b.qty}` : ''}</span>
                            <span className="font-semibold">{cost} Ibiceri</span>
                          </div>
                        );
                      })}
                      <div className="flex justify-between text-sm font-extrabold border-t border-gray-200 pt-2 mt-2">
                        <span>Total</span>
                        <span className="text-[#C1027D]">{calcCost()} Ibiceri</span>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-400 font-semibold mt-2">Your balance: {balance.toLocaleString()} Ibiceri</div>

                    <button className="btn btn-primary btn-full mt-3" onClick={publish}>Publish to Newsroom</button>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════ SETTINGS ═══════════════ */}
            {view === 'settings' && (
              <div className="card" style={{ maxWidth: 520 }}>
                <h3 className="font-bold mb-4">Organisation profile</h3>
                <div className="field-group">
                  <label className="field-label">Organisation logo</label>
                  <label className="dropzone" onClick={() => logoInputRef.current?.click()}>
                    <svg className="dropzone-illustration" viewBox="0 0 48 48" fill="none">
                      <rect x="6" y="20" width="36" height="20" rx="4" fill="#FBEAF5"/>
                      <path d="M24 6v22M24 6l-8 8M24 6l8 8" stroke="#C1027D" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="main-txt">Click to upload your logo</div>
                  </label>
                  <input type="file" accept="image/*" ref={logoInputRef} className="hidden" onChange={() => showToast('Logo uploaded')} />
                </div>
                <div className="field-group mt-3">
                  <label className="field-label">Organisation name</label>
                  <input type="text" className="input" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Edupoto Rwanda Ltd" />
                </div>
                <div className="field-group mt-3">
                  <label className="field-label">Short description</label>
                  <textarea className="textarea" value={orgDesc} onChange={e => setOrgDesc(e.target.value)} placeholder="A short public description used across your published content." />
                </div>
                <div className="field-group mt-3">
                  <label className="field-label">Official contact email</label>
                  <input type="email" className="input" value={orgEmail} onChange={e => setOrgEmail(e.target.value)} placeholder="comms@yourorganisation.rw" />
                </div>
                <button className="btn btn-primary mt-4" onClick={() => showToast('Organisation profile saved')}>Save Profile</button>
              </div>
            )}
          </div>

          {toast && <div className="toast">{toast}</div>}
        </main>
      </div>
    </ProtectedRoute>
  );
}
