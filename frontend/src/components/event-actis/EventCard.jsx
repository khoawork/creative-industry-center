import { useState } from 'react';
import { MapPin, UserCheck, Bell } from 'lucide-react';

export const EventCard = ({ event, onRegister, onDetail }) => {
  const [imgSrc, setImgSrc] = useState(event.image);

  return (
    <article className="bg-white rounded-xl border border-[#e0bfbb]/40 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Thumbnail Area with Date and Status Badge */}
      <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={event.title}
          onError={() => {
            if (event.fallbackImage && imgSrc !== event.fallbackImage) {
              setImgSrc(event.fallbackImage);
            }
          }}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status Pill Badge at top-left */}
        <div className="absolute top-3 left-3">
          {event.status === 'open' && (
            <span className="inline-flex items-center gap-1.5 bg-[#ffba45] text-[#704b00] text-[11px] font-bold px-2.5 py-1 rounded-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-smll bg-[#704b00] animate-pulse"></span>
              {event.statusText}
            </span>
          )}
          {event.status === 'upcoming' && (
            <span className="inline-flex items-center gap-1.5 bg-[#ffddaf] text-[#704b00] text-[11px] font-bold px-2.5 py-1 rounded-sm shadow-sm">
              {event.statusText}
            </span>
          )}
          {event.status === 'planned' && (
            <span className="inline-flex items-center gap-1.5 bg-[#e3e2e0] text-[#58413f] text-[11px] font-bold px-2.5 py-1 rounded-sm shadow-sm">
              {event.statusText}
            </span>
          )}
        </div>

        {/* Date Badge at bottom-right of image */}
        <div className="absolute bottom-2.5 right-3 bg-white/95 rounded-sm px-2.5 py-1.5 text-center shadow-md border border-gray-100 min-w-[70px]">
          <span className="block text-xl font-black text-[#490003] leading-none">
            {event.day}
          </span>
          <span className="block text-[9px] uppercase font-bold text-gray-500 tracking-wider mt-0.5">
            {event.monthYear}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location line */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-[#9c6800] shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Event Title */}
          <h3
            onClick={() => onDetail && onDetail(event)}
            className="text-base font-bold text-[#1a1c1b] group-hover:text-[#490003] transition-colors line-clamp-2 leading-snug mt-2 cursor-pointer"
            title={event.title}
          >
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed text-justify sm:text-left">
            {event.description}
          </p>

          {/* Speaker / Host Box */}
          <div className="bg-[#f4f3f1] p-2.5 rounded-sm flex items-center gap-2.5 mt-3.5">
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${event.speaker.avatarBg}`}>
              {event.speaker.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1a1c1b] truncate">
                {event.speaker.name}
              </p>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">
                {event.speaker.role}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 mt-4 pt-2">
          {event.actionType === 'notify' ? (
            <button
              type="button"
              onClick={() => onRegister && onRegister(event)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm bg-[#480004] hover:bg-[#6b0f11] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-[#f4b42c]" />
              <span>{event.actionText}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onRegister && onRegister(event)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-sm bg-[#490003] hover:bg-[#710008] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#ffba45]" />
              <span>{event.actionText}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDetail && onDetail(event)}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-sm border border-[#e0bfbb] hover:border-[#8c716e] text-[#1a1c1b] hover:bg-[#f4f3f1] font-semibold text-xs transition-colors cursor-pointer"
          >
            <span>Chi tiết</span>
          </button>
        </div>

      </div>

    </article>
  );
};

export default EventCard;
