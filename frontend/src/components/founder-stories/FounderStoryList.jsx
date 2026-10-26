import { FounderCard } from './FounderCard';
import { SearchX, RotateCcw } from 'lucide-react';

export const FounderStoryList = ({ stories, onResetFilter, onOpenEvaluationModal }) => {


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
