import React, { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function ProjectForm({ formData }) {
  const tag = formData?.tag || "HỢP TÁC PHÁT TRIỂN & ĐỒNG HÀNH CHIẾN LƯỢC";
  const title =
    formData?.title || "ĐỀ XUẤT DỰ ÁN SÁNG TẠO HOẶC ĐĂNG KÝ ĐỒNG HÀNH CÙNG TRUNG TÂM";
  const description =
    formData?.description ||
    "Bạn là tổ chức, địa phương hay nhà sáng lập sở hữu công trình, giải pháp nghệ thuật hoặc công nghệ đột phá? Hãy nộp hồ sơ để nhận thẩm định chuyên gia, bảo trợ pháp lý và tiếp cận nguồn lực hệ sinh thái Viện Kỷ lục Việt Nam.";
  const benefits =
    Array.isArray(formData?.benefits) && formData.benefits.length > 0
      ? formData.benefits
      : [];
  const formTitle = formData?.form_title || "Gửi Đề Xuất Dự Án Mới";
  const formDescription =
    formData?.form_description ||
    "Ban Thư ký Hội đồng Khoa học sẽ phản hồi văn bản trong vòng 03 ngày làm việc.";
  const buttonText = formData?.button_text || "Gửi Hồ Sơ Dự Án";

  const formFields = Array.isArray(formData?.form_fields) ? formData.form_fields : [];

  const [formValues, setFormValues] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (fieldKey, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormValues({});
    }, 4500);
  };

  return (
    <div className="bg-[#710008] text-white py-16 px-6 md:px-20 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      {/* Cột trái: Thông tin giới thiệu */}
      <div className="lg:col-span-7">
        <span className="text-xs md:text-sm uppercase tracking-wider bg-[#ffffff30] text-[#e9c8a3] px-3 py-1 rounded font-semibold inline-block">
          {tag}
        </span>
        <h2 className="text-2xl md:text-4xl font-bold leading-tight mt-4 mb-4 uppercase">
          {title}
        </h2>
        <p className="text-sm md:text-base text-[#f7b8a9] leading-relaxed mb-6 max-w-2xl">
          {description}
        </p>
        {benefits.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {benefits.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <FiCheckCircle className="text-[#d49520] text-base shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cột phải: Form nhập */}
      <div className="bg-white text-gray-800 p-6 md:p-8 rounded-xl shadow-lg lg:col-span-5 w-full">
        <h3 className="text-xl font-bold text-[#710008] mb-1">
          {formTitle}
        </h3>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          {formDescription}
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-semibold text-center leading-relaxed">
            Cảm ơn bạn! Đề xuất dự án đã được gửi thành công đến Ban Thư ký Hội đồng Khoa học.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {formFields.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400 italic">
                Hiện chưa có ô nhập liệu nào được thiết lập.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {formFields.map((field, idx) => {
                  const fieldKey = field.id || `field_${idx}`;
                  const isHalf = field.width === "half";
                  const isRequired = Boolean(field.required);

                  return (
                    <div
                      key={fieldKey}
                      className={isHalf ? "col-span-1" : "col-span-1 sm:col-span-2"}
                    >
                      <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5 text-[11px]">
                        {field.label}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {field.type === "select" ? (
                        <select
                          required={isRequired}
                          value={formValues[fieldKey] || ""}
                          onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                          className="w-full bg-[#fdf6ec] border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-700 text-xs focus:outline-none focus:border-[#710008] transition"
                        >
                          <option value="">{field.placeholder || "Chọn " + field.label}</option>
                          {Array.isArray(field.options) &&
                            field.options.map((opt, oIdx) => (
                              <option key={oIdx} value={opt}>
                                {opt}
                              </option>
                            ))}
                        </select>
                      ) : field.type === "textarea" ? (
                        <textarea
                          rows={3}
                          required={isRequired}
                          placeholder={field.placeholder || ""}
                          value={formValues[fieldKey] || ""}
                          onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                          className="w-full bg-[#fdf6ec] border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-700 text-xs placeholder-gray-400 focus:outline-none focus:border-[#710008] transition"
                        />
                      ) : (
                        <input
                          type={field.type || "text"}
                          required={isRequired}
                          placeholder={field.placeholder || ""}
                          value={formValues[fieldKey] || ""}
                          onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                          className="w-full bg-[#fdf6ec] border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-700 text-xs placeholder-gray-400 focus:outline-none focus:border-[#710008] transition"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {formFields.length > 0 && (
              <button
                type="submit"
                className="w-full bg-[#710008] hover:bg-[#590006] text-white font-bold py-3.5 px-4 rounded-lg transition duration-200 uppercase tracking-wider text-xs shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span className="text-[11px] transform group-hover:translate-x-0.5 transition-transform">
                  ▶
                </span>
                <span>{buttonText}</span>
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
