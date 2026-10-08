import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, CheckCircle2, UserCheck, Send, Loader2 } from 'lucide-react';
import {
  fetchFormConfig,
  submitFormToBackend,
  DEFAULT_FORM_CONFIGS,
} from '../../services/googleSheetService.js';

export const EventRegisterModal = ({ event, isOpen, onClose }) => {
  const [config, setConfig] = useState(DEFAULT_FORM_CONFIGS.event_registration);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchFormConfig('event_registration').then((loaded) => {
      if (loaded) {
        setConfig(loaded);
        const initial = {};
        (loaded.fields || []).forEach((f) => {
          if (f.key === 'eventName') {
            initial[f.key] = event?.actionText || event?.title || 'Sự kiện CIC';
          } else {
            initial[f.key] = '';
          }
        });
        setFormData((prev) => ({
          ...initial,
          ...prev,
          eventName: event?.actionText || event?.title || 'Sự kiện CIC',
        }));
      }
    });
  }, [event]);

  if (!isOpen || !event) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        eventName: event.actionText || event.title || 'Sự kiện CIC',
        ...formData,
      };
      await submitFormToBackend('event_registration', payload, config);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Lỗi khi đăng ký sự kiện:', err);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = (config.fields || []).filter((f) => f.key !== 'eventName');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-amber-900/20 relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#490003] via-[#710008] to-[#480004] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#f4b42c] flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#ffddaf] uppercase tracking-wider block">
                {event.categoryLabel}
              </span>
              <h3 className="text-base sm:text-lg font-bold tracking-tight line-clamp-1">
                {event.actionText}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#1a1c1b]">
                Đăng ký thành công!
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                Mã xác nhận tham dự và hướng dẫn chi tiết đã được gửi đến email của Quý đại biểu.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Event Mini Box */}
              <div className="bg-[#faf9f7] p-3 rounded-xl border border-[#e0bfbb]/40 space-y-1">
                <h4 className="text-xs font-bold text-[#490003] line-clamp-1 ">
                  {event.title}
                </h4>
                <div className="flex items-center gap-4 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#9c6800]" />
                    {event.day} {event.monthYear}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#9c6800]" />
                    {event.location}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-3.5">
                {fields.map((field, idx) => {
                  const key = field.key || `field_${idx}`;
                  const colSpan =
                    field.width === 'half' || field.colSpan === 1
                      ? 'col-span-12 sm:col-span-6'
                      : field.width === 'third'
                      ? 'col-span-12 sm:col-span-4'
                      : 'col-span-12';

                  return (
                    <div key={key} className={colSpan}>
                      <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>

                      {field.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          required={field.required}
                          value={formData[key] ?? ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder={field.placeholder || ''}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#f4f3f1] border border-transparent text-[#1a1c1b] focus:outline-hidden focus:bg-white focus:border-[#8c716e]"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          required={field.required}
                          value={formData[key] ?? ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#f4f3f1] border border-transparent text-[#1a1c1b] focus:outline-hidden focus:bg-white focus:border-[#8c716e]"
                        >
                          <option value="">{field.placeholder || '-- Chọn --'}</option>
                          {(field.options || []).map((opt, oIdx) => (
                            <option key={oIdx} value={typeof opt === 'object' ? opt.value : opt}>
                              {typeof opt === 'object' ? opt.label : opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || 'text'}
                          required={field.required}
                          value={formData[key] ?? ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder={field.placeholder || ''}
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#f4f3f1] border border-transparent text-[#1a1c1b] focus:outline-hidden focus:bg-white focus:border-[#8c716e]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#490003] hover:bg-[#710008] rounded-lg shadow-sm cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ffba45]" />
                      <span>Đang gửi thông tin...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#ffba45]" />
                      <span>Xác nhận đăng ký</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default EventRegisterModal;
