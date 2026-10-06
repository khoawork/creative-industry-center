import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CalendarDays,
  Award,
  GraduationCap,
  FolderKanban,
  Database,
} from 'lucide-react';
import {
  EventTableManager,
  AwardTableManager,
  TrainingTableManager,
  ProjectTableManager,
} from '../../components/Admin/Catalog/index.js';

const TABS = [
  {
    id: 'events',
    label: 'Sự kiện (Events)',
    icon: CalendarDays,
    color: 'from-blue-500 to-indigo-600',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Quản lý lịch trình, thời gian, địa điểm và trạng thái các sự kiện',
  },
  {
    id: 'awards',
    label: 'Giải thưởng (Awards)',
    icon: Award,
    color: 'from-amber-500 to-yellow-600',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Hồ sơ khen thưởng, số quyết định và danh hiệu tôn vinh',
  },
  {
    id: 'training',
    label: 'Đào tạo (Training)',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Khóa học chuyên môn, chứng nhận, đối tượng và điểm nổi bật',
  },
  {
    id: 'projects',
    label: 'Dự án (Projects)',
    icon: FolderKanban,
    color: 'from-violet-500 to-purple-600',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    description: 'Các sáng kiến trọng điểm, khẩu hiệu và chỉ số nghiên cứu',
  },
];

export default function AdminCatalog({ defaultTab }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // Xác định active tab dựa trên prop defaultTab, URL pathname, hoặc search query
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
    // Nếu trang hiện tại là /admin/events, /admin/projects,... thì điều hướng tới tab đó
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSeg = pathSegments[pathSegments.length - 1];
    if (['events', 'awards', 'training', 'projects'].includes(lastSeg)) {
      navigate(`/admin/${tabId}`);
    } else {
      setSearchParams({ tab: tabId });
    }
  };

  const currentTabInfo = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--admin-surface)] to-[var(--admin-surface)]/80 border border-[var(--admin-border)] p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-[var(--admin-border)] text-[var(--admin-text-muted)]">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Hệ thống Quản lý Danh mục (Catalog Management)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--admin-text)] tracking-tight">
              Quản lý Dữ liệu Danh mục
            </h1>
            <p className="text-sm text-[var(--admin-text-muted)] max-w-2xl">
              Thực hiện thêm mới, chỉnh sửa và quản lý các bản ghi của các phân hệ Sự kiện, Giải thưởng, Đào tạo và Dự án trực tiếp qua API.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group overflow-hidden ${
                isSelected
                  ? 'bg-[var(--admin-surface)] border-white/20 shadow-xl ring-2 ring-white/10'
                  : 'bg-[var(--admin-surface)]/60 border-[var(--admin-border)] hover:bg-[var(--admin-surface)] hover:border-white/10 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2.5 rounded-xl border ${tab.badgeColor}`}>
                  <TabIcon className="w-5 h-5" />
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <h3 className="font-bold text-sm text-[var(--admin-text)] group-hover:text-white transition">
                {tab.label}
              </h3>
              <p className="text-xs text-[var(--admin-text-muted)] line-clamp-1 mt-1">
                {tab.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Section */}
      <div className="transition-all duration-300">
        {activeTab === 'events' && <EventTableManager />}
        {activeTab === 'awards' && <AwardTableManager />}
        {activeTab === 'training' && <TrainingTableManager />}
        {activeTab === 'projects' && <ProjectTableManager />}
      </div>
    </div>
  );
}
