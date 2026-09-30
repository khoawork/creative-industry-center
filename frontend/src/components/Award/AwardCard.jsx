import React from 'react';
import { Flame, Award, Medal, Sparkles, Trophy, ChevronRight, FileText } from 'lucide-react';

const ICON_MAP = {
  Flame,
  Award,
  Medal,
  Sparkles,
  Trophy,
};

export const AwardCard = ({ award, onSelectAward }) => {
  const IconComponent = ICON_MAP[award.iconName] || Trophy;

  return (
    <article className="group bg-white rounded-xl md:rounded-2xl border border-[#e5e5e5] hover:border-[#680007]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-stretch">
      {/* Left Column: Image with Badge Overlay */}
      <div className="relative w-full md:w-[320px] lg:w-[360px] xl:w-[390px] shrink-0 h-[210px] sm:h-[230px] md:h-auto min-h-[200px] rounded-xl overflow-hidden bg-gray-100">
        <img
          src={award.image}
          alt={award.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Dark subtle gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top-Left Category Badge */}
        <div className="absolute top-3 left-3 bg-[#680007] text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md backdrop-blur-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-300 animate-pulse"></span>
          <span>{award.categoryBadge}</span>
        </div>
      </div>

      {/* Right Column: Information & Details */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div>
          {/* Top Meta Line: Code & Scope */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="inline-block bg-[#ffdad6]/60 border border-[#f5b8b0] text-[#680007] text-[11px] font-bold px-2 py-0.5 rounded tracking-wider">
              {award.code}
            </span>
            <span className="text-[11px] text-gray-500 font-semibold tracking-wider uppercase truncate">
              {award.scope}
            </span>
          </div>

          {/* Title Row with Red Crest Icon */}
          <div className="flex items-start gap-2.5 mb-1.5">
            <div className="w-7 h-7 rounded bg-[#680007] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <IconComponent className="w-4 h-4" />
            </div>
            <h3 
              onClick={() => onSelectAward && onSelectAward(award)}
              className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-[#680007] transition-colors leading-snug cursor-pointer"
            >
              {award.title}
            </h3>
          </div>

          {/* Subtitle in Gold/Amber Accent */}
          <p className="text-xs sm:text-[12.5px] font-bold text-[#b88628] uppercase tracking-wide mb-2.5 pl-9.5">
            {award.subtitle}
          </p>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3 sm:line-clamp-4 pl-9.5">
            {award.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between pl-9.5">
          <button
            type="button"
            onClick={() => onSelectAward && onSelectAward(award)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#680007] hover:text-[#8e000a] group/btn transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Xem chi tiết quy chuẩn &amp; đề cử</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </button>

          <span className="text-xs text-gray-400 font-medium">
            Năm xét tặng: <strong className="text-gray-700 font-semibold">{award.year}</strong>
          </span>
        </div>
      </div>
    </article>
  );
};

export default AwardCard;

