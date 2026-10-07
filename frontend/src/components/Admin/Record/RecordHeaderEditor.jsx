import React from "react";
import { Plus, Trash2, Layout, Sparkles } from "lucide-react";
import { AdminCard, AdminButton, AdminInput } from "../Common";

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
      <AdminCard
        title="Cấu hình Header & Tiêu đề trang"
        subtitle="Chỉnh sửa thông tin biểu ngữ chính, khẩu hiệu và các chỉ số thống kê của trang Đề cử Kỷ lục."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <AdminInput
              label="Tiêu đề chính (Title) *"
              value={header.title || ""}
              onChange={(e) => handleFieldChange("title", e?.target?.value ?? e)}
              placeholder="VD: KHÔNG GIAN TÔN VINH VÀ THÚC ĐẨY CÁC GIÁ TRỊ KỶ LỤC SÁNG TẠO"
              required
            />
          </div>

          <div>
            <AdminInput
              label="Nhãn phụ / Badge (Subtitle)"
              value={header.subtitle || ""}
              onChange={(e) => handleFieldChange("subtitle", e?.target?.value ?? e)}
              placeholder="VD: VIỆN KỶ LỤC VIỆT NAM — VIETKINGS"
            />
          </div>

          <div>
            <AdminInput
              label="Biểu tượng Icon (Lucide Icon Name)"
              value={header.icon || ""}
              onChange={(e) => handleFieldChange("icon", e?.target?.value ?? e)}
              placeholder="VD: Trophy, Award, Sparkles"
            />
          </div>

          <div className="md:col-span-2">
            <AdminInput
              label="Khẩu hiệu / Slogan chính"
              multiline
              rows={3}
              value={header.slogan || ""}
              onChange={(e) => handleFieldChange("slogan", e?.target?.value ?? e)}
              placeholder="VD: Cơ quan nghiên cứu, thẩm định và bảo trợ chính thức các sáng kiến kỷ lục quốc gia..."
            />
          </div>
        </div>
      </AdminCard>

      {/* Metrics Section */}
      <AdminCard
        title="Chỉ số thống kê (Metrics)"
        subtitle="Các con số nổi bật hiển thị ở góc phải banner header."
        actions={
          <AdminButton
            type="button"
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleAddMetric}
          >
            Thêm chỉ số
          </AdminButton>
        }
      >
        <div className="space-y-3">
          {(header.metrics || []).length === 0 ? (
            <div className="p-6 text-center text-xs text-(--admin-ink)/60 italic border border-dashed border-(--admin-border) rounded-xl">
              Chưa có chỉ số nào. Bấm "Thêm chỉ số" để tạo mới.
            </div>
          ) : (
            (header.metrics || []).map((metric, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-(--admin-background) border border-(--admin-border)"
              >
                <div className="w-1/3">
                  <input
                    type="text"
                    value={metric.value || ""}
                    onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                    placeholder="Giá trị (VD: 05, 100%)"
                    className="w-full rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs font-bold text-(--admin-ink) focus:outline-hidden focus:border-(--admin-accent)"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={metric.label || ""}
                    onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                    placeholder="Nhãn (VD: HẠNG MỤC ĐỀ CỬ)"
                    className="w-full rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs text-(--admin-ink) focus:outline-hidden focus:border-(--admin-accent)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMetric(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                  title="Xóa chỉ số"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </AdminCard>
    </div>
  );
}
