import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Send, Check } from 'lucide-react';
import { FormBuilder } from '../Base';
import { fetchFormConfig, DEFAULT_FORM_CONFIGS } from '../../../services/googleSheetService.js';

export default function TrainingProposalEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    tag: initialData?.tag || 'GHI DANH & KẾT NỐI DOANH NGHIỆP',
    title:
      initialData?.title ||
      'ĐĂNG KÝ THAM GIA KHÓA ĐÀO TẠO HOẶC ĐỀ XUẤT HỢP TÁC CHIẾN LƯỢC',
    description:
      initialData?.description ||
      'Quý doanh nghiệp, tổ chức hoặc cá nhân có nhu cầu nâng cao năng lực quản trị tài sản trí tuệ và ươm tạo dự án sáng tạo vui lòng gửi thông tin đăng ký để Hội đồng tuyển sinh tiếp nhận và phản hồi.',
    benefits: Array.isArray(initialData?.benefits) ? [...initialData.benefits] : [],
    form_title: initialData?.form_title || 'Đăng Ký Khóa Học & Đề Xuất Hợp Tác',
    form_description:
      initialData?.form_description ||
      'Ban Tuyển sinh & Hợp tác Chiến lược sẽ liên hệ phản hồi trong 24 giờ làm việc.',
    button_text: initialData?.button_text || 'GỬI HỒ SƠ ĐĂNG KÝ',
    form_fields: Array.isArray(initialData?.form_fields) && initialData.form_fields.length > 0
      ? [...initialData.form_fields]
      : [],
  });

  // Tải cấu hình form hiện tại theo slug/id nếu form_fields đang trống
  useEffect(() => {
    fetchFormConfig('training_registration').then((cfg) => {
      const activeCfg = cfg || DEFAULT_FORM_CONFIGS.training_registration;
      setFormData((prev) => {
        let currentFields = Array.isArray(prev.form_fields) && prev.form_fields.length > 0
          ? [...prev.form_fields]
          : (activeCfg.fields || []);

        // Đảm bảo luôn có 2 trường cố định courseCode và courseName
        const hasCode = currentFields.some((f) => (f.key === 'courseCode' || f.id === 'courseCode'));
        const hasName = currentFields.some((f) => (f.key === 'courseName' || f.id === 'courseName'));
        const prefix = [];
        if (!hasCode) {
          prefix.push({
            key: 'courseCode',
            id: 'courseCode',
            label: 'Mã khóa học',
            type: 'text',
            placeholder: 'Mã khóa học',
            required: true,
            readOnly: true,
            width: 'half',
          });
        }
        if (!hasName) {
          prefix.push({
            key: 'courseName',
            id: 'courseName',
            label: 'Tên khóa học',
            type: 'text',
            placeholder: 'Tên khóa học đăng ký',
            required: true,
            readOnly: true,
            width: 'half',
          });
        }
        return {
          ...prev,
          form_fields: [...prefix, ...currentFields],
        };
      });
    });
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        tag: initialData.tag || 'GHI DANH & KẾT NỐI DOANH NGHIỆP',
        title:
          initialData.title ||
          'ĐĂNG KÝ THAM GIA KHÓA ĐÀO TẠO HOẶC ĐỀ XUẤT HỢP TÁC CHIẾN LƯỢC',
        description:
          initialData.description ||
          'Quý doanh nghiệp, tổ chức hoặc cá nhân có nhu cầu nâng cao năng lực quản trị tài sản trí tuệ và ươm tạo dự án sáng tạo vui lòng gửi thông tin đăng ký để Hội đồng tuyển sinh tiếp nhận và phản hồi.',
        benefits: Array.isArray(initialData.benefits) ? [...initialData.benefits] : [],
        form_title: initialData.form_title || 'Đăng Ký Khóa Học & Đề Xuất Hợp Tác',
        form_description:
          initialData.form_description ||
          'Ban Tuyển sinh & Hợp tác Chiến lược sẽ liên hệ phản hồi trong 24 giờ làm việc.',
        button_text: initialData.button_text || 'GỬI HỒ SƠ ĐĂNG KÝ',
        form_fields: Array.isArray(initialData.form_fields)
          ? [...initialData.form_fields]
          : [],
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.tag.trim()) errs.tag = 'Tag đề xuất là bắt buộc';
    if (!formData.title.trim()) errs.title = 'Tiêu đề đề xuất là bắt buộc';
    if (!formData.description.trim()) errs.description = 'Mô tả đề xuất là bắt buộc';
    if (!formData.form_title.trim()) errs.form_title = 'Tiêu đề form là bắt buộc';
    if (!formData.form_description.trim()) errs.form_description = 'Mô tả form là bắt buộc';
    if (formData.benefits.length === 0) {
      errs.benefits = 'Cần ít nhất 1 cam kết / quyền lợi';
    } else {
      formData.benefits.forEach((item, idx) => {
        if (!item?.trim()) errs[`benefit_${idx}`] = 'Nội dung quyền lợi không được để trống';
      });
    }

    if (Array.isArray(formData.form_fields)) {
      formData.form_fields.forEach((field, idx) => {
        if (!field.label?.trim()) {
          errs[`field_label_${idx}`] = 'Chủ đề / Nhãn ô nhập không được để trống';
        }
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaveSuccess(false);
    await onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleAddBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, 'Quyền lợi / Chứng nhận mới'],
    }));
  };

  const handleRemoveBenefit = (index) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, idx) => idx !== index),
    }));
  };

  const handleBenefitChange = (index, value) => {
    setFormData((prev) => {
      const nextBenefits = [...prev.benefits];
      nextBenefits[index] = value;
      return { ...prev, benefits: nextBenefits };
    });
  };

  const handleFormBuilderChange = (updated) => {
    setFormData((prev) => ({
      ...prev,
      form_title: updated.form_title,
      form_description: updated.form_description,
      button_text: updated.button_text,
      form_fields: updated.form_fields,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông tin kêu gọi hợp tác */}
      <div className="p-6 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] space-y-5">
        <div className="flex items-center gap-2 border-b border-(--admin-border) pb-3">
          <Send className="text-(--admin-accent)" size={18} />
          <h3 className="text-base font-bold text-(--admin-title)">
            Phần Kêu gọi Đăng ký &amp; Hợp tác Đào tạo (CTA Section)
          </h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
            Huy hiệu phân loại (Tag) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.tag}
            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
            placeholder="Ví dụ: GHI DANH & KẾT NỐI DOANH NGHIỆP"
            className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
          />
          {errors.tag && <p className="text-xs text-red-500 mt-1">{errors.tag}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
            Tiêu đề kêu gọi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ví dụ: ĐĂNG KÝ THAM GIA KHÓA ĐÀO TẠO HOẶC ĐỀ XUẤT HỢP TÁC CHIẾN LƯỢC"
            className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
            Nội dung kêu gọi / Hướng dẫn <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nội dung giải thích quyền lợi và phương thức đăng ký khóa đào tạo..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Cam kết & Lợi ích */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider">
              Cam kết &amp; Quyền lợi hỗ trợ ({formData.benefits.length}){' '}
              <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddBenefit}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-(--admin-accent) text-white hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={13} /> Thêm quyền lợi
            </button>
          </div>

          {errors.benefits && <p className="text-xs text-red-500 mb-2">{errors.benefits}</p>}

          <div className="space-y-2.5">
            {formData.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 w-6 text-right">#{idx + 1}</span>
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(idx, e.target.value)}
                  placeholder="Ví dụ: Chứng nhận chính thức từ Viện Kỷ lục Việt Nam (VIETKINGS)"
                  className="flex-1 px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs text-(--admin-title)"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBenefit(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded cursor-pointer"
                  title="Xóa"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component Reusable FormBuilder từ Base */}
      <FormBuilder
        formId="training_registration"
        value={{
          form_title: formData.form_title,
          form_description: formData.form_description,
          button_text: formData.button_text,
          form_fields: formData.form_fields,
        }}
        onChange={handleFormBuilderChange}
        errors={errors}
        previewAccentColor="#710008"
        title="Cấu hình Khối Form Đăng Ký &amp; Các Ô Nhập Liệu"
        description="Admin có thể tự do thêm, bớt hoặc tùy biến chủ đề, gợi ý nhập và loại ô nhập liệu cho form đăng ký khóa đào tạo."
      />

      {/* Nút lưu */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saveSuccess && (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <Check size={16} /> Đã lưu thành công!
          </span>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-(--admin-accent) text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-sm cursor-pointer"
        >
          <Save size={16} />
          {isSaving ? 'Đang lưu...' : 'Lưu cấu hình Đăng ký & Form'}
        </button>
      </div>
    </form>
  );
}
