import React, { useState, useEffect } from 'react';
import { Save, Check, Phone, Mail, MapPin, ShieldCheck, Sliders } from 'lucide-react';
import { AdminCard, AdminButton } from '../Common/index.js';
import { FormBuilder } from '../Base/index.js';

const DEFAULT_FIELDS = [
  {
    id: 'fullName',
    label: 'Họ và tên đại biểu',
    type: 'text',
    placeholder: 'Nguyễn Văn A',
    required: true,
    width: 'half',
  },
  {
    id: 'phone',
    label: 'Số điện thoại liên hệ',
    type: 'tel',
    placeholder: '0912 345 678',
    required: true,
    width: 'half',
  },
  {
    id: 'email',
    label: 'Địa chỉ email công vụ',
    type: 'email',
    placeholder: 'daibieu@tochuc.vn',
    required: true,
    width: 'full',
  },
  {
    id: 'organization',
    label: 'Cơ quan / Doanh nghiệp',
    type: 'text',
    placeholder: 'Tên cơ quan / doanh nghiệp',
    required: false,
    width: 'half',
  },
  {
    id: 'position',
    label: 'Chức danh / Chức vụ',
    type: 'text',
    placeholder: 'Chức danh / chức vụ',
    required: false,
    width: 'half',
  },
  {
    id: 'session',
    label: 'Phiên hội nghị đăng ký tham dự',
    type: 'select',
    placeholder: 'Chọn phiên tham dự',
    options: [
      'Toàn bộ 4 phiên làm việc',
      'Phiên I & II - Hội nghị Chiến lược',
      'Phiên III - Triển lãm & Kết nối B2B',
      'Phiên IV - Gala Vinh danh Doanh nghiệp',
    ],
    required: true,
    width: 'full',
  },
];

export default function ForumRegistrationEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    tag: initialData?.tag || 'Đăng Ký Tham Dự',
    title: initialData?.title || 'Đăng Ký Tham Dự Diễn Đàn Kinh Tế Kỷ Lục 2026',
    description:
      initialData?.description ||
      'Vui lòng hoàn thiện thông tin dưới đây để Ban Tổ chức chuẩn bị chu đáo và gửi thẻ đại biểu chính thức.',
    hotline: initialData?.hotline || '028.3847.7899',
    email: initialData?.email || 'bandoingoai@kinhtekyluc.vn',
    address:
      initialData?.address || 'Trung tâm Hội nghị Quốc gia, Hà Nội / TP. Hồ Chí Minh',
    privacy_text:
      initialData?.privacy_text ||
      'Thông tin của quý đại biểu được bảo mật và chỉ sử dụng cho công tác tổ chức diễn đàn.',
    button_text: initialData?.button_text || 'Xác Nhận Đăng Ký',
    form_fields: Array.isArray(initialData?.form_fields) && initialData.form_fields.length > 0
      ? [...initialData.form_fields]
      : DEFAULT_FIELDS,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        tag: initialData.tag || 'Đăng Ký Tham Dự',
        title: initialData.title || 'Đăng Ký Tham Dự Diễn Đàn Kinh Tế Kỷ Lục 2026',
        description:
          initialData.description ||
          'Vui lòng hoàn thiện thông tin dưới đây để Ban Tổ chức chuẩn bị chu đáo và gửi thẻ đại biểu chính thức.',
        hotline: initialData.hotline || '028.3847.7899',
        email: initialData.email || 'bandoingoai@kinhtekyluc.vn',
        address:
          initialData.address || 'Trung tâm Hội nghị Quốc gia, Hà Nội / TP. Hồ Chí Minh',
        privacy_text:
          initialData.privacy_text ||
          'Thông tin của quý đại biểu được bảo mật và chỉ sử dụng cho công tác tổ chức diễn đàn.',
        button_text: initialData.button_text || 'Xác Nhận Đăng Ký',
        form_fields: Array.isArray(initialData.form_fields) && initialData.form_fields.length > 0
          ? [...initialData.form_fields]
          : DEFAULT_FIELDS,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormBuilderChange = (updated) => {
    setFormData((prev) => ({
      ...prev,
      form_fields: updated.form_fields || [],
    }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaveSuccess(false);
    await onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Tiêu Đề & Lời Kêu Gọi */}
      <AdminCard
        title="Tiêu Đề & Lời Kêu Gọi Đăng Ký"
        subtitle="Cấu hình tiêu đề, nhãn thẻ, mô tả và nút gửi của form đăng ký."
        actions={
          <AdminButton
            type="button"
            variant="primary"
            icon={saveSuccess ? Check : Save}
            loading={isSaving}
            onClick={handleSubmit}
          >
            {saveSuccess ? 'Đã lưu Cấu Hình!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </AdminButton>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Nhãn phân loại (Tag)
              </label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Đăng Ký Tham Dự"
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Tiêu đề chính
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Đăng Ký Tham Dự Diễn Đàn Kinh Tế Kỷ Lục 2026"
                required
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Đoạn văn hướng dẫn
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Vui lòng hoàn thiện thông tin dưới đây..."
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Nhãn nút gửi form (Submit Button)
            </label>
            <input
              type="text"
              name="button_text"
              value={formData.button_text}
              onChange={handleChange}
              placeholder="Xác Nhận Đăng Ký"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>
        </div>
      </AdminCard>

      {/* 2. Cấu hình các trường đăng ký (FormBuilder - Chuyển từ Forms sang đây) */}
      <FormBuilder
        formId="forum_registration"
        value={{
          form_fields: formData.form_fields || [],
        }}
        onChange={handleFormBuilderChange}
        showFormMeta={false}
        showPreview={false}
        title="Cấu hình các trường đăng ký"
        description="Thêm, sắp xếp và tùy chỉnh các ô nhập liệu hiển thị trong form đăng ký Forum."
      />

      {/* 3. Thông Tin Đường Dây Nóng & Đầu Mối Tiếp Nhận */}
      <AdminCard
        title="Thông Tin Đường Dây Nóng & Đầu Mối Tiếp Nhận"
        subtitle="Cấu hình hotline, email và địa chỉ hiển thị bên cạnh form đăng ký."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Hotline tiếp nhận đại biểu
            </label>
            <div className="relative">
              <input
                type="text"
                name="hotline"
                value={formData.hotline}
                onChange={handleChange}
                placeholder="028.3847.7899"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Email công vụ tiếp nhận
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="bandoingoai@kinhtekyluc.vn"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Địa chỉ tổ chức / văn phòng
            </label>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Trung tâm Hội nghị Quốc gia, Hà Nội / TP. Hồ Chí Minh"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Cam kết bảo mật thông tin (Privacy disclaimer)
            </label>
            <div className="relative">
              <input
                type="text"
                name="privacy_text"
                value={formData.privacy_text}
                onChange={handleChange}
                placeholder="Thông tin của quý đại biểu được bảo mật..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
              <ShieldCheck size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
