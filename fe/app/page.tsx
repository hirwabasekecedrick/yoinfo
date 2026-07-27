"use client";

import Link from "next/link";
import {
  ArrowRight,
  Users,
  Building2,
  FileEdit,
  Handshake,
  Briefcase,
  Rocket,
  PenLine,
  Send,
  Phone,
  Zap,
  Globe,
  Shield,
} from "lucide-react";

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
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block"
            >
              Home
            </Link>
            <Link
              href="/business"
              className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block"
            >
              Business
            </Link>
            <Link
              href="/messaging"
              className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block"
            >
              Blast Wizard
            </Link>
            <Link
              href="/poster/dashboard"
              className="text-sm font-medium text-gray-500 hover:text-[#C1027D] px-2 sm:px-3 py-2 rounded-lg hover:bg-[#FBEAF5] transition-colors hidden sm:block"
            >
              Update Wizard
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
        <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF2F8] via-white to-[#FDF2F8]">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[#C1027D]/8 to-[#8A0260]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-[#E97BC4]/10 to-[#C1027D]/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F8CEE9]/20 rounded-full blur-[100px]" />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #C1027D 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-32">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
              {/* Left Image Card */}
              <div className="relative order-2 lg:order-1 group">
                <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_40px_-12px_rgba(193,2,125,0.15)] p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(193,2,125,0.25)] hover:-translate-y-2">
                  {/* Image container */}
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FDF2F8] to-[#FBEAF5] aspect-square">
                    <img
                      src="/man_sending_message.png"
                      alt="Sending a message"
                      className="w-full h-full object-cover p-6 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C1027D]/5 to-transparent" />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-3 -right-3 sm:bottom-4 sm:right-4 bg-white rounded-2xl shadow-lg shadow-[#C1027D]/10 border border-[#f0e4ec] px-4 py-2.5 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C1027D] to-[#8A0260] flex items-center justify-center">
                      <Send className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        Instant
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        Delivery
                      </div>
                    </div>
                  </div>
                  {/* Corner decoration */}
                  <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-[#C1027D]/10 to-transparent rounded-full blur-xl" />
                </div>
              </div>

              {/* Center Text */}
              <div className="order-1 lg:order-2 text-center lg:px-4">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#f0e4ec] rounded-full px-4 py-1.5 mb-6 shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-[#C1027D]" />
                  <span className="text-xs font-semibold text-gray-600">
                    Trusted by 2,400+ users
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                  Update.{" "}
                  <span className="bg-gradient-to-r from-[#C1027D] to-[#8A0260] bg-clip-text text-transparent">
                    Publish.
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-[#D93F9E] to-[#C1027D] bg-clip-text text-transparent">
                    Blast.
                  </span>
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md mx-auto">
                  Share updates instantly — everywhere, all at once. SMS, email,
                  WhatsApp, from one dashboard.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/auth"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#C1027D] to-[#8A0260] text-white font-semibold px-8 py-3.5 rounded-xl hover:shadow-xl hover:shadow-[#C1027D]/25 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {/* <Link
                    href="/business"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold px-8 py-3.5 rounded-xl border border-gray-200 hover:border-[#C1027D]/30 hover:text-[#C1027D] hover:shadow-lg transition-all duration-300"
                  >
                    Explore Businesses
                  </Link> */}
                </div>
                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-6 mt-8">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Pan-Africa</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Secure</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Real-time</span>
                  </div>
                </div>
              </div>

              {/* Right Image Card */}
              <div className="relative order-3 group">
                <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-[0_8px_40px_-12px_rgba(193,2,125,0.15)] p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(193,2,125,0.25)] hover:-translate-y-2">
                  {/* Image container */}
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FDF2F8] to-[#FBEAF5] aspect-square">
                    <img
                      src="/woman_receiving_message.png"
                      alt="Receiving a message"
                      className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C1027D]/5 to-transparent" />
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-3 -left-3 sm:bottom-4 sm:left-4 bg-white rounded-2xl shadow-lg shadow-[#C1027D]/10 border border-[#f0e4ec] px-4 py-2.5 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8A0260] to-[#3D0231] flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        30K+
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">
                        Connections
                      </div>
                    </div>
                  </div>
                  {/* Corner decoration */}
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-[#E97BC4]/10 to-transparent rounded-full blur-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Section ─────────────────────────────── */}
        <section className="relative -mt-8 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[
                  {
                    icon: Users,
                    value: "2,400+",
                    label: "Active Investors",
                    color: "from-[#C1027D] to-[#8A0260]",
                  },
                  {
                    icon: Building2,
                    value: "850+",
                    label: "Businesses Listed",
                    color: "from-[#E97BC4] to-[#C1027D]",
                  },
                  {
                    icon: FileEdit,
                    value: "12K+",
                    label: "Posts Published",
                    color: "from-[#D93F9E] to-[#C1027D]",
                  },
                  {
                    icon: Handshake,
                    value: "30K+",
                    label: "Connections Made",
                    color: "from-[#8A0260] to-[#3D0231]",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="text-center group">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mx-auto mb-3 transition-transform duration-300 group-hover:scale-110`}
                    >
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Option Cards ──────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Everything you need
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              One platform to update, publish, and blast your message across
              every channel.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Business Profiling */}
            <Link
              href="/business"
              className="group relative bg-white rounded-2xl border border-[#f0e4ec] p-8 transition-all duration-300 hover:shadow-xl hover:border-[#F8CEE9] hover:-translate-y-1"
            >
              <div className="flex w-full gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C1027D]/10 to-[#C1027D]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-6 h-6 text-[#C1027D]" />
                </div>
                <div className="flex items-center h-12">
                  <h3 className="text-xl font-bold text-gray-900">
                    Business Profiling
                  </h3>
                </div>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Create and discover businesses across Africa. List your company,
                services, and connect with customers.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C1027D] group-hover:gap-3 transition-all duration-300">
                Explore
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Blast Wizard */}
            <Link
              href="/messaging"
              className="group relative bg-white rounded-2xl border border-[#f0e4ec] p-8 transition-all duration-300 hover:shadow-xl hover:border-[#F8CEE9] hover:-translate-y-1"
            >
              <div className="flex w-full gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C1027D]/10 to-[#C1027D]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-6 h-6 text-[#C1027D]" />
                </div>
                <div className="flex items-center h-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Blast Wizard
                  </h3>
                </div>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Send messages to WhatsApp, SMS, and email from one place. Upload
                contacts, write once, blast everywhere.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C1027D] group-hover:gap-3 transition-all duration-300">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            {/* Post / Update */}
            <Link
              href="/poster/dashboard"
              className="group relative bg-white rounded-2xl border border-[#f0e4ec] p-8 transition-all duration-300 hover:shadow-xl hover:border-[#F8CEE9] hover:-translate-y-1"
            >
              <div className="flex w-full gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C1027D]/10 to-[#C1027D]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PenLine className="w-6 h-6 text-[#C1027D]" />
                </div>
                <div className="flex items-center h-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Update Wizard</h3>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Share news, events, and announcements with your audience. Add
                images, links, and choose a call-to-action.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C1027D] group-hover:gap-3 transition-all duration-300">
                Get Started
                <ArrowRight className="w-4 h-4" />
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
                Join thousands of investors, businesses, and creators already
                growing on yoInfo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#C1027D] font-bold px-8 py-4 rounded-xl hover:bg-[#FBEAF5] transition-all shadow-lg"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
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
              <Link
                href="/messaging"
                className="hover:text-[#C1027D] transition-colors flex items-center gap-1.5"
              >
                <Rocket className="w-3.5 h-3.5" /> Blast Wizard
              </Link>
              <Link
                href="/poster/dashboard"
                className="hover:text-[#C1027D] transition-colors flex items-center gap-1.5"
              >
                <PenLine className="w-3.5 h-3.5" /> Update Wizard
              </Link>
              <Link
                href="/business"
                className="hover:text-[#C1027D] transition-colors flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5" /> Business
              </Link>
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
