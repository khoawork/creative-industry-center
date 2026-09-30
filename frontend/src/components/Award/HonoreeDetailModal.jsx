import React, { useEffect } from 'react';
import { X, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

export const HonoreeDetailModal = ({ honoree, isOpen, onClose }) => {
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

  if (!isOpen || !honoree) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#680007] to-[#8d000a] text-white p-5 sm:p-6 pr-12 relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-gray-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded uppercase">
              {honoree.badge}
            </span>
            <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded">
              {honoree.code}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold leading-snug">
            {honoree.title}
          </h3>
          <p className="text-xs sm:text-sm text-amber-200 mt-0.5">
            {honoree.subtitle}
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

        <div className="p-5 sm:p-6 space-y-4 text-gray-700 text-sm">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <img
              src={honoree.avatar}
              alt={honoree.title}
              className="w-16 h-16 rounded-xl object-cover border border-gray-300 shrink-0"
            />
            <div>
              <h4 className="font-bold text-gray-900 text-base">{honoree.title}</h4>
              <p className="text-xs text-gray-500">{honoree.subtitle}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#680007]" />
                  {honoree.date}
                </span>
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Xác thực chính thức
                </span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-[#680007] uppercase tracking-wider mb-2">
              Nội dung cống hiến &amp; thành tích ghi nhận
            </h5>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-[#faf8f5] p-4 rounded-xl border border-gray-100">
              {honoree.description}
            </p>
          </div>

          <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100 flex items-start gap-2.5 text-xs text-[#680007]">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Hồ sơ đã được lưu trữ vĩnh viễn trong Niên giám Tôn vinh Kỷ lục Quốc gia của Viện Kỷ lục Việt Nam (VIETKINGS).
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#680007] text-white rounded-lg text-xs font-semibold hover:bg-[#850009] transition cursor-pointer"
          >
            Đóng thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default HonoreeDetailModal;
