import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function HeroSection({ headerData }) {
  const badge = headerData?.badge || "Chuẩn mực VIETKINGS Quốc tế";
  const title = headerData?.title || "HỢP TÁC & ĐÀO TẠO";
  const description =
    headerData?.description ||
    "Chương trình phát triển năng lực sáng tạo, kỹ năng xác lập kỷ lục và đồng hành chuyển giao tri thức doanh nghiệp.";
  const statistics = Array.isArray(headerData?.statistics) && headerData.statistics.length > 0
    ? headerData.statistics
    : [
        { value: "120+", label: "Kỷ lục Gia & Chuyên gia" },
        { value: "100%", label: "Chứng nhận Pháp lý" },
      ];

  return (
    <section className="relative w-full overflow-hidden bg-[#710008] text-white">
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#490003] via-[#710008] to-[#6b0f11] opacity-95" />

      {/* Decorative circle */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#ffba45]/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-[75rem] flex-col items-start justify-between gap-8 px-6 py-[72px] md:flex-row md:items-center">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 backdrop-blur-md">
            <FaCheckCircle className="text-[18px] text-[#ffba45]" />

            <span className="text-[12px] leading-4 font-semibold uppercase tracking-[0.05em] text-[#ffba45]">
              {badge}
            </span>
          </div>

          <h1 className="mb-3 text-[40px] md:text-[56px] leading-[48px] md:leading-[68px] font-bold tracking-[-0.02em] text-white uppercase">
            {title}
          </h1>

          <p className="max-w-xl text-[16px] md:text-[18px] leading-7 text-[#ffdad6]">
            {description}
          </p>
        </div>

        <div className="grid w-full shrink-0 grid-cols-2 gap-4 md:w-auto">
          {statistics.map((stat, idx) => (
            <div key={idx} className="flex flex-col rounded-lg bg-white/10 p-4 backdrop-blur-md">
              <span className="text-[28px] md:text-[32px] leading-10 font-bold text-[#ffba45]">
                {stat.value}
              </span>

              <span className="text-[11px] md:text-[12px] leading-4 font-semibold uppercase tracking-[0.05em] text-[#ffdad6]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}