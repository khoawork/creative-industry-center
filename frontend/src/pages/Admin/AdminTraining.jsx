import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Layers,
  ShieldCheck,
  GraduationCap,
  RefreshCw,
} from 'lucide-react';
import { TrainingPageAPI } from '../../api/trainingPageApi.js';
import {
  TrainingHeaderEditor,
  TrainingModelsEditor,
  TrainingCertificationEditor,
  TrainingSelector,
} from '../../components/Admin/Training';

const adminTrainingTabs = [
  { id: 'header', label: 'Header & Giới thiệu', icon: Sparkles },
  { id: 'models', label: 'Mô hình hợp tác', icon: Layers },
  { id: 'certification', label: 'Cam kết & Chứng nhận', icon: ShieldCheck },
  { id: 'trainings', label: 'Khóa học hiển thị (Chọn lọc)', icon: GraduationCap },
];




export default function AdminTraining() {
  const [activeTab, setActiveTab] = useState(adminTrainingTabs[0]);
  const [trainingData, setTrainingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
      alert('Không thể kết nối đến máy chủ để tải dữ liệu trang Hợp tác & Đào tạo.');
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
      alert('Cập nhật phần Header thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu Header:', error);
      alert('Có lỗi xảy ra khi lưu Header lên hệ thống.');
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
      alert('Cập nhật phần Mô hình hợp tác thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu Mô hình hợp tác:', error);
      alert('Có lỗi xảy ra khi lưu Mô hình hợp tác lên hệ thống.');
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
      alert('Cập nhật phần Cam kết & Chứng nhận thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu Cam kết & Chứng nhận:', error);
      alert('Có lỗi xảy ra khi lưu Cam kết & Chứng nhận lên hệ thống.');
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
      alert('Cập nhật danh sách khóa đào tạo hiển thị thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu danh sách khóa đào tạo hiển thị:', error);
      alert('Có lỗi xảy ra khi lưu danh sách khóa đào tạo hiển thị.');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--admin-border) pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-(--admin-title)">
              Quản trị Trang Hợp tác &amp; Đào tạo
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Sparkles size={12} /> Live API
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-(--admin-heading)">
            Tùy biến tiêu đề banner, số liệu thống kê, cấu hình động form đăng ký (FormBuilder) và chọn lọc các khóa đào tạo giới thiệu ngoài website
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
        </div>
      </div>

      {/* Tabs navigation */}
      <div
        role="tablist"
        aria-label="Cấu hình trang Hợp tác & Đào tạo"
        className="flex border-b border-(--admin-border) overflow-x-auto gap-2"
      >
        {adminTrainingTabs.map((tab, index) => {
          const isSelected = activeTab.id === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              role="tab"
              id={`training-tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`training-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => selectTab(tab)}
              onKeyDown={(event) => {
                let nextIndex = index;
                if (event.key === 'ArrowRight') {
                  nextIndex = (index + 1) % adminTrainingTabs.length;
                } else if (event.key === 'ArrowLeft') {
                  nextIndex = (index - 1 + adminTrainingTabs.length) % adminTrainingTabs.length;
                } else if (event.key === 'Home') nextIndex = 0;
                else if (event.key === 'End') nextIndex = adminTrainingTabs.length - 1;
                else return;
                event.preventDefault();
                selectTab(adminTrainingTabs[nextIndex]);
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

        {/* Tab 4: Khóa học hiển thị (Chọn lọc) */}
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
    </div>
  );
}
