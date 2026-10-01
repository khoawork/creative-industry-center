import React from 'react';

export const AwardHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#faf6f0] via-[#fdfbf7] to-[#faf9f7] pt-10 pb-8 md:pt-14 md:pb-12 border-b border-[#f1eae0]">
      {/* Decorative Star Watermark Background (Emblem-style) */}
      <div 
        className="pointer-events-none absolute -right-12 -top-16 md:right-10 md:-top-10 w-[380px] h-[380px] md:w-[520px] md:h-[520px] opacity-[0.07] select-none"
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

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffdad6]/60 border border-[#f5b8b0] text-[#680007] text-xs font-semibold tracking-wider uppercase mb-4 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#680007]"></span>
          <span>Hệ thống tôn vinh thường niên • Viện Kỷ lục Việt Nam</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black text-[#680007] tracking-tight uppercase leading-tight mb-4">
          GIẢI THƯỞNG
        </h1>

        {/* Description Subtitle */}
        <p className="max-w-4xl text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
          Hệ thống giải thưởng và tôn vinh thường niên do Trung tâm Công nghiệp Sáng tạo &amp; Viện Kỷ lục Việt Nam (VIETKINGS) chủ trì, nhằm ghi nhận những cống hiến xuất sắc trong bảo tồn di sản, đổi mới sáng tạo và xác lập giá trị kỷ lục Việt Nam.
        </p>
      </div>
    </section>
  );
};

export default AwardHero;

