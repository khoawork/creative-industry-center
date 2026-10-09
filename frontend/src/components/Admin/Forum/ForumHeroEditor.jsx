import React, { useState, useEffect } from 'react';
import { Save, Check, Calendar, MapPin } from 'lucide-react';
import { AdminCard, AdminButton, AdminStickySaveBar } from '../Common/index.js';
import ForumImageUploadField from './ForumImageUploadField.jsx';

export default function ForumHeroEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    badge: initialData?.badge ,
    title: initialData?.title,
    subtitle: initialData?.subtitle,
    motto: initialData?.motto,
    event_date: initialData?.event_date ,
    event_location: initialData?.event_location,
    top_logo_image: initialData?.top_logo_image,
    banner_image: initialData?.banner_image ,
    primary_button_text: initialData?.primary_button_text,
    primary_button_link: initialData?.primary_button_link ,
    secondary_button_text: initialData?.secondary_button_text,
    secondary_button_link: initialData?.secondary_button_link,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        badge: initialData.badge ?? '',
        title: initialData.title ?? '',
        subtitle: initialData.subtitle ?? '',
        motto: initialData.motto ?? '',
        event_date: initialData.event_date ?? '',
        event_location: initialData.event_location ?? '',
        top_logo_image: initialData.top_logo_image ?? '',
        banner_image: initialData.banner_image ?? '',
        primary_button_text: initialData.primary_button_text ?? '',
        primary_button_link: initialData.primary_button_link ?? '',
        secondary_button_text: initialData.secondary_button_text ?? '',
        secondary_button_link: initialData.secondary_button_link ?? '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    await onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminCard
        title="Tiêu đề & Thông điệp Thượng đỉnh"
        subtitle="Cấu hình thông điệp chiến lược, khẩu hiệu hành động và thời gian địa điểm diễn đàn."
        actions={
          <AdminButton
            type="submit"
            variant="primary"
            icon={saveSuccess ? Check : Save}
            loading={isSaving}
          >
            {saveSuccess ? 'Đã lưu Hero!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </AdminButton>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Badge nhận diện / Huy hiệu đầu trang
            </label>
            <input
              type="text"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="Hội nghị Thượng đỉnh Kinh tế Kỷ lục Toàn quốc"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Tiêu đề chính (Tiếng Việt)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="DIỄN ĐÀN KINH TẾ KỶ LỤC 2026"
              required
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Tiêu đề phụ (Tiếng Anh)
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="RECORD ECONOMIC FORUM"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Khẩu hiệu / Tôn chỉ chiến lược (Motto)
            </label>
            <input
              type="text"
              name="motto"
              value={formData.motto}
              onChange={handleChange}
              placeholder="“Chứng thực giá trị – Kiến tạo tài sản – Trao truyền ý chí”"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Thời gian tổ chức
            </label>
            <div className="relative">
              <input
                type="text"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                placeholder="Tháng 10/2026 (Phiên Toàn thể)"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
              <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Địa điểm tổ chức
            </label>
            <div className="relative">
              <input
                type="text"
                name="event_location"
                value={formData.event_location}
                onChange={handleChange}
                placeholder="Trung tâm Hội nghị Quốc gia"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard
        title="Nút Hành Động & Ảnh Bìa Sự Kiện"
        subtitle="Đường dẫn nút bấm và hình ảnh hội nghị hiển thị ở khung banner chính."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Nhãn nút chính (Primary CTA)
            </label>
            <input
              type="text"
              name="primary_button_text"
              value={formData.primary_button_text}
              onChange={handleChange}
              placeholder="Đăng ký tham dự"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Liên kết nút chính
            </label>
            <input
              type="text"
              name="primary_button_link"
              value={formData.primary_button_link}
              onChange={handleChange}
              placeholder="#dang-ky"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Nhãn nút phụ (Secondary CTA)
            </label>
            <input
              type="text"
              name="secondary_button_text"
              value={formData.secondary_button_text}
              onChange={handleChange}
              placeholder="Khám phá mục tiêu"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Liên kết nút phụ
            </label>
            <input
              type="text"
              name="secondary_button_link"
              value={formData.secondary_button_link}
              onChange={handleChange}
              placeholder="#muc-tieu"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
            <ForumImageUploadField
              label="Logo nhỏ trên khu vực Hero"
              folder="forum/hero"
              value={formData.top_logo_image || ''}
              onChange={(value) => setFormData((current) => ({ ...current, top_logo_image: value }))}
            />
            <ForumImageUploadField
              label="Ảnh banner Hero"
              folder="forum/hero"
              value={formData.banner_image || ''}
              onChange={(value) => setFormData((current) => ({ ...current, banner_image: value }))}
            />
          </div>
        </div>
      </AdminCard>
      <AdminStickySaveBar
        type="submit"
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        successMessage="Đã lưu Hero thành công!"
        hintMessage="Nhấn lưu để đồng bộ thông điệp chiến lược và khẩu hiệu Diễn đàn ra website."
        buttonText="Lưu Thay Đổi"
        savingText="Đang lưu..."
      />
    </form>
  );
}
