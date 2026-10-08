import React from 'react';
import { BadgeCheck, Globe2, Layers3, Network, Shield, TrendingUp, Award } from 'lucide-react';

const icons = {
  trending_up: TrendingUp,
  'trending-up': TrendingUp,
  hub: Network,
  network: Network,
  public: Globe2,
  globe: Globe2,
  shield: Shield,
  layers: Layers3,
  award: Award,
  verified: BadgeCheck,
};

export default function ForumPillars({ data }) {
  const section = data || {};
  const pillars = Array.isArray(section.pillars) ? section.pillars : [];

  return (
    <section id="tru-cot" className="scroll-mt-24 bg-[#f7fafe] px-4 py-8 text-slate-800 sm:px-6 lg:py-10">
      <span id="muc-tieu" className="scroll-mt-24" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 grid grid-cols-1 items-end gap-3 md:grid-cols-[1.2fr_1fr] md:gap-8">
          <div>
            <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.12em] text-blue-700 sm:text-[9px]">
              {section.tag}
            </p>
            <h2 className="text-xl font-bold leading-tight text-[#092d63] sm:text-2xl">
              {section.title}
            </h2>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-600 sm:text-xs">
            {section.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = icons[pillar.icon] || BadgeCheck;
            return (
              <article
                key={pillar.id || index}
                className="flex min-h-[166px] flex-col rounded-md border border-slate-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-3.5"
              >
                <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-md bg-[#f0f4f8] text-[#164c91]">
                  <Icon size={17} />
                </div>
                <span className="mb-1 text-[8px] font-semibold uppercase tracking-wide text-blue-700">
                    {pillar.pillar_no}
                </span>
                <h3 className="text-[11px] font-bold leading-snug text-[#092d63] sm:text-xs">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-[9px] leading-relaxed text-slate-600">
                  {pillar.description}
                </p>
                {pillar.action_text && (
                  <span className="mt-auto pt-2 text-[8px] font-semibold text-blue-700">
                    {pillar.action_text} <span aria-hidden="true">›</span>
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
