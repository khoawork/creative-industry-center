import { FounderCard } from './FounderCard';
import { SearchX, RotateCcw } from 'lucide-react';

export const FounderStoryList = ({ stories, onResetFilter, onOpenEvaluationModal }) => {
  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e8dfd3] p-12 text-center my-8 shadow-xs max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-full bg-red-50 text-[#710008] flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Không tìm thấy câu chuyện phù hợp</h3>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
          Hiện chưa có câu chuyện nào thỏa mãn từ khóa hoặc bộ lọc đã chọn. Hãy thử tìm bằng từ khóa khác hoặc xem tất cả câu chuyện.
        </p>
        <button
          onClick={onResetFilter}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#710008] text-white text-xs font-semibold hover:bg-[#580006] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Xem tất cả câu chuyện</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 my-8">
      {stories.map((story) => (
        <FounderCard
          key={story.id}
          story={story}
          onOpenEvaluationModal={onOpenEvaluationModal}
        />
      ))}
    </div>
  );
};

export default FounderStoryList;
