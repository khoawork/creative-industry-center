import { useState, useEffect } from "react";
import { Mail, ShieldCheck, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import {
  getFormConfig,
  fetchFormConfig,
  submitFormToBackend,
  DEFAULT_FORM_CONFIGS,
} from "../../services/googleSheetService.js";

export const EventNewsletter = () => {
  const [config, setConfig] = useState(DEFAULT_FORM_CONFIGS.event_newsletter);
  const [formData, setFormData] = useState({});
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Tải cấu hình form động từ service & backend
  useEffect(() => {
    fetchFormConfig("event_newsletter").then((loaded) => {
      if (loaded) {
        setConfig(loaded);
        // Khởi tạo formData theo danh sách fields
        const initial = {};
        (loaded.fields || []).forEach((f) => {
          initial[f.key] = "";
        });
        setFormData(initial);
      }
    });
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!agreed) {
      setErrorMessage("Vui lòng tích chọn đồng ý tiếp nhận thông tin.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Gửi dữ liệu qua Backend API (Backend tự động đẩy vào Google Sheet & lưu DB dự phòng)
      const res = await submitFormToBackend("event_newsletter", formData, config);

      if (res?.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          // Reset form
          const resetData = {};
          (config.fields || []).forEach((f) => {
            resetData[f.key] = "";
          });
          setFormData(resetData);
        }, 5000);
      } else {
        setErrorMessage(res?.message || "Không thể gửi thông tin lúc này. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi gửi biểu mẫu:", error);
      setErrorMessage(
        "Không thể gửi thông tin vào lúc này. Quý đại biểu vui lòng thử lại sau hoặc liên hệ hotline."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = config.fields || [];

  return (
    <section className="max-w-5xl mx-auto my-14 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-[#e0bfbb]/50 shadow-md p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#490003] via-[#710008] to-[#f4b42c]"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Info & Trust */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="inline-flex items-center gap-2 text-[#9c6800] text-xs font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4 text-[#f4b42c]" />
              <span>{config.badgeText || "BẢN TIN VIỆN KỶ LỤC"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1c1b] tracking-tight leading-snug">
              {config.title || "Đăng Ký Nhận Thông Báo Sự Kiện Sớm"}
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify sm:text-left">
              {config.subtitle ||
                "Nhận thư mời ưu tiên, tài liệu kỷ yếu và thông cáo báo chí chính thức trực tiếp từ Ban Thư ký Trung tâm Công nghiệp Sáng tạo."}
            </p>

            {config.trustBadge && (
              <div className="pt-3 flex items-start gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-[#9c6800] shrink-0 mt-0.5" />
                <span>{config.trustBadge}</span>
              </div>
            )}
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-[#faf9f7] border border-emerald-200 rounded-2xl p-8 text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#1a1c1b]">
                  {config.successTitle || "Đăng ký nhận thông báo thành công!"}
                </h4>
                <p className="text-xs text-gray-600">
                  {config.successMessage ||
                    "Cảm ơn Quý đại biểu. Thông báo sự kiện mới nhất sẽ được gửi đến hộp thư của Quý vị."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {fields.map((field) => {
                    const isFullWidth = field.colSpan === 2 || field.type === "textarea";
                    return (
                      <div
                        key={field.key}
                        className={isFullWidth ? "sm:col-span-2" : ""}
                      >
                        <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            rows={3}
                            required={field.required}
                            value={formData[field.key] || ""}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder || ""}
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm bg-white border border-[#e2d9cd] text-[#1a1c1b] placeholder-gray-400 focus:outline-hidden focus:bg-white focus:border-[#710008] transition-all"
                          />
                        ) : field.type === "select" ? (
                          <select
                            required={field.required}
                            value={formData[field.key] || ""}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm bg-white border border-[#e2d9cd] text-[#1a1c1b] focus:outline-hidden focus:bg-white focus:border-[#710008] transition-all"
                          >
                            <option value="">-- Chọn {field.label} --</option>
                            {(field.options || []).map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type || "text"}
                            required={field.required}
                            value={formData[field.key] || ""}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder || ""}
                            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm bg-white border border-[#e2d9cd] text-[#1a1c1b] placeholder-gray-400 focus:outline-hidden focus:bg-white focus:border-[#710008] transition-all"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="agreed"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 text-[#490003] focus:ring-[#490003] cursor-pointer bg-white"
                  />
                  <label
                    htmlFor="agreed"
                    className="text-xs text-gray-600 leading-snug cursor-pointer select-none"
                  >
                    Tôi đồng ý tiếp nhận các tài liệu và thông tin sự kiện từ VIETKINGS.
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-sm bg-[#490003] hover:bg-[#710008] text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#ffba45]" />
                        <span>Đang gửi thông tin...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#ffba45]" />
                        <span>{config.submitButtonText || "Xác Nhận Đăng Ký Thông Báo"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventNewsletter;
