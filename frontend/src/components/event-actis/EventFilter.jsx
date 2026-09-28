import { Search, Calendar } from 'lucide-react';
import { EVENT_CATEGORIES } from '../../data/eventData';

export const EventFilter = ({
  activeCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  selectedYear,
  onSelectYear,
}) => {
  return (
    <div className="relative -mt-7 sm:-mt-8 z-20 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-[#e0bfbb]/40 p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          
          {/* Categories Pill Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none no-scrollbar">
            {EVENT_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#490003] text-white shadow-sm ring-1 ring-[#710008]'
                      : 'bg-[#f4f3f1] text-[#1a1c1b] hover:bg-[#efeeec] hover:text-[#490003]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input & Year Selector */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm tên sự kiện..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-[#f4f3f1] border border-transparent text-[#1a1c1b] placeholder-gray-400 focus:outline-hidden focus:bg-white focus:border-[#8c716e] transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Year Selector */}
            <div className="relative shrink-0">
              <select
                value={selectedYear}
                onChange={(e) => onSelectYear(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-[#f4f3f1] border border-transparent text-[#1a1c1b] font-medium focus:outline-hidden focus:bg-white focus:border-[#8c716e] cursor-pointer"
              >
                <option value="2026">Năm 2026 (Toàn bộ)</option>
                <option value="2025">Năm 2025</option>
                <option value="all">Tất cả các năm</option>
              </select>
              <Calendar className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventFilter;
