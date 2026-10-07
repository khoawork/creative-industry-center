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
  const [formData, setFormData] = useState({
    founderName: '',
    brandName: '',
    category: 'craft',
    email: '',
    phone: '',
    storySummary: '',
  });

  useEffect(() => {
    fetchFormConfig('founder_story_submission').then((loaded) => {
      if (loaded) setConfig(loaded);
    });
  }, []);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-amber-900/10 relative">
        <div className="bg-gradient-to-r from-[#710008] to-[#450105] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Gửi Câu Chuyện Sáng Nghiệp</h3>
              <p className="text-xs text-amber-200/80">Chia sẻ hành trình của bạn cùng Trung tâm</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Họ và tên nhà sáng lập *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.founderName}
                    onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#710008] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tên thương hiệu / Doanh nghiệp *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="VD: Gốm Sứ Bát Tràng"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#710008] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Lĩnh vực hoạt động
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#710008] focus:border-transparent bg-white"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#710008] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email liên hệ *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@doanhnghiep.vn"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#710008] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tóm tắt câu chuyện / Dự án sáng tạo *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.storySummary}
                  onChange={(e) => setFormData({ ...formData, storySummary: e.target.value })}
                  placeholder="Chia sẻ ngắn gọn về hành trình khởi nghiệp, khó khăn đã vượt qua hoặc dấu ấn đặc biệt..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-[#710008] focus:border-transparent"
                ></textarea>
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
