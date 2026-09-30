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
      className="group bg-white rounded-xl md:rounded-2xl border border-gray-200 hover:border-[#680007]/30 shadow-xs hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between cursor-pointer relative overflow-hidden"
    >
      {/* Decorative subtle corner glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-100/40 rounded-full blur-xl group-hover:bg-rose-100/50 transition-colors pointer-events-none" />

      <div>
        {/* Top Header: Badge + Gold Icon */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="inline-block bg-[#680007] text-white text-[10px] sm:text-[10.5px] font-bold px-2.5 py-1 rounded tracking-wide uppercase">
            {honoree.badge}
          </span>
          <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-[#b88628] shrink-0 border border-amber-200/50">
            <IconComponent className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Profile Info: Avatar + Names */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={honoree.avatar}
            alt={honoree.title}
            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200 bg-gray-50 shadow-2xs group-hover:scale-105 transition-transform"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#680007] transition-colors leading-snug truncate">
              {honoree.title}
            </h4>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {honoree.subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
          {honoree.description}
        </p>
      </div>

      {/* Card Footer: Date & Code */}
      <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between text-[11px]">
        <span className="text-gray-400 font-medium">
          {honoree.date}
        </span>
        <span className="font-mono font-bold text-[#680007] bg-[#fff0ed] px-2 py-0.5 rounded border border-[#fbd0d0]">
          {honoree.code}
        </span>
      </div>
    </div>
  );
};

export default HonoreeCard;

