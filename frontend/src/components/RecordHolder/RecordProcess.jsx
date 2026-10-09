import React from "react";
import RecordHolderIcon from "./RecordHolderIcon.jsx";

const STEP_COLOR_MAP = {
  primary: "bg-record-primary text-record-on-primary",
  secondary: "bg-record-secondary-container text-record-on-secondary-container",
  amber: "bg-amber-500 text-white shadow-amber-500/20",
  sky: "bg-sky-500 text-white shadow-sky-500/20",
  indigo: "bg-indigo-600 text-white shadow-indigo-600/20",
  emerald: "bg-emerald-600 text-white shadow-emerald-600/20",
  rose: "bg-rose-600 text-white shadow-rose-600/20",
  purple: "bg-purple-600 text-white shadow-purple-600/20",
  blue: "bg-blue-600 text-white shadow-blue-600/20",
  green: "bg-emerald-600 text-white shadow-emerald-600/20",
  red: "bg-red-700 text-white shadow-red-700/20",
  gold: "bg-amber-400 text-amber-950 shadow-amber-400/20",
};

export default function RecordProcess({ process }) {
  if (!process) return null;

  return (
    <section className="w-full py-16 lg:py-24 bg-record-surface-container-high text-record-on-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-14">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-record-primary"></span>
            {process.subtitle || "QUY TRÌNH CHUẨN HÓA"}
          </div>
          <h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold py-4">
            {process.title}
          <h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold">
            {process.title || "QUY TRÌNH 4 BƯỚC THẨM ĐỊNH & XÁC LẬP ĐỀ CỬ KỶ LỤC"}
          </h2>
          <p className="font-body-md text-body-md text-record-on-surface-variant">
            {process.description || "Đảm bảo tính pháp lý, độc lập tuyệt đối và đánh giá giá trị sáng tạo theo quy chế Viện Kỷ lục Việt Nam."}
          </p>
        </div>

        {/* Lưới 4 bước quy trình */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.cards?.map((card, idx) => {
            const stepNum = String(idx + 1).padStart(2, "0");
            const isLastStep = idx === (process.cards.length - 1);

            // Xác định màu nền số bước dựa trên card.color
            const colorKey = card.color ? String(card.color).toLowerCase() : "";
            const isCustomHex = colorKey.startsWith("#") || colorKey.startsWith("rgb");
            const mappedColorClass = STEP_COLOR_MAP[colorKey];

            const fallbackClass = isLastStep
              ? "bg-record-secondary-container text-record-on-secondary-container"
              : "bg-record-primary text-record-on-primary";

            const stepColorClass = mappedColorClass || (isCustomHex ? "text-white" : fallbackClass);
            const customStyle = isCustomHex ? { backgroundColor: card.color, color: "#ffffff" } : undefined;

            return (
              <div
                key={card.id || idx}
                className="p-6 rounded-xl bg-record-surface-container-lowest shadow-sm flex flex-col justify-between gap-6 relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    {/* Ô Nền Số Bước — Nhận giá trị màu từ cấu hình admin */}
                    <span
                      style={customStyle}
                      className={`w-10 h-10 rounded-lg font-headline-sm text-headline-sm font-bold flex items-center justify-center shadow-sm transition-colors ${stepColorClass}`}
                    >
                      {stepNum}
                    </span>
                    <RecordHolderIcon
                      name={card.icon || (idx === 0 ? "description" : idx === 1 ? "psychology" : idx === 2 ? "travel_explore" : "military_tech")}
                      size={28}
                      filled={isLastStep}
                      className={isLastStep ? "text-record-primary" : "text-record-secondary"}
                    />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-record-primary font-bold">
                    {card.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-record-on-surface-variant leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Thông tin thời gian / biên bản / địa điểm ở chân mỗi card */}
                {card.info && card.info.length > 0 && (
                  <div className="pt-4 bg-record-surface-container-low p-3 rounded-lg text-label-sm text-record-on-surface-variant">
                    {card.info.map((inf, i) => (
                      <div key={i} className="leading-snug">
                        <strong className="text-record-primary">{inf.label}:</strong> {inf.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}