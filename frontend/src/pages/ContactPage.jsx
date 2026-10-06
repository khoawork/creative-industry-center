import { useEffect, useState } from 'react'
import ContactHero from '../components/Contact/ContactHero.jsx'
import ContactInfo from '../components/Contact/ContactInfo.jsx'
import ContactMap from '../components/Contact/ContactMap.jsx'
import ContactForm from '../components/Contact/ContactForm.jsx'
import { CONTACT_PAGE_ID, ContactAPI, contactError, requireContactData } from '../api/contactApi.js'

export default function ContactPage() {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    ContactAPI.getPage(CONTACT_PAGE_ID, { signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) setContent(requireContactData(response))
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(contactError(err))
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [attempt])

  const retry = () => {
    setLoading(true)
    setError('')
    setAttempt((value) => value + 1)
  }

  return (
    <main
      id="contact-content"
      lang="vi"
      aria-busy={loading}
      className="min-h-screen min-w-0 flex-1 bg-[var(--contact-cream)] text-base leading-relaxed text-black antialiased [--contact-red:#710008] [--contact-gold:#d49520] [--contact-cream:#f4f3f1] [font-family:'Inter',sans-serif]"
    >
      {loading ? <p role="status" className="p-16 text-center">Đang tải thông tin liên hệ…</p> : error ? (
        <div className="space-y-4 p-16 text-center">
          <p role="alert">{error}</p>
          <button type="button" onClick={retry} className="rounded-lg bg-[var(--contact-red)] px-5 py-3 text-white focus-visible:outline-2 focus-visible:outline-[var(--contact-gold)]">Thử lại</button>
        </div>
      ) : content ? <>
        <ContactHero intro={content.props.intro} />
        <div className="mx-auto grid max-w-[75rem] grid-cols-1 items-start gap-8 px-4 py-12 md:px-6 lg:grid-cols-12">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
            <ContactInfo contact={content.props.contact} offices={content.props.offices} hours={content.props.workingHours} channels={content.props.socialChannels} />
            <ContactMap location={content.props.mapLocation} />
          </div>
          <ContactForm categories={content.props.contactCategories} contact={content.props.contact} form={content.props.form} />
        </div>
      </> : null}
    </main>
  )
}
