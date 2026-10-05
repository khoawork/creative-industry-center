import { useState } from 'react'
import { getSpeakerInitials } from '../../config/Events/eventsConfig.js'

export default function EventSpeakerAvatar({ speaker, className = 'size-10' }) {
  const [failedImage, setFailedImage] = useState('')
  const image = typeof speaker?.image === 'string' ? speaker.image.trim() : ''

  if (image && failedImage !== image) {
    return <img src={image} alt={speaker.name || 'Diễn giả'} loading="lazy" onError={() => setFailedImage(image)} className={`${className} shrink-0 rounded-lg object-cover`} />
  }

  return <span aria-hidden="true" className={`${className} flex shrink-0 items-center justify-center rounded-lg bg-(--color-brand-gold) text-sm font-bold text-black`}>
    {getSpeakerInitials(speaker?.name)}
  </span>
}
