'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchInvestments, fetchBusinesses, deleteInvestment } from '@/lib/api';
import ToolLayout from '@/components/tool-layout';
import ProtectedRoute from '@/components/protected-route';

const TOOL_NAV = [
  { label: 'Update Wizard', href: '/poster/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { label: 'Blast Wizard', href: '/messaging', icon: 'M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.111.431-.173.869-.173 1.315 0 .447.062.884.173 1.315m0-9.665a24.301 24.301 0 003.484.045m-3.484 0a24.27 24.27 0 01-3.484-.045' },
  { label: 'Invoice Wizard', href: '/invoices', icon: 'M9 7h6M9 11h6M9 15h3M6 3h9l3 3v15a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z' },
  { label: 'Business Profiling', href: '/business', icon: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 0113.5 9h1.5a1.5 1.5 0 011.5 1.5v8.25' },
  { label: 'Fliiper', href: '/flipper', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z' },
];

const CATEGORIES = ['All', 'Real Estate', 'Technology', 'Agriculture', 'Energy', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Tourism', 'Retail'];
const STATUSES = ['All', 'Open', 'Closing Soon', 'Coming Soon'];

export default function InvestmentsContent() {
  const searchParams = useSearchParams();

  const [investments, setInvestments] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [budgetRange, setBudgetRange] = useState<[string, string]>(['', '']);
  const [selectedInvestment, setSelectedInvestment] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'opportunities' | 'directory'>('opportunities');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchInvestments({ category: selectedCategory, status: selectedStatus, search: search || undefined })
      .then(setInvestments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedStatus, search]);

  useEffect(() => {
    fetchBusinesses({})
      .then(setBusinesses)
      .catch(console.error);
  }, []);

  return (
    <ProtectedRoute>
      <ToolLayout
        title=""
        subtitle=""
        navItems={TOOL_NAV}
      >
        <div className="flex gap-6">
          {/* ── Filter Sidebar ────────────────────────────── */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="space-y-6">
              {/* Search */}
              <div>
                <div className="section-heading">Search</div>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search investments..."
                  className="input"
                />
              </div>

              {/* Categories */}
              <div>
                <div className="section-heading">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div>
                <div className="section-heading">Budget Range</div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={budgetRange[0]}
                    onChange={e => setBudgetRange([e.target.value, budgetRange[1]])}
                    placeholder="Min $"
                    className="input"
                  />
                  <input
                    type="number"
                    value={budgetRange[1]}
                    onChange={e => setBudgetRange([budgetRange[0], e.target.value])}
                    placeholder="Max $"
                    className="input"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="section-heading">Location</div>
                <input type="text" placeholder="City, Country" className="input" />
              </div>

              {/* Status */}
              <div>
                <div className="section-heading">Status</div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(status => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`chip ${selectedStatus === status ? 'active' : ''}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setSelectedCategory('All'); setSelectedStatus('All'); setSearch(''); setBudgetRange(['', '']); }}
                className="btn btn-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* ── Main Content ─────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`text-sm font-bold pb-2 border-b-2 transition-colors ${
                  activeTab === 'opportunities'
                    ? 'text-[#C1027D] border-[#C1027D]'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                Opportunities
              </button>
              <button
                onClick={() => setActiveTab('directory')}
                className={`text-sm font-bold pb-2 border-b-2 transition-colors ${
                  activeTab === 'directory'
                    ? 'text-[#C1027D] border-[#C1027D]'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                Business Directory
              </button>
            </div>

            {activeTab === 'opportunities' ? (
              <>
                {/* Mobile Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide lg:hidden">
                  {CATEGORIES.slice(0, 6).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="card animate-pulse">
                        <div className="h-40 bg-[#FBEAF5] rounded-xl mb-4" />
                        <div className="h-5 w-3/4 bg-[#FBEAF5] rounded mb-2" />
                        <div className="h-3 w-full bg-[#FDF4FA] rounded mb-2" />
                        <div className="h-3 w-2/3 bg-[#FDF4FA] rounded" />
                      </div>
                    ))}
                  </div>
                ) : investments.length === 0 ? (
                  <div className="text-center py-20 card">
                    <div className="w-16 h-16 rounded-full bg-[#FBEAF5] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#E97BC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No investments found</h3>
                    <p className="text-sm text-gray-400">Try adjusting your filters</p>
                  </div>
                ) : selectedInvestment ? (
                  /* ── Detail View ─────────────────────────── */
                  <div className="card animate-fade-in-up">
                    <button onClick={() => setSelectedInvestment(null)} className="back-btn mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                      Back to list
                    </button>

                    {selectedInvestment.imageUrl && (
                      <img src={selectedInvestment.imageUrl} alt={selectedInvestment.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge info">{selectedInvestment.category}</span>
                      <span className={`badge ${selectedInvestment.status === 'Open' ? 'success' : selectedInvestment.status === 'Closing Soon' ? 'warning' : 'info'}`}>
                        {selectedInvestment.status}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedInvestment.title}</h2>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{selectedInvestment.summary}</p>

                    {selectedInvestment.description && (
                      <p className="text-sm text-gray-600 leading-relaxed mb-6">{selectedInvestment.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#FDF4FA] rounded-xl p-3">
                        <div className="text-xs text-gray-400 font-semibold">Min Investment</div>
                        <div className="text-sm font-bold text-gray-900">${selectedInvestment.minInvestment?.toLocaleString() || '—'}</div>
                      </div>
                      <div className="bg-[#FDF4FA] rounded-xl p-3">
                        <div className="text-xs text-gray-400 font-semibold">Est. ROI</div>
                        <div className="text-sm font-bold text-[#C1027D]">{selectedInvestment.roi || '—'}</div>
                      </div>
                      <div className="bg-[#FDF4FA] rounded-xl p-3">
                        <div className="text-xs text-gray-400 font-semibold">Location</div>
                        <div className="text-sm font-bold text-gray-900">{selectedInvestment.location || '—'}</div>
                      </div>
                      <div className="bg-[#FDF4FA] rounded-xl p-3">
                        <div className="text-xs text-gray-400 font-semibold">Max Investment</div>
                        <div className="text-sm font-bold text-gray-900">${selectedInvestment.maxInvestment?.toLocaleString() || '—'}</div>
                      </div>
                    </div>

                    <button className="btn btn-primary w-full">
                      Start a Conversation
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* ── Grid View ──────────────────────────── */
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {investments.map((investment) => (
                      <div key={investment.id} className="relative">
                        <div
                          className="card cursor-pointer hover:shadow-lg hover:border-[#F8CEE9] hover:-translate-y-1 transition-all duration-300"
                          onClick={() => setSelectedInvestment(investment)}
                        >
                          {investment.imageUrl && (
                            <img src={investment.imageUrl} alt={investment.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="badge info text-[10px]">{investment.category}</span>
                            <span className={`badge text-[10px] ${investment.status === 'Open' ? 'success' : investment.status === 'Closing Soon' ? 'warning' : 'info'}`}>
                              {investment.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-1">{investment.title}</h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{investment.summary}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#C1027D]">{investment.roi}</span>
                            <span className="text-xs text-gray-400">{investment.location}</span>
                          </div>
                        </div>
                        {user && (investment.authorId === user.id || user.role === 'ADMIN') && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteInvestment(investment.id); }}
                            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* ── Business Directory Tab ──────────────────── */
              <>
                {businesses.length === 0 ? (
                  <div className="text-center py-20 card">
                    <div className="w-16 h-16 rounded-full bg-[#FBEAF5] flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#E97BC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No businesses yet</h3>
                    <p className="text-sm text-gray-400">Businesses will appear here once listed.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {businesses.map((biz: any) => (
                      <div key={biz.id} className="card hover:shadow-lg hover:border-[#F8CEE9] transition-all">
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
                        {biz.services?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {biz.services.slice(0, 3).map((s: string) => (
                              <span key={s} className="px-2 py-0.5 rounded-full bg-[#FBEAF5] text-[10px] font-semibold text-[#C1027D]">{s}</span>
                            ))}
                          </div>
                        )}
                        <button className="btn btn-outline w-full text-xs py-2">
                          Visit Website
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </ToolLayout>
    </ProtectedRoute>
  );

  async function handleDeleteInvestment(id: string) {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await deleteInvestment(token, id);
      setInvestments(prev => prev.filter(inv => inv.id !== id));
    } catch (err) {
      console.error(err);
    }
  }
}
