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
import { AdminPageHeader, AdminTabs, AdminToast, AdminButton } from '../../components/Admin/Common/index.js';

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
  const [toast, setToast] = useState(null);

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
        setToast({ message: 'Không thể kết nối lấy dữ liệu trang dự án từ API.', error: true });
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
      setToast({ message: 'Cập nhật phần Header thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Header:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Header lên hệ thống.', error: true });
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
      setToast({ message: 'Cập nhật phần Đề xuất thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Đề xuất:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Đề xuất lên hệ thống.', error: true });
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
      setToast({ message: 'Cập nhật danh sách dự án hiển thị thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu danh sách dự án hiển thị:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu danh sách dự án hiển thị.', error: true });
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
      <AdminPageHeader
        badge="Live API"
        title="Quản trị Trang Dự án"
        subtitle="Tùy biến nội dung tiêu đề, chỉ số thống kê, form đề xuất và chọn lọc các dự án hiển thị ngoài website."
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={loadData}
            >
              Làm mới
            </AdminButton>

            <a
              href="/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition cursor-pointer"
            >
              <ExternalLink size={14} />
              Xem trang dự án
            </a>
          </div>
        }
      />

      {/* Tabs Danh mục */}
      <AdminTabs
        tabs={adminProjectTabs}
        activeTab={activeTab.id}
        onChange={(id) => {
          const tab = adminProjectTabs.find((t) => t.id === id);
          if (tab) selectTab(tab);
        }}
      />

      {/* Tab Panels */}
      <div>
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

      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
