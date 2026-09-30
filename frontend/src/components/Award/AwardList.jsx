import React from 'react';
import { AwardCard } from './AwardCard';
import { FileDown, MapPin, ArrowRight, AlertCircle, RotateCcw } from 'lucide-react';

export const AwardList = ({
  awards,
  onSelectAward,
  onOpenRegulationModal,
  onScrollToHonorees,
  onResetFilter,
}) => {
  return (
    <section className="mb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2 border-b border-gray-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 bg-[#680007] rounded-full shrink-0"></div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 uppercase tracking-wide">
            DANH MỤC 06 GIẢI THƯỞNG THƯỜNG NIÊN VIETKINGS
          </h2>
        </div>

        {/* Right Action: Quy chế xét tặng & đề cử [PDF] */}
        <button
          type="button"
          onClick={onOpenRegulationModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#680007] text-[#680007] hover:bg-[#680007] hover:text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Quy chế xét tặng &amp; đề cử [PDF]</span>
        </button>
      </div>

      {/* Awards Cards List */}
      {awards.length > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          {awards.map((award) => (
            <AwardCard
              key={award.id}
              award={award}
              onSelectAward={onSelectAward}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center my-6">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 mb-1">
            Không tìm thấy giải thưởng phù hợp
          </h3>
          <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
            Không có kết quả nào phù hợp với bộ lọc hiện tại. Hãy thử tìm kiếm với từ khóa khác hoặc thiết lập lại bộ lọc.
          </p>
          <button
            type="button"
            onClick={onResetFilter}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#680007] text-white rounded-lg text-xs font-semibold hover:bg-[#850009] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thiết lập lại bộ lọc</span>
          </button>
        </div>
      )}

      {/* Bottom Information Notice Bar */}
      <div className="mt-5 bg-[#fff8f8] border border-[#fbd0d0] rounded-xl px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start sm:items-center gap-2 text-gray-700">
          <MapPin className="w-4 h-4 text-[#680007] shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-[13px] leading-relaxed">
            <span className="font-semibold text-[#680007]">*</span> Tất cả giải thưởng đều có ban giám khảo uy tín, tham khảo hệ thống cơ sở dữ liệu xác lập kỷ lục thường niên của TW VIETKINGS.
          </p>
        </div>

        <button
          type="button"
          onClick={onScrollToHonorees}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#680007] hover:text-[#8e000a] shrink-0 hover:underline cursor-pointer"
        >
          <span>Tra cứu danh hiệu trúng thưởng</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};

export default AwardList;

