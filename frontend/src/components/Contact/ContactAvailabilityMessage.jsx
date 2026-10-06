const linkClass = 'rounded-sm font-semibold text-[var(--contact-gold)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--contact-gold)]'
const contactPattern = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d\s().-]{6,}\d)/gi
const messageTokenPattern = /(\{hotline(?:\s*:\s*[^}]+)?\}|\{email(?:\s*:\s*[^}]+)?\}|hotline|email Ban Thư ký)/gi
const hotlineTokenPattern = /^\{hotline(?:\s*:\s*([^}]+))?\}$/i
const emailTokenPattern = /^\{email(?:\s*:\s*([^}]+))?\}$/i

function phoneHref(value) {
  return `tel:${String(value).replace(/[^\d+]/g, '')}`
}

function renderTextWithLinks(text, keyPrefix) {
  return String(text).split(contactPattern).map((part, index) => {
    if (!part) return null
    if (part.includes('@')) return <a key={`${keyPrefix}-email-${index}`} href={`mailto:${part}`} className={linkClass}>email Ban Thư ký</a>
    if (/^\+?\d[\d\s().-]{6,}\d$/u.test(part)) return <a key={`${keyPrefix}-phone-${index}`} href={phoneHref(part)} className={linkClass}>hotline</a>
    return <span key={`${keyPrefix}-text-${index}`}>{part}</span>
  })
}

export default function ContactAvailabilityMessage({ message, contact = {} }) {
  const phoneHrefValue = contact.phoneHref || '#'
  const emailValue = contact.emails?.[0] || 'email@example.com'
  const emailHref = `mailto:${emailValue}`

  return String(message).split(messageTokenPattern).map((part, index) => {
    const hotlineMatch = part.match(hotlineTokenPattern)
    const emailMatch = part.match(emailTokenPattern)
    if (hotlineMatch) return <a key={`${part}-${index}`} href={phoneHrefValue} className={linkClass}>{hotlineMatch[1]?.trim() || 'hotline'}</a>
    if (emailMatch) return <a key={`${part}-${index}`} href={emailHref} className={linkClass}>{emailMatch[1]?.trim() || 'email Ban Thư ký'}</a>
    if (part === 'hotline') return <a key={`${part}-${index}`} href={phoneHrefValue} className={linkClass}>{part}</a>
    if (part === 'email Ban Thư ký') return <a key={`${part}-${index}`} href={emailHref} className={linkClass}>{part}</a>
    return renderTextWithLinks(part, `message-${index}`)
  })
}
