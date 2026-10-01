import React from "react";
import { Award, FileText, ArrowRight, CheckCircle2 } from "lucide-react";

const fallbackCertificates = [
  "Bảo mật hồ sơ độc quyền",
  "Thẩm định hội đồng chuyên gia",
  "Vinh danh Niên giám VIETKINGS",
];

export const StoryCTA = ({ cta, onOpenSubmitModal, onOpenEvaluationModal }) => {
  const certificates = cta?.certificate?.length
    ? cta.certificate.map((certificate) => certificate.name)
    : fallbackCertificates;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#490003] text-white p-7 sm:p-9 md:p-12 shadow-xl border-t-4 border-[#d49520] my-12">
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#d49520]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-1.5 text-[#d49520] text-xs font-bold tracking-widest uppercase">
            <Award className="w-4 h-4 text-[#d49520]" />
            <span>TIẾP NHẬN ĐỀ CỬ & LƯU TRỮ KỶ LỤC</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase drop-shadow-sm leading-tight">
            {cta?.title || 'BẠN CÓ CÂU CHUYỆN SÁNG NGHIỆP TRUYỀN CẢM HỨNG?'}
          </h2>

          <div className="bg-[#d49520] h-[4px] w-[80px] rounded-lg"></div>

          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed text-justify sm:text-left">
            {cta?.description || 'Hãy gửi hồ sơ hoặc giới thiệu các Kỷ lục gia, Nhà sáng lập tài ba tới Ban Biên tập Trung tâm Công nghiệp Sáng tạo — Viện Kỷ lục Việt Nam (VIETKINGS) để được thẩm tra, lưu giữ và vinh danh trên hệ sinh thái truyền thông quốc gia.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-amber-200/90 font-medium">
            {certificates.map((certificate, index) => (
              <div key={`${certificate}-${index}`} className="flex items-center gap-1.5 text-amber-300">
              <CheckCircle2 className="w-4 h-4 text-[#d49520]" />
                <span>{certificate}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 shrink-0 min-w-[260px]">
          <button
            type="button"
            onClick={onOpenSubmitModal}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#d49520] hover:bg-[#c28518] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>{cta?.btn_cta || 'Gửi câu chuyện ngay'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenEvaluationModal}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#360002] hover:bg-[#250001] border border-[#d49520]/40 text-amber-100 hover:text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#d49520]" />
            <span>{cta?.sub_btn_cta || 'Quy chế xét duyệt Kỷ lục'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default StoryCTA;
