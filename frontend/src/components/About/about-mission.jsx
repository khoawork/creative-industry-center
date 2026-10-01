import { AboutHeading, AboutIcon, AboutImage } from './about-shared.jsx';

export default function AboutMission({ section }) {
  return (
    <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <div className="min-w-0 space-y-6 lg:col-span-7">
        <AboutHeading tag={section.tag} title={section.title_main} />
        {section.items.length > 0 && (
          <div className="space-y-4 pt-2">
            {section.items.map((item, index) => (
              <article key={index} className="flex flex-col items-start gap-3 rounded-lg border border-black/10 bg-white p-4 shadow-sm sm:flex-row sm:gap-4 sm:p-5">
                <AboutIcon code={item.icon} className="rounded-full border border-[#d49520]/40 bg-[#710008] p-3 text-[#d49520]" />
                <div className="min-w-0">
                  <h3 className="mb-1 text-lg font-bold text-[#710008]">{item.title}</h3>
                  <p className="whitespace-pre-line text-base leading-relaxed text-black/80 sm:text-lg">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      <div className="min-w-0 lg:col-span-5"><AboutImage image={section.featured_image} /></div>
    </section>
  );
}
