import React, { useState } from 'react';
import { Plus, Trash2, Save, Sparkles, Check } from 'lucide-react';

export default function HeroSectionEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    badge: initialData?.badge || '',
    title_main: initialData?.title_main || '',
    subtitle: initialData?.subtitle || '',
    quote: initialData?.quote || '',
    buttons: Array.isArray(initialData?.buttons) ? [...initialData.buttons] : [],
    statistics: Array.isArray(initialData?.statistics) ? [...initialData.statistics] : [],
  });

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.badge.trim()) errs.badge = 'badge là bắt buộc';
    if (!formData.title_main.trim()) errs.title_main = 'title_main là bắt buộc';
    if (!formData.subtitle.trim()) errs.subtitle = 'subtitle là bắt buộc';
    if (!formData.quote.trim()) errs.quote = 'quote là bắt buộc';
    if (formData.buttons.length === 0) {
      errs.buttons = 'Cần ít nhất 1 nút bấm (danh sách buttons là bắt buộc)';
    } else {
      formData.buttons.forEach((btn, idx) => {
        if (!btn.text?.trim() || !btn.link?.trim()) {
          errs[`btn_${idx}`] = 'Text và Link của nút là bắt buộc';
        }
      });
    }
    if (formData.statistics.length === 0) {
      errs.statistics = 'Cần ít nhất 1 số liệu thống kê (danh sách statistics là bắt buộc)';
    } else {
      formData.statistics.forEach((stat, idx) => {
        if (!stat.value?.trim() || !stat.label?.trim()) {
          errs[`stat_${idx}`] = 'Value và Label của thống kê là bắt buộc';
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

  // Button actions
  const handleAddButton = () => {
    setFormData((prev) => ({
      ...prev,
      buttons: [...prev.buttons, { text: 'Nút mới', link: '/' }],
    }));
  };

  const handleRemoveButton = (index) => {
    setFormData((prev) => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index),
    }));
  };

  const handleButtonChange = (index, field, val) => {
    setFormData((prev) => {
      const next = [...prev.buttons];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, buttons: next };
    });
  };

  // Statistics actions
  const handleAddStat = () => {
    setFormData((prev) => ({
      ...prev,
      statistics: [...prev.statistics, { value: '100+', label: 'Chỉ số mới' }],
    }));
  };

  const handleRemoveStat = (index) => {
    setFormData((prev) => ({
      ...prev,
      statistics: prev.statistics.filter((_, i) => i !== index),
    }));
  };

  const handleStatChange = (index, field, val) => {
    setFormData((prev) => {
      const next = [...prev.statistics];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, statistics: next };
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Editor Form Column (7 cols) */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 sm:p-6 rounded-xl">
          <div className="flex items-center justify-between pb-4 border-b border-(--admin-border)">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-(--admin-title)">
                Cấu hình Hero Section
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Quản lý tiêu đề, khẩu hiệu, nút bấm và số liệu thống kê
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-(--admin-accent)/20 text-(--admin-heading) font-semibold">
              Khối Hero
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Badge */}
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) uppercase tracking-wider mb-1">
                Badge huy hiệu *
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="VD: VIỆN KỶ LỤC VIỆT NAM — VIETKINGS"
                className="w-full px-3.5 py-2 text-sm bg-(--admin-background) border border-(--admin-border) focus:border-(--admin-accent) rounded-lg outline-none text-(--admin-ink) transition-colors"
              />
              {errors.badge && <p className="text-red-500 text-xs mt-1">{errors.badge}</p>}
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
                placeholder="VD: TRUNG TÂM CÔNG NGHIỆP SÁNG TẠO"
                className="w-full px-3.5 py-2 text-sm bg-(--admin-background) border border-(--admin-border) focus:border-(--admin-accent) rounded-lg outline-none text-(--admin-ink) font-semibold transition-colors"
              />
              {errors.title_main && <p className="text-red-500 text-xs mt-1">{errors.title_main}</p>}
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) uppercase tracking-wider mb-1">
                Tiêu đề phụ / Định vị *
              </label>
              <textarea
                rows={2}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="VD: NƠI KẾT TINH TRÍ TUỆ, XÁC LẬP KỶ LỤC VÀ TÔN VINH GIÁ TRỊ VIỆT"
                className="w-full px-3.5 py-2 text-sm bg-(--admin-background) border border-(--admin-border) focus:border-(--admin-accent) rounded-lg outline-none text-(--admin-ink) transition-colors resize-y"
              />
              {errors.subtitle && <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>}
            </div>

            {/* Quote / Slogan */}
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) uppercase tracking-wider mb-1">
                Châm ngôn / Trích dẫn *
              </label>
              <input
                type="text"
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="VD: “Chứng thực giá trị — Kiến tạo tài sản — Trao truyền ý chí”"
                className="w-full px-3.5 py-2 text-sm bg-(--admin-background) border border-(--admin-border) focus:border-(--admin-accent) rounded-lg outline-none text-(--admin-ink) transition-colors"
              />
              {errors.quote && <p className="text-red-500 text-xs mt-1">{errors.quote}</p>}
            </div>
          </div>
        </div>

        {/* Buttons List Section */}
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 sm:p-6 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-(--admin-border)">
            <div>
              <h3 className="text-sm font-bold text-(--admin-title)">
                Danh sách Nút bấm hành động
              </h3>
              <p className="text-xs text-gray-500">Mỗi nút gồm text và link điều hướng</p>
            </div>
            <button
              type="button"
              onClick={handleAddButton}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--admin-accent) text-(--admin-black) text-xs font-semibold hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={14} /> Thêm nút
            </button>
          </div>

          {errors.buttons && <p className="text-red-500 text-xs mt-2">{errors.buttons}</p>}

          <div className="mt-4 space-y-3">
            {formData.buttons.map((btn, index) => (
              <div
                key={index}
                className="p-3.5 rounded-lg border border-(--admin-border) bg-(--admin-background) flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-(--admin-surface) border border-(--admin-border) flex items-center justify-center text-xs font-bold shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={btn.text}
                    onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                    placeholder="Tên nút"
                    className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={btn.link}
                    onChange={(e) => handleButtonChange(index, 'link', e.target.value)}
                    placeholder="Link liên kết (/...)"
                    className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveButton(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer shrink-0 self-end sm:self-center"
                  title="Xóa nút này"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics List Section */}
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 sm:p-6 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-(--admin-border)">
            <div>
              <h3 className="text-sm font-bold text-(--admin-title)">
                Chỉ số thống kê
              </h3>
              <p className="text-xs text-gray-500">Mỗi chỉ số gồm giá trị và nhãn hiển thị</p>
            </div>
            <button
              type="button"
              onClick={handleAddStat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--admin-accent) text-(--admin-black) text-xs font-semibold hover:opacity-90 transition cursor-pointer"
            >
              <Plus size={14} /> Thêm chỉ số
            </button>
          </div>

          {errors.statistics && <p className="text-red-500 text-xs mt-2">{errors.statistics}</p>}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.statistics.map((stat, index) => (
              <div
                key={index}
                className="p-3.5 rounded-lg border border-(--admin-border) bg-(--admin-background) relative"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-(--admin-heading)">
                    Thống kê #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                    placeholder="Giá trị (VD: 500+)"
                    className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink) font-bold"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    placeholder="Nhãn (VD: Kỷ lục Gia & Tổ chức)"
                    className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Check size={14} /> Đã lưu Hero Section thành công!
            </span>
          ) : (
            <span className="text-xs text-gray-500 flex items-center gap-1.5">
              <Sparkles size={14} className="text-(--admin-heading)" />
              Sẵn sàng lưu cập nhật
            </span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--admin-hover) text-(--admin-hover-text) text-sm font-semibold hover:opacity-90 shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu Hero Section'}</span>
          </button>
        </div>
      </form>

      {/* Live Preview Column (5 cols) */}
      <div className="lg:col-span-5 sticky top-6">
        <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-(--admin-border) mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-(--admin-heading)">
              Xem trước trực tiếp (Live Preview)
            </span>
            <span className="text-[11px] text-gray-400">Trang chủ Hero</span>
          </div>

          {/* Mini preview container */}
          <div className="rounded-xl border border-gray-200 bg-[#710008] text-white p-6 text-center space-y-4 relative overflow-hidden shadow-sm">
            {/* Watermark circle */}
            <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full border-4 border-white" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-semibold tracking-wider uppercase mx-auto">
              <span>★</span>
              <span>{formData.badge || 'CHƯA CÓ BADGE'}</span>
              <span>★</span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white leading-tight">
              {formData.title_main || 'TIÊU ĐỀ CHÍNH'}
            </h3>

            {/* Subtitle */}
            <p className="text-xs text-amber-200 font-medium leading-relaxed max-w-sm mx-auto">
              {formData.subtitle || 'Tiêu đề phụ...'}
            </p>

            {/* Quote */}
            <p className="text-xs italic text-gray-200">
              {formData.quote || '“Câu châm ngôn trích dẫn...”'}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {formData.buttons.map((btn, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                    idx === 0
                      ? 'bg-amber-400 text-gray-950'
                      : 'border border-amber-300 text-amber-200'
                  }`}
                >
                  {btn.text || `Nút ${idx + 1}`}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/20 mt-4">
              {formData.statistics.map((st, idx) => (
                <div key={idx} className="p-2 rounded bg-white/5 text-center">
                  <div className="text-sm font-extrabold text-amber-300">{st.value}</div>
                  <div className="text-[10px] text-gray-300 line-clamp-1">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
