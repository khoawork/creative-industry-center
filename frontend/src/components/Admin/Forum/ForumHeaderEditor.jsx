import React, { useState, useEffect } from 'react';
import { Save, Check, Plus, Trash2, Link as LinkIcon, Compass, Phone } from 'lucide-react';
import { AdminCard, AdminButton } from '../Common/index.js';

export default function ForumHeaderEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    top_back_text: initialData?.top_back_text || 'Quay lại Cổng TTCN Sáng tạo',
    top_back_link: initialData?.top_back_link || '/',
    top_slogan: initialData?.top_slogan || 'Chứng thực giá trị • Kiến tạo tài sản • Trao truyền ý chí',
    top_hotline: initialData?.top_hotline || '028.3847.7899',
    logo_image: initialData?.logo_image || '',
    brand_title: initialData?.brand_title || 'DIỄN ĐÀN KINH TẾ KỶ LỤC',
    brand_subtitle: initialData?.brand_subtitle || 'Vietnam Record Economic Forum',
    nav_items: Array.isArray(initialData?.nav_items) && initialData.nav_items.length > 0
      ? [...initialData.nav_items]
      : [
          { label: 'Giới thiệu & Mục tiêu', href: '#muc-tieu' },
          { label: 'Diễn giả', href: '#dien-gia' },
          { label: 'Hoạt động', href: '#chuong-trinh' },
          { label: 'Giải thưởng', href: '#giai-thuong' },
          { label: 'Đơn vị tổ chức & Tài trợ', href: '#doi-tac' },
        ],
    button_text: initialData?.button_text || 'Đăng ký tham dự',
    button_link: initialData?.button_link || '#dang-ky',
    show_user_icon: initialData?.show_user_icon ?? true,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        top_back_text: initialData.top_back_text || 'Quay lại Cổng TTCN Sáng tạo',
        top_back_link: initialData.top_back_link || '/',
        top_slogan: initialData.top_slogan || 'Chứng thực giá trị • Kiến tạo tài sản • Trao truyền ý chí',
        top_hotline: initialData.top_hotline || '028.3847.7899',
        logo_image: initialData.logo_image || '',
        brand_title: initialData.brand_title || 'DIỄN ĐÀN KINH TẾ KỶ LỤC',
        brand_subtitle: initialData.brand_subtitle || 'Vietnam Record Economic Forum',
        nav_items: Array.isArray(initialData.nav_items) && initialData.nav_items.length > 0
          ? [...initialData.nav_items]
          : [
              { label: 'Giới thiệu & Mục tiêu', href: '#muc-tieu' },
              { label: 'Diễn giả', href: '#dien-gia' },
              { label: 'Hoạt động', href: '#chuong-trinh' },
              { label: 'Giải thưởng', href: '#giai-thuong' },
              { label: 'Đơn vị tổ chức & Tài trợ', href: '#doi-tac' },
            ],
        button_text: initialData.button_text || 'Đăng ký tham dự',
        button_link: initialData.button_link || '#dang-ky',
        show_user_icon: initialData.show_user_icon ?? true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNavItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.nav_items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, nav_items: updated };
    });
  };

  const handleAddNavItem = () => {
    setFormData((prev) => ({
      ...prev,
      nav_items: [
        ...prev.nav_items,
        { label: 'Mục Menu Mới', href: '#section' },
      ],
    }));
  };

  const handleRemoveNavItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      nav_items: prev.nav_items.filter((_, idx) => idx !== index),
    }));
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
      {/* 1. Thanh thông báo đỉnh (Top Bar) */}
      <AdminCard
        title="Thanh Thông Báo & Liên Hệ Đỉnh Trang (Top Bar)"
        subtitle="Cấu hình thanh màu xanh sẫm trên cùng gồm nút quay về cổng chính, khẩu hiệu và hotline."
        actions={
          <AdminButton
            type="submit"
            variant="primary"
            icon={saveSuccess ? Check : Save}
            loading={isSaving}
          >
            {saveSuccess ? 'Đã lưu Header!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </AdminButton>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Văn bản nút quay về (Trái)
            </label>
            <input
              type="text"
              name="top_back_text"
              value={formData.top_back_text}
              onChange={handleChange}
              placeholder="Quay lại Cổng TTCN Sáng tạo"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Đường dẫn nút quay về
            </label>
            <input
              type="text"
              name="top_back_link"
              value={formData.top_back_link}
              onChange={handleChange}
              placeholder="/"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Khẩu hiệu trung tâm
            </label>
            <input
              type="text"
              name="top_slogan"
              value={formData.top_slogan}
              onChange={handleChange}
              placeholder="Chứng thực giá trị • Kiến tạo tài sản • Trao truyền ý chí"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Số điện thoại Hotline (Phải)
            </label>
            <div className="relative">
              <input
                type="text"
                name="top_hotline"
                value={formData.top_hotline}
                onChange={handleChange}
                placeholder="028.3847.7899"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </AdminCard>

      {/* 2. Logo & Nhận Diện Thương Hiệu */}
      <AdminCard
        title="Logo & Tên Thương Hiệu Diễn Đàn"
        subtitle="Cấu hình logo và tên hiển thị ở góc trái thanh điều hướng chính."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Đường dẫn hình ảnh Logo (URL)
            </label>
            <input
              type="text"
              name="logo_image"
              value={formData.logo_image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
            {formData.logo_image && (
              <div className="mt-2.5 p-2 bg-slate-50 border border-slate-200 rounded-lg inline-block">
                <img
                  src={formData.logo_image}
                  alt="Logo Preview"
                  className="h-10 w-auto object-contain"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Tên diễn đàn (Tiếng Việt)
            </label>
            <input
              type="text"
              name="brand_title"
              value={formData.brand_title}
              onChange={handleChange}
              placeholder="DIỄN ĐÀN KINH TẾ KỶ LỤC"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Tên tiếng Anh (Subtitle)
            </label>
            <input
              type="text"
              name="brand_subtitle"
              value={formData.brand_subtitle}
              onChange={handleChange}
              placeholder="Vietnam Record Economic Forum"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>
        </div>
      </AdminCard>

      {/* 3. Menu Điều Hướng & Nút Hành Động */}
      <AdminCard
        title="Danh Sách Menu Điều Hướng & Nút Tham Dự"
        subtitle="Quản lý các liên kết menu trên thanh điều hướng chính và nút kêu gọi hành động."
        actions={
          <AdminButton
            type="button"
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={handleAddNavItem}
          >
            Thêm Mục Menu
          </AdminButton>
        }
      >
        <div className="space-y-4">
          <div className="space-y-3">
            {formData.nav_items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50"
              >
                <span className="text-xs font-bold text-slate-500 w-6 shrink-0">
                  #{index + 1}
                </span>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.label || ''}
                    onChange={(e) => handleNavItemChange(index, 'label', e.target.value)}
                    placeholder="Tên hiển thị menu (VD: Diễn giả)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={item.href || ''}
                    onChange={(e) => handleNavItemChange(index, 'href', e.target.value)}
                    placeholder="Liên kết neo (VD: #dien-gia)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveNavItem(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  title="Xóa mục menu"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Nhãn nút hành động (Button CTA)
              </label>
              <input
                type="text"
                name="button_text"
                value={formData.button_text}
                onChange={handleChange}
                placeholder="Đăng ký tham dự"
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Liên kết nút hành động
              </label>
              <input
                type="text"
                name="button_link"
                value={formData.button_link}
                onChange={handleChange}
                placeholder="#dang-ky"
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="show_user_icon"
                  checked={formData.show_user_icon}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Hiển thị biểu tượng người dùng / tài khoản cạnh nút Đăng ký</span>
              </label>
            </div>
          </div>
        </div>
      </AdminCard>
    </form>
  );
}
