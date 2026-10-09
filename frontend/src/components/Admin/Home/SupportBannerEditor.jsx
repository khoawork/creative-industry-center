import React, { useState } from 'react';
import { Save, Sparkles, Check, Headphones } from 'lucide-react';
import { AdminButton, AdminStickySaveBar } from '../Common/index.js';

export default function SupportBannerEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    text: initialData?.text || '',
    button: {
      text: initialData?.button?.text || 'Kết Nối Ngay',
      link: initialData?.button?.link || '/contact',
    },
  });

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.text.trim()) errs.text = 'text banner là bắt buộc';
    if (!formData.button.text?.trim() || !formData.button.link?.trim()) {
      errs.button = 'text và link của button là bắt buộc';
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Form (7 cols) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 sm:p-6 rounded-xl">
          <div className="flex items-center justify-between pb-4 border-b border-(--admin-border)">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-(--admin-title)">
                Cấu hình Banner Hỗ trợ &amp; Tư vấn
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Quản lý thông điệp hỗ trợ và nút kết nối cuối trang
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-(--admin-accent)/20 text-(--admin-heading) font-semibold">
                Khối Hỗ trợ
              </span>
              <AdminButton
                type="submit"
                variant="primary"
                size="sm"
                icon={saveSuccess ? Check : Save}
                loading={isSaving}
              >
                {isSaving ? 'Đang lưu...' : 'Lưu Support Banner'}
              </AdminButton>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {/* Text banner */}
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) uppercase tracking-wider mb-1">
                Nội dung văn bản banner *
              </label>
              <textarea
                rows={3}
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="VD: Cần tư vấn trực tiếp từ Chuyên viên Viện Kỷ lục? Đường dây nóng tiếp nhận hồ sơ hoạt động 24/7 sẵn sàng đồng hành cùng quý vị."
                className="w-full px-3.5 py-2 text-sm bg-(--admin-background) border border-(--admin-border) focus:border-(--admin-accent) rounded-lg outline-none text-(--admin-ink) transition-colors resize-y leading-relaxed"
              />
              {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text}</p>}
            </div>

            {/* Button */}
            <div className="p-4 rounded-lg border border-(--admin-border) bg-(--admin-background) space-y-3">
              <span className="text-[11px] font-bold text-(--admin-heading) uppercase block">
                Nút liên hệ / kêu gọi hành động *
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tên nút *
                  </label>
                  <input
                    type="text"
                    value={formData.button.text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        button: { ...formData.button, text: e.target.value },
                      })
                    }
                    placeholder="VD: Kết Nối Ngay"
                    className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Link liên kết *
                  </label>
                  <input
                    type="text"
                    value={formData.button.link}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        button: { ...formData.button, link: e.target.value },
                      })
                    }
                    placeholder="VD: /contact"
                    className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
                  />
                </div>
              </div>
              {errors.button && <p className="text-red-500 text-xs mt-1">{errors.button}</p>}
            </div>
          </div>
        </div>

        {/* Submit bar */}
        <AdminStickySaveBar
          type="submit"
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          successMessage="Đã lưu Support Banner thành công!"
          hintMessage="Nhấn lưu để đồng bộ thông điệp hỗ trợ và nút kết nối ra trang chủ."
          buttonText="Lưu Support Banner"
          savingText="Đang lưu..."
        />
      </form>

      {/* Live Preview (5 cols) */}
      <div className="lg:col-span-5 sticky top-6">
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-(--admin-border) mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-(--admin-heading)">
              Xem trước trực tiếp (Live Preview)
            </span>
            <span className="text-[11px] text-gray-400">Trang chủ Banner</span>
          </div>

          <div className="rounded-xl border border-gray-200 bg-[#faf9f7] p-6 shadow-sm flex flex-col items-center sm:items-start text-center sm:text-left gap-4 text-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#d49520] flex items-center justify-center shrink-0 border border-amber-200">
                <Headphones size={26} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#680007]">
                  Trung tâm Hỗ trợ &amp; Tư vấn
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {formData.text || 'Nội dung banner hỗ trợ...'}
                </p>
              </div>
            </div>

            <div className="w-full pt-2">
              <span className="inline-block w-full text-center px-4 py-2 bg-[#680007] text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-xs">
                {formData.button.text || 'Nút bấm'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

