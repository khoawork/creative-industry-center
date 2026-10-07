import React, { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Award,
  Scroll,
  Share2,
  ShieldCheck,
  CheckCircle,
  Eye,
  Sliders,
  Send,
  Play,
  Check,
} from "lucide-react";
import {
  AdminCard,
  AdminInput,
  AdminButton,
  AdminBadge,
} from "../Common/index.js";

// Bộ icon biểu tượng cam kết hỗ trợ
const BENEFIT_ICON_OPTIONS = [
  { value: "badge", label: "Huy hiệu Kỷ lục (Award)", icon: Award },
  { value: "scroll", label: "Sở hữu Trí tuệ (Scroll)", icon: Scroll },
  { value: "network", label: "Mạng lưới Chuyên gia (Network)", icon: Share2 },
  { value: "shield", label: "Bảo trợ Pháp lý (Shield)", icon: ShieldCheck },
  { value: "check", label: "Xác thực (Checkmark)", icon: CheckCircle },
];

const DEFAULT_BENEFITS = [
  { icon: "badge", text: "Bảo chứng Kỷ lục Quốc gia" },
  { icon: "scroll", text: "Tư vấn Sở hữu Trí tuệ" },
  { icon: "network", text: "Kết nối Mạng lưới Chuyên gia" },
];

const DEFAULT_FORM_FIELDS = [
  {
    id: "org_name",
    label: "TÊN CƠ QUAN / CHỦ NHIỆM DỰ ÁN",
    placeholder: "Ví dụ: Tập đoàn Công nghệ & Di sản Văn hóa...",
    type: "text",
    required: true,
    width: "full",
  },
  {
    id: "project_name",
    label: "TÊN DỰ ÁN SÁNG TẠO",
    placeholder: "Ví dụ: Khu bảo tồn tương tác nghệ thuật số...",
    type: "text",
    required: true,
    width: "full",
  },
  {
    id: "phone",
    label: "SỐ ĐIỆN THOẠI",
    placeholder: "0987xxxxxx",
    type: "tel",
    required: true,
    width: "half",
  },
  {
    id: "location",
    label: "ĐỊA BÀN TRIỂN KHAI",
    placeholder: "Chọn địa bàn",
    type: "select",
    options: ["Toàn quốc", "Miền Bắc", "Miền Trung", "Miền Nam", "TP. Hồ Chí Minh", "Hà Nội"],
    required: true,
    width: "half",
  },
  {
    id: "collaboration_need",
    label: "NHU CẦU HỢP TÁC",
    placeholder: "Chọn nhu cầu hợp tác",
    type: "select",
    options: [
      "Đề cử xác lập Kỷ lục Quốc gia & Cố vấn chuyên môn",
      "Tư vấn chiến lược & Bảo trợ truyền thông",
      "Đầu tư sản xuất & Thương mại hóa",
      "Kết nối mạng lưới chuyên gia & Nhà khoa học",
    ],
    required: true,
    width: "full",
  },
];

