import React from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sliders,
  Eye,
  AlertCircle,
} from 'lucide-react';

/**
 * Reusable FormBuilder Component
 * Dùng chung trong Base để thiết lập động form nhập liệu cho bất kỳ trang nào.
 *
 * Props:
 * - value: { form_title, form_description, button_text, form_fields }
 * - onChange: (newValue) => void
 * - errors: Object chứa lỗi validation
 * - showFormMeta: boolean (mặc định: true, hiển thị cấu hình tiêu đề, mô tả, nút gửi)
 * - showPreview: boolean (mặc định: true, hiển thị khung xem trước)
 * - previewValue: dữ liệu chỉ dùng cho khung xem trước khi preview khác value đang chỉnh sửa
 * - previewFooter: nội dung bổ sung hiển thị bên dưới nút trong khung xem trước
 * - previewAccentColor: string (mặc định: '#710008')
 * - title: string (tiêu đề section)
 * - description: string (mô tả section)
 */
export default function FormBuilder({
  value = {},
  onChange,
  errors = {},
  showFormMeta = true,
  showPreview = true,
  previewValue = null,
  previewFooter = null,
  previewAccentColor = '#710008',
  title = 'Cấu hình Khối Form & Các Ô Nhập Liệu',
  description = 'Admin có thể tự do thêm mới, tùy chỉnh chủ đề (label), gợi ý nhập (placeholder) và kiểu dữ liệu cho từng ô nhập liệu.',
}) {
  const formTitle = value?.form_title ?? '';
  const formDescription = value?.form_description ?? '';
  const buttonText = value?.button_text ?? 'Gửi Hồ Sơ';
  const formFields = Array.isArray(value?.form_fields) ? value.form_fields : [];
  const previewFormTitle = previewValue?.form_title ?? formTitle;
  const previewFormDescription = previewValue?.form_description ?? formDescription;
  const previewButtonText = previewValue?.button_text ?? buttonText;
  const previewFormFields = Array.isArray(previewValue?.form_fields) ? previewValue.form_fields : formFields;

  const updateParent = (updates) => {
    if (typeof onChange === 'function') {
      onChange({
        ...value,
        ...updates,
      });
    }
  };

  const handleAddField = () => {
    const newField = {
      id: `field_${Date.now()}`,
      label: '',
      placeholder: '',
      type: 'text',
      options: [],
      required: false,
      width: 'full',
    };
    updateParent({
      form_fields: [...formFields, newField],
    });
  };

  const handleRemoveField = (index) => {
    const nextFields = formFields.filter((_, idx) => idx !== index);
    updateParent({ form_fields: nextFields });
  };

  const handleMoveField = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= formFields.length) return;
    const nextFields = [...formFields];
    const temp = nextFields[index];
    nextFields[index] = nextFields[targetIndex];
    nextFields[targetIndex] = temp;
    updateParent({ form_fields: nextFields });
  };

  const handleFieldChange = (index, key, val) => {
    const nextFields = [...formFields];
    nextFields[index] = { ...nextFields[index], [key]: val };
    updateParent({ form_fields: nextFields });
  };

  return (
    <div className="p-6 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-(--admin-border) pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="text-(--admin-accent)" size={18} />
          <h3 className="text-base font-bold text-(--admin-title)">{title}</h3>
        </div>
      </div>

      {description && (
        <p className="text-xs text-(--admin-heading) leading-relaxed">
          {description}
        </p>
      )}

      {/* Cấu hình Meta của Form (Tiêu đề, mô tả, nút gửi) */}
      {showFormMeta && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
                Tiêu đề khối Form <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => updateParent({ form_title: e.target.value })}
                placeholder="Ví dụ: Gửi Đề Xuất Dự Án Mới"
                className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
              />
              {errors.form_title && (
                <p className="text-xs text-red-500 mt-1">{errors.form_title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
                Chữ hiển thị trên Nút gửi
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => updateParent({ button_text: e.target.value })}
                placeholder="Gửi Thông Tin"
                className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-2">
              Mô tả thời gian phản hồi / Ghi chú Form <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formDescription}
              onChange={(e) => updateParent({ form_description: e.target.value })}
              placeholder="Ví dụ: Ban Thư ký sẽ phản hồi văn bản trong vòng 03 ngày làm việc."
              className="w-full px-3.5 py-2.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-sm text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
            />
            {errors.form_description && (
              <p className="text-xs text-red-500 mt-1">{errors.form_description}</p>
            )}
          </div>
        </div>
      )}

      {/* DANH SÁCH CÁC Ô NHẬP LIỆU */}
      <div className="pt-2 border-t border-(--admin-border)">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-bold text-(--admin-title) flex items-center gap-2">
              <span>Danh sách Ô Nhập Liệu</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-medium">
                {formFields.length} ô
              </span>
            </h4>
            <p className="text-xs text-(--admin-heading) mt-0.5">
              Admin tự do đặt chủ đề (nhãn), gợi ý nhập, chọn kiểu dữ liệu (chữ, số điện thoại, dropdown, v.v.)
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddField}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-(--admin-accent) px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition hover:opacity-90 cursor-pointer shrink-0"
          >
            <Plus size={16} /> Thêm ô nhập liệu mới
          </button>
        </div>

        {errors.form_fields && (
          <p className="text-xs text-red-500 mb-3">{errors.form_fields}</p>
        )}

        {/* Trạng thái chưa có ô nhập liệu nào */}
        {formFields.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-(--admin-border) rounded-xl bg-(--admin-background)/50 space-y-3">
            <AlertCircle className="mx-auto text-gray-400" size={32} />
            <div className="text-xs text-(--admin-heading)">
              Chưa có ô nhập liệu nào được cấu hình cho form này.
            </div>
            <button
              type="button"
              onClick={handleAddField}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-(--admin-accent) px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 cursor-pointer"
            >
              <Plus size={16} /> Thêm ô nhập liệu đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {formFields.map((field, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === formFields.length - 1;

              return (
                <div
                  key={field.id || `field_${idx}`}
                  className="p-4 rounded-xl border border-(--admin-border) bg-(--admin-background) hover:border-(--admin-accent)/50 transition-colors space-y-3"
                >
                  {/* Dòng tiêu đề thẻ: Số thứ tự, Tên chủ đề tóm tắt, Nút điều hướng & Xóa */}
                  <div className="flex items-center justify-between gap-2 border-b border-(--admin-border)/60 pb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-(--admin-surface) text-(--admin-title) border border-(--admin-border)">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-(--admin-title) truncate">
                        {field.label || '(Chưa đặt chủ đề)'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider bg-gray-500/10 text-gray-500">
                        {field.type || 'text'}
                      </span>
                      {field.width === 'half' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-amber-500/10 text-amber-600">
                          50% nửa dòng
                        </span>
                      )}
                      {field.required && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-red-500/10 text-red-500">
                          Bắt buộc
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveField(idx, -1)}
                        disabled={isFirst}
                        className="p-1 text-gray-400 hover:text-(--admin-title) disabled:opacity-30 disabled:cursor-not-allowed rounded cursor-pointer"
                        title="Di chuyển lên"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveField(idx, 1)}
                        disabled={isLast}
                        className="p-1 text-gray-400 hover:text-(--admin-title) disabled:opacity-30 disabled:cursor-not-allowed rounded cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(idx)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded cursor-pointer ml-1"
                        title="Xóa ô nhập liệu này"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Form điều chỉnh chi tiết ô nhập liệu */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
                    {/* Chủ đề / Nhãn */}
                    <div className="lg:col-span-5">
                      <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                        Chủ đề / Nhãn ô nhập (Label) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={field.label || ''}
                        onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                        placeholder="Ví dụ: TÊN DỰ ÁN SÁNG TẠO"
                        className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) font-semibold focus:outline-none focus:border-(--admin-accent)"
                      />
                      {errors[`field_label_${idx}`] && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {errors[`field_label_${idx}`]}
                        </p>
                      )}
                    </div>

                    {/* Placeholder */}
                    <div className="lg:col-span-4">
                      <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                        Gợi ý nhập liệu (Placeholder)
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => handleFieldChange(idx, 'placeholder', e.target.value)}
                        placeholder="Ví dụ: Nhập thông tin..."
                        className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                      />
                    </div>

                    {/* Loại ô nhập */}
                    <div className="lg:col-span-3">
                      <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                        Loại ô nhập
                      </label>
                      <select
                        value={field.type || 'text'}
                        onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                      >
                        <option value="text">Văn bản (Text)</option>
                        <option value="tel">Số điện thoại (Tel)</option>
                        <option value="email">Email</option>
                        <option value="number">Số lượng (Number)</option>
                        <option value="textarea">Văn bản dài (Textarea)</option>
                        <option value="select">Danh sách chọn (Dropdown)</option>
                      </select>
                    </div>

                    {/* Tùy chỉnh thêm: Độ rộng & Bắt buộc */}
                    <div className="lg:col-span-6 flex items-center gap-4 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                          Độ rộng trên Form
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-(--admin-title)">
                            <input
                              type="radio"
                              name={`field_width_${field.id || idx}`}
                              checked={field.width !== 'half'}
                              onChange={() => handleFieldChange(idx, 'width', 'full')}
                              className="text-(--admin-accent)"
                            />
                            <span>Toàn dòng (100%)</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-(--admin-title) ml-2">
                            <input
                              type="radio"
                              name={`field_width_${field.id || idx}`}
                              checked={field.width === 'half'}
                              onChange={() => handleFieldChange(idx, 'width', 'half')}
                              className="text-(--admin-accent)"
                            />
                            <span>Nửa dòng (50%)</span>
                          </label>
                        </div>
                      </div>

                      <div className="ml-auto flex items-center pt-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-(--admin-title)">
                          <input
                            type="checkbox"
                            checked={Boolean(field.required)}
                            onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
                            className="rounded border-gray-300 text-(--admin-accent) focus:ring-(--admin-accent)"
                          />
                          <span className="font-semibold">Bắt buộc nhập</span>
                        </label>
                      </div>
                    </div>

                    {/* Nếu loại là Select (Dropdown), cho phép nhập danh sách options */}
                    {field.type === 'select' && (
                      <div className="lg:col-span-6">
                        <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                          Danh sách lựa chọn (Phân cách bằng dấu phẩy)
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(field.options) ? field.options.join(', ') : ''}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const opts = raw
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean);
                            handleFieldChange(idx, 'options', opts);
                          }}
                          placeholder="Ví dụ: Phương án 1, Phương án 2, Phương án 3"
                          className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
                        />
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {Array.isArray(field.options) &&
                            field.options.map((opt, oIdx) => (
                              <span
                                key={oIdx}
                                className="inline-block px-2 py-0.5 rounded bg-(--admin-surface) border border-(--admin-border) text-[10px] text-(--admin-title)"
                              >
                                {opt}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* XEM TRƯỚC GIAO DIỆN FORM (LIVE PREVIEW) */}
      {showPreview && (
        <div className="pt-4 border-t border-(--admin-border)">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={16} className="text-(--admin-accent)" />
            <h4 className="text-sm font-bold text-(--admin-title)">
              Xem trước Giao diện Form thực tế
            </h4>
          </div>

          <div
            className="max-w-md mx-auto p-4 rounded-2xl shadow-xl transition-colors"
            style={{ backgroundColor: previewAccentColor }}
          >
            <div className="bg-white text-gray-800 p-6 rounded-xl shadow-md">
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: previewAccentColor }}
              >
                {previewFormTitle || '(Tiêu đề form)'}
              </h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                {previewFormDescription || '(Mô tả phản hồi của form)'}
              </p>

              {previewFormFields.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400 italic">
                  Chưa có ô nhập liệu nào để hiển thị xem trước.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {previewFormFields.map((field, idx) => {
                    const isHalf = field.width === 'half';
                    return (
                      <div
                        key={idx}
                        className={isHalf ? 'col-span-1' : 'col-span-1 sm:col-span-2'}
                      >
                        <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1 text-[10px]">
                          {field.label || `Ô NHẬP #${idx + 1}`}
                          {field.required && <span className="text-red-500 ml-0.5">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            disabled
                            className="w-full bg-[#fdf6ec] border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-xs focus:outline-none"
                          >
                            <option>
                              {field.placeholder ||
                                (field.options?.[0] ? field.options[0] : 'Vui lòng chọn...')}
                            </option>
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            disabled
                            rows={2}
                            placeholder={field.placeholder || ''}
                            className="w-full bg-[#fdf6ec] border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-xs placeholder-gray-400 focus:outline-none"
                          />
                        ) : (
                          <input
                            disabled
                            type="text"
                            placeholder={field.placeholder || ''}
                            className="w-full bg-[#fdf6ec] border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-xs placeholder-gray-400 focus:outline-none"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div
                className="w-full text-white font-bold py-3 px-4 rounded-lg uppercase tracking-wider text-xs shadow-md mt-4 flex items-center justify-center gap-2 select-none"
                style={{ backgroundColor: previewAccentColor }}
              >
                <span className="text-[10px]">▶</span>
                <span>{previewButtonText || 'Gửi Thông Tin'}</span>
              </div>
              {previewFooter}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
