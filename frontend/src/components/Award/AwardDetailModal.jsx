import React, { useEffect } from 'react';
import { X, CheckCircle2, FileText, Download, Send, ShieldCheck } from 'lucide-react';

export const AwardDetailModal = ({ award, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !award) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#680007] to-[#8d000a] text-white p-5 sm:p-6 pr-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {award.categoryBadge}
            </span>
            <span className="bg-amber-400 text-gray-900 text-[11px] font-extrabold px-2 py-0.5 rounded uppercase">
              {award.code}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold leading-snug">
            {award.title}
          </h3>

          <p className="text-xs sm:text-sm text-amber-200 font-semibold tracking-wide uppercase mt-1">
            {award.subtitle}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-gray-700 text-sm">
          {/* Main Photo Banner & Scope */}
          <div className="relative rounded-xl overflow-hidden h-[180px] sm:h-[220px]">
            <img
              src={award.image}
              alt={award.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Phạm vi: {award.scope} • Năm xét: {award.year}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-[#680007] uppercase tracking-wider mb-2">
              Mục đích &amp; Ý nghĩa giải thưởng
            </h4>
            <p className="text-gray-700 leading-relaxed bg-[#faf8f5] p-3.5 rounded-xl border border-gray-100">
              {award.description}
            </p>
          </div>

          {/* Criteria List */}
          <div>
            <h4 className="text-xs font-bold text-[#680007] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#680007]" />
              <span>Tiêu chuẩn xét tặng &amp; đánh giá</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {award.criteria?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 border border-gray-200/80"
                >
                  <span className="w-5 h-5 rounded-full bg-[#680007] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-gray-700 leading-relaxed font-medium">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Dossier Documents */}
          <div>
            <h4 className="text-xs font-bold text-[#680007] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#680007]" />
              <span>Hồ sơ đề cử bao gồm</span>
            </h4>
            <ul className="space-y-2">
              {award.dossier?.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs text-gray-700 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#680007] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100 transition cursor-pointer"
          >
            Đóng lại
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`Đang tải mẫu hồ sơ: ${award.title}. Mẫu đăng ký đã được chuẩn bị.`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#680007] text-[#680007] hover:bg-rose-50 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải mẫu đề cử</span>
            </button>

            <button
              type="button"
              onClick={() => {
                alert(`Mở cổng nộp hồ sơ trực tuyến cho "${award.title}". Vui lòng chuẩn bị file đính kèm PDF theo quy chế.`);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#680007] hover:bg-[#850009] text-white rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi hồ sơ đề cử</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwardDetailModal;

