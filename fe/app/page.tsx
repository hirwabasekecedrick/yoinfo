'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Top Nav ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#f0e4ec]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/YoINFOlogo.png" alt="yoInfo" className="h-8" />
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block">
              Home
            </Link>
            <Link href="/investments" className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block">
              Investments
            </Link>
            <Link href="/messaging" className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block">
              Blast
            </Link>
            <Link href="/poster/dashboard" className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block">
              Post
            </Link>
            <Link
              href="/auth"
              className="text-sm font-semibold bg-[#C1027D] text-white px-5 py-2 rounded-lg hover:bg-[#8A0260] transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero Section ──────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FBEAF5] to-white" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#F8CEE9]/40 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-[#FFE0F0]/50 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-16 sm:pb-24">
            <div className="flex items-center justify-center gap-8 lg:gap-16">
              {/* Man Sending Image */}
              <div className="hidden lg:block flex-shrink-0 animate-fade-in-up opacity-0 stagger-1">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#C1027D]/10 rounded-full blur-2xl" />
                  <img
                    src="/man_sending_message.png"
                    alt="Sending a message"
                    className="relative w-64 h-64 xl:w-80 xl:h-80 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Hero Text */}
              <div className="text-center max-w-xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4 animate-fade-in-up opacity-0 stagger-1">
                  Update. Publish.{' '}
                  <span className="text-gradient">Blast.</span>
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto animate-fade-in-up opacity-0 stagger-2">
                  Share Updates Instantly — Everywhere, All at Once.
                </p>
                <div className="animate-fade-in-up opacity-0 stagger-3">
                  <Link
                    href="/auth"
                    className="inline-flex items-center gap-2 bg-[#C1027D] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#8A0260] transition-all shadow-lg shadow-[#C1027D]/25 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Get Started
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Woman Receiving Image */}
              <div className="hidden lg:block flex-shrink-0 animate-fade-in-up opacity-0 stagger-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-[#D93F9E]/10 rounded-full blur-2xl" />
                  <img
                    src="/woman_receiving_message.png"
                    alt="Receiving a message"
                    className="relative w-64 h-64 xl:w-80 xl:h-80 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Mobile: show images stacked below text */}
            <div className="lg:hidden flex justify-center gap-6 mt-10 animate-fade-in-up opacity-0 stagger-2">
              <div className="relative">
                <img src="/man_sending_message.png" alt="Sending" className="w-40 h-40 object-contain drop-shadow-lg" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#C1027D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">📤 Send</div>
              </div>
              <div className="relative">
                <img src="/woman_receiving_message.png" alt="Receiving" className="w-40 h-40 object-contain drop-shadow-lg" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#8A0260] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">📱 Receive</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Section ─────────────────────────────── */}
        <section className="border-y border-[#f0e4ec] bg-[#fdf8fa]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '👤', value: '2,400+', label: 'Active Investors', color: 'from-[#C1027D] to-[#8A0260]' },
                { icon: '🏢', value: '850+', label: 'Businesses Listed', color: 'from-[#E97BC4] to-[#C1027D]' },
                { icon: '📝', value: '12K+', label: 'Posts Published', color: 'from-[#D93F9E] to-[#C1027D]' },
                { icon: '🤝', value: '30K+', label: 'Connections Made', color: 'from-[#8A0260] to-[#3D0231]' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-lg mx-auto mb-3`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Option Cards ──────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Investments */}
            <Link
              href="/investments"
              className="group relative bg-white rounded-2xl border border-[#f0e4ec] p-8 transition-all duration-300 hover:shadow-xl hover:border-[#F8CEE9] hover:-translate-y-1"
            >
              <div className="ring green mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Investments</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Discover high-potential investment opportunities across real estate, tech, agriculture, and more.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C1027D] group-hover:gap-3 transition-all duration-300">
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>

            {/* Blast Wizard */}
            <Link
              href="/messaging"
              className="group relative bg-white rounded-2xl border border-[#f0e4ec] p-8 transition-all duration-300 hover:shadow-xl hover:border-[#F8CEE9] hover:-translate-y-1"
            >
              <div className="ring lime mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.111.431-.173.869-.173 1.315 0 .447.062.884.173 1.315m0-9.665a24.301 24.301 0 003.484.045m-3.484 0a24.27 24.27 0 01-3.484-.045" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Blast Wizard</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Send messages to WhatsApp, SMS, and email from one place. Upload contacts, write once, blast everywhere.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C1027D] group-hover:gap-3 transition-all duration-300">
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>

            {/* Post / Update */}
            <Link
              href="/poster/dashboard"
              className="group relative bg-white rounded-2xl border border-[#f0e4ec] p-8 transition-all duration-300 hover:shadow-xl hover:border-[#F8CEE9] hover:-translate-y-1"
            >
              <div className="ring dark mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Post</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Share news, events, and announcements with your audience. Add images, links, and choose a call-to-action.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C1027D] group-hover:gap-3 transition-all duration-300">
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
          <div className="bg-gradient-to-r from-[#C1027D] to-[#8A0260] rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Start Sharing in 60 seconds
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of investors, businesses, and creators already growing on yoInfo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#C1027D] font-bold px-8 py-4 rounded-xl hover:bg-[#FBEAF5] transition-all shadow-lg"
                >
                  Create Free Account
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/investments"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/30 transition-all border border-white/20"
                >
                  Browse Investments
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-[#f0e4ec] bg-[#fdf8fa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/YoINFOlogo.png" alt="yoInfo" className="h-6" />
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/investments" className="hover:text-[#C1027D] transition-colors">Investments</Link>
              <Link href="/messaging" className="hover:text-[#C1027D] transition-colors">Blast</Link>
              <Link href="/poster/dashboard" className="hover:text-[#C1027D] transition-colors">Post</Link>
              <Link href="/business" className="hover:text-[#C1027D] transition-colors">Business</Link>
            </div>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} yoInfo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
