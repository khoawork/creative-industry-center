import React from 'react';
import { Search, ChevronDown, RotateCcw, X } from 'lucide-react';
import { AWARD_CATEGORIES, AWARD_YEARS } from '../../data/awardsData';

export const AwardFilter = ({
  searchTerm,
  onSearchChange,
  selectedYear,
  onSelectYear,
  selectedCategory,
  onSelectCategory,
  onResetFilter,
}) => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-[#e5e5e5] shadow-xs p-3 md:p-4 mb-8">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 md:gap-4">
        
        {/* Left: Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên hoặc mã giải thưởng..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-[#faf9f7] hover:bg-white focus:bg-white border border-[#e5e5e5] focus:border-[#680007] rounded-lg outline-none transition-all placeholder:text-gray-400 text-gray-800"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
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
          <div className="flex items-center bg-[#f3f4f6] p-1 rounded-lg border border-gray-200/80">
            {AWARD_YEARS.map((year) => {
              const isActive = selectedYear === year;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => onSelectYear(year)}
                  className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#680007] text-white shadow-2xs font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>

          {/* Category Dropdown */}
          <div className="relative min-w-[190px] sm:min-w-[210px]">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#e5e5e5] hover:border-gray-400 focus:border-[#680007] rounded-lg outline-none text-gray-700 cursor-pointer transition-colors font-medium truncate"
            >
              {AWARD_CATEGORIES.map((cat) => (
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

