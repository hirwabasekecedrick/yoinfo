'use client';

import Link from 'next/link';
import { useIbiceri } from './ibiceri-provider';

export default function IbiceriBadge() {
  const { balance } = useIbiceri();

  return (
    <Link
      href="/wallet"
      title="Ibiceri balance"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7E8] border-[1.5px] border-[#F0D9A6] hover:border-[#E8B04B] transition-all whitespace-nowrap"
    >
      <svg className="flex-shrink-0" width="15" height="15" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#E8B04B" stroke="#8A5A00" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="6.4" fill="none" stroke="#8A5A00" strokeWidth="1" />
        <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#8A5A00" fontFamily="Montserrat,sans-serif">
          i
        </text>
      </svg>
      <span className="text-[11.5px] font-extrabold text-[#8A5A00]">{balance}</span>
    </Link>
  );
}
