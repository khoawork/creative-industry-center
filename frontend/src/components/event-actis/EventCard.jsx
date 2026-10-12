import { MapPin } from "lucide-react";
import {
  eventStatusLabel,
  getEventDateParts,
} from "../../config/Events/eventsConfig.js";
import { validEventLink } from "../../api/eventApi.js";
import EventSpeakerAvatar from "./EventSpeakerAvatar.jsx";

export const EventCard = ({ event, onDetail }) => {
  const date = getEventDateParts(event.event_date);
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="relative h-56 w-full overflow-hidden bg-black/5">
        {event.image && (
          <img
            src={event.image}
            alt={event.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
        <span className="absolute left-3 top-3 rounded bg-(--color-brand-gold) px-3 py-1 text-xs font-bold text-black">
          {eventStatusLabel(event.status)}
        </span>
        {date && (
          <time
            dateTime={event.event_date}
            className="absolute bottom-3 right-3 min-w-24 rounded border border-(--color-brand-red)/30 bg-white px-3 py-2 text-center shadow-md"
          >
            <strong className="block text-2xl font-extrabold leading-none text-(--color-brand-red)">
              {date.day}
            </strong>
            <span className="mt-1 block text-[10px] font-bold tracking-wide text-(--color-brand-gold)">
              {date.monthYear}
            </span>
          </time>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="flex items-start gap-2 text-xs text-black/60">
          <MapPin
            size={15}
            className="shrink-0 text-(--color-brand-red)"
            aria-hidden="true"
          />
          {event.location}
        </p>
        <h2 className="text-base font-bold leading-snug">
          <button
            className="cursor-pointer text-left hover:text-(--color-brand-red) focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)"
            onClick={() => onDetail(event)}
          >
            {event.name}
          </button>
        </h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-black/70">
          {event.description}
        </p>
        {event.speakers?.length > 0 && (
          <div className="space-y-3 rounded-lg bg-(--color-brand-cream) p-3">
            {event.speakers.map((speaker, index) => (
              <div key={index} className="flex min-w-0 items-center gap-3">
                <EventSpeakerAvatar speaker={speaker} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {speaker.name}
                  </p>
                  <p className="truncate text-xs text-black/60">
                    {speaker.role || speaker.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          {event.btn_action && validEventLink(event.form_url) && (
            <a
              href={event.form_url}
              className="flex-1 rounded-lg bg-(--color-brand-red) px-4 py-3 text-center text-xs font-bold text-white hover:bg-black focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)"
            >
              {event.btn_action}
            </a>
          )}
          <button
            onClick={() => onDetail(event)}
            className="rounded-lg border border-black/20 px-4 py-3 text-xs font-semibold hover:bg-(--color-brand-cream) focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </article>
  );
};
export default EventCard;
