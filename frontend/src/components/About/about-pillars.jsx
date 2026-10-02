import { AboutHeading, AboutIcon, AboutLink } from './about-shared.jsx';

export default function AboutPillars({ coreValues, actions }) {
  return (
    <section className="w-full border-y border-[#d49520]/30 bg-[#f4f3f1] px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {coreValues && (
          <>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
              <AboutHeading tag={coreValues.tag} title={coreValues.title_main} />
              {coreValues.description && <p className="whitespace-pre-line text-xl leading-relaxed text-black/80">{coreValues.description}</p>}
            </div>
            {coreValues.items.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 xl:mt-16 xl:grid-cols-4 xl:gap-8">
                {coreValues.items.map((item, index) => (
                  <article key={index} className="flex min-w-0 flex-col items-center rounded-xl border border-black/10 border-t-4 border-t-[#710008] bg-white p-8 text-center shadow-lg">
                    <AboutIcon code={item.icon} size={40} className="mb-6 rounded-full border border-[#d49520]/40 bg-[#710008]/10 p-5 text-[#710008]" />
                    <h3 className="mb-3 text-lg font-extrabold tracking-wide text-[#710008]">{item.title}</h3>
                    <p className="whitespace-pre-line leading-relaxed text-black/80">{item.description}</p>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
        {actions && (
          <div className={`flex flex-wrap items-center justify-center gap-6 ${coreValues ? 'mt-16' : ''}`}>
            {actions.buttons.map((button, index) => (
              <AboutLink key={index} href={button.link} className={`inline-flex w-full min-w-0 items-center justify-center gap-3 rounded-xl border-2 px-6 py-4 text-center font-bold shadow-md motion-safe:transition-colors sm:w-auto sm:max-w-full ${index === 0 ? 'border-[#710008] bg-[#710008] text-white hover:bg-black hover:border-black' : 'border-[#710008] bg-white text-[#710008] hover:bg-[#f4f3f1]'}`}>
                <AboutIcon code={button.icon} className="text-[#d49520]" /><span className="min-w-0">{button.text}</span>
              </AboutLink>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
