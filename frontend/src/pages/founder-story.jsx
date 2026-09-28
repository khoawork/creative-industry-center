import React, { useState, useMemo } from 'react';
import { Introduction } from '../components/founder-stories/introduction';
import { StoryFilter } from '../components/founder-stories/StoryFilter';
import { FounderStoryList } from '../components/founder-stories/FounderStoryList';
import { StoryCTA } from '../components/founder-stories/StoryCTA';
import { SubmitStoryModal } from '../components/founder-stories/SubmitStoryModal';
import { RecordEvaluationModal } from '../components/founder-stories/RecordEvaluationModal';
import { FOUNDER_STORIES } from '../data/founderStoriesData';

export const FounderStory = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);

  const filteredStories = useMemo(() => {
    return FOUNDER_STORIES.filter((story) => {
      const matchCategory =
        selectedCategory === 'all' || story.category === selectedCategory;

      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchSearch =
        normalizedSearch === '' ||
        story.name.toLowerCase().includes(normalizedSearch) ||
        story.title.toLowerCase().includes(normalizedSearch) ||
        story.categoryLabel.toLowerCase().includes(normalizedSearch) ||
        story.badgeText.toLowerCase().includes(normalizedSearch) ||
        story.tabs.about.content.toLowerCase().includes(normalizedSearch);

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchTerm]);

  const handleResetFilter = () => {
    setSelectedCategory('all');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2d2a29]">
      <Introduction totalStories={FOUNDER_STORIES.length} />

      <StoryFilter
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        storyCount={filteredStories.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <FounderStoryList
          stories={filteredStories}
          onResetFilter={handleResetFilter}
          onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
        />
        <StoryCTA
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
          onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
        />
      </main>

      <SubmitStoryModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      <RecordEvaluationModal
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
      />
    </div>
  );
};

export default FounderStory;