import React, { useState } from 'react';
import {
  Mail,
  UserCheck,
  UsersRound,
  GraduationCap,
  MessageSquareText,
  Award,
  Sparkles,
  Lightbulb,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react';
import { formatRelativeTime } from '../../../services/googleSheetService.js';

// Bộ icon đại diện cho từng loại form
const FORM_ICONS = {
  event_newsletter: Mail,
  event_registration: UserCheck,
  forum_registration: UsersRound,
  training_registration: GraduationCap,
  contact_feedback: MessageSquareText,
  record_nomination: Award,
  founder_story_submission: Sparkles,
  project_proposal: Lightbulb,
};

export default function FormListSidebar({
  forms = [],
  activeFormId,
  onSelectForm,
  allConfigs = {},
  sharedSheetUrl = '',
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredForms = forms.filter((form) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      form.title?.toLowerCase().includes(term) ||
      form.id?.toLowerCase().includes(term) ||
      form.sheetName?.toLowerCase().includes(term) ||
      form.pagePath?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col h-full bg-(--admin-surface) rounded-2xl border border-(--admin-border) shadow-2xs overflow-hidden">
      {/* Header Sidebar */}
      <div className="p-4 border-b border-(--admin-border) bg-gray-50/70">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-(--admin-heading) flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-(--admin-heading)" />
            Danh Sách Biểu Mẫu ({forms.length})
          </h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {Object.values(allConfigs).filter((c) => c.sheetUrl || sharedSheetUrl).length}/{forms.length} Đã liên kết
          </span>
        </div>

        {/* Ô tìm kiếm form nhanh */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên form, tab sheet..."
            className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-white placeholder-gray-400 focus:outline-hidden focus:border-(--admin-heading) transition"
          />
        </div>
      </div>

      {/* Danh sách các biểu mẫu */}
      <div className="p-2.5 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] sm:max-h-[640px]">
        {filteredForms.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400">
            Không tìm thấy biểu mẫu phù hợp với từ khóa &quot;{searchTerm}&quot;
          </div>
        ) : (
          filteredForms.map((item) => {
            const isActive = activeFormId === item.id;
            const IconComponent = FORM_ICONS[item.id] || FileSpreadsheet;
            const cfg = allConfigs[item.id] || item;
            const fieldCount = cfg.fields?.length || item.fields?.length || 0;
            const targetSheet = cfg.sheetName || item.sheetName;
            const hasSheet = Boolean(cfg.sheetUrl || sharedSheetUrl);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectForm(item.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group relative ${
                  isActive
                    ? 'border-(--admin-heading) bg-(--admin-heading)/5 ring-2 ring-(--admin-heading)/20 shadow-xs'
                    : 'border-transparent hover:border-gray-200 hover:bg-gray-50/80 bg-white'
                }`}
              >
                {/* Icon biểu mẫu */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-(--admin-heading) text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-(--admin-heading)/10 group-hover:text-(--admin-heading)'
                  }`}
                >
                  <IconComponent className="w-4.5 h-4.5" />
                </div>

                {/* Thông tin form */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold line-clamp-1 ${
                        isActive ? 'text-(--admin-heading)' : 'text-(--admin-title)'
                      }`}
                    >
                      {item.title}
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isActive ? 'text-(--admin-heading) translate-x-0.5' : 'text-gray-300'
                      }`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {/* Badge vị trí trang web */}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200/80">
                      {item.pagePath}
                    </span>

                    {/* Badge tên tab Google Sheet */}
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200/70">
                      Tab: {targetSheet}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100/80 text-[10px]">
                    <span className="text-gray-400">{fieldCount} trường nhập liệu</span>
                    {cfg.lastSyncedAt ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold" title={`Đồng bộ lúc: ${new Date(cfg.lastSyncedAt).toLocaleString('vi-VN')}`}>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Đã sync ({formatRelativeTime(cfg.lastSyncedAt)})</span>
                      </span>
                    ) : hasSheet ? (
                      <span className="text-amber-600 font-medium">Chưa sync tab</span>
                    ) : (
                      <span className="text-gray-400 italic">Chưa dán URL</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer gợi ý */}
      <div className="p-3 border-t border-(--admin-border) bg-gray-50/50 text-[11px] text-gray-500">
        💡 <span className="font-semibold text-gray-700">Mẹo:</span> Chỉ cần dán 1 link Google Sheet duy nhất, toàn bộ biểu mẫu sẽ tự động dùng chung file và chia tab riêng biệt.
      </div>
    </div>
  );
}
