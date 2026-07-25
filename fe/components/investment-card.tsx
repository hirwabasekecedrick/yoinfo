'use client';

interface Investment {
  id: string;
  title: string;
  category: string;
  summary: string;
  minInvestment: number;
  maxInvestment: number;
  location: string;
  status: 'Open' | 'Closing Soon' | 'Coming Soon';
  roi: string;
  image?: string;
  imageUrl?: string;
  featured?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  'Open': 'bg-[#D93F9E]/5 text-[#C1027D] border-[#D93F9E]/20',
  'Closing Soon': 'bg-amber-50 text-amber-700 border-amber-200',
  'Coming Soon': 'bg-gray-50 text-gray-600 border-gray-200',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Real Estate': 'bg-blue-50 text-blue-700',
  'Technology': 'bg-purple-50 text-purple-700',
  'Agriculture': 'bg-lime-50 text-lime-700',
  'Energy': 'bg-orange-50 text-orange-700',
  'Finance': 'bg-[#FBEAF5] text-[#C1027D]',
  'Healthcare': 'bg-rose-50 text-rose-700',
  'Education': 'bg-indigo-50 text-indigo-700',
  'Manufacturing': 'bg-slate-50 text-slate-700',
  'Tourism': 'bg-cyan-50 text-cyan-700',
  'Retail': 'bg-[#FBEAF5] text-[#C1027D]',
};

export default function InvestmentCard({ investment }: { investment: Investment }) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <div className={`group bg-white border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#F8CEE9]/50 hover:-translate-y-1 ${investment.featured ? 'border-[#E97BC4] ring-1 ring-[#FBEAF5]' : 'border-[#f0e4ec]'}`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#FBEAF5] to-[#FDF4FA]">
        <img
          src={investment.imageUrl || investment.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop'}
          alt={investment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_STYLES[investment.status]}`}>
            {investment.status}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${CATEGORY_COLORS[investment.category] || 'bg-gray-50 text-gray-700'}`}>
            {investment.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-[#C1027D] transition-colors">
          {investment.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {investment.summary}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-[#FDF4FA]">
            <div className="text-xs text-gray-400 font-medium mb-0.5">Investment</div>
            <div className="text-sm font-bold text-[#C1027D]">
              {formatCurrency(investment.minInvestment)}
              {investment.maxInvestment !== investment.minInvestment && ` - ${formatCurrency(investment.maxInvestment)}`}
            </div>
          </div>
          <div className="text-center p-2 rounded-lg bg-[#FDF4FA]">
            <div className="text-xs text-gray-400 font-medium mb-0.5">Est. ROI</div>
            <div className="text-sm font-bold text-[#C1027D]">{investment.roi}</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-[#FDF4FA]">
            <div className="text-xs text-gray-400 font-medium mb-0.5">Location</div>
            <div className="text-sm font-bold text-[#C1027D] truncate">{investment.location}</div>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full py-2.5 rounded-xl bg-[#C1027D] text-white text-sm font-bold hover:bg-[#8A0260] transition-all shadow-sm shadow-[#C1027D]/25 hover:shadow-md hover:shadow-[#C1027D]/30">
          Explore Opportunity
        </button>
      </div>
    </div>
  );
}
