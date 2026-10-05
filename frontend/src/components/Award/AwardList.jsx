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
    <section className="mb-14 w-full">
      {/* Section Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 border-l-4 border-[#710008] py-1 pl-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#710008] sm:text-lg">
            DANH MỤC 06 GIẢI THƯỞNG THƯỜNG NIÊN VIETKINGS
          </h2>
        </div>

        {/* Right Action: Quy chế xét tặng & đề cử [PDF] */}
        <button
          type="button"
          onClick={onOpenRegulationModal}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#710008] px-3.5 py-2 text-xs font-bold text-[#710008] transition hover:bg-[#710008] hover:text-white"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Quy chế xét tặng &amp; đề cử [PDF]</span>
        </button>
      </div>

      {/* Awards Cards List */}
      {awards.length > 0 ? (
        <div className="space-y-6">
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
      <div className="mt-6 flex flex-col justify-between gap-3 rounded-xl border border-[#710008]/20 bg-gradient-to-r from-[#710008]/10 via-[#710008]/5 to-transparent px-4 py-3 text-xs text-[#58413f] sm:flex-row sm:items-center sm:text-sm">
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

