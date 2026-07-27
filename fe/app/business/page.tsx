'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchBusinesses, createBusiness, deleteBusiness } from '@/lib/api';
import BusinessProfileForm from '@/components/business-profile-form';
import ToolLayout from '@/components/tool-layout';
import ProtectedRoute from '@/components/protected-route';

const TOOL_NAV = [
  { label: 'Update Wizard', href: '/poster/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { label: 'Blast Wizard', href: '/messaging', icon: 'M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.111.431-.173.869-.173 1.315 0 .447.062.884.173 1.315m0-9.665a24.301 24.301 0 003.484.045m-3.484 0a24.27 24.27 0 01-3.484-.045' },
  { label: 'Business Profiling', href: '/business', icon: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 0113.5 9h1.5a1.5 1.5 0 011.5 1.5v8.25' },
];

const CATEGORIES = ['All', 'Technology', 'Healthcare', 'Finance', 'Education', 'Hospitality', 'Manufacturing', 'Agriculture', 'Construction', 'Professional Services', 'Retail'];

export default function BusinessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBF6F9] flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>}>
      <BusinessPageContent />
    </Suspense>
  );
}

function BusinessPageContent() {
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchBusinesses({ category: selectedCategory, search: search || undefined })
      .then(setBusinesses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, selectedCategory]);

  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSaveProfile = async (data: any) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const newBusiness = await createBusiness(token, data);
      setBusinesses(prev => [newBusiness, ...prev]);
      setShowForm(false);
      setSubmitMessage({ type: 'success', text: 'Business profile created!' });
      setTimeout(() => setSubmitMessage(null), 4000);
    } catch (err: any) {
      setSubmitMessage({ type: 'error', text: err.message || 'Failed to create business profile' });
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await deleteBusiness(token, id);
      setBusinesses(prev => prev.filter(b => b.id !== id));
    } catch (err) { console.error(err); }
  };

  const selectedBiz = selectedBusiness ? businesses.find(b => b.id === selectedBusiness) : null;

  return (
    <ProtectedRoute>
      <ToolLayout title="Business Directory" subtitle="Discover businesses across Africa." navItems={TOOL_NAV}>
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="space-y-6">
              <div>
                <div className="section-heading">Search</div>
                <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search businesses..." className="input" />
              </div>
              <div>
                <div className="section-heading">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} className={`chip ${selectedCategory === cat ? 'active' : ''}`}>{cat}</button>
                  ))}
                </div>
              </div>
              {user && (
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary w-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {showForm ? 'Close Form' : 'Profile Your Business'}
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {submitMessage && (
              <div className={`mb-4 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold ${
                submitMessage.type === 'success' ? 'bg-[#D93F9E]/5 border border-[#D93F9E]/20 text-[#C1027D]' : 'bg-red-50 border border-red-200 text-red-700'
              }`}>{submitMessage.text}</div>
            )}

            {showForm && user && (
              <div className="mb-6 animate-fade-in-up">
                <BusinessProfileForm onSave={handleSaveProfile} onCancel={() => setShowForm(false)} />
              </div>
            )}

            {/* Business Grid + Detail */}
            <div className="flex gap-6">
              <div className={`flex-1 min-w-0 ${selectedBiz ? 'lg:w-1/2' : ''}`}>
                {loading ? (
                  <div className={`grid gap-6 ${selectedBiz ? 'sm:grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
                    {[1, 2, 3].map(i => <div key={i} className="card animate-pulse"><div className="h-36 bg-[#FBEAF5] rounded-xl mb-4" /><div className="h-5 w-2/3 bg-[#FBEAF5] rounded mb-2" /></div>)}
                  </div>
                ) : businesses.length === 0 ? (
                  <div className="card text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#FBEAF5] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#E97BC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">No businesses found</h3>
                    <p className="text-sm text-gray-400">Try adjusting your search or category filter</p>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${selectedBiz ? 'sm:grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
                    {businesses.map((biz) => (
                      <div key={biz.id} className="card cursor-pointer hover:shadow-lg hover:border-[#F8CEE9] transition-all duration-300 group relative" onClick={() => setSelectedBusiness(selectedBusiness === biz.id ? null : biz.id)}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C1027D] to-[#8A0260] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {biz.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{biz.name}</h3>
                            <p className="text-xs text-gray-400">{[biz.city, biz.country].filter(Boolean).join(', ') || 'Location not set'}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{biz.description || biz.tagline || 'No description available.'}</p>
                        {user && (biz.authorId === user.id || user.role === 'ADMIN') && (
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteBusiness(biz.id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Detail Sidebar */}
              {selectedBiz && (
                <div className="hidden lg:block w-96 flex-shrink-0">
                  <div className="sticky top-20 card animate-slide-in-right">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-lg text-gray-900">{selectedBiz.name}</h2>
                      <button onClick={() => setSelectedBusiness(null)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{[selectedBiz.city, selectedBiz.country].filter(Boolean).join(', ') || 'Location not set'}</p>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{selectedBiz.description || selectedBiz.tagline || 'No description available.'}</p>
                    {selectedBiz.services?.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Services</div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedBiz.services.map((s: string) => (
                            <span key={s} className="px-2.5 py-1 rounded-lg bg-[#FBEAF5] text-xs font-semibold text-[#C1027D]">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2 mb-4">
                      {selectedBiz.phone && <div className="text-sm text-gray-600">📞 {selectedBiz.phone}</div>}
                      {selectedBiz.email && <div className="text-sm text-gray-600">✉️ {selectedBiz.email}</div>}
                      {selectedBiz.website && <div className="text-sm text-gray-600">🌐 {selectedBiz.website}</div>}
                    </div>
                    <button className="btn btn-primary w-full">Visit Website</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ToolLayout>
    </ProtectedRoute>
  );
}
