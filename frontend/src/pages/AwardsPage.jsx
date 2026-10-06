import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  AwardHero,
  AwardFilter,
  AwardList,
  HonoreesList,
  AwardDetailModal,
  AwardRegulationModal,
  HonoreeDetailModal,
  AwardPageUnavailable,
} from '../components/Award';
import { AwardAPI } from '../api/awardApi.js';
import { mapAwardPage } from '../services/awardMapper.js';

export const AwardsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('Tất cả');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [awardPage, setAwardPage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedAward, setSelectedAward] = useState(null);
  const [selectedHonoree, setSelectedHonoree] = useState(null);
  const [regulationModal, setRegulationModal] = useState({
    isOpen: false,
    mode: 'regulation', // 'regulation' | 'dossier'
  });

  const honoreesRef = useRef(null);

  useEffect(() => {
    let active = true;
    AwardAPI.getAwardPage()
      .then((response) => {
        if (active) setAwardPage(mapAwardPage(response));
      })
      .catch(() => {
        if (active) setAwardPage(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Filter awards
  const filteredAwards = useMemo(() => {
    return (awardPage?.awards || []).filter((award) => {
      // Year filter
      const matchYear =
        selectedYear === 'Tất cả' || String(award.year) === selectedYear;

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
  }, [awardPage, searchTerm, selectedYear, selectedCategory]);

  // Filter honorees
  const filteredHonorees = useMemo(() => {
    return (awardPage?.honorees || []).filter((honoree) => {
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
  }, [awardPage, searchTerm, selectedYear]);

  const filterYears = useMemo(() => {
    return Array.from(
      new Set(
        (awardPage?.awards || [])
          .map((award) => String(award.year || '').trim())
          .filter(Boolean),
      ),
    ).sort((firstYear, secondYear) => Number(secondYear) - Number(firstYear));
  }, [awardPage]);

  const filterCategories = useMemo(() => {
    return Array.from(
      new Set(
        (awardPage?.awards || [])
          .map((award) => String(award.category || '').trim())
          .filter(Boolean),
      ),
    ).map((category) => ({ id: category, label: category }));
  }, [awardPage]);

  if (loading) {
    return <div className="min-h-[55vh] grid place-items-center text-sm text-gray-500">Đang tải nội dung giải thưởng...</div>;
  }

  if (!awardPage || (!awardPage.header?.tittle && !awardPage.header?.title && filteredAwards.length === 0 && filteredHonorees.length === 0)) {
    return <AwardPageUnavailable />;
  }

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
    <div className="min-h-screen bg-[#faf9f7] font-sans text-[#1a1c1b]">
      {/* 1. Header Banner with decorative star watermark */}
      <AwardHero header={awardPage.header} />

      {/* Main Body */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {/* 2. Search & Filter Bar */}
        <AwardFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onResetFilter={handleResetFilter}
          years={filterYears}
          categories={filterCategories}
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
