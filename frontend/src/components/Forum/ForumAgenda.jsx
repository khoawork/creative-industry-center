import React from 'react';
import { Award, Building2, Clock } from 'lucide-react';

export default function ForumAgenda({ data }) {
  const section = data || {};
  const sessions = Array.isArray(section.sessions) ? section.sessions : [];

  return (
    <section id="chuong-trinh" className="scroll-mt-24 bg-[#f7fafe] px-4 py-12 text-slate-800 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-2 text-xl font-bold uppercase tracking-[0.12em] text-blue-700 sm:text-[14px]">
            {section.tag}
          </p>
          <h2 className="text-2xl font-bold leading-tight text-[#092d63] sm:text-3xl">
            {section.title}
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {section.description}
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-md bg-[#eef3fa] p-3 text-[#092d63]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-blue-700">
              <Award size={26} />
            </span>
            <span>
              <span className="block text-[16px] font-bold">{section.certificate_title}</span>
              <span className="mt-1 block text-[12px] text-slate-600">
                {section.certificate_subtitle}
              </span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {sessions.map((session, index) => (
            <article
              key={session.id || index}
              className={`rounded-md border-l-[3px] bg-white px-4 py-4 shadow-sm sm:px-5 ${index === 2 ? 'border-l-blue-500' : index === 3 ? 'border-l-slate-700' : 'border-l-[#0a397f]'}`}
            >
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-sm bg-[#e7efff] px-2 py-1 text-[10px] font-extrabold text-[#0a397f]">
                  <Clock size={11} />
                  {session.session_no}
                </span>
                {session.location && (
                  <span className="inline-flex items-center gap-1 text-[12px] text-slate-600">
                    <Building2 size={11} />
                    {session.location}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold leading-snug text-[#092d63]">
                {session.title}
              </h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-600 sm:text-sm">
                {session.description}
              </p>
              {Array.isArray(session.tags) && session.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {session.tags.map((tag, tagIndex) => (
                    <span
                      key={`${tag}-${tagIndex}`}
                      className="rounded-full bg-[#eef1f5] px-2 py-1 text-[12px] font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
