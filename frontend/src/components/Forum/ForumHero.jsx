import React from 'react';
import { CalendarDays, MapPin } from 'lucide-react';

export default function ForumHero({ data }) {
  const hero = data || {};
  const badge = hero.badge || '';
  const title = hero.title || '';
  const subtitle = hero.subtitle || '';
  const motto = hero.motto || '';
  const eventDate = hero.event_date || '';
  const eventLocation = hero.event_location || '';
  const bannerImage = hero.banner_image || '';
  const topLogoImage = hero.top_logo_image || '';

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_22%,#c8ddfb_0%,#e8f1fd_48%,#f3f6fb_100%)] px-4 pb-12 pt-10 text-[#092d63] sm:px-6 sm:pt-12 lg:pb-16 lg:pt-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#c5d5f1] via-[#73a5e7] to-[#d5ddf2]" />
      <div className="relative mx-auto max-w-6xl text-center">
        {topLogoImage && (
          <div className="mx-auto mb-6 flex h-14 w-24 items-center justify-center bg-white p-2 shadow-md sm:h-16 sm:w-28">
            <img src={topLogoImage} alt="Logo diễn đàn" className="max-h-full max-w-full object-contain" />
          </div>
        )}

        <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0756a8] shadow-sm sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          {badge}
        </div>
        <h1 className="mx-auto text-3xl font-extrabold leading-tight tracking-tight text-[#052f6b] sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-1 text-sm font-bold tracking-wide text-[#0058bc] sm:text-xl">
          {subtitle}
        </p>
        <p className="mt-3 text-xs italic text-black-800 sm:text-sm">{motto}</p>

        <div className="mx-auto mt-4 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-md bg-white px-4 py-3 text-[11px] font-medium text-slate-800 shadow-sm sm:text-xs">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={15} className="text-blue-600" /> 
            {eventDate}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={15} className="text-blue-600" />
            {eventLocation}
          </span>
        </div>

        {bannerImage && (
          <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-lg border border-slate-300 bg-white shadow-lg sm:mt-10">
            <img
              src={bannerImage}
              alt={title}
              className="aspect-[16/8] w-full object-cover sm:aspect-[16/7]"
              fetchPriority="high"
            />
          </div>
        )}
      </div>
    </section>
  );
}
