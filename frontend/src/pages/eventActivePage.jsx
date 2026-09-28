import { useState, useMemo } from 'react';
import { EventHero } from '../components/event-actis/EventHero';
import { EventFilter } from '../components/event-actis/EventFilter';
import { EventList } from '../components/event-actis/EventList';
import { EventNewsletter } from '../components/event-actis/EventNewsletter';
import { EventRegisterModal } from '../components/event-actis/EventRegisterModal';
import { EventDetailModal } from '../components/event-actis/EventDetailModal';
import { EVENTS_DATA } from '../data/eventData';

export const EventActivePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Modals state
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return EVENTS_DATA.filter((event) => {
      // Category filter
      let matchCategory = true;
      if (activeCategory === 'upcoming') {
        matchCategory = event.status === 'open' || event.status === 'upcoming';
      } else if (activeCategory !== 'all') {
        matchCategory = event.category === activeCategory;
      }

      // Year filter
      let matchYear = true;
      if (selectedYear !== 'all') {
        matchYear = event.monthYear.includes(selectedYear);
      }

      // Search filter
      const term = searchTerm.trim().toLowerCase();
      const matchSearch =
        term === '' ||
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.speaker.name.toLowerCase().includes(term);

      return matchCategory && matchYear && matchSearch;
    });
  }, [activeCategory, selectedYear, searchTerm]);

  const handleResetFilter = () => {
    setActiveCategory('all');
    setSearchTerm('');
    setSelectedYear('2026');
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1c1b] flex flex-col font-sans">
      
      <EventHero />

      <EventFilter
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <EventList
          events={filteredEvents}
          totalEvents={54}
          onResetFilter={handleResetFilter}
          onRegisterEvent={(event) => setRegisteringEvent(event)}
          onDetailEvent={(event) => setDetailEvent(event)}
        />

        <EventNewsletter />
      </main>

      <EventRegisterModal
        event={registeringEvent}
        isOpen={Boolean(registeringEvent)}
        onClose={() => setRegisteringEvent(null)}
      />

      <EventDetailModal
        event={detailEvent}
        isOpen={Boolean(detailEvent)}
        onClose={() => setDetailEvent(null)}
        onRegister={(event) => {
          setDetailEvent(null);
          setRegisteringEvent(event);
        }}
      />

    </div>
  );
};

export default EventActivePage;