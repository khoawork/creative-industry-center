import React from "react";
import { Plus, Trash2, Layout, Sparkles } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3.5 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-[var(--admin-heading)] mb-1.5";

export default function RecordHeaderEditor({ data = {}, onChange }) {
  const header = {
    title: "",
    subtitle: "",
    icon: "",
    slogan: "",
    metrics: [],
    ...data,
  };

  const handleFieldChange = (field, value) => {
    onChange({ ...header, [field]: value });
  };

  const handleMetricChange = (index, key, value) => {
    const updated = [...(header.metrics || [])];
    updated[index] = { ...updated[index], [key]: value };
    handleFieldChange("metrics", updated);
  };

  const handleAddMetric = () => {
    const updated = [...(header.metrics || []), { label: "", value: "" }];
    handleFieldChange("metrics", updated);
  };

  const handleRemoveMetric = (index) => {
    const updated = (header.metrics || []).filter((_, i) => i !== index);
    handleFieldChange("metrics", updated);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-[var(--admin-border)] pb-4 mb-5">
          <span className="p-2 rounded-lg bg-[var(--admin-accent)]/10 text-[var(--admin-heading)]">
            <Layout size={18} />
          </span>
          <div>
            <h3 className="text-base font-bold text-[var(--admin-title)]">
              Cấu hình Header &amp; Tiêu đề trang
            </h3>
            <p className="text-xs text-gray-500">
              Chỉnh sửa thông tin biểu ngữ chính, khẩu hiệu và các chỉ số thống kê
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={labelClass}>Tiêu đề chính (Title) *</label>
            <input
              type="text"
              value={header.title || ""}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="VD: HỆ THỐNG ĐỀ CỬ KỶ LỤC & TÔN VINH DANH HIỆU"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tiêu đề phụ / Huy hiệu (Subtitle)</label>
            <input
              type="text"
              value={header.subtitle || ""}
              onChange={(e) => handleFieldChange("subtitle", e.target.value)}
              placeholder="VD: CỔNG THÔNG TIN ĐỀ CỬ KỶ LỤC QUỐC GIA"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Icon nền / biểu tượng</label>
            <input
              type="text"
              value={header.icon || ""}
              onChange={(e) => handleFieldChange("icon", e.target.value)}
              placeholder="VD: military_tech, workspace_premium, flare"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Khẩu hiệu / Slogan</label>
            <textarea
              rows={2}
              value={header.slogan || ""}
              onChange={(e) => handleFieldChange("slogan", e.target.value)}
              placeholder="VD: Tôn vinh trí tuệ — Ghi nhận cống hiến — Xác lập giá trị trường tồn"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Sparkles size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-title)]">
                Chỉ số thống kê (Metrics)
              </h3>
              <p className="text-xs text-gray-500">
                Các con số nổi bật hiển thị ở góc phải banner header
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddMetric}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--admin-accent)] text-white hover:opacity-90 transition cursor-pointer"
          >
            <Plus size={14} /> Thêm chỉ số
          </button>
        </div>

        <div className="space-y-3">
          {(header.metrics || []).length === 0 ? (
            <p className="text-center py-6 text-xs text-gray-400 italic">
              Chưa có chỉ số nào. Bấm "Thêm chỉ số" để tạo mới.
            </p>
          ) : (
            (header.metrics || []).map((metric, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)]"
              >
                <div className="w-1/3">
                  <input
                    type="text"
                    value={metric.value || ""}
                    onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                    placeholder="Giá trị (VD: 05, 100%)"
                    className={inputClass}
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={metric.label || ""}
                    onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                    placeholder="Nhãn (VD: HẠNG MỤC ĐỀ CỬ)"
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMetric(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                  title="Xóa chỉ số"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
