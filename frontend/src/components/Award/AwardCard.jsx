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
    <article className="group grid overflow-hidden rounded-2xl border border-[#710008]/15 bg-white shadow-sm transition-all duration-300 hover:border-[#710008] hover:shadow-xl md:grid-cols-12">
      {/* Left Column: Image with Badge Overlay */}
      <div className="relative min-h-[260px] overflow-hidden bg-[#e9e8e6] md:col-span-5 md:min-h-[320px]">
        <img
          src={award.image}
          alt={award.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Dark subtle gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Top-Left Category Badge */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md bg-[#710008] px-3 py-1 font-mono text-xs font-bold text-white shadow-md">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300"></span>
          <span>{award.categoryBadge}</span>
        </div>
      </div>

      {/* Right Column: Information & Details */}
      <div className="flex flex-col justify-between p-5 md:col-span-7 lg:p-7">
        <div>
          {/* Top Meta Line: Code & Scope */}
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="rounded bg-[#710008]/10 px-2.5 py-1 font-mono text-xs font-bold text-[#710008]">
              MÃ HIỆU: {award.code}
            </span>
            <span className="truncate text-xs font-medium text-[#58413f]">
              {award.decision_number}
            </span>
          </div>

          {/* Title Row with Red Crest Icon */}
          <div className="mb-2 flex items-start gap-3">
            <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#710008] to-[#580006] text-amber-300 shadow-md">
              <IconComponent className="w-4 h-4" />
            </div>
            <h3 
              onClick={() => onSelectAward && onSelectAward(award)}
              className="cursor-pointer text-xl font-bold leading-tight tracking-tight text-[#710008] transition-colors group-hover:text-[#580006] sm:text-2xl"
            >
              {award.title}
            </h3>
          </div>

          {/* Subtitle in Gold/Amber Accent */}
          <p className="mb-3 pl-[3.25rem] text-sm font-semibold uppercase tracking-wider text-[#805600]">
            {award.subtitle}
          </p>

          {/* Description */}
          <p className="border-t border-dashed border-[#710008]/15 pt-3 text-base font-medium leading-relaxed text-[#58413f] line-clamp-4 pl-[3.25rem]">
            {award.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 pl-[3.25rem]">
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

