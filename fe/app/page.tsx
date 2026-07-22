'use client';

import Link from 'next/link';
import Image from 'next/image';

const FEATURES = [
  {
    title: 'Investment Opportunities',
    description: 'Discover high-potential investments across real estate, tech, agriculture, and more. Search by category, location, and budget.',
    href: '/investments',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    stats: '50+ Opportunities',
  },
  {
    title: 'Post an Update',
    description: 'Share news, events, and announcements. Add images, links, and choose a call-to-action for your audience.',
    href: '/poster/dashboard',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    color: 'from-green-600 to-teal-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    stats: 'Share & Engage',
  },
  {
    title: 'Business Profile',
    description: 'Showcase your business to the world. Add your services, gallery, operating hours, team, and customer testimonials.',
    href: '/business',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    stats: 'Grow Your Brand',
  },
];

const STATS = [
  { label: 'Active Investors', value: '2,400+' },
  { label: 'Businesses Listed', value: '850+' },
  { label: 'Posts Published', value: '12K+' },
  { label: 'Connections Made', value: '30K+' },
];

const CTA_ACTIONS = [
  'Explore Opportunity',
  'Discover More',
  'Get Started',
  'Take Action Today',
];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  return (
    <Link
      href={feature.href}
      className={`group relative bg-white rounded-2xl border border-green-100 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-green-100/50 hover:border-green-200 hover:-translate-y-1 animate-fade-in-up stagger-${index + 1} opacity-0`}
    >
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">{feature.description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${feature.textColor} ${feature.bgColor} px-3 py-1 rounded-full`}>
          {feature.stats}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 group-hover:gap-3 transition-all duration-300">
          Get Started
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

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
              href="/investments"
              className="text-sm font-medium text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Investments
            </Link>
            <Link
              href="/business"
              className="text-sm font-medium text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Business
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
                <span className="text-xs font-semibold text-green-700">The platform for growth</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 animate-fade-in-up opacity-0 stagger-1">
                Invest. Publish.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                  Grow.
                </span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up opacity-0 stagger-2">
                Your all-in-one platform to discover investment opportunities, share updates with your audience, and build a powerful business profile.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 stagger-3">
                <Link
                  href="/investments"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                  Explore Investments
                </Link>
                <Link
                  href="/poster/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-green-700 font-semibold px-8 py-3.5 rounded-xl border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Start Posting
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

        {/* Feature Cards Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Everything you need in one place
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Whether you are an investor, business owner, or content creator — InfoPulse has the tools to help you succeed.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
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
                + 17 more
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
                Join thousands of investors, businesses, and creators already growing on InfoPulse.
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
                  href="/investments"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-700/50 text-white font-semibold px-8 py-4 rounded-xl hover:bg-green-700/70 transition-all border border-white/20"
                >
                  Browse Investments
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
              <Link href="/investments" className="hover:text-green-600 transition-colors">Investments</Link>
              <Link href="/business" className="hover:text-green-600 transition-colors">Business</Link>
              <Link href="/poster/dashboard" className="hover:text-green-600 transition-colors">Post</Link>
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
