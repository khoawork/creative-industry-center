import React, { useState, useMemo, useRef } from 'react';
import {
  AwardHero,
  AwardFilter,
  AwardList,
  HonoreesList,
  AwardDetailModal,
  AwardRegulationModal,
  HonoreeDetailModal,
} from '../components/Award';
import {
  ANNUAL_AWARDS_DATA,
  RECENT_HONOREES_DATA,
} from '../data/awardsData';

export const AwardsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [selectedAward, setSelectedAward] = useState(null);
  const [selectedHonoree, setSelectedHonoree] = useState(null);
  const [regulationModal, setRegulationModal] = useState({
    isOpen: false,
    mode: 'regulation', // 'regulation' | 'dossier'
  });

  const honoreesRef = useRef(null);

  // Filter awards
  const filteredAwards = useMemo(() => {
    return ANNUAL_AWARDS_DATA.filter((award) => {
      // Year filter
      const matchYear =
        selectedYear === 'Tất cả' || award.year === selectedYear;

      // Category filter
      const matchCategory =
        selectedCategory === 'all' || award.category === selectedCategory;

      // Search filter
      const term = searchTerm.trim().toLowerCase();
      const matchSearch =
        term === '' ||
        award.title.toLowerCase().includes(term) ||
        award.code.toLowerCase().includes(term) ||
        award.subtitle.toLowerCase().includes(term) ||
        award.description.toLowerCase().includes(term) ||
        award.categoryBadge.toLowerCase().includes(term);

      return matchYear && matchCategory && matchSearch;
    });
  }, [searchTerm, selectedYear, selectedCategory]);

  // Filter honorees
  const filteredHonorees = useMemo(() => {
    return RECENT_HONOREES_DATA.filter((honoree) => {
      const matchYear =
        selectedYear === 'Tất cả' || honoree.year === selectedYear;

      const term = searchTerm.trim().toLowerCase();
      const matchSearch =
        term === '' ||
        honoree.title.toLowerCase().includes(term) ||
        honoree.subtitle.toLowerCase().includes(term) ||
        honoree.code.toLowerCase().includes(term) ||
        honoree.badge.toLowerCase().includes(term) ||
        honoree.description.toLowerCase().includes(term);

      return matchYear && matchSearch;
    });
  }, [searchTerm, selectedYear]);

  const handleResetFilter = () => {
    setSearchTerm('');
    setSelectedYear('Tất cả');
    setSelectedCategory('all');
  };

  const handleScrollToHonorees = () => {
    if (honoreesRef.current) {
      honoreesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1c1b] flex flex-col font-sans">
      {/* 1. Header Banner with decorative star watermark */}
      <AwardHero />

      {/* Main Body */}
      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-1">
        {/* 2. Search & Filter Bar */}
        <AwardFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onResetFilter={handleResetFilter}
        />

        {/* 3. Section: Danh mục 06 Giải thưởng thường niên */}
        <AwardList
          awards={filteredAwards}
          onSelectAward={(award) => setSelectedAward(award)}
          onOpenRegulationModal={() =>
            setRegulationModal({ isOpen: true, mode: 'regulation' })
          }
          onScrollToHonorees={handleScrollToHonorees}
          onResetFilter={handleResetFilter}
        />

        {/* 4. Section: Bảng vàng tôn vinh gần nhất */}
        <HonoreesList
          honorees={filteredHonorees}
          onSelectHonoree={(honoree) => setSelectedHonoree(honoree)}
          onOpenDossierModal={() =>
            setRegulationModal({ isOpen: true, mode: 'dossier' })
          }
          honoreesRef={honoreesRef}
        />
      </main>

      {/* Interactive Modals */}
      <AwardDetailModal
        award={selectedAward}
        isOpen={Boolean(selectedAward)}
        onClose={() => setSelectedAward(null)}
      />

      <HonoreeDetailModal
        honoree={selectedHonoree}
        isOpen={Boolean(selectedHonoree)}
        onClose={() => setSelectedHonoree(null)}
      />

      <AwardRegulationModal
        isOpen={regulationModal.isOpen}
        mode={regulationModal.mode}
        onClose={() => setRegulationModal({ isOpen: false, mode: 'regulation' })}
      />
    </div>
  );
};

export default AwardsPage;
