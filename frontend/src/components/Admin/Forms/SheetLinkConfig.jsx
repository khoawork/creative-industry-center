import React from 'react';
import {
  Link,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Share2,
  Copy,
  Check,
  FileSpreadsheet,
  Clock,
  Zap,
} from 'lucide-react';
import { formatRelativeTime } from '../../../services/googleSheetService.js';

export default function SheetLinkConfig({
  sheetUrl = '',
  sheetName = '',
  lastSyncedAt = null,
  onUpdateSheetUrl,
  onUpdateSheetName,
  onSync,
  isSyncing = false,
  syncResult = null,
  onSyncAll,
  isSyncingAll = false,
  syncAllResults = null,
  botEmail = '',
  isEmailCopied = false,
  onCopyBotEmail,
  applyToAllForms = true,
  onToggleApplyToAll,
  totalForms = 0,
}) {
  const isAlreadySynced = Boolean(lastSyncedAt);

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-(--admin-border) bg-(--admin-surface) space-y-4 shadow-2xs">
      {/* Header khu vực liên kết */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--admin-border)/60 pb-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--admin-heading)">
          <Link className="w-4 h-4" />
          <span>Liên kết Google Sheet &amp; Quản Lý Đồng Bộ</span>
        </div>

        {/* Email bot copy nhanh */}
        <div className="flex items-center gap-2 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs text-amber-900">
          <Share2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="text-[11px]">Email Bot cần Share:</span>
          <code className="font-mono text-[11px] font-semibold select-all text-amber-950">
            {botEmail}
          </code>
          <button
            type="button"
            onClick={onCopyBotEmail}
            className="ml-1 text-[11px] font-bold text-(--admin-heading) hover:underline cursor-pointer flex items-center gap-0.5"
          >
            {isEmailCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {isEmailCopied ? 'Đã copy' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Trạng thái đã từng đồng bộ hay chưa */}
      <div
        className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
          isAlreadySynced
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isAlreadySynced ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          ) : (
            <Clock className="w-4.5 h-4.5 text-amber-600 shrink-0" />
          )}
          <div>
            <span className="font-bold block text-xs">
              {isAlreadySynced
                ? `Đã đồng bộ cấu trúc cột (${formatRelativeTime(lastSyncedAt)})`
                : 'Trang tính này chưa được đồng bộ cấu trúc cột'}
            </span>
            <p className="text-[11px] opacity-80 mt-0.5">
              {isAlreadySynced
                ? 'Tab này đã sẵn sàng. Bạn không cần phải đồng bộ lại, trừ khi muốn đổi tên cột hoặc thêm trường mới.'
                : 'Hãy dán link Google Sheet và bấm đồng bộ 1 lần để hệ thống tạo hàng tiêu đề in đậm.'}
            </p>
          </div>
        </div>

        {lastSyncedAt && (
          <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-white/80 border border-emerald-300 text-emerald-950">
            {new Date(lastSyncedAt).toLocaleString('vi-VN')}
          </span>
        )}
      </div>

      {/* Input Link Sheet, Tên Tab và Nút Đồng bộ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
        {/* Đường dẫn Google Sheet */}
        <div className="md:col-span-6">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Đường dẫn Google Sheet (Dùng chung cho toàn bộ website) *
          </label>
          <input
            type="url"
            value={sheetUrl}
            onChange={(e) => onUpdateSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5.../edit"
            className="w-full px-3 py-2 text-xs sm:text-sm font-mono rounded-lg border border-(--admin-border) bg-white focus:outline-hidden focus:border-(--admin-heading)"
          />
          {onToggleApplyToAll && (
            <label className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={applyToAllForms}
                onChange={(e) => onToggleApplyToAll(e.target.checked)}
                className="rounded text-(--admin-heading) focus:ring-(--admin-heading)"
              />
              <span>Dùng chung link Google Sheet này cho tất cả các biểu mẫu</span>
            </label>
          )}
        </div>

        {/* Tên Tab Trang Tính */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Tên Trang tính (Tab trong Sheet) *
          </label>
          <input
            type="text"
            value={sheetName}
            onChange={(e) => onUpdateSheetName(e.target.value)}
            placeholder="DangKySuKien hoặc SuKien"
            className="w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-(--admin-border) bg-white focus:outline-hidden focus:border-(--admin-heading)"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Ghi vào Tab: <span className="font-mono font-bold text-(--admin-heading)">&quot;{sheetName || 'DangKySuKien'}&quot;</span>
          </p>
        </div>

        {/* Nút Đồng bộ Cột Tab hiện tại */}
        <div className="md:col-span-3">
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing || !sheetUrl}
            className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition cursor-pointer disabled:opacity-40 shadow-xs ${
              isAlreadySynced
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                : 'bg-(--admin-heading) hover:opacity-90 text-white'
            }`}
            title={`Tạo hoặc cập nhật cấu trúc tab "${sheetName}"`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>
              {isSyncing
                ? `Đang tạo tab "${sheetName}"...`
                : isAlreadySynced
                ? `Đồng bộ lại tab "${sheetName}"`
                : `Đồng bộ Tab "${sheetName}"`}
            </span>
          </button>
        </div>
      </div>

      {/* Nút đồng bộ toàn bộ các tab (1 lần duy nhất) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>Đồng bộ 1 lần duy nhất cho toàn bộ {totalForms} biểu mẫu</span>
          </div>
          <p className="text-[11px] text-amber-900/80">
            Tự động khởi tạo toàn bộ {totalForms} trang tính tương ứng trong Google Sheet chỉ với 1 cú click. Sau đó không cần đồng bộ lại nữa.
          </p>
        </div>

        <button
          type="button"
          onClick={onSyncAll}
          disabled={isSyncingAll || !sheetUrl}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition cursor-pointer disabled:opacity-40"
        >
          <Zap className="w-3.5 h-3.5 fill-white" />
          <span>{isSyncingAll ? `Đang tạo ${totalForms} tab...` : `⚡ Đồng bộ tất cả ${totalForms} tab (1 lần duy nhất)`}</span>
        </button>
      </div>

      {/* Thông báo kết quả đồng bộ */}
      {(syncResult || syncAllResults) && (
        <div
          className={`p-3.5 rounded-lg text-xs space-y-1.5 ${
            (syncResult?.success || syncAllResults?.success)
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold text-xs">
                {syncAllResults?.message || syncResult?.message}
              </span>
            </div>

            {sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold underline hover:opacity-80 shrink-0 text-(--admin-heading)"
              >
                <ExternalLink className="w-3 h-3" />
                Mở Google Sheet kiểm tra
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
