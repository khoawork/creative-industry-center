import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { CATEGORIES } from '../../data/founderStoriesData';
import {
  fetchFormConfig,
  submitFormToBackend,
  DEFAULT_FORM_CONFIGS,
} from '../../services/googleSheetService.js';

export const SubmitStoryModal = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState(DEFAULT_FORM_CONFIGS.founder_story_submission);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchFormConfig('founder_story_submission').then((loaded) => {
      if (loaded) {
        setConfig(loaded);
        const initial = {};
        (loaded.fields || []).forEach((f) => {
          initial[f.key] = '';
        });
        setFormData(initial);
      }
    });
  }, []);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitFormToBackend('founder_story_submission', formData, config);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Lỗi khi gửi câu chuyện sáng nghiệp:', err);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = config.fields || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-amber-900/10 relative">
        <div className="bg-gradient-to-r from-[#710008] to-[#450105] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{config.title || "Gửi Câu Chuyện Sáng Nghiệp"}</h3>
              <p className="text-xs text-amber-200/80">{config.subtitle || "Chia sẻ hành trình của bạn cùng Trung tâm"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Gửi thông tin thành công!</h4>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Cảm ơn bạn đã gửi câu chuyện. Ban biên tập sẽ liên hệ lại với bạn trong vòng 48 giờ làm việc để hoàn thiện nội dung.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>

                      {field.type === 'textarea' ? (
                        <textarea
                          required={field.required}
                          rows={3}
                          value={formData[key] ?? ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder={field.placeholder || ''}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#710008] focus:border-transparent"
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={formData[key] ?? ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          required={field.required}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#710008] focus:border-transparent bg-white"
                        >
                          <option value="">{field.placeholder || '-- Chọn --'}</option>
                          {key === 'category' && (!field.options || field.options.length === 0)
                            ? CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.label}
                                </option>
                              ))
                            : (field.options || []).map((opt, oIdx) => (
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
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#710008] focus:border-transparent"
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
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#710008] hover:bg-[#590108] rounded-lg shadow-sm cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang gửi câu chuyện...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi Ban Biên Tập</span>
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

export default SubmitStoryModal;
