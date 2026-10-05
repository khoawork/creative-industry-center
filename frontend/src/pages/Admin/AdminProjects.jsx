import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ExternalLink,
  RefreshCw,
  Layout,
  Send,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

import { ProjectPageAPI } from '../../api/projectPageApi.js';
import {
  ProjectHeaderEditor,
  ProjectProposalEditor,
  ProjectSelector,
} from '../../components/Admin/Projects';

const adminProjectTabs = [
  { id: 'header', label: 'Header & Giới thiệu', icon: Layout },
  { id: 'proposal', label: 'Đề xuất & CTA Form', icon: Send },
  { id: 'selector', label: 'Dự án hiển thị (Chọn lọc)', icon: CheckSquare },
];

export default function AdminProjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabRefs = useRef([]);
  const activeTabId = searchParams.get('tab') || 'header';
  const activeTab = adminProjectTabs.find((t) => t.id === activeTabId) || adminProjectTabs[0];

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const selectTab = (tab) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (tab.id === 'header') next.delete('tab');
      else next.set('tab', tab.id);
      return next;
    });
  };

  const loadData = () => {
    setLoading(true);
    ProjectPageAPI.getProjectPage(5)
      .then((result) => {
        const dataPayload = result.data || result;
        setProjectData(dataPayload);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu trang Dự án từ API:', err);
        alert('Không thể kết nối lấy dữ liệu trang dự án từ API.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveHeader = async (newHeaderData) => {
    if (!projectData) return;
    setIsSaving(true);
    try {
      const response = await ProjectPageAPI.updateHeaderSection(projectData.id, newHeaderData);
      const updatedProps = {
        ...(projectData.props || {}),
        header_section: response.data || newHeaderData,
      };
      setProjectData({ ...projectData, props: updatedProps });
      alert('Cập nhật phần Header thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu Header:', error);
      alert('Có lỗi xảy ra khi lưu Header lên hệ thống.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProposal = async (newProposalData) => {
    if (!projectData) return;
    setIsSaving(true);
    try {
      const response = await ProjectPageAPI.updateProposalSection(projectData.id, newProposalData);
      const savedProposal = response?.data || response || newProposalData;
      const updatedProps = {
        ...(projectData.props || {}),
        proposal_section: savedProposal,
      };
      setProjectData({ ...projectData, props: updatedProps });
      alert('Cập nhật phần Đề xuất thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu Đề xuất:', error);
      alert('Có lỗi xảy ra khi lưu Đề xuất lên hệ thống.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSelected = async (selectedIds) => {
    if (!projectData) return;
    setIsSaving(true);
    try {
      const response = await ProjectPageAPI.updateSelectedProjects(projectData.id, selectedIds);
      const updatedIds = response?.data?.project_ids ?? selectedIds;
      const updatedProps = {
        ...(projectData.props || {}),
        selected_project_ids: updatedIds,
      };
      setProjectData({ ...projectData, props: updatedProps });
      alert('Cập nhật danh sách dự án hiển thị thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu danh sách dự án hiển thị:', error);
      alert('Có lỗi xảy ra khi lưu danh sách dự án hiển thị.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-(--admin-heading)">
          <RefreshCw className="animate-spin text-(--admin-accent)" size={20} />
          <span>Đang nạp dữ liệu trang Dự án từ hệ thống...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header trang quản trị */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--admin-border) pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-(--admin-title)">
              Quản trị Trang Dự án
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Sparkles size={12} /> Live API
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-(--admin-heading)">
            Tùy biến nội dung tiêu đề, chỉ số thống kê, form đề xuất và chọn lọc các dự án hiển thị ngoài website
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-1.5 rounded-full border border-(--admin-border) bg-(--admin-surface) px-3 py-1.5 text-[11px] font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition cursor-pointer"
            title="Làm mới dữ liệu từ server"
          >
            <RefreshCw size={13} />
            Làm mới
          </button>

          <a
            href="/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-(--admin-border) bg-(--admin-surface) px-3 py-1.5 text-[11px] font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition cursor-pointer"
          >
            <ExternalLink size={13} />
            Xem trang dự án
          </a>
        </div>
      </div>

      {/* Tabs Danh mục */}
      <div
        role="tablist"
        aria-label="Quản lý trang dự án"
        className="my-6 flex max-w-full gap-1 overflow-x-auto border-b border-(--admin-border) bg-(--admin-surface) p-1 [scrollbar-width:none]"
      >
        {adminProjectTabs.map((tab, index) => {
          const IconComponent = tab.icon;
          const isSelected = activeTab.id === tab.id;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`project-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`project-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => selectTab(tab)}
              onKeyDown={(event) => {
                let nextIndex;
                if (event.key === 'ArrowRight') nextIndex = (index + 1) % adminProjectTabs.length;
                else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + adminProjectTabs.length) % adminProjectTabs.length;
                else if (event.key === 'Home') nextIndex = 0;
                else if (event.key === 'End') nextIndex = adminProjectTabs.length - 1;
                else return;
                event.preventDefault();
                selectTab(adminProjectTabs[nextIndex]);
                tabRefs.current[nextIndex]?.focus();
              }}
              className={`min-h-11 shrink-0 cursor-pointer border-b-2 px-4 text-sm font-semibold whitespace-nowrap flex items-center gap-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--admin-heading) transition-colors ${
                isSelected
                  ? 'border-(--admin-accent) text-(--admin-title)'
                  : 'border-transparent text-(--admin-heading) hover:bg-(--admin-background)'
              }`}
            >
              <IconComponent size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {/* Tab 1: Header */}
        <div
          id="project-panel-header"
          role="tabpanel"
          aria-labelledby="project-tab-header"
          hidden={activeTab.id !== 'header'}
        >
          {activeTab.id === 'header' && (
            <ProjectHeaderEditor
              key={`header-${projectData?.id || 'default'}`}
              initialData={projectData?.props?.header_section}
              onSave={handleSaveHeader}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Tab 2: Proposal / CTA */}
        <div
          id="project-panel-proposal"
          role="tabpanel"
          aria-labelledby="project-tab-proposal"
          hidden={activeTab.id !== 'proposal'}
        >
          {activeTab.id === 'proposal' && (
            <ProjectProposalEditor
              key={`proposal-${projectData?.id || 'default'}`}
              initialData={projectData?.props?.proposal_section}
              onSave={handleSaveProposal}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Tab 3: Selector (Chọn các dự án để hiển thị - Không có CRUD) */}
        <div
          id="project-panel-selector"
          role="tabpanel"
          aria-labelledby="project-tab-selector"
          hidden={activeTab.id !== 'selector'}
        >
          {activeTab.id === 'selector' && (
            <ProjectSelector
              key={`selector-${projectData?.id || 'default'}-${(projectData?.props?.selected_project_ids || []).length}`}
              initialSelectedIds={projectData?.props?.selected_project_ids}
              onSave={handleSaveSelected}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
