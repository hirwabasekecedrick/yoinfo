'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = 'https://infopulse-be.onrender.com/';

type Post = { id: string; content: string; imageUrl?: string; createdAt: string; author: { id: string; name: string; email: string } };
type User = { id: string; name: string; email: string; role: string; createdAt: string };

const NAV_ITEMS = [
  { label: 'Overview', key: 'overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'All Posts', key: 'posts', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { label: 'Users', key: 'users', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) { router.push('/auth'); return; }
    const u = JSON.parse(stored);
    if (u.role !== 'ADMIN') { router.push('/poster/dashboard'); return; }
    setAdminUser(u);

    fetch(`${API_URL}/posts`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setPosts).catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-neutral-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const totalPosts = posts.length;
  const recentPosts = posts.slice(0, 5);
  const roleBreakdown = posts.reduce((acc: any, p) => {
    const e = p.author.email;
    acc[e] = (acc[e] || 0) + 1;
    return acc;
  }, {});
  const topPosters = Object.entries(roleBreakdown)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex">
      <aside className="w-56 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hidden lg:flex flex-col">
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-white flex items-center justify-center">
              <svg className="w-4 h-4 text-white dark:text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">InfoPulse</span>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === item.key
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
              {item.key === 'posts' && (
                <span className="ml-auto text-xs bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded-full">{totalPosts}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-semibold text-xs flex-shrink-0">
              {adminUser.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">{adminUser.name || 'Admin'}</div>
              <div className="text-xs text-neutral-400">ADMIN</div>
            </div>
            <button onClick={handleLogout} title="Logout" className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="lg:hidden flex gap-2 overflow-x-auto">
              {NAV_ITEMS.map(item => (
                <button key={item.key} onClick={() => setActiveTab(item.key)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${activeTab === item.key ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="hidden lg:block">
              <h1 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">{NAV_ITEMS.find(i => i.key === activeTab)?.label}</h1>
              <p className="text-xs text-neutral-500">Administration Console</p>
            </div>
          </div>
          <button onClick={handleLogout} className="lg:hidden text-xs text-neutral-500 border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 rounded-lg hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-8">

            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in-up">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Posts', value: totalPosts, sub: 'All time' },
                    { label: 'Active Posters', value: new Set(posts.map(p => p.author.email)).size, sub: 'Unique contributors' },
                    { label: 'This Week', value: posts.filter(p => new Date(p.createdAt) > new Date(Date.now() - 7 * 86400000)).length, sub: 'Posts last 7 days' },
                    { label: 'Status', value: 'Online', sub: 'System active' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
                      <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stat.value}</div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mt-0.5">{stat.label}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{stat.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Recent Activity</h3>
                      <button onClick={() => setActiveTab('posts')} className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">View all &rarr;</button>
                    </div>
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {loading ? (
                        [1,2,3].map(i => (
                          <div key={i} className="flex items-center gap-3 px-5 py-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 animate-pulse" />
                            <div className="flex-1 space-y-1.5"><div className="h-3 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /><div className="h-2.5 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></div>
                          </div>
                        ))
                      ) : recentPosts.length === 0 ? (
                        <div className="px-5 py-8 text-center text-sm text-neutral-500">No posts yet</div>
                      ) : (
                        recentPosts.map(post => (
                          <div key={post.id} className="flex items-start gap-3 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                              {post.author.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">{post.author.name || 'Unknown'}</span>
                                <span className="text-xs text-neutral-400">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                              <p className="text-xs text-neutral-500 mt-0.5 truncate">{post.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
                      <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">Top Contributors</h3>
                    </div>
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {topPosters.length === 0 ? (
                        <div className="px-5 py-8 text-center text-sm text-neutral-500">No data</div>
                      ) : (
                        topPosters.map(([email, count]: any, idx) => {
                          const poster = posts.find(p => p.author.email === email)?.author;
                          const pct = Math.round((count / totalPosts) * 100);
                          return (
                            <div key={email} className="flex items-center gap-3 px-5 py-3">
                              <div className="text-xs text-neutral-400 w-4 font-mono">{idx + 1}</div>
                              <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                {poster?.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-neutral-900 dark:text-neutral-100 truncate">{poster?.name || email}</div>
                                <div className="mt-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                              <div className="text-xs font-mono font-semibold text-neutral-900 dark:text-neutral-100">{count}</div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-500">{totalPosts} total {totalPosts === 1 ? 'post' : 'posts'}</p>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 animate-pulse" />
                        <div className="flex-1 space-y-2"><div className="h-3.5 w-1/3 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /><div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></div>
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm text-neutral-500">No posts found.</div>
                ) : (
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {posts.map((post, idx) => (
                        <div key={post.id} className="flex items-start gap-4 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors group animate-fade-in-up" style={{ animationDelay: `${idx * 40}ms` }}>
                          <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-semibold text-sm flex-shrink-0 mt-0.5">
                            {post.author.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{post.author.name || 'Unknown'}</span>
                              <span className="text-xs text-neutral-500 font-mono">{post.author.email}</span>
                              <time className="text-xs text-neutral-500 ml-auto">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
                            </div>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{post.content}</p>
                            {post.imageUrl && (
                              <img src={post.imageUrl} alt="" className="mt-3 rounded-lg max-h-80 object-cover border border-neutral-200 dark:border-neutral-800" loading="lazy" />
                            )}
                          </div>
                          <button
                            onClick={() => deletePost(post.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-red-500 flex-shrink-0"
                            title="Delete post"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4 animate-fade-in-up">
                <p className="text-sm text-neutral-500">Unique contributors tracked from post activity</p>
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    <div className="col-span-5">User</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2 text-center">Posts</div>
                    <div className="col-span-2 text-right">Latest</div>
                  </div>
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {loading ? (
                      [1,2,3].map(i => (
                        <div key={i} className="grid grid-cols-12 px-5 py-3.5 gap-2">
                          <div className="col-span-5 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 animate-pulse" /><div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></div>
                          <div className="col-span-3 flex items-center"><div className="h-3 w-32 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></div>
                          <div className="col-span-2 flex items-center justify-center"><div className="h-3 w-6 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></div>
                          <div className="col-span-2 flex items-center justify-end"><div className="h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse" /></div>
                        </div>
                      ))
                    ) : topPosters.length === 0 ? (
                      <div className="px-5 py-8 text-center text-sm text-neutral-500">No user data available.</div>
                    ) : (
                      Array.from(new Set(posts.map(p => p.author.email))).map((email, idx) => {
                        const user = posts.find(p => p.author.email === email)?.author;
                        const postCount = posts.filter(p => p.author.email === email).length;
                        const lastPost = posts.filter(p => p.author.email === email).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                        return (
                          <div key={email as string} className="grid grid-cols-12 px-5 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors items-center animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                            <div className="col-span-5 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{user?.name || 'Unknown'}</span>
                            </div>
                            <div className="col-span-3 text-xs text-neutral-500 font-mono truncate">{email as string}</div>
                            <div className="col-span-2 text-center">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs font-bold">{postCount}</span>
                            </div>
                            <div className="col-span-2 text-right text-xs text-neutral-500">{lastPost ? new Date(lastPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '\u2014'}</div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
