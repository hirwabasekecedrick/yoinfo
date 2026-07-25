'use client';

interface Business {
  id: string;
  name: string;
  tagline: string;
  category: string;
  description: string;
  logo: string;
  coverImage: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  reviewCount: number;
  services: string[];
  featured?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Technology': 'bg-purple-50 text-purple-700 border-purple-200',
  'Healthcare': 'bg-rose-50 text-rose-700 border-rose-200',
  'Finance': 'bg-[#FBEAF5] text-[#C1027D] border-[#F8CEE9]',
  'Education': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Retail': 'bg-[#FBEAF5] text-[#C1027D] border-[#F8CEE9]',
  'Hospitality': 'bg-amber-50 text-amber-700 border-amber-200',
  'Manufacturing': 'bg-slate-50 text-slate-700 border-slate-200',
  'Agriculture': 'bg-lime-50 text-lime-700 border-lime-200',
  'Construction': 'bg-orange-50 text-orange-700 border-orange-200',
  'Professional Services': 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

export default function BusinessCard({ business, onView }: { business: Business; onView?: (id: string) => void }) {
  return (
    <div className={`group bg-white border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#F8CEE9]/50 hover:-translate-y-1 ${business.featured ? 'border-[#E97BC4] ring-1 ring-[#FBEAF5]' : 'border-[#f0e4ec]'}`}>
      {/* Cover Image */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#FBEAF5] to-[#FDF4FA]">
        <img
          src={business.coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop'}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Logo + Basic Info */}
      <div className="px-5 -mt-8 relative">
        <div className="flex items-end gap-3 mb-3">
          <div className="w-16 h-16 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden flex-shrink-0">
            <img src={business.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop'} alt={business.name} className="w-full h-full object-cover" />
          </div>
          <div className="pb-1">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#C1027D] transition-colors leading-tight">
              {business.name}
            </h3>
            <p className="text-xs text-gray-400">{business.location}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 space-y-3">
        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${CATEGORY_COLORS[business.category] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
          {business.category}
        </span>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{business.tagline || business.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`w-4 h-4 ${star <= Math.round(business.rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-500">
            {business.rating.toFixed(1)} ({business.reviewCount} reviews)
          </span>
        </div>

        {/* Services */}
        {business.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {business.services.slice(0, 3).map((service) => (
              <span key={service} className="px-2 py-0.5 rounded-md bg-[#FBEAF5] text-xs font-medium text-[#C1027D]">
                {service}
              </span>
            ))}
            {business.services.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-gray-50 text-xs font-medium text-gray-500">
                +{business.services.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onView?.(business.id)}
          className="w-full py-2.5 rounded-xl bg-[#C1027D] text-white text-sm font-bold hover:bg-[#8A0260] transition-all shadow-sm shadow-[#C1027D]/25"
        >
          View Full Profile
        </button>
      </div>
    </div>
  );
}
