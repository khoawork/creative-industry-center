import React from 'react';
import { Award, Medal, Star, Trophy } from 'lucide-react';

const awardIcons = [Trophy, Award, Medal, Star];

export default function ForumAwards({ data, dbAwards = [] }) {
  const section = data || {};
  const awards = Array.isArray(dbAwards) ? dbAwards : [];

  return (
    <section id="giai-thuong" className="scroll-mt-24 bg-[#f1f4f8] px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 sm:text-xs">
            {section.tag}
          </p>
          <h2 className="text-2xl font-bold leading-tight text-[#092d63] sm:text-3xl">
            {section.title}
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {section.description}
          </p>
        </header>

        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
          {awards.map((award, index) => {
            const name = award.name || award.title || '';
            const description =
              award.description ||
              (typeof award.criteria === 'string' ? award.criteria : '') ||
              award.props?.description || '';
            const Icon = awardIcons[index % awardIcons.length];
            const badge = award.badge || award.props?.category_badge || '';
            const image = award.image || award.props?.image;
            const criteria = Array.isArray(award.criteria) ? award.criteria : [];

            return (
              <article
                key={award.id || index}
                className={`relative flex flex-col rounded-lg border border-slate-200 bg-white px-5 pb-5 pt-6 text-center shadow-sm ${index === 1 ? 'ring-1 ring-slate-300' : ''}`}
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-[#e5edff] text-[#082e68]">
                  {image ? (
                    <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <Icon size={22} />
                  )}
                </div>
                {badge && (
                  <span className="mx-auto mb-2 rounded-full bg-[#e2eaff] px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-[#123d7c]">
                    {badge}
                  </span>
                )}
                <h3 className="mx-auto max-w-sm text-sm font-bold leading-snug text-[#092d63]">
                  {name}
                </h3>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-600">
                  {description}
                </p>
                {criteria.length > 0 && (
                  <div className="mt-auto pt-3 text-left">
                    <p className="border-t border-slate-100 pt-2 text-[9px] font-bold text-slate-700">
                      Tiêu chí then chốt:
                    </p>
                    <ul className="mt-1 list-inside list-disc space-y-0.5 text-left text-[9px] leading-relaxed text-slate-600">
                      {criteria.slice(0, 2).map((criterion, criterionIndex) => (
                        <li key={criterionIndex}>
                          {typeof criterion === 'string'
                            ? criterion
                            : criterion.title || criterion.name || ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
