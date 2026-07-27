'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, fetchPosts, fetchTags } from '@/lib/api';
import { API_URL } from '@/lib/config';
import ToolLayout from '@/components/tool-layout';
import ProtectedRoute from '@/components/protected-route';

const TOOL_NAV = [
  { label: 'Update Wizard', href: '/poster/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { label: 'Blast Wizard', href: '/messaging', icon: 'M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.111.431-.173.869-.173 1.315 0 .447.062.884.173 1.315m0-9.665a24.301 24.301 0 003.484.045m-3.484 0a24.27 24.27 0 01-3.484-.045' },
  { label: 'Business Profiling', href: '/business', icon: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 0113.5 9h1.5a1.5 1.5 0 011.5 1.5v8.25' },
];

const MAX_WORDS = 250;
const MAX_HEADER_CHARS = 200;

const CTA_CATEGORIES = {
  'Contact & Inquiries': ['Book Now', 'Schedule a Visit', 'Request a Quote', 'Get a Consultation'],
  'E-Commerce': ['Reserve Your Spot', 'Order Now', 'Browse Catalogue', 'Add to Cart'],
  'Events & RSVP': ['Reserve Your Spot', 'Register Now', 'Sign Up Today', 'Join Now'],
  'Appointments & Visits': ['Book Now', 'Schedule a Visit', 'Get a Consultation', 'Reserve Your Spot'],
  'Engagement': ['Explore Opportunity', 'View Full Profile', 'Start a Conversation', 'Discover More', 'Go for It', "Don't Miss Out", 'Grab This Offer', 'Take Action Today', 'Get Started', 'Claim Your Listing'],
};

type ViewType = 'compose' | 'published' | 'settings';

export default function PosterDashboard() {
  const [view, setView] = useState<ViewType>('compose');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [links, setLinks] = useState<{ url: string; title?: string }[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tags, setTags] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) { router.push('/auth'); return; }
    fetchPosts().then(setPosts).catch(console.error).finally(() => setLoadingPosts(false));
  }, [router]);

  useEffect(() => { fetchTags().then(setTags).catch(console.error); }, []);

  const handleImageSelect = (file: File | null) => {
    if (!file || !['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const isOverWordLimit = wordCount > MAX_WORDS;
  const canPublish = content.trim().length > 0 && !isOverWordLimit && selectedAction;

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    try { new URL(newLinkUrl); } catch { return; }
    setLinks(prev => [...prev, { url: newLinkUrl, title: newLinkTitle || undefined }]);
    setNewLinkUrl(''); setNewLinkTitle('');
  };

  const resetForm = () => {
    setTitle(''); setContent(''); removeImage(); setSelectedTags([]);
    setLinks([]); setSelectedEventId(null); setSelectedAction(null);
  };

  const handlePublish = async () => {
    setIsSubmitting(true); setMessage(null);
    try {
      const token = localStorage.getItem('token');
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch(`${API_URL}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }
      const enrichedContent = selectedAction ? `${content}\n\n[${selectedAction}]` : content;
      const newPost = await createPost(enrichedContent, token!, title, imageUrl, selectedTags, links, selectedEventId || undefined);
      resetForm();
      setPosts(prev => [newPost, ...prev]);
      setMessage({ type: 'success', text: 'Update published successfully!' });
      setTimeout(() => setMessage(null), 5000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to publish update.' });
    } finally { setIsSubmitting(false); }
  };

  return (
    <ProtectedRoute>
      <ToolLayout
        title=""
        subtitle=""
        navItems={TOOL_NAV}
      >
        {/* View Tabs */}
        <div className="flex items-center gap-4 mb-6">
          {(['compose', 'published', 'settings'] as ViewType[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-sm font-bold pb-2 border-b-2 transition-colors capitalize ${
                view === v ? 'text-[#C1027D] border-[#C1027D]' : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* ═══ COMPOSE ═══ */}
        {view === 'compose' && (
          <div className="grid lg:grid-cols-2 gap-6 animate-fade-in-up">
            {/* Form */}
            <div className="space-y-5">
              {message && (
                <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium ${
                  message.type === 'success' ? 'bg-[#D93F9E]/5 border border-[#D93F9E]/20 text-[#C1027D]' : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="card space-y-5">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">What update do you have today?</h3>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title (optional)</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={MAX_HEADER_CHARS} placeholder="Give your post a catchy headline..." className="input" />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                  <textarea value={content} onChange={e => setContent(e.target.value)} className="textarea min-h-[160px]" placeholder="Share your update, announcement, or news..." autoFocus />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-32 rounded-full overflow-hidden bg-gray-200">
                        <div className={`h-full rounded-full transition-all duration-300 ${wordCount === 0 ? 'w-0 bg-gray-300' : isOverWordLimit ? 'w-full bg-red-500' : wordCount > MAX_WORDS * 0.8 ? 'w-5/6 bg-amber-500' : 'w-1/2 bg-[#C1027D]'}`} />
                      </div>
                      <span className={`text-xs font-semibold tabular-nums ${isOverWordLimit ? 'text-red-500' : wordCount > MAX_WORDS * 0.8 ? 'text-amber-500' : 'text-gray-400'}`}>
                        {wordCount}/{MAX_WORDS}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image (optional)</label>
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-[#f0e4ec] group">
                      <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover" />
                      <button onClick={removeImage} className="absolute top-2 right-2 px-3 py-1.5 bg-white rounded-lg text-xs font-semibold text-gray-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                    </div>
                  ) : (
                    <div onDragOver={e => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={e => { e.preventDefault(); setIsDragOver(false); handleImageSelect(e.dataTransfer.files?.[0] || null); }} onClick={() => fileInputRef.current?.click()} className={`dropzone ${isDragOver ? 'dragover' : ''}`}>
                      <div className="font-semibold text-sm text-gray-600">Click to upload or drag and drop</div>
                      <div className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, WebP</div>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={e => handleImageSelect(e.target.files?.[0] || null)} className="hidden" />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: any) => {
                      const isSelected = selectedTags.includes(tag.id);
                      return (
                        <button key={tag.id} onClick={() => setSelectedTags(prev => isSelected ? prev.filter(id => id !== tag.id) : [...prev, tag.id])} className={`chip ${isSelected ? 'active' : ''}`}>
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Links */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Links (optional)</label>
                  <div className="flex gap-2 mb-2">
                    <input type="url" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="https://..." className="input flex-1" />
                    <input type="text" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} placeholder="Title" className="input flex-1" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }} />
                    <button onClick={handleAddLink} disabled={!newLinkUrl.trim()} className="btn btn-primary text-sm py-2 px-4 disabled:opacity-40">Add</button>
                  </div>
                  {links.length > 0 && (
                    <div className="space-y-2">
                      {links.map((link, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#FDF4FA] border border-[#f0e4ec]">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{link.title || link.url}</div>
                            <div className="text-xs text-gray-400 truncate">{link.url}</div>
                          </div>
                          <button onClick={() => setLinks(prev => prev.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA Picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Call-to-Action *</label>
                  <div className="space-y-3">
                    {(Object.entries(CTA_CATEGORIES) as [string, string[]][]).map(([category, ctas]) => (
                      <div key={category}>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{category}</div>
                        <div className="flex flex-wrap gap-2">
                          {ctas.map(cta => (
                            <button key={cta} onClick={() => setSelectedAction(cta)} className={`cta-chip ${selectedAction === cta ? 'selected' : ''}`}>
                              {cta}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Publish */}
                <button onClick={handlePublish} disabled={isSubmitting || !canPublish} className="btn btn-primary w-full disabled:opacity-40">
                  {isSubmitting ? 'Publishing...' : 'Publish Update'}
                  {!isSubmitting && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="hidden lg:block">
              <div className="sticky top-20">
                <div className="section-heading mb-3">Live Preview</div>
                <div className="card overflow-hidden">
                  {imagePreview && <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover" />}
                  <div className="p-5">
                    {title && <h4 className="font-bold text-base text-gray-900 mb-2">{title}</h4>}
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">{content || 'Start writing to see a preview...'}</p>
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {selectedTags.map(tagId => {
                          const tag = tags.find((t: any) => t.id === tagId);
                          return tag ? <span key={tagId} className="px-2 py-0.5 rounded-full bg-[#FBEAF5] text-xs font-semibold text-[#C1027D]">{tag.label}</span> : null;
                        })}
                      </div>
                    )}
                    {selectedAction && (
                      <button className="btn btn-primary text-sm py-2 w-full">{selectedAction}</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PUBLISHED ═══ */}
        {view === 'published' && (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="font-bold text-gray-900">Published Posts</h3>
            {loadingPosts ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="card animate-pulse"><div className="h-5 w-3/4 bg-[#FBEAF5] rounded mb-2" /><div className="h-3 w-full bg-[#FDF4FA] rounded" /></div>)}
              </div>
            ) : posts.length === 0 ? (
              <div className="card text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#FBEAF5] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#E97BC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">No posts yet</h3>
                <p className="text-sm text-gray-400">Create your first update to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post: any) => (
                  <div key={post.id} className="card flex items-start gap-4">
                    {post.imageUrl && <img src={post.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      {post.title && <h4 className="font-bold text-gray-900 truncate">{post.title}</h4>}
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">{post.content?.replace(/\[.*\]/, '').trim()}</p>
                      <div className="text-xs text-gray-400 mt-2">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="btn btn-ghost text-xs py-1.5 px-3">View</button>
                      <button className="btn btn-ghost text-xs py-1.5 px-3">Edit</button>
                      <button className="btn btn-danger text-xs py-1.5 px-3">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ SETTINGS ═══ */}
        {view === 'settings' && (
          <div className="space-y-6 animate-fade-in-up max-w-xl">
            <h3 className="font-bold text-gray-900">Profile Settings</h3>
            <div className="card space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Page Name</label>
                <input type="text" placeholder="Your Page Name" className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" placeholder="you@example.com" className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                <textarea placeholder="Tell people about yourself..." className="textarea" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Photo</label>
                <div className="dropzone text-sm py-6">Click to upload photo</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <input type="tel" placeholder="+250 7XX XXX XXX" className="input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Social Links</label>
                <div className="space-y-2">
                  {['Website', 'Twitter / X', 'LinkedIn', 'Instagram'].map(platform => (
                    <input key={platform} type="url" placeholder={`${platform} URL`} className="input" />
                  ))}
                </div>
              </div>

              <button className="btn btn-primary w-full">Save Settings</button>
            </div>
          </div>
        )}
      </ToolLayout>
    </ProtectedRoute>
  );
}
