import React from 'react';
import { Trophy, Award, Bookmark } from 'lucide-react';

const HONOREE_ICON_MAP = {
  trophy: Trophy,
  award: Award,
  bookmark: Bookmark,
};

export const HonoreeCard = ({ honoree, onSelectHonoree }) => {
  const IconComponent = HONOREE_ICON_MAP[honoree.iconType] || Trophy;

  return (
    <div 
      onClick={() => onSelectHonoree && onSelectHonoree(honoree)}
      className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#710008]/20 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#710008] hover:shadow-lg"
    >
      {/* Decorative subtle corner glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-3xl bg-gradient-to-bl from-amber-400/20 via-[#710008]/10 to-transparent" />

      <div>
        {/* Top Header: Badge + Gold Icon */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-block rounded-md bg-[#710008] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {honoree.badge}
          </span>
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-amber-200/50 bg-amber-50 text-[#805600]">
            <IconComponent className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Profile Info: Avatar + Names */}
        <div className="flex items-center gap-3 mb-3">
          <div className="size-14 shrink-0 overflow-hidden rounded-full border-2 border-[#710008]/30 bg-gray-50 shadow-sm transition group-hover:border-[#710008]">
            <img
              src={honoree.avatar}
              alt={honoree.title}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-base font-bold leading-snug text-[#710008] transition-colors">
              {honoree.title}
            </h4>
            <p className="mt-0.5 truncate text-xs font-medium text-[#58413f]">
              {honoree.subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="rounded-lg border border-gray-100 bg-[#faf9f7] p-2.5 text-xs leading-relaxed text-[#1a1c1b] line-clamp-3">
          {honoree.description}
        </p>
      </div>

      {/* Card Footer: Date & Code */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-[11px]">
        <span className="text-[#58413f]">
          Ngày trao: {honoree.date}
        </span>
        <span className="rounded bg-[#710008]/10 px-2 py-0.5 font-mono font-bold text-[#710008]">
          {honoree.code}
        </span>
      </div>
    </div>
  );
};

export default HonoreeCard;

