import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Eye,
  ExternalLink,
  Layers,
} from 'lucide-react';

import EventNewsletterPreview from './EventNewsletterPreview.jsx';
import EventRegisterPreview from './EventRegisterPreview.jsx';
import TrainingRegisterPreview from './TrainingRegisterPreview.jsx';
import ContactFeedbackPreview from './ContactFeedbackPreview.jsx';
import RecordNominationPreview from './RecordNominationPreview.jsx';
import FounderStoryPreview from './FounderStoryPreview.jsx';
import ProjectProposalPreview from './ProjectProposalPreview.jsx';
import DynamicFormRenderer from '../../../shared/DynamicFormRenderer.jsx';

export default function FormPreviewContainer({
  formConfig,
}) {
  const [deviceView, setDeviceView] = useState('desktop'); // 'desktop' | 'mobile'
  const [previewMode, setPreviewMode] = useState('dynamic'); // 'dynamic' | 'legacy'

  if (!formConfig) return null;

  // Lựa chọn component preview tương ứng với formId (Legacy)
  const renderLegacyPreviewContent = () => {
    switch (formConfig.id) {
      case 'event_newsletter':
        return <EventNewsletterPreview config={formConfig} />;
      case 'event_registration':
      case 'forum_registration':
        return <EventRegisterPreview config={formConfig} />;
      case 'training_registration':
        return <TrainingRegisterPreview config={formConfig} />;
      case 'contact_feedback':
        return <ContactFeedbackPreview config={formConfig} />;
      case 'record_nomination':
        return <RecordNominationPreview config={formConfig} />;
      case 'founder_story_submission':
        return <FounderStoryPreview config={formConfig} />;
      case 'project_proposal':
        return <ProjectProposalPreview config={formConfig} />;
      default:
        return <EventNewsletterPreview config={formConfig} />;
    }
  };

  const renderPreviewContent = () => {
    if (previewMode === 'dynamic') {
      return <DynamicFormRenderer config={formConfig} preview={true} />;
    }
    return renderLegacyPreviewContent();
  };

  return (
    <div className="space-y-4">
      {/* Thanh công cụ điều khiển Preview */}
      <div className="p-3.5 rounded-xl border border-(--admin-border) bg-(--admin-surface) flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-(--admin-heading)" />
          <span className="text-xs font-bold text-(--admin-title)">
            Giao Diện Mẫu Ban Đầu Của Biểu Mẫu Ngoài Website
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
            {formConfig.pagePath}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Chuyển đổi Dynamic / Legacy */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setPreviewMode('dynamic')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                previewMode === 'dynamic'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Cấu hình động (Thực tế)
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('legacy')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                previewMode === 'legacy'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Giao diện gốc
            </button>
          </div>

          {/* Chuyển đổi Desktop / Mobile */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                deviceView === 'desktop'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                deviceView === 'mobile'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>
        </div>
      </div>

      {/* Khung hiển thị giao diện xem trước */}
      <div className="p-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 flex items-center justify-center min-h-[380px]">
        <div
          className={`transition-all duration-300 w-full ${
            deviceView === 'mobile'
              ? 'max-w-sm rounded-3xl p-3 bg-gray-900 shadow-2xl border-4 border-gray-800'
              : 'max-w-3xl'
          }`}
        >
          {deviceView === 'mobile' && (
            <div className="w-20 h-4 bg-gray-800 rounded-full mx-auto mb-3"></div>
          )}
          <div className={deviceView === 'mobile' ? 'rounded-2xl overflow-hidden' : ''}>
            {renderPreviewContent()}
          </div>
        </div>
      </div>

      {/* Chú thích thông tin */}
      <div className="text-center text-[11px] text-gray-400">
        📌 Đây là giao diện mẫu tiêu chuẩn của component <span className="font-mono text-gray-600 font-semibold">{formConfig.componentName}</span> khi hiển thị tới người dùng tại trang <span className="font-mono text-gray-600 font-semibold">{formConfig.pagePath}</span>.
      </div>
    </div>
  );
}
