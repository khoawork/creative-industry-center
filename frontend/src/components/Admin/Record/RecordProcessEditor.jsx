import React from "react";
import { ListOrdered, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3.5 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-[var(--admin-heading)] mb-1.5";

export default function RecordProcessEditor({ data = {}, onChange }) {
  const process = {
    title: "",
    subtitle: "",
    description: "",
    ...data,
  };

  const handleFieldChange = (field, value) => {
    onChange({ ...process, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-[var(--admin-border)] pb-4 mb-5">
          <span className="p-2 rounded-lg bg-sky-500/10 text-sky-500">
            <ListOrdered size={18} />
          </span>
          <div>
            <h3 className="text-base font-bold text-[var(--admin-title)]">
              Quy trình 4 bước thẩm định &amp; xác lập kỷ lục
            </h3>
            <p className="text-xs text-gray-500">
              Cấu hình tiêu đề và mô tả quy trình tiếp nhận hồ sơ công khai
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Nhãn phụ (Title badge)</label>
            <input
              type="text"
              value={process.title || ""}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="VD: QUY TRÌNH CHUẨN HÓA"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tiêu đề chính (Subtitle heading)</label>
            <input
              type="text"
              value={process.subtitle || ""}
              onChange={(e) => handleFieldChange("subtitle", e.target.value)}
              placeholder="VD: QUY TRÌNH 4 BƯỚC THẨM ĐỊNH & XÁC LẬP ĐỀ CỬ KỶ LỤC"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Mô tả tóm tắt quy trình</label>
            <textarea
              rows={3}
              value={process.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Đảm bảo tính pháp lý, độc lập tuyệt đối và đánh giá giá trị sáng tạo theo quy chế Viện Kỷ lục Việt Nam..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* 4 bước chuẩn hóa cố định preview */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xs">
        <h4 className="text-sm font-bold text-[var(--admin-title)] mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-500" /> 4 Bước thẩm định theo quy chuẩn Viện Kỷ lục
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)] space-y-1.5">
            <span className="font-bold text-amber-500 text-sm block">Bước 01</span>
            <div className="font-bold text-[var(--admin-title)]">Nộp Hồ Sơ Sơ Khảo</div>
            <p className="text-gray-400">Tiếp nhận hồ sơ đề cử, văn bằng SHTT và báo cáo minh chứng.</p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)] space-y-1.5">
            <span className="font-bold text-sky-500 text-sm block">Bước 02</span>
            <div className="font-bold text-[var(--admin-title)]">HĐ Khoa Học Thẩm Định</div>
            <p className="text-gray-400">Hội đồng các Giáo sư họp phiên chuyên đề đánh giá tính xác thực.</p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)] space-y-1.5">
            <span className="font-bold text-indigo-500 text-sm block">Bước 03</span>
            <div className="font-bold text-[var(--admin-title)]">Khảo Sát Thực Địa</div>
            <p className="text-gray-400">Đoàn giám định viên trực tiếp xuống cơ sở kiểm tra thực tế.</p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)] space-y-1.5">
            <span className="font-bold text-emerald-500 text-sm block">Bước 04</span>
            <div className="font-bold text-[var(--admin-title)]">Công Bố &amp; Xác Lập</div>
            <p className="text-gray-400">Ban hành Nghị quyết Vinh danh, trao Bằng chứng nhận và Kỷ niệm chương.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
