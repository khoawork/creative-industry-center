export default function ContactHero({ intro }) {
  return (
    <section aria-labelledby="contact-title" className="bg-white shadow-sm">
      <div className="mx-auto max-w-[75rem] px-4 pt-12 pb-8 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="mb-3 inline-flex items-center gap-2 rounded-[4px] bg-[var(--contact-cream)] px-3 py-1 text-xs font-bold tracking-wider text-[var(--contact-red)] uppercase shadow-sm">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-[var(--contact-gold)]" />
            {intro.badge}
          </p>
          <div className="relative pb-3">
            <h1 id="contact-title" className="text-[28px] leading-10 font-bold tracking-tight text-[var(--contact-red)] uppercase md:text-[32px]">{intro.title}</h1>
            <span aria-hidden="true" className="absolute bottom-0 left-1/2 flex h-1 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--contact-red)]">
              <span className="h-1.5 w-3 rounded-full bg-[var(--contact-gold)]" />
            </span>
          </div>
          <p className="mt-4 text-base leading-7 md:text-lg">{intro.description}</p>
        </div>
      </div>
    </section>
  )
}
