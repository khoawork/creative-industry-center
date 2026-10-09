import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

function PartnerMark({ image, name, small = false }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name || ''}
        className={`${small ? 'h-8 w-8' : 'h-10 w-10'} object-contain`}
        loading="lazy"
      />
    );
  }
  return <Building2 size={small ? 17 : 21} className="text-[#0756a8]" />;
}

export default function ForumPartners({ data }) {
  const section = data || {};
  const organizers = Array.isArray(section.organizers) ? section.organizers : [];
  const sponsors = Array.isArray(section.sponsors) ? section.sponsors : [];

  return (
    <section id="doi-tac" className="scroll-mt-24 bg-[#f7fafe] px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 text-center">
          <p className="text-xl font-bold uppercase tracking-[0.14em] text-blue-700 sm:text-[14px]">
            {section.organizers_tag}
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {organizers.map((partner, index) => (
            <article
              key={partner.id || `${partner.name}-${index}`}
              className="flex min-h-20 items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-center shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <PartnerMark image={partner.image} name={partner.name} small />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-[12px] font-extrabold leading-snug text-[#092d63]">
                  {partner.name}
                </span>
                <span className="mt-1 block text-[12px] text-slate-500">{partner.desc || partner.tier}</span>
              </span>
            </article>
          ))}
        </div>

        <div className="mb-5 mt-8 text-center">
          <p className="text-xl font-bold uppercase tracking-[0.14em] text-blue-700 sm:text-[14px]">
            {section.sponsors_tag}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {sponsors.map((partner, index) => (
            <article
              key={partner.id || `${partner.name}-${index}`}
              className="flex min-h-[76px] flex-col items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-3 text-center shadow-sm"
            >
              <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                <PartnerMark image={partner.image} name={partner.name} small />
              </span>
              <span className="text-[12px] font-bold leading-snug text-[#092d63]">{partner.name}</span>
              {partner.tier && (
                <span className="mt-1 text-[10px] text-slate-500">{partner.tier}</span>
              )}
            </article>
          ))}
        </div>
       
      </div>
    </section>
  );
}
