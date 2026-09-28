import { useState } from 'react';
import { EventCard } from './EventCard';
import { SearchX, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export const EventList = ({
  events,
  totalEvents = 54,
  onResetFilter,
  onRegisterEvent,
  onDetailEvent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e0bfbb]/40 p-12 text-center my-10 shadow-xs max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full bg-[#ffdad6] text-[#490003] flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#1a1c1b]">
          Không tìm thấy sự kiện phù hợp
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
          Hiện chưa có sự kiện nào khớp với từ khóa hoặc danh mục đã lọc. Quý vị vui lòng thử lại với từ khóa khác.
        </p>
        <button
          onClick={onResetFilter}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#490003] text-white text-xs font-semibold hover:bg-[#710008] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xem tất cả sự kiện</span>
        </button>
      </div>
    );
  }

  return (
    <div className="my-10 space-y-10">
      
      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={onRegisterEvent}
            onDetail={onDetailEvent}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-lg border border-[#e0bfbb]/60 flex items-center justify-center text-gray-600 hover:bg-[#f4f3f1] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-lg font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-[#490003] text-white shadow-xs'
                  : 'border border-[#e0bfbb]/60 text-gray-700 hover:bg-[#f4f3f1]'
              }`}
            >
              {page}
            </button>
          ))}

          <span className="px-1 text-gray-400 font-bold text-xs">...</span>

          <button
            onClick={() => setCurrentPage(9)}
            className={`w-9 h-9 rounded-lg font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
              currentPage === 9
                ? 'bg-[#490003] text-white shadow-xs'
                : 'border border-[#e0bfbb]/60 text-gray-700 hover:bg-[#f4f3f1]'
            }`}
          >
            9
          </button>

          <button
            onClick={() => setCurrentPage(Math.min(9, currentPage + 1))}
            disabled={currentPage === 9}
            className="w-9 h-9 rounded-lg border border-[#e0bfbb]/60 flex items-center justify-center text-gray-600 hover:bg-[#f4f3f1] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            aria-label="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 font-medium">
          Hiển thị 1 - {events.length} trong số {totalEvents} sự kiện đã xác lập
        </p>
      </div>

    </div>
  );
};

export default EventList;
