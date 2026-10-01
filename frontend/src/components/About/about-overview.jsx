import { AboutHeading, AboutIcon, AboutImage } from './about-shared.jsx';

export default function AboutOverview({ section }) {
  return (
    <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <div className="min-w-0 space-y-6 lg:col-span-7">
        <AboutHeading tag={section.tag} title={section.title_main} />
        {section.paragraphs.map((paragraph, index) => <p key={index} className="whitespace-pre-line text-lg leading-relaxed text-black/80 sm:text-xl">{paragraph}</p>)}
        {section.statistics.length > 0 && (
          <dl className="flex flex-wrap gap-6 pt-2">
            {section.statistics.map((item, index) => (
              <div key={index} className="flex min-w-0 max-w-full items-center gap-3.5 rounded-lg border border-[#d49520]/40 bg-white p-3.5 shadow-sm">
                <AboutIcon code={item.icon} size={32} className="text-[#d49520]" />
                <div className="flex min-w-0 flex-col">
                  <dt className="order-2 text-xs font-medium text-black/70">{item.label}</dt>
                  <dd className="text-lg font-bold text-[#710008]">{item.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        )}
      </div>
      <div className="min-w-0 lg:col-span-5"><AboutImage image={section.featured_image} /></div>
    </section>
  );
}
