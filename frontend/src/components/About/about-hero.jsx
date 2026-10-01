import { AboutLink } from './about-shared.jsx';

export default function AboutHero({ section }) {
  return (
    <section className="w-full border-b-4 border-[#d49520] bg-[#710008] px-6 py-16 text-white shadow-xl lg:px-12 lg:py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {section.breadcrumbs.length > 0 && (
          <nav aria-label="Đường dẫn trang" className="mb-6 text-sm font-semibold text-[#d49520]">
            <ol className="flex flex-wrap items-center justify-center gap-2">
              {section.breadcrumbs.map((item, index) => (
                <li key={index} className="flex min-w-0 items-center gap-2">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {item.link === null
                    ? <span aria-current="page" className="text-white">{item.text}</span>
                    : <AboutLink href={item.link} className="hover:underline">{item.text}</AboutLink>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div aria-hidden="true" className="mb-6 flex w-full max-w-md items-center gap-4 text-[#d49520]">
          <div className="h-px flex-1 bg-[#d49520]" /><span>★</span><div className="h-px flex-1 bg-[#d49520]" />
        </div>
        <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">{section.title_main}</h1>
        {section.quote && (
          <blockquote className="mt-6 w-full max-w-3xl rounded-xl border border-[#d49520]/40 bg-black/20 p-6 shadow-lg sm:p-8">
            <p className="text-base font-medium italic leading-relaxed text-[#d49520] md:text-lg">{section.quote}</p>
            {section.quote_author && <footer className="mt-4 text-xs font-semibold tracking-widest text-[#d49520]">{section.quote_author}</footer>}
          </blockquote>
        )}
      </div>
    </section>
  );
}
