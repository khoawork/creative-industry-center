import { FaCheckCircle } from "react-icons/fa";

export default function HeroSection() {
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
              Chuẩn mực VIETKINGS Quốc tế
            </span>
          </div>

          <h1 className="mb-3 text-[56px] leading-[68px] font-bold tracking-[-0.02em] text-white">
            HỢP TÁC & ĐÀO TẠO
          </h1>

          <p className="max-w-xl text-[18px] leading-7 text-[#ffdad6]">
            Chương trình phát triển năng lực sáng tạo, kỹ năng xác lập kỷ
            lục và đồng hành chuyển giao tri thức doanh nghiệp.
          </p>
        </div>

        <div className="grid w-full shrink-0 grid-cols-2 gap-4 md:w-auto">
          <div className="flex flex-col rounded-lg bg-white/10 p-4 backdrop-blur-md">
            <span className="text-[32px] leading-10 font-bold text-[#ffba45]">
              120+
            </span>

            <span className="text-[12px] leading-4 font-semibold uppercase tracking-[0.05em] text-[#ffdad6]">
              Kỷ lục Gia & Chuyên gia
            </span>
          </div>

          <div className="flex flex-col rounded-lg bg-white/10 p-4 backdrop-blur-md">
            <span className="text-[32px] leading-10 font-bold text-[#ffba45]">
              100%
            </span>

            <span className="text-[12px] leading-4 font-semibold uppercase tracking-[0.05em] text-[#ffdad6]">
              Chứng nhận Pháp lý
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}