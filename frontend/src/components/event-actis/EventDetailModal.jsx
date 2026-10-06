import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { validEventLink } from '../../api/eventApi.js'
import { formatEventDate } from '../../config/Events/eventsConfig.js'
import EventSpeakerAvatar from './EventSpeakerAvatar.jsx'

export const EventDetailModal = ({ event, isOpen, onClose }) => {
  const dialog = useRef(null)
  useEffect(() => {
    if (isOpen && !dialog.current.open) dialog.current.showModal()
    else if (!isOpen && dialog.current.open) dialog.current.close()
  }, [isOpen])
  return <dialog ref={dialog} onCancel={onClose} onClose={onClose} aria-labelledby="event-detail-title" className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl bg-white p-0 text-black backdrop:bg-black/60">
    {event && <>
      <div className="relative aspect-video bg-black/5">{event.image && <img src={event.image} alt={event.name} className="h-full w-full object-cover" />}<button type="button" autoFocus onClick={onClose} aria-label="Đóng chi tiết" className="absolute right-3 top-3 rounded-full bg-black p-2 text-white focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)"><X size={20} /></button></div>
      <div className="space-y-4 p-6"><h2 id="event-detail-title" className="text-xl font-bold text-(--color-brand-red)">{event.name}</h2><p className="text-sm text-black/60">{event.location}</p>{event.event_date && <p className="text-sm">Ngày tổ chức: <time dateTime={event.event_date}>{formatEventDate(event.event_date)}</time></p>}<p className="whitespace-pre-line text-sm leading-7">{event.description}</p>
        {event.speakers?.map((speaker, index) => <div key={index} className="flex gap-3 rounded-lg bg-(--color-brand-cream) p-4"><EventSpeakerAvatar speaker={speaker} className="size-14" /><div className="min-w-0"><h3 className="font-semibold">{speaker.name}</h3><p className="text-sm text-black/70">{speaker.role || speaker.title}</p>{speaker.description && <p className="mt-2 text-sm">{speaker.description}</p>}</div></div>)}
        {event.btn_action && validEventLink(event.form_url) && <a href={event.form_url} className="inline-block rounded-lg bg-(--color-brand-red) px-5 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-(--color-brand-gold)">{event.btn_action}</a>}
      </div>
    </>}
  </dialog>
}
export default EventDetailModal
