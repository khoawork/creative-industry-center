import { AboutLink } from './about-shared.jsx';

export default function AboutHero({ section }) {
  return (
    <section className="w-full border-b-4 border-[#d49520] bg-[#710008] px-6   text-white shadow-xl lg:px-12 ">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center pt-12">
       
        <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">{section.title_main}</h1>
         <div aria-hidden="true" className=" flex w-full max-w-md items-center gap-4 pt-4 text-[#d49520]">
          <div className="h-px flex-1 bg-[#d49520]" /><span>★</span><div className="h-px flex-1 bg-[#d49520]" />
        </div>
        {section.quote && (
          <blockquote className="mt-6 mb-20  w-full max-w-3xl rounded-lg border border-[#d49520]/30 bg-black/40 p-6 shadow-lg sm:p-8">
            <p className="text-base font-medium  leading-relaxed text-[#d49520] md:text-lg">{section.quote}</p>
            {section.quote_author && <footer className="mt-4 text-xs font-semibold tracking-widest text-[#d49520]">{section.quote_author}</footer>}
          </blockquote>
        )}
      </div>
    </section>
  );
}
