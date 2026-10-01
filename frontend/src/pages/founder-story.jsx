import React, { useEffect, useMemo, useState } from 'react';
import { Introduction } from '../components/founder-stories/introduction';
import { StoryFilter } from '../components/founder-stories/StoryFilter';
import { FounderStoryList } from '../components/founder-stories/FounderStoryList';
import { StoryCTA } from '../components/founder-stories/StoryCTA';
import { SubmitStoryModal } from '../components/founder-stories/SubmitStoryModal';
import { RecordEvaluationModal } from '../components/founder-stories/RecordEvaluationModal';
import { FOUNDER_STORIES } from '../data/founderStoriesData';
import { FounderAPI } from '../api/founderApi';
import {
  getFounderCategories,
  mapFounderPageToCta,
  mapFounderPageToHero,
  mapFounderPageToStories,
  unwrapFounderResponse,
} from '../services/founderMapper';

export const FounderStory = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [stories, setStories] = useState(FOUNDER_STORIES);
  const [hero, setHero] = useState(null);
  const [cta, setCta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    let isMounted = true;

    FounderAPI.getFounderPage()
      .then((result) => {
        if (!isMounted) return;
        const page = unwrapFounderResponse(result);
        const apiStories = mapFounderPageToStories(page);

        if (apiStories.length > 0) setStories(apiStories);
        setHero(mapFounderPageToHero(page));
        setCta(mapFounderPageToCta(page));
      })
      .catch(() => {
        if (isMounted) setApiError('Không thể tải dữ liệu mới nhất, đang hiển thị nội dung dự phòng.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => getFounderCategories(stories), [stories]);

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
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
  }, [selectedCategory, searchTerm, stories]);

  const handleResetFilter = () => {
    setSelectedCategory('all');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2d2a29]">
      <Introduction hero={hero} totalStories={stories.length} />

      {apiError && (
        <div role="status" className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
          {apiError}
        </div>
      )}

      <StoryFilter
        categories={categories}
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        storyCount={filteredStories.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {isLoading && <p className="mb-4 text-center text-xs text-gray-500">Đang đồng bộ dữ liệu Founder...</p>}
        <FounderStoryList
          stories={filteredStories}
          onResetFilter={handleResetFilter}
          onOpenEvaluationModal={() => setIsEvaluationModalOpen(true)}
        />
        <StoryCTA
          cta={cta}
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