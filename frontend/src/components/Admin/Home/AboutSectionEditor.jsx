import React, { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Save, Sparkles, Check, Image as ImageIcon, Upload } from 'lucide-react';
import { AdminButton, AdminStickySaveBar } from '../Common/index.js';

export default function AboutSectionEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    tag: initialData?.tag || '',
    title_main: initialData?.title_main || '',
    featured_image: {
      url: initialData?.featured_image?.url || '',
      caption_title: initialData?.featured_image?.caption_title || '',
      caption_text: initialData?.featured_image?.caption_text || '',
    },
    core_values: Array.isArray(initialData?.core_values) ? [...initialData.core_values] : [],
    action_button: {
      text: initialData?.action_button?.text || 'Tìm hiểu cơ hội',
      link: initialData?.action_button?.link || '/about',
    },
  });

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [uploadError, setUploadError] = useState('');
  const imageInputRef = useRef(null);

  useEffect(() => {
    if (!selectedImageFile) {
      setImagePreviewUrl('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(selectedImageFile);
    setImagePreviewUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImageFile]);

  const handleImageSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ảnh không được vượt quá 5 MB.');
      event.target.value = '';
      return;
    }

    setSelectedImageFile(file);
    setUploadError('');
    event.target.value = '';
  };

  const validate = () => {
    const errs = {};
    if (!formData.tag.trim()) errs.tag = 'tag là bắt buộc';
    if (!formData.title_main.trim()) errs.title_main = 'title_main là bắt buộc';
    if (!formData.featured_image.url?.trim()) errs.image_url = 'url hình ảnh là bắt buộc';
    if (!formData.featured_image.caption_title?.trim()) errs.image_caption_title = 'caption_title là bắt buộc';
    if (!formData.featured_image.caption_text?.trim()) errs.image_caption_text = 'caption_text là bắt buộc';

    if (formData.core_values.length === 0) {
      errs.core_values = 'Cần ít nhất 1 giá trị cốt lõi (core_values là bắt buộc)';
    } else {
      formData.core_values.forEach((cv, idx) => {
        if (!cv.icon?.trim() || !cv.title?.trim() || !cv.description?.trim()) {
          errs[`cv_${idx}`] = 'icon, title và description là bắt buộc';
        }
      });
    }

    if (!formData.action_button.text?.trim() || !formData.action_button.link?.trim()) {
      errs.action_button = 'text và link của action_button là bắt buộc';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaveSuccess(false);
    const saved = await onSave(formData, selectedImageFile);
    if (saved === false) return;
    if (saved?.featured_image?.url) {
      setFormData((current) => ({
        ...current,
        featured_image: { ...current.featured_image, ...saved.featured_image },
      }));
    }
    setSelectedImageFile(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  
  const handleAddCoreValue = () => {
    setFormData((prev) => ({
      ...prev,
      core_values: [
        ...prev.core_values,
        { icon: 'star', title: 'Giá trị mới', description: 'Mô tả chi tiết giá trị này...' },
      ],
    }));
  };

  const handleRemoveCoreValue = (index) => {
    setFormData((prev) => ({
      ...prev,
      core_values: prev.core_values.filter((_, i) => i !== index),
    }));
  };

  const handleCoreValueChange = (index, field, val) => {
    setFormData((prev) => {
      const next = [...prev.core_values];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, core_values: next };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Editor Form Column (7 cols) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        {/* Main Info */}
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 sm:p-6 rounded-xl">
          <div className="flex items-center justify-between pb-4 border-b border-(--admin-border)">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-(--admin-title)">
                Cấu hình About Section
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Quản lý sứ mệnh, hình ảnh nổi bật, giá trị cốt lõi và nút hành động
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-(--admin-accent)/20 text-(--admin-heading) font-semibold">
                Khối Giới thiệu
              </span>
              <AdminButton
                type="submit"
                variant="primary"
                size="sm"
                icon={saveSuccess ? Check : Save}
                loading={isSaving}
              >
                {isSaving ? 'Đang lưu...' : 'Lưu About Section'}
              </AdminButton>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {/* Tag / Eyebrow */}
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) uppercase tracking-wider mb-1">
                Thẻ chủ đề / Eyebrow *
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="VD: SỨ MỆNH & TẦM NHÌN QUỐC GIA"
                className="w-full px-3.5 py-2 text-sm bg-(--admin-background) border border-(--admin-border) focus:border-(--admin-accent) rounded-lg outline-none text-(--admin-ink) transition-colors"
              />
              {errors.tag && <p className="text-red-500 text-xs mt-1">{errors.tag}</p>}
            </div>

            {/* Title Main */}
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) uppercase tracking-wider mb-1">
                Tiêu đề chính *
              </label>
              <input
                type="text"
                value={formData.title_main}
                onChange={(e) => setFormData({ ...formData, title_main: e.target.value })}
                placeholder="VD: Về Trung tâm Công nghiệp Sáng tạo"
                className="w-full px-3.5 py-2 text-sm bg-(--admin-background) border border-(--admin-border) focus:border-(--admin-accent) rounded-lg outline-none text-(--admin-ink) font-semibold transition-colors"
              />
              {errors.title_main && <p className="text-red-500 text-xs mt-1">{errors.title_main}</p>}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 sm:p-6 rounded-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-(--admin-border)">
            <ImageIcon size={18} className="text-(--admin-heading)" />
            <div>
              <h3 className="text-sm font-bold text-(--admin-title)">
                Hình ảnh nổi bật
              </h3>
              <p className="text-xs text-gray-500">Bao gồm url ảnh và nội dung chú thích</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                URL Hình ảnh *
              </label>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelection}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isSaving}
                  className="inline-flex min-h-10 items-center gap-2 rounded-md border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) disabled:cursor-wait disabled:opacity-60"
                >
                  <Upload size={14} />
                  {selectedImageFile ? 'Đổi ảnh đã chọn' : 'Chọn ảnh'}
                </button>
                {selectedImageFile && <span className="text-xs text-gray-500">Ảnh sẽ được upload Cloudinary khi lưu About.</span>}
              </div>
              {uploadError && <p role="alert" className="mb-2 text-xs text-red-600">{uploadError}</p>}
              <input
                type="text"
                value={formData.featured_image.url}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_image: { ...formData.featured_image, url: e.target.value },
                  })
                }
                placeholder="VD: https://... hoặc /assets/..."
                className="w-full px-3 py-1.5 text-xs bg-(--admin-background) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
              />
              {errors.image_url && <p className="text-red-500 text-xs mt-1">{errors.image_url}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Tiêu đề ảnh chú thích *
              </label>
              <input
                type="text"
                value={formData.featured_image.caption_title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_image: { ...formData.featured_image, caption_title: e.target.value },
                  })
                }
                placeholder="VD: Viện Kỷ lục Việt Nam (VietKings)"
                className="w-full px-3 py-1.5 text-xs bg-(--admin-background) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
              />
              {errors.image_caption_title && (
                <p className="text-red-500 text-xs mt-1">{errors.image_caption_title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Nội dung chú thích ảnh *
              </label>
              <textarea
                rows={2}
                value={formData.featured_image.caption_text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featured_image: { ...formData.featured_image, caption_text: e.target.value },
                  })
                }
                placeholder="VD: Thành trì kết nối những trí tuệ ưu tú, gìn giữ tinh hoa văn hóa..."
                className="w-full px-3 py-1.5 text-xs bg-(--admin-background) border border-(--admin-border) rounded-md outline-none text-(--admin-ink) resize-y"
              />
              {errors.image_caption_text && (
                <p className="text-red-500 text-xs mt-1">{errors.image_caption_text}</p>
              )}
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 sm:p-6 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-(--admin-border)">
            <div>
              <h3 className="text-sm font-bold text-(--admin-title)">
                Giá trị cốt lõi
              </h3>
              <p className="text-xs text-gray-500">Mỗi giá trị gồm icon, tiêu đề và mô tả</p>
            </div>
            <button
              type="button"
              onClick={handleAddCoreValue}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--admin-accent) text-(--admin-black) text-xs font-semibold hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={14} /> Thêm giá trị
            </button>
          </div>

          {errors.core_values && <p className="text-red-500 text-xs mt-2">{errors.core_values}</p>}

          <div className="mt-4 space-y-3">
            {formData.core_values.map((cv, index) => (
              <div
                key={index}
                className="p-3.5 rounded-lg border border-(--admin-border) bg-(--admin-background) relative space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-(--admin-heading)">
                    Giá trị #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCoreValue(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      value={cv.icon}
                      onChange={(e) => handleCoreValueChange(index, 'icon', e.target.value)}
                      placeholder="Icon (VD: landmark, star)"
                      className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={cv.title}
                      onChange={(e) => handleCoreValueChange(index, 'title', e.target.value)}
                      placeholder="Tiêu đề"
                      className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink) font-semibold"
                    />
                  </div>
                </div>
                <textarea
                  rows={2}
                  value={cv.description}
                  onChange={(e) => handleCoreValueChange(index, 'description', e.target.value)}
                  placeholder="Mô tả giá trị..."
                  className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink) resize-y"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 sm:p-6 rounded-xl">
          <h3 className="text-sm font-bold text-(--admin-title) mb-3 pb-2 border-b border-(--admin-border)">
            Nút hành động chính
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Text hiển thị trên nút *
              </label>
              <input
                type="text"
                value={formData.action_button.text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    action_button: { ...formData.action_button, text: e.target.value },
                  })
                }
                placeholder="VD: Tìm hiểu cơ hội"
                className="w-full px-3 py-1.5 text-xs bg-(--admin-background) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Link điều hướng *
              </label>
              <input
                type="text"
                value={formData.action_button.link}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    action_button: { ...formData.action_button, link: e.target.value },
                  })
                }
                placeholder="VD: /about"
                className="w-full px-3 py-1.5 text-xs bg-(--admin-background) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
              />
            </div>
          </div>
          {errors.action_button && (
            <p className="text-red-500 text-xs mt-2">{errors.action_button}</p>
          )}
        </div>

        {/* Submit Bar */}
        <AdminStickySaveBar
          type="submit"
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          successMessage="Đã lưu About Section thành công!"
          hintMessage="Nhấn lưu để đồng bộ thông tin giới thiệu, sứ mệnh và nút hành động ra trang chủ."
          buttonText="Lưu About Section"
          savingText="Đang lưu..."
        />
      </form>

      {/* Live Preview Column (5 cols) */}
      <div className="lg:col-span-5 sticky top-6">
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-(--admin-border) mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-(--admin-heading)">
              Xem trước trực tiếp (Live Preview)
            </span>
            <span className="text-[11px] text-gray-400">Trang chủ About</span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4 shadow-sm text-gray-800">
            {/* Tag & Title */}
            <div className="text-center pb-2 border-b border-gray-100">
              <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase block">
                {formData.tag || 'CHƯA CÓ TAG'}
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-[#710008] uppercase mt-0.5">
                {formData.title_main || 'TIÊU ĐỀ ABOUT'}
              </h4>
            </div>

            {/* Photo & Caption */}
            <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 h-36">
              {imagePreviewUrl || formData.featured_image.url ? (
                <img
                  src={imagePreviewUrl || formData.featured_image.url}
                  alt={formData.featured_image.caption_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  Chưa có ảnh
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 text-white">
                <p className="text-[11px] font-bold leading-tight">
                  {formData.featured_image.caption_title}
                </p>
                <p className="text-[9px] text-gray-200 line-clamp-1 mt-0.5">
                  {formData.featured_image.caption_text}
                </p>
              </div>
            </div>

            {/* Core values */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                Giá trị cốt lõi
              </span>
              {formData.core_values.map((cv, idx) => (
                <div key={idx} className="p-2 rounded bg-gray-50 border border-gray-100 text-left">
                  <div className="text-xs font-bold text-[#710008] flex items-center gap-1.5">
                    <span>❖</span> {cv.title}
                  </div>
                  <div className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">
                    {cv.description}
                  </div>
                </div>
              ))}
            </div>

            {/* Action button */}
            <div className="pt-2 text-center">
              <span className="inline-block px-4 py-1.5 bg-[#710008] text-white text-xs font-bold rounded-lg shadow-xs">
                {formData.action_button.text || 'Nút hành động'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

