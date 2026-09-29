import React, { useRef, useState } from 'react';
import { Filter, Search, ChevronRight, Home } from 'lucide-react';
import { CATEGORIES } from '../../data/founderStoriesData';

export const StoryFilter = ({
  activeCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  storyCount,
}) => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="bg-white border-b border-[#e8e2d9] shadow-xs  top-[72px] md:top-[104px] z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0 pr-1">
              <Filter className="w-3.5 h-3.5 text-[#710008]" />
              <span className="hidden sm:inline">Lĩnh vực:</span>
            </div>

            <div 
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="flex items-center gap-2 shrink-0 overflow-x-auto select-none cursor-grab active:cursor-grabbing pb-2 custom-scrollbar"
              style={{
                scrollbarWidth: 'thin', 
                scrollbarColor: '#d49520 #f4f1ea', 
              }}
            >
              <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                  height: 6px; /* Độ dày của thanh trượt */
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #f4f1ea; /* Màu nền của thanh trượt */
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #d49520; /* Màu của thanh kéo (dùng màu vàng cam chủ đạo) */
                  border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #710008; /* Đổi sang màu đỏ đậm khi rê chuột vào */
                }
              `}</style>

              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#710008] text-white shadow-sm ring-1 ring-red-900/30'
                        : 'bg-[#f4f1ea] text-gray-700 hover:bg-[#eae4d8] hover:text-[#710008]'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative min-w-[240px] max-w-sm shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm theo tên nhà sáng lập, nghề..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg bg-[#faf8f5] border border-[#e2d9cd] text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#710008] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <a href="/" className="hover:text-[#710008] flex items-center gap-1">
              <Home className="w-3 h-3" /> Trang chủ
            </a>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-600">Khám phá</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-[#710008] font-semibold">Chuyện Nhà Sáng Nghiệp</span>
            {activeCategory !== 'all' && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <span className="bg-amber-100 text-[#710008] px-2 py-0.5 rounded font-medium text-[11px]">
                  {CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </span>
              </>
            )}
          </div>

          <div className="shrink-0 text-gray-500 text-[11px]">
            Hiển thị <span className="font-bold text-[#710008]">{storyCount}</span> câu chuyện tiêu biểu
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryFilter;