import { AboutHeading, AboutIcon, AboutImage } from './about-shared.jsx';
import { aboutImages } from '../../data/About/aboutImages.js';

export default function AboutVision({ section }) {
  return (
    <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
      <div className="order-2 min-w-0 lg:order-1 lg:col-span-5"><AboutImage image={section.featured_image} localImage={aboutImages.vision} /></div>
      <div className="order-1 min-w-0 space-y-6 lg:order-2 lg:col-span-7">
        <AboutHeading tag={section.tag} title={section.title_main} />
        {section.paragraphs.map((paragraph, index) => <p key={index} className="whitespace-pre-line text-lg leading-relaxed text-black/80 sm:text-xl">{paragraph}</p>)}
        {section.items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            {section.items.map((item, index) => (
              <article key={index} className="min-w-0 rounded-lg border border-black/10 border-l-4 border-l-[#d49520] bg-white p-6 shadow-md">
                <h3 className="mb-2 flex items-start gap-2.5 font-bold text-[#710008]"><AboutIcon code={item.icon} className="text-[#d49520]" /><span className="min-w-0">{item.title}</span></h3>
                <p className="whitespace-pre-line leading-relaxed text-black/80">{item.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
