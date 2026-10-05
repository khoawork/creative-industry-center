import React from "react";
import { Search, ChevronDown, RotateCcw, X } from "lucide-react";

export const AwardFilter = ({
  searchTerm,
  onSearchChange,
  selectedYear,
  onSelectYear,
  selectedCategory,
  onSelectCategory,
  onResetFilter,
  years = [],
  categories = [],
}) => {
  const yearOptions = ["Tất cả", ...years];
  const categoryOptions = [
    { id: "all", label: "Tất cả lĩnh vực xét chọn" },
    ...categories,
  ];

  return (
    <div className="mb-8 border border-[#710008]/15 bg-white p-3 shadow-sm md:rounded-xl md:p-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 md:gap-4">
        {/* Left: Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên hoặc mã giải thưởng..."
            className="w-full rounded-lg border border-[#710008]/20 bg-[#faf9f7] py-2 pl-11 pr-9 text-sm text-[#1a1c1b] outline-none transition-colors placeholder:text-[#58413f] focus:border-[#710008] focus:bg-white"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Year Filters & Category Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Year Pills */}
          <div className="flex items-center">
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-[#faf9f7] text-xs sm:text-sm font-medium text-[#58413f] outline-none cursor-pointer focus:border-[#710008] focus:ring-1 focus:ring-[#710008]"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="relative min-w-[190px] sm:min-w-[210px]">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-[#faf9f7] py-2 pl-3 pr-8 text-xs font-medium text-[#1a1c1b] outline-none transition-colors hover:border-[#710008] focus:border-[#710008] sm:text-sm"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Reset / Refresh Filter Button */}
          <button
            type="button"
            onClick={onResetFilter}
            className="p-2 rounded-lg border border-[#e5e5e5] text-gray-500 hover:text-[#680007] hover:border-[#680007] hover:bg-rose-50/50 transition-colors cursor-pointer shrink-0"
            title="Đặt lại bộ lọc"
            aria-label="Đặt lại bộ lọc"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AwardFilter;
