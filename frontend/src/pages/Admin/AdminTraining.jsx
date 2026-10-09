import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  GraduationCap,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { TrainingPageAPI } from '../../api/trainingPageApi.js';
import { saveFormConfig } from '../../services/googleSheetService.js';
import {
  TrainingHeaderEditor,
  TrainingModelsEditor,
  TrainingCertificationEditor,
  TrainingProposalEditor,
  TrainingSelector,
} from '../../components/Admin/Training';
import { AdminPageHeader, AdminTabs, AdminToast, AdminButton } from '../../components/Admin/Common/index.js';

const adminTrainingTabs = [
  { id: 'header', label: 'Header & Giới thiệu', icon: Sparkles },
  { id: 'models', label: 'Mô hình hợp tác', icon: Layers },
  { id: 'certification', label: 'Cam kết & Chứng nhận', icon: ShieldCheck },
  { id: 'proposal', label: 'Form Đăng ký / Đề xuất', icon: FileText },
  { id: 'trainings', label: 'Khóa học hiển thị (Chọn lọc)', icon: GraduationCap },
];




export default function AdminTraining() {
  const [activeTab, setActiveTab] = useState(adminTrainingTabs[0]);
  const [trainingData, setTrainingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const tabRefs = useRef([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await TrainingPageAPI.getTrainingPage(9);
      if (response && response.data) {
        setTrainingData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu trang Hợp tác & Đào tạo:', error);
      setToast({ message: 'Không thể kết nối đến máy chủ để tải dữ liệu trang Hợp tác & Đào tạo.', error: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectTab = (tab) => {
    setActiveTab(tab);
  };

  const handleSaveHeader = async (newHeaderData) => {
    if (!trainingData) return;
    setIsSaving(true);
    try {
      const response = await TrainingPageAPI.updateHeaderSection(trainingData.id, newHeaderData);
      const savedHeader = response?.data || response || newHeaderData;
      const updatedProps = {
        ...(trainingData.props || {}),
        header_section: savedHeader,
      };
      setTrainingData({ ...trainingData, props: updatedProps });
      setToast({ message: 'Cập nhật phần Header thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Header:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Header lên hệ thống.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveModels = async (newModelsData) => {
    if (!trainingData) return;
    setIsSaving(true);
    try {
      const response = await TrainingPageAPI.updateModelsSection(trainingData.id, newModelsData);
      const savedModels = response?.data?.models || response?.models || newModelsData;
      const updatedProps = {
        ...(trainingData.props || {}),
        models_section: savedModels,
      };
      setTrainingData({ ...trainingData, props: updatedProps });
      setToast({ message: 'Cập nhật phần Mô hình hợp tác thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Mô hình hợp tác:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Mô hình hợp tác lên hệ thống.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCertification = async (newCertData) => {
    if (!trainingData) return;
    setIsSaving(true);
    try {
      const response = await TrainingPageAPI.updateCertificationSection(trainingData.id, newCertData);
      const savedCert = response?.data || response || newCertData;
      const updatedProps = {
        ...(trainingData.props || {}),
        certification_section: savedCert,
      };
      setTrainingData({ ...trainingData, props: updatedProps });
      setToast({ message: 'Cập nhật phần Cam kết & Chứng nhận thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Cam kết & Chứng nhận:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Cam kết & Chứng nhận lên hệ thống.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProposal = async (newProposalData) => {
    if (!trainingData) return;
    setIsSaving(true);
    try {
      const response = await TrainingPageAPI.updateProposalSection(trainingData.id, newProposalData);
      const savedProposal = response?.data || response || newProposalData;
      const updatedProps = {
        ...(trainingData.props || {}),
        proposal_section: savedProposal,
      };
      setTrainingData({ ...trainingData, props: updatedProps });

      // Tự động đồng bộ sang Google Sheet form config
      try {
        const fields = (savedProposal.form_fields || []).map((f) => ({
          key: f.id || f.key,
          label: f.label || f.placeholder || f.id,
          type: f.type || 'text',
          placeholder: f.placeholder || '',
          required: Boolean(f.required),
          colSpan: f.width === 'half' ? 1 : 2,
          options: f.options || [],
        }));
        await saveFormConfig('training_registration', {
          title: savedProposal.form_title || 'Ghi Danh Khóa Học & Đào Tạo Kỷ Lục',
          subtitle: savedProposal.form_description || '',
          submitButtonText: savedProposal.button_text || 'GỬI HỒ SƠ ĐĂNG KÝ',
          fields,
        });
      } catch (errSync) {
        console.warn('Lỗi khi đồng bộ cấu hình form training_registration:', errSync);
      }

      setToast({ message: 'Cập nhật Form đăng ký & đồng bộ biểu mẫu thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Form đăng ký:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Form đăng ký lên hệ thống.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSelected = async (selectedIds) => {
    if (!trainingData) return;
    setIsSaving(true);
    try {
      const response = await TrainingPageAPI.updateSelectedTrainings(trainingData.id, selectedIds);
      const updatedIds = response?.data?.training_ids ?? selectedIds;
      const updatedProps = {
        ...(trainingData.props || {}),
        selected_training_ids: updatedIds,
      };
      setTrainingData({ ...trainingData, props: updatedProps });
      setToast({ message: 'Cập nhật danh sách khóa đào tạo hiển thị thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu danh sách khóa đào tạo hiển thị:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu danh sách khóa đào tạo hiển thị.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-(--admin-heading)">
          <RefreshCw className="animate-spin text-(--admin-accent)" size={20} />
          <span>Đang nạp dữ liệu trang Hợp tác &amp; Đào tạo từ hệ thống...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header trang quản trị */}
      <AdminPageHeader
        badge="Live API"
        title="Quản trị Trang Hợp tác & Đào tạo"
        subtitle="Tùy biến tiêu đề banner, số liệu thống kê, cấu hình động form đăng ký (FormBuilder) và chọn lọc các khóa đào tạo giới thiệu ngoài website."
        actions={
          <AdminButton
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={loadData}
          >
            Làm mới
          </AdminButton>
        }
      />

      {/* Tabs navigation */}
      <AdminTabs
        tabs={adminTrainingTabs}
        activeTab={activeTab.id}
        onChange={(id) => {
          const tab = adminTrainingTabs.find((t) => t.id === id);
          if (tab) selectTab(tab);
        }}
      />

      {/* Tab Panels */}
      <div>
        {/* Tab 1: Header */}
        <div
          id="training-panel-header"
          role="tabpanel"
          aria-labelledby="training-tab-header"
          hidden={activeTab.id !== 'header'}
        >
          {activeTab.id === 'header' && (
            <TrainingHeaderEditor
              key={`header-${trainingData?.id || 'default'}`}
              initialData={trainingData?.props?.header_section}
              onSave={handleSaveHeader}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Tab 2: Models section */}
        <div
          id="training-panel-models"
          role="tabpanel"
          aria-labelledby="training-tab-models"
          hidden={activeTab.id !== 'models'}
        >
          {activeTab.id === 'models' && (
            <TrainingModelsEditor
              key={`models-${trainingData?.id || 'default'}`}
              initialData={trainingData?.props?.models_section}
              onSave={handleSaveModels}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Tab 3: Certification section */}
        <div
          id="training-panel-certification"
          role="tabpanel"
          aria-labelledby="training-tab-certification"
          hidden={activeTab.id !== 'certification'}
        >
          {activeTab.id === 'certification' && (
            <TrainingCertificationEditor
              key={`cert-${trainingData?.id || 'default'}`}
              initialData={trainingData?.props?.certification_section}
              onSave={handleSaveCertification}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Tab 4: Form Đăng ký / Đề xuất */}
        <div
          id="training-panel-proposal"
          role="tabpanel"
          aria-labelledby="training-tab-proposal"
          hidden={activeTab.id !== 'proposal'}
        >
          {activeTab.id === 'proposal' && (
            <TrainingProposalEditor
              key={`proposal-${trainingData?.id || 'default'}`}
              initialData={trainingData?.props?.proposal_section}
              onSave={handleSaveProposal}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Tab 5: Khóa học hiển thị (Chọn lọc) */}
        <div
          id="training-panel-trainings"
          role="tabpanel"
          aria-labelledby="training-tab-trainings"
          hidden={activeTab.id !== 'trainings'}
        >
          {activeTab.id === 'trainings' && (
            <TrainingSelector
              key={`selector-${trainingData?.id || 'default'}`}
              initialSelectedIds={trainingData?.props?.selected_training_ids}
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