export default function ProjectProposalEditor({
  initialData,
  onSave,
  isSaving,
}) {
  const [formData, setFormData] = useState({
    tag: initialData?.tag || "HỢP TÁC PHÁT TRIỂN & ĐỒNG HÀNH CHIẾN LƯỢC",
    title:
      initialData?.title ||
      "ĐỀ XUẤT DỰ ÁN SÁNG TẠO HOẶC ĐĂNG KÝ ĐỒNG HÀNH CÙNG TRUNG TÂM",
    description:
      initialData?.description ||
      "Bạn là tổ chức, địa phương hay nhà sáng lập sở hữu công trình, giải pháp nghệ thuật hoặc công nghệ đột phá? Hãy nộp hồ sơ để nhận thẩm định chuyên gia, bảo trợ pháp lý và tiếp cận nguồn lực hệ sinh thái Viện Kỷ lục Việt Nam.",
    benefits:
      Array.isArray(initialData?.benefits) && initialData.benefits.length > 0
        ? initialData.benefits.map((b, idx) =>
            typeof b === "string"
              ? {
                  icon: ["badge", "scroll", "network"][idx % 3] || "badge",
                  text: b,
                }
              : { icon: b.icon || "badge", text: b.text || "" }
          )
        : DEFAULT_BENEFITS,
    form_title: initialData?.form_title || "Gửi Đề Xuất Dự Án Mới",
    form_description:
      initialData?.form_description ||
      "Ban Thư ký Hội đồng Khoa học sẽ phản hồi văn bản trong vòng 03 ngày làm việc.",
    button_text: initialData?.button_text || "Gửi Hồ Sơ Dự Án",
    form_fields:
      Array.isArray(initialData?.form_fields) && initialData.form_fields.length > 0
        ? initialData.form_fields
        : DEFAULT_FORM_FIELDS,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        tag: initialData.tag || "HỢP TÁC PHÁT TRIỂN & ĐỒNG HÀNH CHIẾN LƯỢC",
        title:
          initialData.title ||
          "ĐỀ XUẤT DỰ ÁN SÁNG TẠO HOẶC ĐĂNG KÝ ĐỒNG HÀNH CÙNG TRUNG TÂM",
        description:
          initialData.description ||
          "Bạn là tổ chức, địa phương hay nhà sáng lập sở hữu công trình, giải pháp nghệ thuật hoặc công nghệ đột phá? Hãy nộp hồ sơ để nhận thẩm định chuyên gia, bảo trợ pháp lý và tiếp cận nguồn lực hệ sinh thái Viện Kỷ lục Việt Nam.",
        benefits:
          Array.isArray(initialData.benefits) && initialData.benefits.length > 0
            ? initialData.benefits.map((b, idx) =>
                typeof b === "string"
                  ? {
                      icon: ["badge", "scroll", "network"][idx % 3] || "badge",
                      text: b,
                    }
                  : { icon: b.icon || "badge", text: b.text || "" }
              )
            : DEFAULT_BENEFITS,
        form_title: initialData.form_title || "Gửi Đề Xuất Dự Án Mới",
        form_description:
          initialData.form_description ||
          "Ban Thư ký Hội đồng Khoa học sẽ phản hồi văn bản trong vòng 03 ngày làm việc.",
        button_text: initialData.button_text || "Gửi Hồ Sơ Dự Án",
        form_fields:
          Array.isArray(initialData.form_fields) && initialData.form_fields.length > 0
            ? initialData.form_fields
            : DEFAULT_FORM_FIELDS,
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Xử lý an toàn event value
  const getVal = (e) => (e && e.target ? e.target.value : e);

  const validate = () => {
    const errs = {};
    if (!formData.tag?.trim()) errs.tag = "Huy hiệu / Tag là bắt buộc";
    if (!formData.title?.trim()) errs.title = "Tiêu đề kêu gọi là bắt buộc";
    if (!formData.description?.trim())
      errs.description = "Mô tả kêu gọi là bắt buộc";
    if (!formData.form_title?.trim())
      errs.form_title = "Tiêu đề form là bắt buộc";
    if (!formData.form_description?.trim())
      errs.form_description = "Mô tả form là bắt buộc";

    if (!formData.benefits || formData.benefits.length === 0) {
      errs.benefits = "Cần ít nhất 1 cam kết / quyền lợi";
    } else {
      formData.benefits.forEach((item, idx) => {
        if (!item.text?.trim()) {
          errs[`benefit_${idx}`] = "Nội dung quyền lợi không được để trống";
        }
      });
    }

    if (Array.isArray(formData.form_fields)) {
      formData.form_fields.forEach((field, idx) => {
        if (!field.label?.trim()) {
          errs[`field_label_${idx}`] = "Chủ đề / Nhãn ô nhập là bắt buộc";
        }
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setSaveSuccess(false);

    // Chuẩn bị payload tương thích backend
    const payload = {
      tag: formData.tag.trim(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      benefits: formData.benefits,
      form_title: formData.form_title.trim(),
      form_description: formData.form_description.trim(),
      button_text: formData.button_text?.trim() || "Gửi Hồ Sơ Dự Án",
      form_fields: formData.form_fields.map((f, i) => ({
        id: f.id || `field_${i}`,
        label: f.label.trim(),
        placeholder: f.placeholder || "",
        type: f.type || "text",
        options: Array.isArray(f.options) ? f.options : [],
        required: Boolean(f.required),
        width: f.width || "full",
      })),
    };

    await onSave(payload);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Quản lý cam kết / quyền lợi
  const handleAddBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [
        ...prev.benefits,
        { icon: "badge", text: "Cam kết hỗ trợ mới" },
      ],
    }));
  };

  const handleRemoveBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, idx) => idx !== index),
    }));
  };

  const handleBenefitTextChange = (index, value) => {
    setFormData((prev) => {
      const next = [...prev.benefits];
      next[index] = { ...next[index], text: value };
      return { ...prev, benefits: next };
    });
  };

  const handleBenefitIconChange = (index, iconValue) => {
    setFormData((prev) => {
      const next = [...prev.benefits];
      next[index] = { ...next[index], icon: iconValue };
      return { ...prev, benefits: next };
    });
  };

  // Quản lý form fields
  const handleAddField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: "",
      placeholder: "",
      type: "text",
      options: [],
      required: false,
      width: "full",
    };
    setFormData((prev) => ({
      ...prev,
      form_fields: [...prev.form_fields, newField],
    }));
  };

  const handleRemoveField = (index) => {
    setFormData((prev) => ({
      ...prev,
      form_fields: prev.form_fields.filter((_, idx) => idx !== index),
    }));
  };

  const handleMoveField = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= formData.form_fields.length) return;
    const nextFields = [...formData.form_fields];
    const temp = nextFields[index];
    nextFields[index] = nextFields[targetIdx];
    nextFields[targetIdx] = temp;
    setFormData((prev) => ({ ...prev, form_fields: nextFields }));
  };

  const handleFieldChange = (index, key, val) => {
    setFormData((prev) => {
      const nextFields = [...prev.form_fields];
      nextFields[index] = { ...nextFields[index], [key]: val };
      return { ...prev, form_fields: nextFields };
    });
  };

  const renderIconComponent = (iconKey) => {
    switch (iconKey) {
      case "badge":
        return <Award size={18} className="text-amber-500" />;
      case "scroll":
        return <Scroll size={18} className="text-amber-500" />;
      case "network":
        return <Share2 size={18} className="text-amber-500" />;
      case "shield":
        return <ShieldCheck size={18} className="text-amber-500" />;
      default:
        return <CheckCircle size={18} className="text-amber-500" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Phần Kêu gọi Đề xuất (Cột Trái CTA) */}
      <AdminCard
        title="Thông tin Kêu gọi Đề xuất (Cột Trái CTA)"
        subtitle="Quản lý thẻ phân loại, tiêu đề in hoa, nội dung sứ mệnh và 3 cam kết hỗ trợ đồng hành."
        badge={<AdminBadge variant="burgundy">CTA Section</AdminBadge>}
      >
        <div className="space-y-4">
          <AdminInput
            label="Huy hiệu phân loại (Tag)"
            required
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: getVal(e) })}
            placeholder="Ví dụ: HỢP TÁC PHÁT TRIỂN & ĐỒNG HÀNH CHIẾN LƯỢC"
            error={errors.tag}
          />

          <AdminInput
            label="Tiêu đề kêu gọi chính"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: getVal(e) })}
            placeholder="Ví dụ: ĐỀ XUẤT DỰ ÁN SÁNG TẠO HOẶC ĐĂNG KÝ ĐỒNG HÀNH CÙNG TRUNG TÂM"
            error={errors.title}
          />

          <AdminInput
            label="Đoạn văn mô tả sứ mệnh / Hướng dẫn gửi hồ sơ"
            required
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: getVal(e) })
            }
            placeholder="Nội dung giải thích quyền lợi và phương thức gửi hồ sơ đề xuất..."
            error={errors.description}
          />

          {/* Danh sách 3 cam kết / quyền lợi */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3 border-b border-(--admin-border) pb-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-(--admin-heading)">
                  Các cam kết &amp; Quyền lợi hỗ trợ ({formData.benefits.length})
                </h4>
                <p className="text-[11px] text-(--admin-ink)/70 mt-0.5">
                  Chọn biểu tượng (Huy hiệu, Sở hữu trí tuệ, Mạng lưới chuyên gia) và nhập nội dung.
                </p>
              </div>
              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={handleAddBenefit}
              >
                Thêm quyền lợi
              </AdminButton>
            </div>

            {errors.benefits && (
              <p className="text-xs text-red-500 mb-2">{errors.benefits}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {formData.benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-(--admin-border) bg-(--admin-background) space-y-2.5 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-(--admin-heading)">
                      Cam kết #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded transition"
                      title="Xóa quyền lợi"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Chọn icon */}
                  <div>
                    <label className="block text-[10px] font-semibold text-(--admin-ink)/60 uppercase mb-1">
                      Biểu tượng Icon
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-(--admin-surface) border border-(--admin-border) flex items-center justify-center shrink-0">
                        {renderIconComponent(b.icon)}
                      </div>
                      <select
                        value={b.icon || "badge"}
                        onChange={(e) =>
                          handleBenefitIconChange(idx, e.target.value)
                        }
                        className="w-full rounded-lg border border-(--admin-border) bg-(--admin-surface) px-2.5 py-1.5 text-xs text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                      >
                        {BENEFIT_ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Nhập text */}
                  <div>
                    <label className="block text-[10px] font-semibold text-(--admin-ink)/60 uppercase mb-1">
                      Nội dung cam kết
                    </label>
                    <input
                      type="text"
                      value={b.text}
                      onChange={(e) =>
                        handleBenefitTextChange(idx, e.target.value)
                      }
                      placeholder="Ví dụ: Bảo chứng Kỷ lục Quốc gia"
                      className="w-full rounded-lg border border-(--admin-border) bg-(--admin-surface) px-2.5 py-1.5 text-xs text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                    />
                    {errors[`benefit_${idx}`] && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {errors[`benefit_${idx}`]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminCard>

      {/* 2. Cấu hình Khối Form (Cột Phải) */}
      <AdminCard
        title="Cấu hình Khối Form Đề Xuất (Cột Phải)"
        subtitle="Tùy biến tiêu đề form, mô tả thời gian phản hồi, nhãn nút gửi và danh sách các ô nhập liệu."
        badge={<AdminBadge variant="amber">Form Fields Editor</AdminBadge>}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="Tiêu đề Form"
              required
              value={formData.form_title}
              onChange={(e) =>
                setFormData({ ...formData, form_title: getVal(e) })
              }
              placeholder="Ví dụ: Gửi Đề Xuất Dự Án Mới"
              error={errors.form_title}
            />

            <AdminInput
              label="Chữ trên nút gửi"
              value={formData.button_text}
              onChange={(e) =>
                setFormData({ ...formData, button_text: getVal(e) })
              }
              placeholder="Ví dụ: Gửi Hồ Sơ Dự Án"
            />
          </div>

          <AdminInput
            label="Mô tả / Ghi chú thời gian phản hồi"
            required
            multiline
            rows={2}
            value={formData.form_description}
            onChange={(e) =>
              setFormData({ ...formData, form_description: getVal(e) })
            }
            placeholder="Ví dụ: Ban Thư ký Hội đồng Khoa học sẽ phản hồi văn bản trong vòng 03 ngày làm việc."
            error={errors.form_description}
          />

          {/* Danh sách các trường ô nhập liệu */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3 border-b border-(--admin-border) pb-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-(--admin-heading)">
                  Danh sách ô nhập liệu ({formData.form_fields.length})
                </h4>
                <p className="text-[11px] text-(--admin-ink)/70 mt-0.5">
                  Admin có thể thêm mới, đổi thứ tự, cấu hình độ rộng (Toàn dòng / Nửa dòng) và kiểu ô (Text, Số ĐT, Dropdown select).
                </p>
              </div>
              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={handleAddField}
              >
                Thêm ô nhập liệu
              </AdminButton>
            </div>

            <div className="space-y-3">
              {formData.form_fields.map((field, idx) => (
                <div
                  key={field.id || idx}
                  className="p-4 rounded-xl border border-(--admin-border) bg-(--admin-background) space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--admin-accent)/10 text-[10px] font-bold text-(--admin-accent)">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-(--admin-title)">
                        {field.label || "Ô nhập liệu mới"}
                      </span>
                      {field.required && (
                        <span className="text-[10px] font-semibold text-red-500 uppercase">
                          (Bắt buộc)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveField(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded"
                        title="Di chuyển lên"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveField(idx, 1)}
                        disabled={idx === formData.form_fields.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded"
                        title="Di chuyển xuống"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                        title="Xóa ô nhập"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Nhãn */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-[10px] font-bold text-(--admin-heading) uppercase mb-1">
                        Tên nhãn hiển thị <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          handleFieldChange(idx, "label", e.target.value)
                        }
                        placeholder="Ví dụ: TÊN CƠ QUAN / CHỦ NHIỆM DỰ ÁN"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title)"
                      />
                      {errors[`field_label_${idx}`] && (
                        <p className="text-[10px] text-red-500 mt-1">
                          {errors[`field_label_${idx}`]}
                        </p>
                      )}
                    </div>

                    {/* Placeholder */}
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-[10px] font-bold text-(--admin-heading) uppercase mb-1">
                        Gợi ý nhập (Placeholder)
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ""}
                        onChange={(e) =>
                          handleFieldChange(idx, "placeholder", e.target.value)
                        }
                        placeholder="Ví dụ: 0987xxxxxx..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title)"
                      />
                    </div>

                    {/* Kiểu ô */}
                    <div>
                      <label className="block text-[10px] font-bold text-(--admin-heading) uppercase mb-1">
                        Kiểu dữ liệu
                      </label>
                      <select
                        value={field.type || "text"}
                        onChange={(e) =>
                          handleFieldChange(idx, "type", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title)"
                      >
                        <option value="text">Chữ (Text)</option>
                        <option value="tel">Số điện thoại (Tel)</option>
                        <option value="email">Email</option>
                        <option value="select">Danh sách chọn (Select)</option>
                        <option value="textarea">Văn bản dài (Textarea)</option>
                      </select>
                    </div>

                    {/* Độ rộng */}
                    <div>
                      <label className="block text-[10px] font-bold text-(--admin-heading) uppercase mb-1">
                        Độ rộng hiển thị
                      </label>
                      <select
                        value={field.width || "full"}
                        onChange={(e) =>
                          handleFieldChange(idx, "width", e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title)"
                      >
                        <option value="full">Toàn dòng (100% Full)</option>
                        <option value="half">Nửa dòng (50% Half)</option>
                      </select>
                    </div>

                    {/* Bắt buộc */}
                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id={`req_${idx}`}
                        checked={Boolean(field.required)}
                        onChange={(e) =>
                          handleFieldChange(idx, "required", e.target.checked)
                        }
                        className="rounded border-(--admin-border) text-(--admin-accent) focus:ring-(--admin-accent)"
                      />
                      <label
                        htmlFor={`req_${idx}`}
                        className="text-xs font-semibold text-(--admin-title) cursor-pointer"
                      >
                        Bắt buộc nhập (*)
                      </label>
                    </div>
                  </div>

                  {/* Nếu kiểu ô là select: Quản lý options */}
                  {field.type === "select" && (
                    <div className="pt-2 border-t border-(--admin-border)/60">
                      <label className="block text-[10px] font-bold text-(--admin-heading) uppercase mb-1">
                        Danh sách các lựa chọn (mỗi lựa chọn cách nhau bởi dấu phẩy)
                      </label>
                      <input
                        type="text"
                        value={
                          Array.isArray(field.options)
                            ? field.options.join(", ")
                            : ""
                        }
                        onChange={(e) => {
                          const arr = e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          handleFieldChange(idx, "options", arr);
                        }}
                        placeholder="Ví dụ: Toàn quốc, Miền Bắc, Miền Trung, Miền Nam"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title)"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminCard>

      {/* 3. Khung Xem Trước Trực Quan (Live Preview) */}
      <AdminCard
        title="Khung Xem Trước Trực Quan (Live Preview)"
        subtitle="Mô phỏng 100% giao diện thực tế khi người dùng truy cập ngoài website."
        badge={<AdminBadge variant="emerald">Live Web View</AdminBadge>}
      >
        <div className="bg-[#710008] text-white p-6 md:p-8 rounded-2xl shadow-inner relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Cột trái CTA Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-[#ffffff18] border border-amber-300/30 text-amber-200 px-3 py-1 rounded text-[11px] font-semibold uppercase">
                <Sparkles size={12} className="text-amber-300" />
                <span>{formData.tag}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold uppercase font-serif leading-tight">
                {formData.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#f7c2b6] leading-relaxed max-w-xl font-light">
                {formData.description}
              </p>

              {/* 3 cam kết */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                {formData.benefits.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="p-1 rounded bg-amber-400/10 text-amber-300 shrink-0">
                      {renderIconComponent(b.icon)}
                    </div>
                    <span className="text-[11px] font-medium text-white/95 leading-tight">
                      {b.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cột phải Form Preview */}
            <div className="bg-white text-gray-800 p-5 sm:p-6 rounded-xl shadow-xl lg:col-span-5 w-full">
              <h4 className="text-lg font-bold text-[#710008] font-serif mb-1">
                {formData.form_title}
              </h4>
              <p className="text-[11px] text-gray-500 mb-4 leading-relaxed">
                {formData.form_description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {formData.form_fields.map((f, idx) => (
                  <div
                    key={idx}
                    className={
                      f.width === "half"
                        ? "col-span-1"
                        : "col-span-1 sm:col-span-2"
                    }
                  >
                    <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">
                      {f.label}{" "}
                      {f.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="w-full bg-[#fdfaf5] border border-amber-200/60 rounded px-2.5 py-2 text-gray-500 text-[11px] truncate">
                      {f.placeholder || `[Ô nhập: ${f.label}]`}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 w-full bg-[#710008] text-white py-2.5 px-3 rounded-lg text-center font-bold text-xs uppercase flex items-center justify-center gap-2 shadow">
                <Play size={11} className="fill-white" />
                <span>{formData.button_text}</span>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Thanh hành động lưu */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-xl border border-(--admin-border) bg-(--admin-surface)/95 p-4 shadow-lg backdrop-blur-md">
        <div>
          {saveSuccess ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <Check size={16} /> Đã lưu thành công lên máy chủ!
            </span>
          ) : (
            <span className="text-xs text-(--admin-ink)/60">
              Nhấn lưu để đồng bộ dữ liệu form đề xuất ra website người dùng.
            </span>
          )}
        </div>

        <AdminButton
          type="submit"
          variant="primary"
          size="md"
          icon={Save}
          loading={isSaving}
        >
          {isSaving ? "Đang lưu cấu hình..." : "Lưu cấu hình Đề xuất & Form"}
        </AdminButton>
      </div>
    </form>
  );
}
