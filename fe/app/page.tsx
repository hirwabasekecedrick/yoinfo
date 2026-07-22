'use client';

import Link from 'next/link';
import Image from 'next/image';

const STATS = [
  { label: 'Active Users', value: '2,400+' },
  { label: 'Posts Published', value: '12K+' },
  { label: 'Engagements', value: '30K+' },
  { label: 'Growth Rate', value: '150%' },
];

const CTA_ACTIONS = [
  'Book Now',
  'Get Started',
  'Learn More',
  'Sign Up Today',
  'Join Now',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 overflow-hidden">
              <Image src="/logoo.png" alt="InfoPulse Logo" width={120} height={40} className="object-contain" />
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/poster/dashboard"
              className="text-sm font-medium text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Feed
            </Link>
            <Link
              href="/auth"
              className="text-sm font-medium text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth"
              className="text-sm font-semibold bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-50/80 to-white" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-green-200/30 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6 animate-fade-in-down opacity-0">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-green-700">The platform for publishing</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 animate-fade-in-up opacity-0 stagger-1">
                Publish. Share.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                  Grow.
                </span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up opacity-0 stagger-2">
                Share news, events, and announcements with your audience. Add images, links, and choose a call-to-action for your posts.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 stagger-3">
                <Link
                  href="/poster/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Start Posting
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-green-700 font-semibold px-8 py-3.5 rounded-xl border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  View Feed
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-green-100 bg-green-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold text-green-600 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Everything you need to publish
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Create engaging posts with images, links, tags, and powerful calls-to-action.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative bg-white rounded-2xl border border-green-100 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-green-100/50 hover:border-green-200 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rich Content</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Create posts with titles, images, and formatted content up to 250 words.</p>
            </div>
            <div className="group relative bg-white rounded-2xl border border-green-100 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-green-100/50 hover:border-green-200 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Links & Tags</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Add custom links and tags to organize and enhance your posts.</p>
            </div>
            <div className="group relative bg-white rounded-2xl border border-green-100 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-green-100/50 hover:border-green-200 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Powerful CTAs</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Choose from 21+ call-to-action buttons to drive engagement.</p>
            </div>
          </div>
        </section>

        {/* CTA Actions Preview */}
        <section className="bg-gradient-to-b from-white to-green-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                Powerful calls-to-action
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Every post comes with a customizable action button. Choose from 21 engaging CTAs to drive your audience to take the next step.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {CTA_ACTIONS.map((action) => (
                <span
                  key={action}
                  className="px-5 py-2.5 rounded-full bg-white border border-green-200 text-sm font-semibold text-green-700 hover:bg-green-50 hover:border-green-300 transition-colors cursor-default"
                >
                  {action}
                </span>
              ))}
              <span className="px-5 py-2.5 rounded-full bg-green-100 text-sm font-semibold text-green-600">
                + 16 more
              </span>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of creators already growing on InfoPulse.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-green-700 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-all shadow-lg"
                >
                  Create Free Account
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/poster/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-700/50 text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-700/70 transition-all border border-white/20"
                >
                  Start Posting
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-green-100 bg-green-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-8 overflow-hidden">
              <Image src="/logoo.png" alt="InfoPulse Logo" width={100} height={32} className="object-contain" />
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/poster/dashboard" className="hover:text-green-600 transition-colors">Dashboard</Link>
              <Link href="/" className="hover:text-green-600 transition-colors">Feed</Link>
              <Link href="/auth" className="hover:text-green-600 transition-colors">Sign In</Link>
            </div>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} InfoPulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
