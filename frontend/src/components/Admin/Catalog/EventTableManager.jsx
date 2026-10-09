import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, Tags } from 'lucide-react';
import EventManager from '../Events/EventManager.jsx';
import EventCategories from '../Events/EventCategories.jsx';
import { AdminTabs } from '../Common/index.js';

export default function EventTableManager(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') || searchParams.get('subtab') || 'events';
  const [activeTab, setActiveTab] = useState(currentView === 'categories' ? 'categories' : 'events');
  const [categoryRefreshKey, setCategoryRefreshKey] = useState(0);

  useEffect(() => {
    const view = searchParams.get('view') || searchParams.get('subtab');
    if (view === 'categories' || view === 'events') {
      setActiveTab(view);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (tabId === 'categories') {
        next.set('view', 'categories');
      } else {
        next.delete('view');
        next.delete('subtab');
      }
      return next;
    });
  };

  const SUB_TABS = [
    {
      id: 'events',
      label: 'Danh sách Sự kiện',
      icon: CalendarDays,
    },
    {
      id: 'categories',
      label: 'Quản lý Chuyên mục',
      icon: Tags,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Thanh chuyển đổi phân nhóm Sự kiện / Chuyên mục */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--admin-border) pb-3">
        <AdminTabs
          tabs={SUB_TABS}
          activeTab={activeTab}
          onChange={handleTabChange}
          ariaLabel="Phân nhóm Quản lý Dữ liệu Sự kiện"
        />
      </div>

      {/* Nội dung tương ứng */}
      {activeTab === 'events' ? (
        <EventManager
          {...props}
          reloadKey={categoryRefreshKey}
          onOpenCategories={() => handleTabChange('categories')}
        />
      ) : (
        <EventCategories
          onChanged={() => setCategoryRefreshKey((k) => k + 1)}
          onBackToEvents={() => handleTabChange('events')}
        />
      )}
    </div>
  );
}
