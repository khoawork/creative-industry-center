import React from 'react';

export const AwardHero = ({ header = {} }) => {
  const title = header.tittle || header.title || 'GIẢI THƯỞNG';
  const subTitle = header.sub_title || 'Hệ thống tôn vinh thường niên';
  const description = header.description || 'Hệ thống giải thưởng và tôn vinh thường niên do Trung tâm Công nghiệp Sáng tạo & Viện Kỷ lục Việt Nam (VIETKINGS) chủ trì, nhằm ghi nhận những cống hiến xuất sắc trong bảo tồn di sản, đổi mới sáng tạo và xác lập giá trị kỷ lục Việt Nam.';

  return (
    <section className="relative w-full overflow-hidden border-b border-[#710008]/15 bg-gradient-to-r from-[#580006]/5 via-[#710008]/10 to-transparent py-12 md:py-16">
      {/* Decorative Star Watermark Background (Emblem-style) */}
      <div 
        className="pointer-events-none absolute -right-20 -top-24 h-[420px] w-[420px] select-none opacity-[0.04] md:right-10 md:-top-16 md:h-[600px] md:w-[600px]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 500 500" className="w-full h-full fill-current text-[#680007]">
          {/* 5-pointed faceted star */}
          <polygon points="250,20 290,175 440,175 320,270 365,420 250,330 135,420 180,270 60,175 210,175" />
          <polygon points="250,20 250,330 290,175" fill="rgba(0,0,0,0.15)" />
          <polygon points="440,175 250,330 320,270" fill="rgba(0,0,0,0.15)" />
          <polygon points="365,420 250,330 250,330" fill="rgba(0,0,0,0.15)" />
          <polygon points="135,420 250,330 180,270" fill="rgba(0,0,0,0.15)" />
          <polygon points="60,175 250,330 210,175" fill="rgba(0,0,0,0.15)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header Badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#710008]/20 bg-[#710008]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#710008]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#710008]"></span>
          <span>{subTitle}</span>
        </div>

        {/* Main Title */}
        <h1 className="mb-4 text-4xl font-extrabold uppercase leading-tight tracking-tight text-[#710008] sm:text-5xl md:text-[2.75rem]">
          {title}
        </h1>

        {/* Description Subtitle */}
        <p className="max-w-3xl text-base leading-relaxed text-[#58413f]">
          {description}
        </p>
      </div>
    </section>
  );
};

export default AwardHero;

