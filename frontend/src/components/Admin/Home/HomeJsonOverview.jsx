import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Code } from 'lucide-react';

export default function HomeJsonOverview({ homeData }) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(homeData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const heroStatsCount = homeData?.props?.hero_section?.statistics?.length || 0;
  const heroButtonsCount = homeData?.props?.hero_section?.buttons?.length || 0;
  const aboutValuesCount = homeData?.props?.about_section?.core_values?.length || 0;
  const navSectionsCount = homeData?.props?.nav_sections?.length || 0;

  return (
    <div className="space-y-6">
      {/* Metadata cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
          <span className="text-xs text-gray-500 font-medium block">Trang &amp; Mã định danh</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-(--admin-title)">{homeData?.name || 'Trang chủ'}</span>
            <span className="text-xs font-mono font-bold text-(--admin-heading) bg-gray-100 px-2 py-0.5 rounded">
              ID: {homeData?.id || 1}
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-1 block">Slug: /{homeData?.slug || 'home'}</span>
        </div>

        <div className="p-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
          <span className="text-xs text-gray-500 font-medium block">Cấu hình Hero</span>
          <div className="mt-1 text-lg font-bold text-(--admin-title)">
            {heroButtonsCount} nút • {heroStatsCount} số liệu
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Đang hoạt động</span>
        </div>

        <div className="p-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
          <span className="text-xs text-gray-500 font-medium block">Về chúng tôi &amp; Chuyên mục</span>
          <div className="mt-1 text-lg font-bold text-(--admin-title)">
            {aboutValuesCount} giá trị • {navSectionsCount} chuyên mục
          </div>
          <span className="text-xs text-gray-400 mt-1 block">Đầy đủ cấu trúc DTO</span>
        </div>

        <div className="p-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
          <span className="text-xs text-gray-500 font-medium block">Lần cập nhật gần nhất</span>
          <div className="mt-1 text-xs font-mono text-(--admin-title) truncate font-semibold">
            {homeData?.updated_date ? new Date(homeData.updated_date).toLocaleString('vi-VN') : 'Mặc định'}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Tự động đồng bộ</span>
        </div>
      </div>

      {/* JSON Viewer Card */}
      <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] rounded-xl overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-(--admin-border)">
          <div className="flex items-center gap-2">
            <Code size={18} className="text-(--admin-heading)" />
            <div>
              <h3 className="text-sm font-bold text-(--admin-title)">
                Cấu trúc dữ liệu hoàn chỉnh (HomeResponse Schema)
              </h3>
              <p className="text-xs text-gray-500">
                Toàn bộ payload JSON của trang chủ đồng bộ với backend Flask &amp; Marshmallow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-(--admin-border) text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép JSON'}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-(--admin-hover) text-(--admin-hover-text) text-xs font-semibold hover:opacity-90 transition"
            >
              <ExternalLink size={14} />
              <span>Xem trang chủ thực tế</span>
            </a>
          </div>
        </div>

        <div className="p-4 bg-[#111827] text-gray-100 overflow-x-auto text-xs font-mono max-h-[500px] [scrollbar-width:thin]">
          <pre>{jsonString}</pre>
        </div>
      </div>
    </div>
  );
}
