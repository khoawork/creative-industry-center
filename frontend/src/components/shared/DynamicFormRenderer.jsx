import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  MessageSquareText,
  ChevronDown,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Hash,
  CheckSquare,
  Lock,
} from 'lucide-react';

/**
 * Helper ánh xạ icon theo tên hoặc loại trường
 */
function getFieldIcon(field) {
  const key = String(field.key || field.id || '').toLowerCase();
  const type = String(field.type || '').toLowerCase();

  if (type === 'email' || key.includes('email')) return <Mail size={18} />;
  if (type === 'tel' || key.includes('phone') || key.includes('tel')) return <Phone size={18} />;
  if (type === 'date' || key.includes('date') || key.includes('ngay')) return <Calendar size={18} />;
  if (type === 'time' || key.includes('time') || key.includes('gio')) return <Clock size={18} />;
  if (type === 'number' || key.includes('count') || key.includes('so')) return <Hash size={18} />;
  if (type === 'textarea' || key.includes('message') || key.includes('note') || key.includes('content') || key.includes('summary')) {
    return <MessageSquareText size={18} />;
  }
  if (key.includes('name') || key.includes('ten') || key.includes('author') || key.includes('founder')) {
    return <User size={18} />;
  }
  return <FileText size={18} />;
}

/**
 * Chuyển đổi thuộc tính width / colSpan thành Tailwind Grid col-span
 */
function getColSpanClass(field) {
  const width = field.width;
  const colSpan = field.colSpan;

  if (width === 'third' || colSpan === 4) return 'col-span-12 md:col-span-4';
  if (width === 'two-thirds' || colSpan === 8) return 'col-span-12 md:col-span-8';
  if (width === 'quarter' || colSpan === 3) return 'col-span-12 sm:col-span-6 md:col-span-3';
  if (width === 'half' || colSpan === 1 || colSpan === 6) return 'col-span-12 md:col-span-6';
  return 'col-span-12';
}

/**
 * DynamicFormRenderer
 * Component hiển thị biểu mẫu động chuẩn hóa cho toàn bộ website
 *
 * Props:
 * - config: Object cấu hình form (hỗ trợ cả chuẩn Base FormBuilder và GoogleSheetService)
 * - onSubmit: (values) => Promise<void> | void
 * - isSubmitting: boolean
 * - isSuccess: boolean
 * - successMessage: string
 * - preview: boolean (chế độ xem trước, các input sẽ ở dạng readOnly/disabled)
 * - className: string
 */
