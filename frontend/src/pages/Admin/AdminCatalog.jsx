import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CalendarDays,
  Award,
  GraduationCap,
  FolderKanban,
  Database,
  Trophy,
} from 'lucide-react';
import {
  EventTableManager,
  AwardTableManager,
  TrainingTableManager,
  ProjectTableManager,
  RecordTableManager,
} from '../../components/Admin/Catalog/index.js';

const TABS = [
  {
    id: 'events',
    label: 'Sự kiện (Events)',
    icon: CalendarDays,
    color: 'from-blue-500 to-indigo-600',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    hoverBorder: 'hover:border-blue-400 hover:shadow-blue-500/10',
    activeBorder: 'border-blue-500 ring-2 ring-blue-500/20',
    activeDot: 'bg-blue-500',
    description: 'Quản lý lịch trình, thời gian, địa điểm và trạng thái các sự kiện',
  },
  {
    id: 'awards',
    label: 'Giải thưởng (Awards)',
    icon: Award,
    color: 'from-amber-500 to-yellow-600',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    hoverBorder: 'hover:border-amber-400 hover:shadow-amber-500/10',
    activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
    activeDot: 'bg-amber-500',
    description: 'Hồ sơ khen thưởng, số quyết định và danh hiệu tôn vinh',
  },
  {
    id: 'training',
    label: 'Đào tạo (Training)',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
    activeDot: 'bg-emerald-500',
    description: 'Khóa học chuyên môn, chứng nhận, đối tượng và điểm nổi bật',
  },
  {
    id: 'projects',
    label: 'Dự án (Projects)',
    icon: FolderKanban,
    color: 'from-violet-500 to-purple-600',
    badgeColor: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    hoverBorder: 'hover:border-violet-400 hover:shadow-violet-500/10',
    activeBorder: 'border-violet-500 ring-2 ring-violet-500/20',
    activeDot: 'bg-violet-500',
    description: 'Các sáng kiến trọng điểm, khẩu hiệu và chỉ số nghiên cứu',
  },
  {
    id: 'records',
    label: 'Kỷ lục (Records)',
    icon: Trophy,
    color: 'from-amber-500 to-yellow-600',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    hoverBorder: 'hover:border-amber-400 hover:shadow-amber-500/10',
    activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
    activeDot: 'bg-amber-500',
    description: 'Hạng mục đề cử, quy chế, bảng vàng và hồ sơ kỷ lục',
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
    if (['events', 'awards', 'training', 'projects', 'records'].includes(lastSeg)) {
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
              Thực hiện thêm mới, chỉnh sửa và quản lý các bản ghi của các phân hệ Sự kiện, Giải thưởng, Đào tạo, Dự án và Kỷ lục.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group overflow-hidden cursor-pointer ${
                isSelected
                  ? `bg-[var(--admin-surface)] ${tab.activeBorder} shadow-lg -translate-y-1`
                  : `bg-[var(--admin-surface)]/80 border-[var(--admin-border)] hover:bg-[var(--admin-surface)] ${tab.hoverBorder} hover:-translate-y-1 hover:shadow-md opacity-85 hover:opacity-100`
              }`}
            >
              {/* Top accent line on selected or hover */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 bg-gradient-to-r ${tab.color} ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              />

              <div className="flex items-center justify-between mb-3">
                <span
                  className={`p-2.5 rounded-xl border transition-all duration-200 group-hover:scale-110 group-hover:shadow-sm ${tab.badgeColor}`}
                >
                  <TabIcon className="w-5 h-5" />
                </span>
                {isSelected ? (
                  <span className={`w-2.5 h-2.5 rounded-full ${tab.activeDot} ring-4 ring-current/20 animate-pulse`} />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
                )}
              </div>
              <h3 className="font-bold text-sm text-[var(--admin-text)] transition-colors">
                {tab.label}
              </h3>
              <p className="text-xs text-[var(--admin-text-muted)] line-clamp-1 mt-1 group-hover:text-[var(--admin-text)] transition-colors">
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
        {activeTab === 'records' && <RecordTableManager />}
      </div>
    </div>
  );
}
