import React from 'react';
import { HonoreeCard } from './HonoreeCard';
import { Award, ChevronRight } from 'lucide-react';

export const HonoreesList = ({
  honorees,
  onSelectHonoree,
  onOpenDossierModal,
  honoreesRef,
}) => {
  return (
    <section ref={honoreesRef} className="pt-4 pb-14">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] sm:text-xs font-bold text-[#680007] tracking-wider uppercase block mb-1.5">
            BẢNG VÀNG TÔN VINH GẦN NHẤT
          </span>
          <h2 className="text-xl sm:text-2xl md:text-[26px] font-extrabold text-gray-900 tracking-tight">
            Gương Mặt &amp; Tập Thể Xuất Sắc Vừa Được Ghi Danh
          </h2>
        </div>

        {/* Action Button: Hồ sơ vinh danh Mùa Xuân - Năm 2025 */}
        <button
          type="button"
          onClick={onOpenDossierModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#680007] hover:bg-[#850009] text-white text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Hồ sơ vinh danh Mùa Xuân - Năm 2025</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of 3 Honorees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {honorees.map((item) => (
          <HonoreeCard
            key={item.id}
            honoree={item}
            onSelectHonoree={onSelectHonoree}
          />
        ))}
      </div>
    </section>
  );
};

export default HonoreesList;

