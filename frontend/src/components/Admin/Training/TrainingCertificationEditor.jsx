import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  Check,
  Award,
  IdCard,
  Users,
  Handshake,
  CheckCircle2,
} from 'lucide-react';
import { AdminCard, AdminButton, AdminStickySaveBar } from '../Common/index.js';

const ICON_OPTIONS = [
  { value: 'award', label: 'Chứng nhận / Giải thưởng (Award)', icon: Award },
  { value: 'id-badge', label: 'Mã số tra cứu / Thẻ định danh (ID Badge)', icon: IdCard },
  { value: 'users', label: 'Mạng lưới chuyên gia (Users)', icon: Users },
  { value: 'handshake', label: 'Hợp tác & Cố vấn (Handshake)', icon: Handshake },
  { value: 'check', label: 'Chuẩn mực cam kết (Check)', icon: CheckCircle2 },
];

const DEFAULT_ITEMS = [
  {
    icon: 'award',
    title: 'Chứng nhận Quốc gia',
    description: 'Ký duyệt trực tiếp bởi lãnh đạo Viện Kỷ lục Việt Nam.',
  },
  {
    icon: 'id-badge',
    title: 'Mã số Tra cứu Toàn quốc',
    description: 'Tích hợp mã định danh điện tử trên cổng tra cứu hồ sơ quốc gia.',
  },
  {
    icon: 'users',
    title: 'Mạng lưới Kỷ lục gia',
    description: 'Quyền tham gia Câu lạc bộ Sáng tạo & Kỷ lục gia doanh nghiệp.',
  },
  {
    icon: 'handshake',
    title: 'Cố vấn Dự án Thực tế',
    description: 'Hỗ trợ kết nối chuyên gia đồng hành 6 tháng sau đào tạo.',
  },
];

