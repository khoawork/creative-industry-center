import React from "react";
import { HonoreeCard } from "./HonoreeCard";
import { Award, ChevronRight } from "lucide-react";

export const HonoreesList = ({
  honorees,
  onSelectHonoree,
  onOpenDossierModal,
  honoreesRef,
}) => {
  return (
    <section ref={honoreesRef} className="relative w-full bg-gradient-to-b from-transparent via-[#710008]/5 to-transparent py-16">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#710008]/20 pb-4 md:flex-row md:items-end">
        <div>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-[#710008]">
            BẢNG VÀNG TÔN VINH GẦN NHẤT
          </span>

          <h2 className="text-xl font-extrabold tracking-tight text-[#710008] md:text-2xl">
            Gương Mặt &amp; Tập Thể Xuất Sắc Vừa Được Ghi Danh
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenDossierModal}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-[#710008] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#580006] sm:self-auto"
        >
          <Award className="h-3.5 w-3.5" />
          <span>Hồ sơ vinh danh Mùa Xuân - Năm 2025</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
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
