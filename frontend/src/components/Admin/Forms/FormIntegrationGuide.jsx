import React from 'react';
import {
  Code2,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  Database,
  FileSpreadsheet,
  Globe,
} from 'lucide-react';

export default function FormIntegrationGuide({
  formConfig,
  botEmail,
  sheetUrl,
}) {
  if (!formConfig) return null;

  return (
    <div className="space-y-4">
      {/* Sơ đồ luồng hoạt động */}
      <div className="p-4.5 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-2xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-(--admin-heading) flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-amber-500" />
          Sơ đồ đồng bộ dữ liệu tự động
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Bước 1 */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 space-y-1.5">
            <div className="flex items-center gap-2 text-(--admin-heading) font-bold">
              <Globe className="w-4 h-4" />
              <span>1. Người dùng gửi Form</span>
            </div>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Khách truy cập điền form tại trang <strong className="text-gray-900 font-mono">{formConfig.pagePath}</strong>. Component frontend gọi hàm <code className="bg-gray-200/70 px-1 py-0.5 rounded font-mono text-[10px]">submitFormToBackend()</code>.
            </p>
          </div>

          {/* Bước 2 */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold">
              <Database className="w-4 h-4" />
              <span>2. Backend tiếp nhận &amp; Lưu trữ</span>
            </div>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Flask API xác thực dữ liệu, tự động lưu 1 bản sao dự phòng vào cơ sở dữ liệu hệ thống (Form Submissions).
            </p>
          </div>

          {/* Bước 3 */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <FileSpreadsheet className="w-4 h-4" />
              <span>3. Ghi vào Google Sheet</span>
            </div>
            <p className="text-emerald-700 text-[11px] leading-relaxed">
              Google Service Account tự động ghi 1 hàng mới vào đúng Tab <strong className="font-mono text-emerald-950 font-bold">&quot;{formConfig.sheetName}&quot;</strong> trên Google Sheet đã liên kết.
            </p>
          </div>
        </div>
      </div>

      {/* Thông số kỹ thuật của biểu mẫu */}
      <div className="p-4.5 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-2xs space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-(--admin-heading) flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          Thông số kỹ thuật &amp; Mã nguồn
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-[11px] text-gray-500 block">Mã định danh (Form ID)</span>
            <span className="font-mono font-bold text-gray-900 text-xs">{formConfig.id}</span>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-[11px] text-gray-500 block">Trang hiển thị ngoài web</span>
            <span className="font-mono font-bold text-indigo-600 text-xs">{formConfig.pagePath}</span>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-[11px] text-gray-500 block">Component React</span>
            <span className="font-mono font-bold text-amber-700 text-xs">{formConfig.componentName || 'Form'}</span>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-[11px] text-gray-500 block">Tab Google Sheet đích</span>
            <span className="font-mono font-bold text-emerald-700 text-xs">{formConfig.sheetName}</span>
          </div>
        </div>
      </div>

      {/* Lưu ý quyền truy cập */}
      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-amber-950">Lưu ý phân quyền Google Sheet:</h5>
          <p className="text-[11px] leading-relaxed text-amber-900/90">
            Để hệ thống có quyền ghi dữ liệu vào Sheet, hãy chắc chắn bạn đã chia sẻ quyền <strong>Người chỉnh sửa (Editor)</strong> cho email Bot:
            <br />
            <code className="font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-amber-300 text-amber-950 inline-block mt-1 select-all">
              {botEmail}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
