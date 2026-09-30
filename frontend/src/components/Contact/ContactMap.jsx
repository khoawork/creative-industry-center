import { MapPin, Navigation } from 'lucide-react'

export default function ContactMap({ location }) {
  return (
    <section aria-labelledby="contact-map-title" className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="contact-map-title" className="flex items-center gap-2 text-sm font-bold text-[var(--contact-red)] uppercase">
          <MapPin size={20} aria-hidden="true" className="shrink-0 text-[var(--contact-gold)]" />Sơ Đồ Vị Trí Viện
        </h2>
        <span className="rounded-[4px] bg-[var(--contact-cream)] px-2 py-0.5 text-xs font-semibold text-[var(--contact-red)]">Bản đồ chỉ dẫn</span>
      </div>
      <iframe
        src={location.embedUrl}
        title={`Google Maps — ${location.mapAddress}`}
        className="h-72 w-full rounded-[4px] border-0 bg-[var(--contact-cream)]"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <div className="flex items-start gap-2 rounded-[4px] bg-[var(--contact-cream)] px-3 py-2">
        <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--contact-red)]" />
        <p className="text-sm font-semibold text-[var(--contact-red)]">{location.label}</p>
      </div>
      <p className="text-sm leading-relaxed">{location.address}</p>
      <a href={location.directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 self-start rounded-sm text-sm font-semibold text-[var(--contact-red)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--contact-gold)]">
        <Navigation size={16} aria-hidden="true" />Mở chỉ đường trên Google Maps
      </a>
    </section>
  )
}
