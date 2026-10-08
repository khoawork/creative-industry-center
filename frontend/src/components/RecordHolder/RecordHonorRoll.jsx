import React, { useState } from "react";
import RecordHolderIcon from "./RecordHolderIcon.jsx";

const DEFAULT_CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "doanh-nhan", label: "Doanh nghiệp" },
  { id: "nghe-nhan", label: "Nghệ nhân" },
];

function SingleHonorRollSection({ roll, rollFilter, onFilterChange }) {
  if (!roll || roll.is_visible === false) return null;

  const categories = Array.isArray(roll.categories) && roll.categories.length > 0
    ? roll.categories
    : DEFAULT_CATEGORIES;

  // Lọc danh sách card theo trạng thái hiển thị (is_visible !== false) và category
  const filteredCards = (roll.cards || []).filter((card) => {
    if (card.is_visible === false) return false;
    if (!rollFilter || rollFilter === "all") return true;
    return card.category === rollFilter;
  });

  // Helper xác định icon cho từng card
  const getCardIcon = (card) => {
    if (card.icon) return card.icon;
    const title = card.award_title || "";
    if (title.includes("Hải Đăng") || title.includes("Sáng Nghiệp")) return "flare";
    if (title.includes("Đổi Mới") || title.includes("Di Sản")) return "account_balance";
    if (title.includes("Tinh Hoa") || title.includes("Nghề")) return "handyman";
    return "trophy";
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-record-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-12">
        {/* Section Title with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold">
              <RecordHolderIcon name="verified" size={18} />
              {roll.title || "BẢNG VÀNG DANH DỰ"}
            </div>
            <h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold">
              {roll.subtitle || "Cá Nhân & Tập Thể Được Tôn Vinh Gần Đây"}
            </h2>
            <p className="font-body-md text-body-md text-record-on-surface-variant">
              {roll.description || "Ghi nhận những tấm gương cống hiến vượt bậc đã được trao chứng nhận và cúp vàng tại các kỳ hội ngộ Kỷ lục gia toàn quốc."}
            </p>
          </div>

          {/* Filter Chips for Honorees */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => {
              const isActive = (rollFilter || "all") === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`honoree-filter-btn px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-record-primary text-record-on-primary shadow-sm"
                      : "bg-record-surface-container-high text-record-on-surface-variant hover:bg-record-secondary-fixed"
                  }`}
                  onClick={() => onFilterChange(cat.id)}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Card Dignified Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCards.map((card, idx) => {
            const cardIcon = getCardIcon(card);
            const awardName = card.award_title || card.award_nomination || roll.award_nomination_name?.value || "Bàn Tay Vàng Kỷ Lục 2024";
            const awardLabel = card.award_label || roll.award_nomination_name?.label || "Đề Cử Được Vinh Danh:";

            return (
              <div
                key={card.id || idx}
                data-category={card.category}
                className="honoree-card group bg-record-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Khung hiển thị hình ảnh */}
                {card.image ? (
                  <div className="relative h-64 w-full overflow-hidden bg-record-surface-container">
                    <img
                      src={card.image}
                      alt={card.title || "Chân dung"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-record-primary-container text-record-on-primary font-label-sm text-label-sm font-bold shadow-md z-10">
                      {card.year || "Năm 2024"}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    {/* Badge danh hiệu ở góc dưới ảnh */}
                    {card.badge && (
                      <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                        <span className="font-label-sm text-label-sm text-record-secondary-fixed uppercase font-bold tracking-wider">
                          {card.badge}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-5 pb-0 flex justify-between items-center">
                    <span className="px-2.5 py-1 rounded-md bg-record-primary-container text-record-on-primary font-label-sm text-label-sm font-bold shadow-sm">
                      {card.year || "Năm 2024"}
                    </span>
                    {card.badge && (
                      <span className="font-label-sm text-label-sm text-record-secondary uppercase font-bold tracking-wider">
                        {card.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Nội dung thẻ */}
                <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-record-on-surface font-bold">
                      {card.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-record-on-surface-variant mt-1">
                      {card.description}
                    </p>
                  </div>

                  {/* Khối giải thưởng: cấu hình riêng cho từng card */}
                  <div className="pt-3 bg-record-surface-container-low p-3 rounded-lg flex flex-col gap-1">
                    <span className="font-label-sm text-label-sm text-record-primary font-bold">
                      {awardLabel}
                    </span>
                    <span className="font-body-sm text-body-sm text-record-on-surface font-medium flex items-center gap-1.5">
                      <RecordHolderIcon
                        name={cardIcon}
                        size={18}
                        className="text-record-secondary shrink-0"
                      />
                      <span>{awardName}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function RecordHonorRoll({ honorRoll, filter = "all", setFilter }) {
  if (!honorRoll) return null;

  // Hỗ trợ cả 1 object hoặc mảng các bảng vàng
  const rolls = Array.isArray(honorRoll) ? honorRoll : [honorRoll];
  if (rolls.length === 0) return null;

  // Quản lý filter riêng cho từng bảng vàng nếu có nhiều bảng vàng
  const [internalFilters, setInternalFilters] = useState({});

  return (
    <div className="w-full flex flex-col">
      {rolls.map((roll, idx) => {
        const currentFilter = internalFilters[idx] || filter || "all";
        const handleFilterChange = (newCat) => {
          setInternalFilters((prev) => ({ ...prev, [idx]: newCat }));
          if (idx === 0 && setFilter) setFilter(newCat);
        };

        return (
          <SingleHonorRollSection
            key={roll.id || idx}
            roll={roll}
            rollFilter={currentFilter}
            onFilterChange={handleFilterChange}
          />
        );
      })}
    </div>
  );
}