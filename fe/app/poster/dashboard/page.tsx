'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPost, fetchPosts } from '@/lib/api';
import { API_URL } from '@/lib/config';
import ProtectedRoute from '@/components/protected-route';

const CTA_OPTIONS = [
  'Explore Opportunity','Discover More','Get Started','Take Action Today','Learn More',
  'Join Now','Sign Up Free','Book a Visit','Contact Us','View Details','Claim Offer',
  'Request Info','Start Investing','See Listing','Reserve Spot','Apply Now','Shop Now',
  'Watch Video','Download Guide','Follow Updates','Subscribe',
];

const CHANNELS = [
  { id: 'fliiper', name: 'Fliiper', cost: 0, icon: '📰' },
  { id: 'instagram', name: 'Instagram', cost: 5, icon: '📸' },
  { id: 'facebook', name: 'Facebook', cost: 5, icon: '📘' },
  { id: 'tiktok', name: 'TikTok', cost: 5, icon: '🎵' },
];

export default function PosterDashboard() {
  return (
    <ProtectedRoute>
      <UpdateWizardContent />
    </ProtectedRoute>
  );
}

function UpdateWizardContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [link, setLink] = useState('');
  const [selectedCta, setSelectedCta] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [filter, setFilter] = useState('none');
  const [crop, setCrop] = useState('square');
  const [designTpl, setDesignTpl] = useState('bold');
  const [activeChannels, setActiveChannels] = useState<string[]>(['fliiper']);
  const [channelSchedule, setChannelSchedule] = useState<Record<string, { time: string; lang: string }>>({});
  const [previewTab, setPreviewTab] = useState('yoinfo');
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts().then(setPosts).catch(console.error).finally(() => setLoadingPosts(false));
  }, []);

  const toggleChannel = (id: string) => {
    setActiveChannels(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleImageSelect = (file: File | null) => {
    if (!file || !['image/jpeg','image/png','image/gif','image/webp'].includes(file.type)) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const estimatedCost = activeChannels.reduce((sum, id) => {
    const ch = CHANNELS.find(c => c.id === id);
    return sum + (ch?.cost || 0);
  }, 0);

  const goStep = (s: number) => { setStep(s); window.scrollTo(0, 0); };

  const publish = async () => {
    setPublishing(true);
    try {
      const token = localStorage.getItem('token');
      let imageUrl = '';
      if (imageFile && token) {
        const fd = new FormData();
        fd.append('image', imageFile);
        const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
        if (res.ok) { const d = await res.json(); imageUrl = d.url; }
      }
      const enriched = selectedCta ? `${body}\n\n[${selectedCta}]` : body;
      const newPost = await createPost(enriched, token!, title, imageUrl);
      setPosts(prev => [newPost, ...prev]);
      setStep(1); setTitle(''); setBody(''); setLink(''); setSelectedCta(null);
      setImageFile(null); setImagePreview(null); setActiveChannels(['fliiper']);
    } catch (err) { console.error(err); }
    finally { setPublishing(false); }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="wizard-nav-row">
          <Link href="/" className="wizard-nav-btn">← Back</Link>
          <Link href="/" className="wizard-nav-btn">⌂ Home</Link>
        </div>
        <div className="brand">
          <div className="brand-mark">U</div>
          <div><div className="brand-name">Update Wizard</div><div className="brand-sub">Invest, publish &amp; go social</div></div>
        </div>
        <div className="submodule-switcher">
          <Link href="/investments" className="submodule-tab"><span className="submodule-icon">📈</span> Investment Profiler</Link>
          <div className="submodule-tab active"><span className="submodule-icon">📣</span> Go Social</div>
        </div>
        <nav>
          <div className={`tool-nav-item${step >= 1 ? ' active' : ''}`} onClick={() => goStep(1)}><span className="nav-dot" /> Compose</div>
          <div className="tool-nav-item"><span className="nav-dot" /> Published Posts</div>
          <div className="tool-nav-item"><span className="nav-dot" /> Settings</div>
        </nav>
        <div className="sidebar-foot">Share news, events, and announcements with a call-to-action your audience can act on.</div>
      </aside>

      <main>
        <div className="topbar">
          <div>
            <h1>Compose</h1>
            <p>Write once, add a call-to-action, and publish.</p>
          </div>
        </div>

        <section>
          <div className="step-indicator">
            <div className={`step-dot${step === 1 ? ' active' : step > 1 ? ' done' : ''}`}>1</div><div className="step-line" />
            <div className={`step-dot${step === 2 ? ' active' : step > 2 ? ' done' : ''}`}>2</div><div className="step-line" />
            <div className={`step-dot${step === 3 ? ' active' : step > 3 ? ' done' : ''}`}>3</div><div className="step-line" />
            <div className={`step-dot${step === 4 ? ' active' : ''}`}>4</div>
          </div>
          <div className="step-labels" style={{ gap: 26 }}>
            <span className={step === 1 ? 'active' : ''}>Content</span>
            <span className={step === 2 ? 'active' : ''}>Creative</span>
            <span className={step === 3 ? 'active' : ''}>Channels</span>
            <span className={step === 4 ? 'active' : ''}>Review</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, alignItems: 'start', maxWidth: 1180 }}>
            <div className="card">
              {/* STEP 1: CONTENT */}
              <div className={`compose-step-panel${step === 1 ? ' show' : ''}`}>
                <div className="step-illustration-row">
                  <svg className="step-illustration-icon" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="30" fill="#FBEAF5" />
                    <path d="M14 26v12a4 4 0 0 0 4 4h4l10 8V14l-10 8h-4a4 4 0 0 0-4 4z" fill="#C1027D" />
                    <path d="M40 24c3 2.5 3 13.5 0 16" stroke="#8A0260" strokeWidth="3" strokeLinecap="round" />
                    <path d="M46 19c6 5 6 21 0 26" stroke="#8A0260" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <div className="step-illustration-text">
                    <div className="step-illustration-title">Write your update</div>
                    <div className="step-illustration-caption">Add a headline, a picture, and a button.</div>
                  </div>
                </div>
                <div className="field-group" style={{ marginTop: 14 }}>
                  <label className="field-label">Headline</label>
                  <input type="text" className="input" placeholder="e.g. New guided hikes now bookable" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="field-group" style={{ marginTop: 14 }}>
                  <label className="field-label">Details</label>
                  <textarea className="textarea" placeholder="Tell your audience what's happening…" value={body} onChange={e => setBody(e.target.value)} />
                </div>
                <div className="field-group" style={{ marginTop: 14 }}>
                  <label className="field-label">Link (optional)</label>
                  <input type="url" className="input" placeholder="https://…" value={link} onChange={e => setLink(e.target.value)} />
                </div>
                <div className="field-group" style={{ marginTop: 16 }}>
                  <label className="field-label">Call-to-action — choose 1 of 21</label>
                  <div className="cta-picker">
                    {CTA_OPTIONS.map(c => (
                      <div key={c} className={`cta-opt${selectedCta === c ? ' selected' : ''}`} onClick={() => setSelectedCta(c)}>{c}</div>
                    ))}
                  </div>
                </div>
                <div className="compose-step-nav"><span /><button type="button" className="btn-solid" onClick={() => goStep(2)}>Next: Creative →</button></div>
              </div>

              {/* STEP 2: CREATIVE */}
              <div className={`compose-step-panel${step === 2 ? ' show' : ''}`}>
                <div className="step-illustration-row">
                  <svg className="step-illustration-icon" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="30" fill="#FBEAF5" />
                    <rect x="14" y="18" width="28" height="22" rx="3" fill="#C1027D" />
                    <circle cx="21" cy="26" r="3" fill="#fff" />
                    <path d="M14 36l7-7 6 5 8-9 7 8v4a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3z" fill="#8FD14F" />
                  </svg>
                  <div className="step-illustration-text">
                    <div className="step-illustration-title">Make it look good</div>
                    <div className="step-illustration-caption">Drag a photo in, or upload your own finished picture.</div>
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Image</label>
                  <div className="photo-upload-wrap">
                    {imagePreview ? (
                      <div className="photo-preview-box">
                        <img src={imagePreview} alt="Preview" />
                      </div>
                    ) : (
                      <label className="dropzone" onClick={() => fileInputRef.current?.click()}>
                        <svg className="dropzone-illustration" viewBox="0 0 48 48" fill="none">
                          <rect x="6" y="20" width="36" height="20" rx="4" fill="#FBEAF5" />
                          <path d="M24 6v22M24 6l-8 8M24 6l8 8" stroke="#C1027D" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="main-txt">Click to attach an image</div>
                        <div className="sub-txt">or drag a photo here</div>
                      </label>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageSelect(e.target.files?.[0] || null)} />
                  </div>
                  <div className="photo-tool-label">Filter</div>
                  <div className="photo-tool-row">
                    {['none','vivid','bw','warm','cool'].map(f => (
                      <button key={f} type="button" className={`photo-tool-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f === 'bw' ? 'B&W' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
                    ))}
                  </div>
                  <div className="photo-tool-label">Crop</div>
                  <div className="photo-tool-row">
                    {['square','portrait','landscape'].map(c => (
                      <button key={c} type="button" className={`photo-tool-btn${crop === c ? ' active' : ''}`} onClick={() => setCrop(c)}>{c.charAt(0).toUpperCase() + c.slice(1)}</button>
                    ))}
                  </div>
                </div>
                <div className="field-group" style={{ marginTop: 16 }}>
                  <label className="field-label">Design template</label>
                  <div className="design-tpl-row">
                    {['bold','minimal','festive','corporate'].map(t => (
                      <div key={t} className={`design-tpl ${t}${designTpl === t ? ' selected' : ''}`} onClick={() => setDesignTpl(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>
                    ))}
                  </div>
                </div>
                <div className="compose-step-nav"><button type="button" className="btn-ghost" onClick={() => goStep(1)}>← Back</button><button type="button" className="btn-solid" onClick={() => goStep(3)}>Next: Channels →</button></div>
              </div>

              {/* STEP 3: CHANNELS */}
              <div className={`compose-step-panel${step === 3 ? ' show' : ''}`}>
                <div className="step-illustration-row">
                  <svg className="step-illustration-icon" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="30" fill="#FBEAF5" />
                    <circle cx="20" cy="22" r="6" fill="#C1027D" />
                    <circle cx="44" cy="18" r="5" fill="#8FD14F" />
                    <circle cx="46" cy="42" r="6" fill="#E8862B" />
                    <circle cx="18" cy="44" r="5" fill="#8A0260" />
                    <path d="M20 22l24-4M20 22l26 20M44 18l2 24" stroke="#C1027D" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <div className="step-illustration-text">
                    <div className="step-illustration-title">Choose where it goes</div>
                    <div className="step-illustration-caption">Pick the apps to send to, and words that describe your post.</div>
                  </div>
                </div>
                <div className="fliiper-free-banner">
                  <span>🎉</span>
                  <span><b>Fliiper is free.</b> No Ibiceri needed to post there — but you must pick at least one hashtag so the right people see it.</span>
                </div>
                <div className="field-group" style={{ marginTop: 14 }}>
                  <label className="field-label">Post to — schedule and language, channel by channel</label>
                  <div className="chan-sched-list">
                    {CHANNELS.map(ch => {
                      const on = activeChannels.includes(ch.id);
                      const sched = channelSchedule[ch.id] || { time: '', lang: 'en' };
                      return (
                        <div key={ch.id} className={`chan-sched-row${on ? ' on' : ''}`}>
                          <div className="chan-sched-top">
                            <div className="chan-sched-name" onClick={() => toggleChannel(ch.id)}>
                              <span className="dot" /> {ch.icon} {ch.name}
                            </div>
                            {ch.cost > 0 && <span className="chan-cost-tag">{ch.cost} Ibiceri</span>}
                          </div>
                          {on && (
                            <div className="chan-sched-detail">
                              <label>Language</label>
                              <select value={sched.lang} onChange={e => setChannelSchedule(prev => ({ ...prev, [ch.id]: { ...sched, lang: e.target.value } }))}>
                                <option value="en">English</option>
                                <option value="rw">Kinyarwanda</option>
                              </select>
                              <label>Schedule</label>
                              <input type="datetime-local" value={sched.time} onChange={e => setChannelSchedule(prev => ({ ...prev, [ch.id]: { ...sched, time: e.target.value } }))} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="compose-step-nav"><button type="button" className="btn-ghost" onClick={() => goStep(2)}>← Back</button><button type="button" className="btn-solid" onClick={() => goStep(4)}>Next: Review →</button></div>
              </div>

              {/* STEP 4: REVIEW */}
              <div className={`compose-step-panel${step === 4 ? ' show' : ''}`}>
                <div className="step-illustration-row">
                  <svg className="step-illustration-icon" viewBox="0 0 64 64" fill="none">
                    <circle cx="32" cy="32" r="30" fill="#FBEAF5" />
                    <rect x="16" y="14" width="26" height="34" rx="3" fill="#fff" stroke="#C1027D" strokeWidth="2.5" />
                    <path d="M21 22h16M21 29h16M21 36h10" stroke="#C1027D" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="41" cy="42" r="11" fill="#8FD14F" />
                    <path d="M36 42l4 4 6-8" stroke="#1F6B3A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="step-illustration-text">
                    <div className="step-illustration-title">Check and send</div>
                    <div className="step-illustration-caption">Look at the preview, then press the big button.</div>
                  </div>
                </div>
                <div className="sub-h" style={{ marginTop: 0 }}>Review before you publish</div>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', fontWeight: 500, marginBottom: 14 }}>Check the preview on the right for every channel you selected, then publish or schedule.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, padding: '10px 14px', background: '#FFF7E8', borderRadius: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#8A5A00' }}>Estimated cost</span>
                  <span className="chan-cost-tag">{estimatedCost} Ibiceri</span>
                </div>
                <button className="btn-solid" style={{ width: '100%', padding: 13, marginTop: 16 }} onClick={publish} disabled={publishing || (!body.trim() && !title.trim())}>
                  {publishing ? 'Publishing…' : 'Publish / Schedule Post'}
                </button>
                <div className="compose-step-nav"><button type="button" className="btn-ghost" onClick={() => goStep(3)}>← Back</button><span /></div>
              </div>
            </div>

            {/* PREVIEW PANEL */}
            <div>
              <div className="preview-tabs">
                {['yoinfo','instagram','facebook','tiktok'].map(t => (
                  <div key={t} className={`preview-tab${previewTab === t ? ' active' : ''}`} onClick={() => setPreviewTab(t)}>
                    {t === 'yoinfo' ? 'Fliiper' : t.charAt(0).toUpperCase() + t.slice(1)}
                    <span className="mini-dot" />
                  </div>
                ))}
              </div>

              <div className={`platform-mock${previewTab === 'yoinfo' ? ' show' : ''}`}>
                <div className="preview-post-card">
                  <div className="preview-post-label">yoInfo Fliiper preview</div>
                  {imagePreview && <div className="preview-post-media"><img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                  <div className="preview-post-title">{title || 'Your headline appears here'}</div>
                  <div className="preview-post-body">{body || 'Post details will show up here as you type.'}</div>
                  {selectedCta && <div className="preview-post-cta">{selectedCta}</div>}
                </div>
              </div>

              <div className={`platform-mock${previewTab === 'instagram' ? ' show' : ''}`}>
                <div className="ig-mock">
                  <div className="ig-mock-head"><div className="ig-mock-avatar" /><div className="ig-mock-name">yourbusiness</div></div>
                  {imagePreview && <div className="ig-mock-media"><img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                  {!imagePreview && <div className="ig-mock-media" />}
                  <div className="ig-mock-icons">♡ 💬 ➤</div>
                  <div className="ig-mock-caption"><b>yourbusiness</b> {body || 'Your caption will appear here.'}</div>
                </div>
              </div>

              <div className={`platform-mock${previewTab === 'facebook' ? ' show' : ''}`}>
                <div className="fb-mock">
                  <div className="fb-mock-head"><div className="fb-mock-avatar" /><div><div className="fb-mock-name">Your Business</div><div className="fb-mock-time">Just now · 🌐</div></div></div>
                  <div className="fb-mock-caption">{body || 'Your post will appear here.'}</div>
                  {imagePreview && <div className="fb-mock-media"><img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                  {!imagePreview && <div className="fb-mock-media" />}
                  <div className="fb-mock-icons"><span>👍 Like</span><span>💬 Comment</span><span>↪ Share</span></div>
                </div>
              </div>

              <div className={`platform-mock${previewTab === 'tiktok' ? ' show' : ''}`}>
                <div className="tiktok-phone-frame">
                  <div className="tiktok-phone-notch" />
                  <div className="tiktok-mock">
                    {imagePreview && <div className="tiktok-mock-media"><img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
                    {!imagePreview && <div className="tiktok-mock-media" />}
                    <div className="tiktok-mock-side">
                      <div className="tiktok-mock-icon">♥</div>
                      <div className="tiktok-mock-icon">💬</div>
                      <div className="tiktok-mock-icon">↪</div>
                    </div>
                    <div className="tiktok-mock-body">
                      <div className="tiktok-mock-caption">{body || 'Your caption will appear here.'}</div>
                      <div className="tiktok-mock-music"><span className="tiktok-mock-music-icon">♪</span><span>Upbeat Corporate</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
