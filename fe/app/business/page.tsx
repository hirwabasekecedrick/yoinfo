'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchBusinesses, createBusiness, deleteBusiness } from '@/lib/api';
import BusinessCard from '@/components/business-card';
import BusinessProfileForm from '@/components/business-profile-form';
import ProtectedRoute from '@/components/protected-route';

const CATEGORIES = ['All', 'Technology', 'Healthcare', 'Finance', 'Education', 'Hospitality', 'Manufacturing', 'Agriculture', 'Construction', 'Professional Services', 'Retail'];

export default function BusinessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>}>
      <BusinessPageContent />
    </Suspense>
  );
}

function BusinessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch businesses when search/category changes
  useEffect(() => {
    setLoading(true);
    fetchBusinesses({ category: selectedCategory, search: search || undefined })
      .then(setBusinesses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, selectedCategory]);

  // Debounced search
  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      updateURL(searchInput, selectedCategory);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateURL = useCallback((q: string, cat: string) => {
    const params = new URLSearchParams();
    if (q) params.set('search', q);
    if (cat !== 'All') params.set('category', cat);
    const qs = params.toString();
    router.replace(`/business${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [router]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    updateURL(searchInput, cat);
  };

  const handleViewBusiness = (id: string) => {
    setSelectedBusiness(selectedBusiness === id ? null : id);
  };

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
      setDeleteMessage('Business profile deleted');
      setTimeout(() => setDeleteMessage(''), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const selectedBiz = selectedBusiness ? businesses.find(b => b.id === selectedBusiness) : null;

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900">InfoPulse</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-green-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-green-50 transition-colors">Home</Link>
            <Link href="/investments" className="text-sm font-medium text-gray-500 hover:text-green-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-green-50 transition-colors hidden sm:block">Investments</Link>
            <Link href="/messaging" className="text-sm font-medium text-gray-500 hover:text-green-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-green-50 transition-colors hidden sm:block">Bulk Messaging</Link>
            <Link href="/poster/dashboard" className="text-sm font-medium text-gray-500 hover:text-green-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-green-50 transition-colors hidden sm:block">Post</Link>
            {user ? (
              <Link href="/poster/dashboard" className="text-sm font-semibold bg-green-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-200">Dashboard</Link>
            ) : (
              <Link href="/auth" className="text-sm font-semibold bg-green-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-200">Sign In</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-gray-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Business Directory</h1>
            <p className="text-gray-500 text-base sm:text-lg mb-8">Discover amazing businesses across Africa. Profile your own business and reach thousands of potential customers.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {showForm ? 'Close Form' : 'Profile Your Business'}
                </button>
              )}
              <div className="relative w-full sm:w-96">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search businesses..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-green-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Messages */}
        {submitMessage && (
          <div className={`mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold animate-scale-in ${
            submitMessage.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <svg className="w-4.5 h-4.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {submitMessage.text}
          </div>
        )}
        {deleteMessage && (
          <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold animate-scale-in">
            {deleteMessage}
          </div>
        )}

        {/* Profile Form */}
        {showForm && user && (
          <div className="mb-8 animate-fade-in-up">
            <BusinessProfileForm onSave={handleSaveProfile} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white shadow-sm shadow-green-200'
                  : 'bg-white text-gray-600 border border-green-200 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Business Grid + Detail */}
        <div className="flex gap-8">
          <div className={`flex-1 min-w-0 ${selectedBiz ? 'lg:w-1/2' : ''}`}>
            {loading ? (
              <div className={`grid gap-6 ${selectedBiz ? 'sm:grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white border border-green-100 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-36 bg-green-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-2/3 bg-green-100 rounded" />
                      <div className="h-3 w-full bg-green-50 rounded" />
                      <div className="h-10 bg-green-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : businesses.length === 0 ? (
              <div className="text-center py-20 bg-white border border-green-100 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No businesses found</h3>
                <p className="text-sm text-gray-400">Try adjusting your search or category filter</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${selectedBiz ? 'sm:grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>
                {businesses.map((business) => (
                  <div key={business.id} className="relative group">
                    <BusinessCard business={business} onView={handleViewBusiness} />
                    {user && (business.authorId === user.id || user.role === 'ADMIN') && (
                      <button
                        onClick={() => handleDeleteBusiness(business.id)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete business"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Business Detail Sidebar */}
          {selectedBiz && (
            <div className="hidden lg:block w-96 flex-shrink-0">
              <div className="sticky top-20 bg-white border border-green-100 rounded-2xl overflow-hidden animate-slide-in-right">
                <div className="relative h-40">
                  <img src={selectedBiz.coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop'} alt={selectedBiz.name} className="w-full h-full object-cover" />
                  <button onClick={() => setSelectedBusiness(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-600 hover:bg-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-5 -mt-8 relative">
                  <div className="flex items-end gap-3 mb-4">
                    <img src={selectedBiz.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop'} alt={selectedBiz.name} className="w-14 h-14 rounded-xl border-4 border-white shadow-md object-cover" />
                    <div>
                      <h2 className="font-bold text-xl text-gray-900">{selectedBiz.name}</h2>
                      <p className="text-xs text-gray-400">{[selectedBiz.city, selectedBiz.country].filter(Boolean).join(', ') || 'Location not set'}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{selectedBiz.description || selectedBiz.tagline || 'No description available.'}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-4 h-4 ${star <= Math.round(selectedBiz.rating || 0) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-500">{selectedBiz.rating || 0} ({selectedBiz.reviewCount || 0})</span>
                  </div>

                  {selectedBiz.services?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Services</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedBiz.services.map((service: string) => (
                          <span key={service} className="px-2.5 py-1 rounded-lg bg-green-50 text-xs font-semibold text-green-700 border border-green-200">{service}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    {selectedBiz.phone && (
                      <a href={`tel:${selectedBiz.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        {selectedBiz.phone}
                      </a>
                    )}
                    {selectedBiz.email && (
                      <a href={`mailto:${selectedBiz.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        {selectedBiz.email}
                      </a>
                    )}
                    {selectedBiz.website && (
                      <a href={selectedBiz.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                        {selectedBiz.website}
                      </a>
                    )}
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-200">
                    {selectedBiz.primaryCTA || 'Start a Conversation'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
