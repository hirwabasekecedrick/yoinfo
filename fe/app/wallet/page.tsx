'use client';

import Link from 'next/link';
import ToolLayout from '@/components/tool-layout';
import ProtectedRoute from '@/components/protected-route';
import { useIbiceri } from '@/components/ibiceri-provider';

const TOOL_NAV = [
  { label: 'Update Wizard', href: '/poster/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { label: 'Blast Wizard', href: '/messaging', icon: 'M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.111.431-.173.869-.173 1.315 0 .447.062.884.173 1.315m0-9.665a24.301 24.301 0 003.484.045m-3.484 0a24.27 24.27 0 01-3.484-.045' },
  { label: 'Business Profiling', href: '/business', icon: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 0113.5 9h1.5a1.5 1.5 0 011.5 1.5v8.25' },
  { label: 'Invoice Wizard', href: '/invoices', icon: 'M9 7h6M9 11h6M9 15h3M6 3h9l3 3v15a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z' },
  { label: 'Fliiper', href: '/flipper', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z' },
];

const PACKS: { amount: number; price: number; featured?: boolean }[] = [
  { amount: 100, price: 1000 },
  { amount: 500, price: 4750 },
  { amount: 1000, price: 9000, featured: true },
  { amount: 2500, price: 21250 },
];

export default function WalletPage() {
  const { balance, transactions, shortfall, openPayment } = useIbiceri();

  const packIsRecommended = (amount: number) =>
    shortfall !== null && (PACKS.find(p => p.amount >= shortfall)?.amount ?? 2500) === amount;

  return (
    <ProtectedRoute>
      <ToolLayout title="Ibiceri Wallet" subtitle="Pay-as-you-go token balance" navItems={TOOL_NAV}>
        <div className="max-w-3xl">
          <div className="text-xs font-bold text-gray-400 mb-4">
            <Link href="/" className="text-[#C1027D]">yoInfo</Link> <span className="mx-1">/</span> Ibiceri Wallet
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Your Ibiceri balance</h1>
          <p className="text-sm text-gray-500 font-medium max-w-xl leading-relaxed">
            yoInfo runs on a pay-as-you-go token system. Every post, blast, and translation is paid for in Ibiceri, topped up anytime with Mobile Money.
          </p>

          {shortfall && (
            <div className="flex items-center gap-2.5 bg-[#FBEAE7] border border-[#E8A196] text-[#8A2A1E] text-sm font-bold px-4 py-3 rounded-xl mb-6">
              <span>⚠️</span>
              <span>
                You&apos;re {shortfall} Ibiceri short for that action — pick a package below to top up and continue.
              </span>
            </div>
          )}

          <div className="flex items-center gap-5 bg-gradient-to-br from-[#FFF7E8] to-[#FFF1D2] border border-[#F0D9A6] rounded-2xl px-6 py-5 max-w-md">
            <svg className="flex-shrink-0" width="40" height="40" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#E8B04B" stroke="#8A5A00" strokeWidth="1.2" />
              <circle cx="12" cy="12" r="6.4" fill="none" stroke="#8A5A00" strokeWidth="1" />
              <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A5A00" fontFamily="Montserrat,sans-serif">i</text>
            </svg>
            <div>
              <div className="text-[22px] font-extrabold text-[#8A5A00]">
                <span id="walletBalanceNum">{balance.toLocaleString()}</span> Ibiceri
              </div>
              <div className="text-xs text-[#A9793A] font-semibold mt-0.5">
                ≈ RWF <span id="walletBalanceRwf">{(balance * 10).toLocaleString()}</span> at current rate
              </div>
            </div>
          </div>

          <div className="mt-8 mb-6">
            <div className="text-[11px] font-extrabold text-[#8A0260] bg-[#FBEAF5] px-3 py-1 rounded-full inline-block mb-3 uppercase tracking-wider">
              Top up
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">Buy Ibiceri with Mobile Money</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {PACKS.map(pack => (
              <div
                key={pack.amount}
                id={`walletPack-${pack.amount}`}
                className={`relative bg-white border rounded-2xl shadow-sm p-5 text-center flex flex-col items-center gap-2 ${
                  pack.featured
                    ? 'border-[#E8B04B] bg-[#FFFBF2]'
                    : packIsRecommended(pack.amount)
                      ? 'border-[#C6482E] ring-2 ring-[#C6482E]/20'
                      : 'border-[#f0e4ec]'
                }`}
              >
                {pack.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8B04B] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    Best value
                  </div>
                )}
                <div className="text-xl font-extrabold text-gray-900">{pack.amount.toLocaleString()}</div>
                <div className="text-xs text-gray-500 font-semibold mb-1">RWF {pack.price.toLocaleString()}</div>
                <button
                  className={`text-[12.5px] font-bold px-4 py-2 rounded-[10px] transition-colors ${
                    pack.featured
                      ? 'bg-[#C1027D] text-white hover:bg-[#8A0260]'
                      : 'bg-white border-[1.5px] border-[#f0e4ec] text-[#8A0260] hover:border-[#D93F9E]'
                  }`}
                  onClick={() => openPayment(pack.amount, pack.price)}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#f0e4ec] rounded-2xl p-6 mt-6">
            <div className="text-base font-extrabold text-gray-900 mb-3">Recent activity</div>
            <div id="walletTxList">
              {transactions.slice().reverse().map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[#f8f0f4] last:border-b-0">
                  <div className="text-[13px] font-semibold text-gray-900">
                    {tx.label}
                    <br />
                    <span className="text-[10.5px] text-gray-400 font-semibold">{tx.when}</span>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: tx.type === 'credit' ? '#EFFAF0' : '#FBEAE7',
                      color: tx.type === 'credit' ? '#16A34A' : '#C6482E',
                    }}
                  >
                    {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} Ibiceri
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#f0e4ec] rounded-2xl p-6 mt-6">
            <div className="text-base font-extrabold text-gray-900 mb-3">What costs Ibiceri?</div>
            <div className="flex items-center justify-between py-3 border-b border-[#f8f0f4] last:border-b-0 text-[13px] font-semibold text-gray-900">
              <span>Publish a post to one channel</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F3E7EF] text-[#7A6270]">5 Ibiceri</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#f8f0f4] last:border-b-0 text-[13px] font-semibold text-gray-900">
              <span>Automatic Kinyarwanda translation</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F3E7EF] text-[#7A6270]">3 Ibiceri</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#f8f0f4] last:border-b-0 text-[13px] font-semibold text-gray-900">
              <span>Blast Wizard campaign send</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F3E7EF] text-[#7A6270]">Priced per contact &amp; channel</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-[#f8f0f4] last:border-b-0 text-[13px] font-semibold text-gray-900">
              <span>Issue an EBM-registered invoice</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F3E7EF] text-[#7A6270]">2 Ibiceri</span>
            </div>
          </div>
        </div>
      </ToolLayout>
    </ProtectedRoute>
  );
}
