import React from 'react';
import { CalendarDays, MapPin } from 'lucide-react';

const isVideo = (url) => {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return (
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.mov') ||
    cleanUrl.endsWith('.ogg') ||
    cleanUrl.includes('/video/upload/')
  );
};

export default function ForumHero({ data }) {
  const hero = data || {};
  const title = hero.title || '';
  const subtitle = hero.subtitle || '';
  const motto = hero.motto || '';
  const eventDate = hero.event_date || '';
  const eventLocation = hero.event_location || '';
  const bannerImage = hero.banner_image || '';

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_22%,#c8ddfb_0%,#e8f1fd_48%,#f3f6fb_100%)] px-4 pb-12 text-[#092d63] sm:px-6 lg:pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#c5d5f1] via-[#73a5e7] to-[#d5ddf2]" />
      <div className="relative mx-auto max-w-6xl text-center pt-8">
        <h1 className="mx-auto text-3xl font-bold leading-tight tracking-tight text-[#052f6b] sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <p className="mt-1 text-sm font-bold tracking-wide text-[#0058bc] sm:text-xl">
          {subtitle}
        </p>
        <p className="mt-3 text-xs italic text-black-800 sm:text-sm">{motto}</p>

        <div className="mx-auto mt-4 inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-md bg-white px-4 py-3 text-[14px] font-medium text-slate-800 shadow-sm sm:text-base">
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
            {isVideo(bannerImage) ? (
              <video
                src={bannerImage}
                controls
                autoPlay
                loop
                muted
                playsInline
                className="aspect-[16/8] w-full object-cover sm:aspect-[16/7]"
              />
            ) : (
              <img
                src={bannerImage}
                alt={title}
                className="aspect-[16/8] w-full object-cover sm:aspect-[16/7]"
                fetchPriority="high"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
