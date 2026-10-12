import React from 'react';
import { UserRound } from 'lucide-react';

export default function ForumSpeakers({ data }) {
  const section = data || {};
  const speakers = Array.isArray(section.speakers) ? section.speakers : [];

  return (
    <section id="dien-gia" className="scroll-mt-24 bg-[#f1f4f8] px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <p className="mb-2 text-xl font-bold uppercase tracking-[0.14em] text-blue-700 sm:text-[14px]">
            {section.tag}
          </p>
          <h2 className="text-2xl font-bold leading-tight text-[#092d63] sm:text-3xl">
            {section.title}
          </h2>
          <p className="mt-3 text-xl leading-relaxed text-slate-600 sm:text-base">
            {section.description}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker, index) => (
            <article
              key={speaker.id || index}
              className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm"
            >
              <div className="mx-auto mb-3 flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-lg border-[3px] border-[#1765b8] bg-blue-50">
                {speaker.image ? (
                  <img
                    src={speaker.image}
                    alt={speaker.name || ''}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <UserRound size={30} className="text-blue-700" />
                )}
              </div>
              <h3 className="text-sm font-bold text-[#092d63]">{speaker.name}</h3>
              <p className="mt-1 min-h-8 text-[9px] font-semibold uppercase leading-relaxed tracking-wide text-blue-700">
                {speaker.role}
              </p>
              {speaker.topic && (
                <div className="mt-3 rounded-sm bg-[#edf0f4] px-3 py-2.5 text-[10px] leading-relaxed text-slate-700">
                  <span className="mb-1 block text-[14px] font-semibold text-slate-600">
                    Chủ đề tham luận:
                  </span>
                  <span className="italic text-sm">{speaker.topic}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
