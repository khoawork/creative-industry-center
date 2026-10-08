import React, { useCallback, useEffect, useState } from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  fetchFormConfig,
  submitFormToBackend,
} from '../../services/googleSheetService.js';

const createFormValues = (fields = [], values = {}) =>
  Object.fromEntries(fields.map((field) => [field.key, values[field.key] ?? '']));

export default function ForumRegistration({ data, isOpen, onClose }) {
  const regSection = data || {};
  const hotline = regSection.hotline || '';
  const email = regSection.email || '';
  const address = regSection.address || '';
  const privacyText = regSection.privacy_text || '';

  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formConfig, setFormConfig] = useState(null);
  const tag = formConfig?.badgeText || regSection.tag || '';
  const title = formConfig?.title || regSection.title || '';
  const description = formConfig?.subtitle || regSection.description || '';
  const buttonText = formConfig?.submitButtonText || regSection.button_text || '';

  const closeModal = useCallback(() => {
    if (submitting) return;
    setSubmitted(false);
    setErrorMsg('');
    onClose?.();
  }, [onClose, submitting]);

  useEffect(() => {
    let isMounted = true;
    if (Array.isArray(regSection.form_fields) && regSection.form_fields.length > 0) {
      const mapped = {
        title: regSection.title,
        subtitle: regSection.description,
        badgeText: regSection.tag,
        submitButtonText: regSection.button_text,
        fields: regSection.form_fields.map((f) => ({
          key: f.id || f.key,
          label: f.label,
          type: f.type,
          placeholder: f.placeholder,
          required: Boolean(f.required),
          colSpan: f.width === 'half' ? 1 : 2,
          options: f.options,
        })),
      };
      setFormConfig(mapped);
      setForm((current) => createFormValues(mapped.fields, current));
    } else {
      fetchFormConfig('forum_registration').then((config) => {
        if (!isMounted || !config) return;
        setFormConfig(config);
        setForm((current) => createFormValues(config.fields, current));
      });
    }
    return () => {
      isMounted = false;
    };
  }, [regSection]);

  const renderField = (field) => {
    const commonProps = {
      id: `forum-registration-${field.key}`,
      name: field.key,
      value: form[field.key] ?? '',
      onChange: handleChange,
      required: Boolean(field.required),
      placeholder: field.placeholder || '',
      className: 'w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none sm:text-sm',
    };

    if (field.type === 'textarea') {
      return <textarea {...commonProps} rows={4} />;
    }
    if (field.type === 'select') {
      const options = Array.isArray(field.options) ? field.options : [];
      return (
        <select {...commonProps}>
          <option value="">{field.placeholder || 'Vui lòng chọn'}</option>
          {options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const label = typeof option === 'string' ? option : option.label;
            return <option key={value} value={value}>{label}</option>;
          })}
        </select>
      );
    }
    const supportedTypes = ['text', 'email', 'tel', 'number', 'date'];
    const type = supportedTypes.includes(field.type) ? field.type : 'text';
    return <input {...commonProps} type={type} />;
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeModal();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formConfig?.fields?.length) {
      setErrorMsg('Biểu mẫu đăng ký chưa sẵn sàng. Vui lòng thử lại sau.');
      return;
    }
    const missingField = formConfig.fields.find(
      (field) => field.required && !String(form[field.key] ?? '').trim(),
    );
    if (missingField) {
      setErrorMsg(`Vui lòng điền đầy đủ thông tin: ${missingField.label}.`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitFormToBackend(
        'forum_registration',
        {
          eventName: 'Diễn đàn Kinh tế Kỷ lục 2026',
          ...form,
        },
        formConfig,
      );
      if (result?.offline || result?.success === false) {
        throw new Error('Backend did not accept forum registration');
      }
      setSubmitted(true);
    } catch (error) {
      console.error('Lỗi khi đăng ký tham dự Diễn đàn:', error);
      setErrorMsg('Không thể gửi đăng ký lúc này. Vui lòng thử lại hoặc liên hệ Ban Tổ chức.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="forum-registration-title"
        className="relative my-auto max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-blue-100 bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-blue-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-800">
              <Sparkles size={13} />
              {tag}
            </div>
            <h2 id="forum-registration-title" className="text-lg font-extrabold leading-tight text-[#092d63] sm:text-xl">
              {title}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            disabled={submitting}
            aria-label="Đóng cửa sổ đăng ký"
            className="shrink-0 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 bg-[#f7fafe] p-4 sm:p-6 lg:grid-cols-12 lg:gap-7 lg:p-7">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <div className="text-xs font-extrabold tracking-widest uppercase text-blue-800 mb-2">
                BAN TỔ CHỨC TIẾP NHẬN
              </div>
              <h3 className="text-xl font-bold text-[#001947] uppercase mb-4">
                Hỗ Trợ & Tiếp Đón Đại Biểu
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Mọi thắc mắc về điều kiện tham dự, đăng ký gian hàng triển lãm B2B hoặc hồ sơ xét duyệt vinh danh, quý đại biểu vui lòng liên hệ trực tiếp:
              </p>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-700 shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Đường dây nóng</div>
                    <a
                      href={`tel:${hotline}`}
                      className="text-blue-700 font-bold hover:underline"
                    >
                      {hotline}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-700 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Thư điện tử</div>
                    <a
                      href={`mailto:${email}`}
                      className="text-blue-700 font-bold hover:underline"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-700 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Địa điểm tổ chức</div>
                    <span className="text-slate-600">{address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-blue-200/60 flex items-start gap-2.5 text-xs text-slate-500">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{privacyText}</span>
            </div>
          </div>

          {/* Right: Actual Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h4 className="text-xl font-bold text-[#001947]">
                  Đăng Ký Thành Công!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Cảm ơn Quý đại biểu <strong>{form.fullName || ''}</strong>. Ban Thư ký Diễn đàn đã ghi nhận thông tin và sẽ liên hệ xác nhận thẻ đại biểu qua email/số điện thoại trong vòng 24 giờ làm việc.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm(createFormValues(formConfig.fields));
                  }}
                  className="px-6 py-2 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors mt-4"
                >
                  Đăng ký thêm đại biểu khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {!formConfig?.fields?.length ? (
                  <p className="text-sm text-slate-500">Đang tải cấu hình biểu mẫu...</p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {formConfig.fields.map((field) => (
                      <div key={field.key} className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
                        <label
                          htmlFor={`forum-registration-${field.key}`}
                          className="mb-1 block text-xs font-semibold text-slate-700"
                        >
                          {field.label}
                          {field.required && <span className="text-red-500"> *</span>}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !formConfig?.fields?.length}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-blue-700 to-[#001947] hover:from-blue-600 hover:to-blue-900 text-white shadow-lg shadow-blue-900/20 hover:scale-[1.01] transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Đang xử lý đăng ký...</span>
                    ) : (
                      <>
                        <span>{buttonText}</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
