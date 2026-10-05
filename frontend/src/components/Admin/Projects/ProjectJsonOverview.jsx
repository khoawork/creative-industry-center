import React, { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';

export default function ProjectJsonOverview({ projectData }) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(projectData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const headerStatsCount = projectData?.props?.header_section?.statistics?.length || 0;
  const proposalBenefitsCount = projectData?.props?.proposal_section?.benefits?.length || 0;

  return (
    <div className="space-y-6">
      {/* Metadata cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
          <span className="text-xs text-gray-500 font-medium block">Trang &amp; Mã định danh</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-(--admin-title)">{projectData?.name || 'Dự án nổi bật'}</span>
            <span className="text-xs font-mono font-bold text-(--admin-heading) bg-gray-100 px-2 py-0.5 rounded">
              ID: {projectData?.id || 5}
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-1 block">Slug: /{projectData?.slug || 'projects'}</span>
        </div>

        <div className="p-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
          <span className="text-xs text-gray-500 font-medium block">Cấu hình Header</span>
          <div className="mt-1 text-lg font-bold text-(--admin-title)">
            {headerStatsCount} số liệu thống kê
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Đang hoạt động</span>
        </div>

        <div className="p-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
          <span className="text-xs text-gray-500 font-medium block">Khối Đề xuất (CTA)</span>
          <div className="mt-1 text-lg font-bold text-(--admin-title)">
            {proposalBenefitsCount} cam kết hỗ trợ
          </div>
          <span className="text-xs text-gray-400 mt-1 block">Tích hợp form nộp hồ sơ</span>
        </div>

        <div className="p-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
          <span className="text-xs text-gray-500 font-medium block">Lần cập nhật gần nhất</span>
          <div className="mt-1 text-xs font-mono text-(--admin-title) truncate font-semibold">
            {projectData?.updated_date ? new Date(projectData.updated_date).toLocaleString('vi-VN') : 'Mặc định'}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Tự động đồng bộ</span>
        </div>
      </div>

      {/* JSON Viewer Card */}
      <div className="rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-(--admin-border) bg-(--admin-background)">
          <div className="flex items-center gap-2">
            <Code size={16} className="text-(--admin-heading)" />
            <span className="text-xs font-bold text-(--admin-heading) uppercase tracking-wider">
              Dữ liệu JSON thô (Page Props &amp; Sections)
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs font-semibold text-(--admin-title) hover:bg-gray-100 transition shadow-xs"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-600">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Sao chép JSON</span>
              </>
            )}
          </button>
        </div>

        <div className="p-5 bg-[#1e1e1e] overflow-x-auto max-h-[500px]">
          <pre className="text-xs font-mono text-[#d4d4d4] leading-relaxed select-all">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
}
