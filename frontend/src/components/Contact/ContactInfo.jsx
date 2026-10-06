import { Building2, Clock3, Mail, MessageCircle, PhoneCall, Play } from 'lucide-react'
import Icon from '../shared/Icon.jsx'

const channelIcons = {
  zalo: <MessageCircle size={20} aria-hidden="true" />,
  facebook: <Icon name="globe" />,
  youtube: <Play size={20} aria-hidden="true" />,
}
const linkClass = 'rounded-sm font-medium text-[var(--contact-red)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--contact-gold)]'
const channelClass = 'flex min-w-0 flex-col items-center justify-center gap-1 rounded-[4px] bg-[var(--contact-cream)] p-2 text-center text-xs font-semibold'
const badgeClass = 'flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--contact-cream)] text-[var(--contact-gold)]'

function externalHref(value) {
  const href = String(value || '').trim()
  if (!href) return ''
  return /^https?:\/\//i.test(href) ? href : `https://${href.replace(/^\/\//, '')}`
}

export default function ContactInfo({ contact, offices, hours, channels }) {
  const phones = Array.isArray(contact.phones) && contact.phones.length
    ? contact.phones
    : [{ number: contact.phone, href: contact.phoneHref }]

  return (
    <section aria-labelledby="contact-offices-title" className="relative flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex h-1.5 overflow-hidden rounded-t-lg bg-[var(--contact-red)]">
        <span className="w-16 bg-[var(--contact-gold)]" />
      </div>
      <h2 id="contact-offices-title" className="flex items-center gap-2 pt-1 text-lg leading-6 font-bold tracking-tight text-[var(--contact-red)]">
        <Icon name="landmark" size={24} className="shrink-0 text-[var(--contact-gold)]" />
        Hệ Thống Văn Phòng Phục Vụ
      </h2>
      <div className="rounded-[4px] bg-[var(--contact-cream)] p-3 text-sm">
        <p className="font-bold text-[var(--contact-red)]">{contact.organization}</p>
        <p className="mt-1">{contact.address}</p>
      </div>
      <div className="flex flex-col gap-4">
        {offices.map((office) => (
          <div key={office.id} className="flex items-start gap-3 rounded-[4px] bg-[var(--contact-cream)] p-3">
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[4px] bg-white text-[var(--contact-red)]">
              <Building2 size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-wider text-[var(--contact-red)] uppercase">{office.label}</p>
              <h3 className="mt-0.5 font-semibold">{office.city}</h3>
              <p className="mt-1 text-sm leading-snug">{office.address}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-start gap-3">
          <span className={badgeClass}><PhoneCall size={18} aria-hidden="true" /></span>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase">Điện thoại / Hotline hỗ trợ</h3>
            <div className="mt-1 flex flex-col gap-1">
              {phones.map((phone, index) => <a key={`${phone.href}-${index}`} className={`${linkClass} inline-block font-bold`} href={phone.href}>{phone.number}</a>)}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className={badgeClass}><Mail size={18} aria-hidden="true" /></span>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase">Email chính thức tiếp nhận</h3>
            <div className="mt-1 flex flex-col gap-1 text-sm [overflow-wrap:anywhere]">
              {contact.emails.map((email) => <a key={email} href={`mailto:${email}`} className={linkClass}>{email}</a>)}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className={badgeClass}><Clock3 size={18} aria-hidden="true" /></span>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold uppercase">Thời gian tiếp công dân & hồ sơ</h3>
            <dl className="mt-2 flex flex-col gap-1 text-sm">
              {hours.map((row) => (
                <div key={row.days} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[4px] bg-[var(--contact-cream)] px-2 py-1">
                  <dt>{row.days}:</dt>
                  <dd className="font-semibold whitespace-nowrap text-[var(--contact-red)]">{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className="pt-3">
        <h3 className="mb-2 text-xs font-bold tracking-wider uppercase">Kênh Thông Tin Điện Tử</h3>
        <div className="grid grid-cols-3 gap-2">
          {channels.map((channel) => {
            const content = <><span className="text-[var(--contact-red)]">{channelIcons[channel.id] || <Icon name="globe" />}</span><span>{channel.label}</span></>
            const href = externalHref(channel.href)
            return href ? (
              <a key={channel.id} href={href} target="_blank" rel="noopener noreferrer" className={`${channelClass} hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--contact-gold)]`}>{content}</a>
            ) : (
              <div key={channel.id} className={channelClass}>{content}<span className="text-[10px] leading-4 font-normal">Đang cập nhật</span></div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
