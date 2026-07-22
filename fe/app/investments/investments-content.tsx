'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchInvestments, createInvestment, deleteInvestment } from '@/lib/api';
import InvestmentCard from '@/components/investment-card';
import InvestmentFilters, { type FilterState } from '@/components/investment-filters';
import ProtectedRoute from '@/components/protected-route';

const INVESTMENT_CATEGORIES = [
  'Real Estate', 'Technology', 'Agriculture', 'Energy', 'Finance',
  'Healthcare', 'Education', 'Manufacturing', 'Tourism', 'Retail',
];

const INVESTMENT_STATUSES = ['Open', 'Closing Soon', 'Coming Soon'];

const CTA_ACTIONS = [
  'Explore Opportunity', 'Discover More', 'Get Started', 'Take Action Today', 'Request a Quote', 'Contact Us',
];

export default function InvestmentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formMinInvestment, setFormMinInvestment] = useState('');
  const [formMaxInvestment, setFormMaxInvestment] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formStatus, setFormStatus] = useState('Open');
  const [formRoi, setFormRoi] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    category: (searchParams.get('category') as any) || 'All',
    status: (searchParams.get('status') as any) || 'All',
    minBudget: searchParams.get('minBudget') || '',
    maxBudget: searchParams.get('maxBudget') || '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch investments when filters change
  useEffect(() => {
    setLoading(true);
    fetchInvestments(filters)
      .then(setInvestments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.category !== 'All') params.set('category', newFilters.category);
    if (newFilters.status !== 'All') params.set('status', newFilters.status);
    if (newFilters.minBudget) params.set('minBudget', newFilters.minBudget);
    if (newFilters.maxBudget) params.set('maxBudget', newFilters.maxBudget);

    const qs = params.toString();
    router.replace(`/investments${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [router]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('');
    setFormSummary('');
    setFormDescription('');
    setFormMinInvestment('');
    setFormMaxInvestment('');
    setFormLocation('');
    setFormStatus('Open');
    setFormRoi('');
    setFormImageUrl('');
  };

  const handleCreateInvestment = async () => {
    const token = localStorage.getItem('token');
    if (!token || !formTitle || !formCategory || !formSummary || !formLocation || !formRoi) return;

    setFormSubmitting(true);
    setSubmitMessage(null);
    try {
      const newInvestment = await createInvestment(token, {
        title: formTitle,
        category: formCategory,
        summary: formSummary,
        description: formDescription || undefined,
        minInvestment: Number(formMinInvestment) || 0,
        maxInvestment: Number(formMaxInvestment) || Number(formMinInvestment) || 0,
        location: formLocation,
        status: formStatus,
        roi: formRoi,
        imageUrl: formImageUrl || undefined,
      });
      setInvestments(prev => [newInvestment, ...prev]);
      resetForm();
      setShowForm(false);
      setSubmitMessage({ type: 'success', text: 'Investment listing created!' });
      setTimeout(() => setSubmitMessage(null), 4000);
    } catch (err: any) {
      setSubmitMessage({ type: 'error', text: err.message || 'Failed to create listing' });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteInvestment = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await deleteInvestment(token, id);
      setInvestments(prev => prev.filter(inv => inv.id !== id));
      setDeleteMessage('Listing deleted');
      setTimeout(() => setDeleteMessage(''), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 overflow-hidden">
              <Image src="/logoo.png" alt="InfoPulse Logo" width={120} height={40} className="object-contain" />
            </div>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-green-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-green-50 transition-colors">Home</Link>
            <Link href="/business" className="text-sm font-medium text-gray-500 hover:text-green-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-green-50 transition-colors hidden sm:block">Business</Link>
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
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Investment Opportunities</h1>
            <p className="text-gray-500 text-base sm:text-lg mb-8">Discover high-potential investments across Africa. Filter by category, budget, and location.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {user && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {showForm ? 'Close Form' : 'List an Investment'}
                </button>
              )}
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

        {/* Create Form */}
        {showForm && user && (
          <div className="mb-8 bg-white border border-green-100 rounded-2xl p-6 animate-fade-in-up">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Create Investment Listing</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Investment title" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select category</option>
                  {INVESTMENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Summary *</label>
                <textarea value={formSummary} onChange={e => setFormSummary(e.target.value)} placeholder="Brief description of the opportunity" rows={2} className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Description</label>
                <textarea value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Detailed description..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Min Investment ($)</label>
                <input type="number" value={formMinInvestment} onChange={e => setFormMinInvestment(e.target.value)} placeholder="50000" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Max Investment ($)</label>
                <input type="number" value={formMaxInvestment} onChange={e => setFormMaxInvestment(e.target.value)} placeholder="500000" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
                <input type="text" value={formLocation} onChange={e => setFormLocation(e.target.value)} placeholder="City, Country" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Est. ROI *</label>
                <input type="text" value={formRoi} onChange={e => setFormRoi(e.target.value)} placeholder="18-24%" className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select value={formStatus} onChange={e => setFormStatus(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500">
                  {INVESTMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
                <input type="url" value={formImageUrl} onChange={e => setFormImageUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl border border-green-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setShowForm(false); resetForm(); }} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button
                onClick={handleCreateInvestment}
                disabled={formSubmitting || !formTitle || !formCategory || !formSummary || !formLocation || !formRoi}
                className="px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all disabled:opacity-40 shadow-sm shadow-green-200"
              >
                {formSubmitting ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </div>
        )}

        {/* Filters + Grid */}
        <div className="flex gap-8">
          <InvestmentFilters filters={filters} onFilterChange={handleFilterChange} resultCount={investments.length} />

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white border border-green-100 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-green-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 w-3/4 bg-green-100 rounded" />
                      <div className="h-3 w-full bg-green-50 rounded" />
                      <div className="h-3 w-2/3 bg-green-50 rounded" />
                      <div className="h-10 bg-green-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : investments.length === 0 ? (
              <div className="text-center py-20 bg-white border border-green-100 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No investments found</h3>
                <p className="text-sm text-gray-400 mb-4">Try adjusting your filters or check back later</p>
                <button onClick={() => handleFilterChange({ search: '', category: 'All', status: 'All', minBudget: '', maxBudget: '' })} className="px-5 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">Clear Filters</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {investments.map((investment) => (
                  <div key={investment.id} className="relative">
                    <InvestmentCard investment={investment} />
                    {user && (investment.authorId === user.id || user.role === 'ADMIN') && (
                      <button
                        onClick={() => handleDeleteInvestment(investment.id)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete listing"
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
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
