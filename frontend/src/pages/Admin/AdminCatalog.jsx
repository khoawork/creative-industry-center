import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CalendarDays,
  Award,
  GraduationCap,
  FolderKanban,
  Trophy,
} from 'lucide-react';
import {
  EventTableManager,
  AwardTableManager,
  TrainingTableManager,
  ProjectTableManager,
  RecordTableManager,
} from '../../components/Admin/Catalog/index.js';
import { AdminPageHeader, AdminTabs } from '../../components/Admin/Common/index.js';

const TABS = [
  {
    id: 'events',
    label: 'Sự kiện (Events)',
    icon: CalendarDays,
  },
  {
    id: 'awards',
    label: 'Giải thưởng (Awards)',
    icon: Award,
  },
  {
    id: 'training',
    label: 'Đào tạo (Training)',
    icon: GraduationCap,
  },
  {
    id: 'projects',
    label: 'Dự án (Projects)',
    icon: FolderKanban,
  },
  {
    id: 'records',
    label: 'Kỷ lục (Records)',
    icon: Trophy,
  },
];

export default function AdminCatalog({ defaultTab }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialTab = () => {
    if (defaultTab && TABS.some((t) => t.id === defaultTab)) {
      return defaultTab;
    }
    const pathLastSegment = location.pathname.split('/').filter(Boolean).pop();
    if (pathLastSegment && TABS.some((t) => t.id === pathLastSegment)) {
      return pathLastSegment;
    }
    const queryTab = searchParams.get('tab');
    if (queryTab && TABS.some((t) => t.id === queryTab)) {
      return queryTab;
    }
    return 'events';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    if (defaultTab && TABS.some((t) => t.id === defaultTab)) {
      setActiveTab(defaultTab);
      return;
    }
    const pathLastSegment = location.pathname.split('/').filter(Boolean).pop();
    if (pathLastSegment && TABS.some((t) => t.id === pathLastSegment)) {
      setActiveTab(pathLastSegment);
      return;
    }
    const queryTab = searchParams.get('tab');
    if (queryTab && TABS.some((t) => t.id === queryTab)) {
      setActiveTab(queryTab);
    }
  }, [location.pathname, defaultTab, searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSeg = pathSegments[pathSegments.length - 1];
    if (['events', 'awards', 'training', 'projects', 'records'].includes(lastSeg)) {
      navigate(`/admin/${tabId}`);
    } else {
      setSearchParams({ tab: tabId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header chuẩn hóa theo trang Sự kiện */}
      <AdminPageHeader
        badge="Hệ thống Quản lý Danh mục"
        title="Quản lý Dữ liệu Danh mục"
        subtitle="Quản lý toàn bộ danh mục Sự kiện, Giải thưởng, Đào tạo, Dự án và Kỷ lục theo chuẩn hệ thống."
      />

      {/* Tabs Navigation chuẩn hóa đồng bộ với trang Sự kiện */}
      <AdminTabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={handleTabChange}
      />

      {/* Active Tab Content Section */}
      <div className="min-h-[400px]">
        {activeTab === 'events' && <EventTableManager />}
        {activeTab === 'awards' && <AwardTableManager />}
        {activeTab === 'training' && <TrainingTableManager />}
        {activeTab === 'projects' && <ProjectTableManager />}
        {activeTab === 'records' && <RecordTableManager />}
      </div>
    </div>
  );
}