export default function TrainingCertificationEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    tag: initialData?.tag || 'BẢO CHỨNG PHÁP LÝ & HỌC THUẬT',
    title: initialData?.title || 'Cam Kết Chất Lượng Đào Tạo & Giá Trị Chứng Nhận',
    description:
      initialData?.description ||
      'Mọi chương trình đào tạo tại Trung tâm Công nghiệp Sáng tạo đều tuân thủ các chuẩn mực nghiêm ngặt của Hội đồng Viện Kỷ lục Việt Nam (VIETKINGS). Học viên sau khi hoàn thành khóa học và bảo vệ đề án thành công sẽ được cấp chứng nhận chính thức có giá trị lưu trữ trong cơ sở dữ liệu quốc gia.',
    items: Array.isArray(initialData?.items) && initialData.items.length > 0
      ? [...initialData.items]
      : [...DEFAULT_ITEMS],
    seal_title: initialData?.seal_title || 'VIETKINGS SEAL',
    seal_subtitle: initialData?.seal_subtitle || 'HỘI ĐỒNG XÁC LẬP KỶ LỤC',
    seal_description:
      initialData?.seal_description ||
      'Mỗi học viên tốt nghiệp là một đại sứ thúc đẩy tinh thần sáng tạo và kỷ lục bền vững trong tổ chức của mình.',
    seal_badge: initialData?.seal_badge || 'Tiêu Chuẩn Học Thuật 2024',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        tag: initialData.tag || 'BẢO CHỨNG PHÁP LÝ & HỌC THUẬT',
        title: initialData.title || 'Cam Kết Chất Lượng Đào Tạo & Giá Trị Chứng Nhận',
        description:
          initialData.description ||
          'Mọi chương trình đào tạo tại Trung tâm Công nghiệp Sáng tạo đều tuân thủ các chuẩn mực nghiêm ngặt của Hội đồng Viện Kỷ lục Việt Nam (VIETKINGS). Học viên sau khi hoàn thành khóa học và bảo vệ đề án thành công sẽ được cấp chứng nhận chính thức có giá trị lưu trữ trong cơ sở dữ liệu quốc gia.',
        items: Array.isArray(initialData.items) && initialData.items.length > 0
          ? [...initialData.items]
          : [...DEFAULT_ITEMS],
        seal_title: initialData.seal_title || 'VIETKINGS SEAL',
        seal_subtitle: initialData.seal_subtitle || 'HỘI ĐỒNG XÁC LẬP KỶ LỤC',
        seal_description:
          initialData.seal_description ||
          'Mỗi học viên tốt nghiệp là một đại sứ thúc đẩy tinh thần sáng tạo và kỷ lục bền vững trong tổ chức của mình.',
        seal_badge: initialData.seal_badge || 'Tiêu Chuẩn Học Thuật 2024',
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.tag.trim()) errs.tag = 'Huy hiệu / Tag là bắt buộc';
    if (!formData.title.trim()) errs.title = 'Tiêu đề chính là bắt buộc';
    if (!formData.description.trim()) errs.description = 'Mô tả cam kết là bắt buộc';
    if (!formData.seal_title.trim()) errs.seal_title = 'Tiêu đề con dấu là bắt buộc';

    if (formData.items.length === 0) {
      errs.items = 'Cần ít nhất 1 mục cam kết';
    } else {
      formData.items.forEach((it, idx) => {
        if (!it.title?.trim()) errs[`item_title_${idx}`] = 'Tiêu đề là bắt buộc';
        if (!it.description?.trim()) errs[`item_desc_${idx}`] = 'Mô tả là bắt buộc';
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

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          icon: 'award',
          title: 'Tiêu chuẩn mới',
          description: 'Mô tả nội dung cam kết hoặc bảo chứng...',
        },
      ],
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = { ...nextItems[index], [field]: value };
      return { ...prev, items: nextItems };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Khối Thông tin Cam kết (Cột trái) */}
      <AdminCard
        title="Thông tin Cam Kết Chất Lượng & Bảo Chứng"
        subtitle="Cấu hình tiêu đề, mô tả và huy hiệu bảo chứng học thuật của Viện Kỷ lục Việt Nam"
        actions={
          <AdminButton
            type="submit"
            variant="primary"
            size="sm"
            icon={saveSuccess ? Check : Save}
            loading={isSaving}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu Cam kết & Chứng nhận'}
          </AdminButton>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
                Huy hiệu phân loại (Badge / Tag) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="BẢO CHỨNG PHÁP LÝ & HỌC THUẬT"
                className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) outline-none transition focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/10"
              />
              {errors.tag && <p className="text-xs text-red-500 mt-1">{errors.tag}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
                Tiêu đề chính <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Cam Kết Chất Lượng Đào Tạo & Giá Trị Chứng Nhận"
                className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) font-bold outline-none transition focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/10"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
              Nội dung mô tả cam kết đào tạo <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả chuẩn mực nghiêm ngặt của Hội đồng Viện Kỷ lục Việt Nam (VIETKINGS)..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) outline-none transition focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/10"
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
        </div>
      </AdminCard>

      {/* Danh sách các Mục Cam kết (4 Items) */}
      <AdminCard
        title={`Danh sách Các Mục Bảo chứng & Giá trị (${formData.items.length})`}
        subtitle="Hiển thị dạng lưới 2 cột dưới phần mô tả (ví dụ: Chứng nhận Quốc gia, Mã số Tra cứu...)"
        actions={
          <AdminButton
            type="button"
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleAddItem}
          >
            Thêm mục bảo chứng
          </AdminButton>
        }
      >
        <div className="space-y-4">
          {errors.items && <p className="text-xs text-red-500">{errors.items}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-(--admin-border) bg-(--admin-background) space-y-3"
              >
                <div className="flex items-center justify-between border-b border-(--admin-border) pb-2">
                  <span className="text-xs font-bold text-(--admin-accent) uppercase tracking-wider">
                    Mục #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                    title="Xóa mục này"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                      Biểu tượng
                    </label>
                    <select
                      value={item.icon || 'award'}
                      onChange={(e) => handleItemChange(idx, 'icon', e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) outline-none focus:border-(--admin-accent)"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                      Tiêu đề mục *
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleItemChange(idx, 'title', e.target.value)}
                      placeholder="Chứng nhận Quốc gia"
                      className="w-full px-2.5 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) font-semibold outline-none focus:border-(--admin-accent)"
                    />
                    {errors[`item_title_${idx}`] && (
                      <p className="text-[11px] text-red-500 mt-1">{errors[`item_title_${idx}`]}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                    Mô tả ngắn gọn *
                  </label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Ký duyệt trực tiếp bởi lãnh đạo Viện Kỷ lục Việt Nam..."
                    className="w-full px-2.5 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) outline-none focus:border-(--admin-accent)"
                  />
                  {errors[`item_desc_${idx}`] && (
                    <p className="text-[11px] text-red-500 mt-1">{errors[`item_desc_${idx}`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>

      {/* Khối Con dấu VIETKINGS SEAL (Cột phải) */}
      <AdminCard
        title="Cấu hình Khối Con dấu Xác lập (VIETKINGS SEAL)"
        subtitle="Khối huy hiệu chứng thực hiển thị bên phải phần cam kết chất lượng"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
                Tiêu đề Con dấu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.seal_title}
                onChange={(e) => setFormData({ ...formData, seal_title: e.target.value })}
                placeholder="VIETKINGS SEAL"
                className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) font-bold outline-none focus:border-(--admin-accent)"
              />
              {errors.seal_title && <p className="text-xs text-red-500 mt-1">{errors.seal_title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
                Cơ quan ban hành (Phụ đề)
              </label>
              <input
                type="text"
                value={formData.seal_subtitle}
                onChange={(e) => setFormData({ ...formData, seal_subtitle: e.target.value })}
                placeholder="Hội đồng Xác lập Kỷ lục"
                className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) outline-none focus:border-(--admin-accent)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
              Thông điệp con dấu
            </label>
            <textarea
              rows={2}
              value={formData.seal_description}
              onChange={(e) => setFormData({ ...formData, seal_description: e.target.value })}
              placeholder="Mỗi học viên tốt nghiệp là một đại sứ thúc đẩy tinh thần sáng tạo..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
              Huy hiệu năm / Chuẩn chất lượng
            </label>
            <input
              type="text"
              value={formData.seal_badge}
              onChange={(e) => setFormData({ ...formData, seal_badge: e.target.value })}
              placeholder="Tiêu Chuẩn Học Thuật 2024"
              className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) font-semibold outline-none focus:border-(--admin-accent)"
            />
          </div>
        </div>
      </AdminCard>

      {/* Nút lưu */}
      <AdminStickySaveBar
        type="submit"
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        successMessage="Đã lưu thành công!"
        hintMessage="Nhấn lưu để đồng bộ thông tin cam kết và chứng nhận ra website."
        buttonText="Lưu Cam kết & Chứng nhận"
        savingText="Đang lưu..."
      />
    </form>
  );
}