export default function DynamicFormRenderer({
  config = {},
  onSubmit,
  isSubmitting = false,
  isSuccess = false,
  successMessage,
  preview = false,
  className = '',
}) {
  // Lấy danh sách trường (hỗ trợ cả form_fields và fields)
  const rawFields = Array.isArray(config?.form_fields)
    ? config.form_fields
    : Array.isArray(config?.fields)
    ? config.fields
    : [];

  // Lấy các thông tin tiêu đề và nút bấm
  const title = config?.form_title || config?.title || '';
  const description = config?.form_description || config?.subtitle || '';
  const badgeText = config?.badgeText || config?.badge_text || '';
  const buttonText = config?.button_text || config?.submitButtonText || 'Gửi Thông Tin';
  const buttonAlign = config?.button_align || 'left'; // left | center | right | full
  const accentColor = config?.accent_color || config?.theme_color || '#710008';
  const privacyText = config?.privacy_text || config?.privacyText || '';

  // Form State
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  // Xử lý thay đổi giá trị
  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (preview) return;

    setSubmittedAttempt(true);
    const newErrors = {};

    rawFields.forEach((field, index) => {
      const fieldKey = field.key || field.id || `field_${index}`;
      const val = formData[fieldKey];

      if (field.required) {
        if (val === undefined || val === null || String(val).trim() === '') {
          newErrors[fieldKey] = `Vui lòng nhập ${field.label || 'trường này'}`;
        }
      }

      if (val && field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(val).trim())) {
          newErrors[fieldKey] = 'Địa chỉ email không hợp lệ';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (typeof onSubmit === 'function') {
      try {
        await onSubmit(formData);
      } catch (err) {
        console.error('Lỗi khi gửi form:', err);
      }
    }
  };

  // Xác định class căn lề nút bấm
  const getButtonAlignClass = () => {
    switch (buttonAlign) {
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      case 'full':
        return 'w-full';
      default:
        return 'justify-start';
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-black/5 overflow-hidden transition-all ${className}`}
    >
      {/* Vạch kẻ trang trí trên đầu mang phong cách Kỷ lục */}
      <div
        className="absolute inset-x-0 top-0 h-1.5 flex justify-between overflow-hidden"
        style={{ backgroundColor: accentColor }}
      >
        <span className="w-28 bg-[#f4b42c]" />
        <span className="w-12 bg-[#f4b42c]" />
      </div>

      {/* Header của biểu mẫu */}
      {(title || description || badgeText) && (
        <div className="pb-6 border-b border-gray-100">
          {badgeText && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 bg-amber-50 text-amber-900 border border-amber-200">
              <span className="size-1.5 rounded-full bg-amber-500" />
              {badgeText}
            </div>
          )}
          {title && (
            <h3
              className="text-xl sm:text-2xl font-bold tracking-tight uppercase"
              style={{ color: accentColor }}
            >
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {rawFields.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 italic">
            Chưa có trường nhập liệu nào được cấu hình trong biểu mẫu.
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {rawFields.map((field, index) => {
              const fieldKey = field.key || field.id || `field_${index}`;
              const fieldType = field.type || 'text';
              const colSpanClass = getColSpanClass(field);
              const icon = getFieldIcon(field);
              const error = errors[fieldKey];
              const value = formData[fieldKey] ?? field.defaultValue ?? '';
              const options = Array.isArray(field.options) ? field.options : [];
              const isLocked = Boolean(field.readOnly || field.disabled || fieldKey === 'courseCode' || fieldKey === 'courseName' || preview);

              return (
                <div key={fieldKey} className={colSpanClass}>
                  <label
                    htmlFor={`input-${fieldKey}`}
                    className="flex items-center justify-between text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5"
                  >
                    <span>
                      {field.label || `Trường #${index + 1}`}
                      {field.required && (
                        <span className="text-red-500 ml-1 font-bold">*</span>
                      )}
                    </span>
                    {(field.readOnly || fieldKey === 'courseCode' || fieldKey === 'courseName') && !preview && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded normal-case">
                        <Lock size={10} /> Cố định
                      </span>
                    )}
                  </label>

                  {/* Render theo Field Type */}
                  <div className="relative">
                    {fieldType === 'textarea' ? (
                      <div className="relative">
                        <textarea
                          id={`input-${fieldKey}`}
                          name={fieldKey}
                          rows={field.rows || 3}
                          value={value}
                          readOnly={preview}
                          disabled={preview}
                          placeholder={field.placeholder || 'Nhập nội dung...'}
                          onChange={(e) => handleChange(fieldKey, e.target.value)}
                          className={`w-full rounded-xl border bg-[#faf8f5] px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-amber-500/20 ${
                            error
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-200 focus:border-amber-600'
                          } ${preview ? 'opacity-80 cursor-default' : ''}`}
                        />
                      </div>
                    ) : fieldType === 'select' ? (
                      <div className="relative">
                        <select
                          id={`input-${fieldKey}`}
                          name={fieldKey}
                          value={value}
                          disabled={preview}
                          onChange={(e) => handleChange(fieldKey, e.target.value)}
                          className={`w-full appearance-none rounded-xl border bg-[#faf8f5] pl-3.5 pr-10 py-2.5 text-sm text-gray-900 outline-none transition focus:bg-white focus:ring-2 focus:ring-amber-500/20 cursor-pointer ${
                            error
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-200 focus:border-amber-600'
                          } ${preview ? 'opacity-80 cursor-default' : ''}`}
                        >
                          <option value="">
                            {field.placeholder || '-- Vui lòng chọn một tùy chọn --'}
                          </option>
                          {options.map((opt, optIdx) => {
                            const optVal = typeof opt === 'object' ? opt.value : opt;
                            const optLabel = typeof opt === 'object' ? opt.label : opt;
                            return (
                              <option key={optIdx} value={optVal}>
                                {optLabel}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3 top-3 text-gray-400"
                        />
                      </div>
                    ) : fieldType === 'checkbox' ? (
                      <label className="flex items-center gap-2.5 py-2 cursor-pointer select-none">
                        <input
                          id={`input-${fieldKey}`}
                          type="checkbox"
                          name={fieldKey}
                          checked={Boolean(value)}
                          disabled={preview}
                          onChange={(e) => handleChange(fieldKey, e.target.checked)}
                          className="size-4.5 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700">
                          {field.placeholder || field.label || 'Tôi đồng ý'}
                        </span>
                      </label>
                    ) : fieldType === 'radio' ? (
                      <div className="flex flex-wrap gap-4 py-1.5">
                        {options.map((opt, optIdx) => {
                          const optVal = typeof opt === 'object' ? opt.value : opt;
                          const optLabel = typeof opt === 'object' ? opt.label : opt;
                          return (
                            <label
                              key={optIdx}
                              className="inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                            >
                              <input
                                type="radio"
                                name={fieldKey}
                                value={optVal}
                                checked={value === optVal}
                                disabled={preview}
                                onChange={(e) => handleChange(fieldKey, e.target.value)}
                                className="size-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                              />
                              <span>{optLabel}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          id={`input-${fieldKey}`}
                          name={fieldKey}
                          type={fieldType}
                          value={value}
                          readOnly={isLocked}
                          disabled={isLocked}
                          placeholder={field.placeholder || ''}
                          onChange={(e) => {
                            if (isLocked) return;
                            handleChange(fieldKey, e.target.value);
                          }}
                          className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm transition outline-none ${
                            isLocked && !preview
                              ? 'bg-gray-100/90 text-gray-700 border-gray-300 cursor-not-allowed select-none font-medium'
                              : 'bg-[#faf8f5] text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-amber-500/20'
                          } ${
                            error
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-gray-200 focus:border-amber-600'
                          } ${preview ? 'opacity-80 cursor-default' : ''} ${
                            fieldKey === 'courseCode' ? 'font-mono font-bold' : ''
                          }`}
                        />
                        <div className="pointer-events-none absolute left-3 top-2.5 text-amber-600/70">
                          {icon}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thông báo lỗi validation */}
                  {error && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500 font-medium animate-in fade-in duration-150">
                      <AlertCircle size={13} />
                      {error}
                    </p>
                  )}

                  {/* Chú thích phụ (Help text) */}
                  {field.helpText && !error && (
                    <p className="mt-1 text-[11px] text-gray-400">{field.helpText}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Thông báo gửi thành công */}
        {isSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 flex items-start gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <p className="font-bold">Đã gửi thông tin thành công!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                {successMessage ||
                  'Cảm ơn Quý vị. Ban Thư ký Trung tâm đã tiếp nhận và sẽ liên hệ hỗ trợ trong thời gian sớm nhất.'}
              </p>
            </div>
          </div>
        )}

        {/* Nút hành động Submit */}
        <div className={`pt-3 flex ${getButtonAlignClass()}`}>
          <button
            type="submit"
            disabled={isSubmitting || preview}
            className={`group inline-flex items-center justify-center gap-2.5 rounded-xl px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-98 disabled:opacity-50 cursor-pointer ${
              buttonAlign === 'full' ? 'w-full' : ''
            }`}
            style={{ backgroundColor: accentColor }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin text-amber-300" />
                <span>Đang xử lý thông tin...</span>
              </>
            ) : (
              <>
                <span>{buttonText}</span>
                <Send
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </div>

        {/* Ghi chú bảo mật / SLA */}
        {privacyText && (
          <p className="pt-2 text-center text-xs text-gray-400 leading-relaxed border-t border-gray-100">
            🔒 {privacyText}
          </p>
        )}
      </form>
    </div>
  );
}

