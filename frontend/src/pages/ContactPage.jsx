import ContactHero from '../components/Contact/ContactHero.jsx'
import ContactInfo from '../components/Contact/ContactInfo.jsx'
import ContactMap from '../components/Contact/ContactMap.jsx'
import ContactForm from '../components/Contact/ContactForm.jsx'
import { site } from '../config/shared/site.js'
import { contactIntro, offices, workingHours, socialChannels, mapLocation, contactCategories } from '../data/Contact/contactData.js'

export default function ContactPage() {
  return (
    <main
      id="contact-content"
      lang="vi"
      className="min-w-0 flex-1 bg-[var(--contact-cream)] text-base leading-relaxed text-black antialiased [--contact-red:#710008] [--contact-gold:#d49520] [--contact-cream:#f4f3f1] [font-family:'Inter',sans-serif]"
    >
      <ContactHero intro={contactIntro} />
      <div className="mx-auto grid max-w-[75rem] grid-cols-1 items-start gap-8 px-4 py-12 md:px-6 lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-5">
          <ContactInfo contact={site.contact} offices={offices} hours={workingHours} channels={socialChannels} />
          <ContactMap location={mapLocation} />
        </div>
        <ContactForm categories={contactCategories} contact={site.contact} />
      </div>
    </main>
  )
}
