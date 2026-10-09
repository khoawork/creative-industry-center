import React, { useState } from "react";
import {
  Award,
  Scroll,
  Share2,
  Sparkles,
  ShieldCheck,
  Users,
  FileCheck,
  CheckCircle,
  Play,
  Send,
} from "lucide-react";

// Danh sách trường mặc định nếu chưa được cấu hình
const DEFAULT_FORM_FIELDS = [
  {
    id: "org_name",
    label: "TÊN CƠ QUAN / CHỦ NHIỆM DỰ ÁN",
    placeholder: "Ví dụ: Tập đoàn Công nghệ & Di sản Văn hóa...",
    type: "text",
    required: true,
    width: "full",
  },
  {
    id: "project_name",
    label: "TÊN DỰ ÁN SÁNG TẠO",
    placeholder: "Ví dụ: Khu bảo tồn tương tác nghệ thuật số...",
    type: "text",
    required: true,
    width: "full",
  },
  {
    id: "phone",
    label: "SỐ ĐIỆN THOẠI",
    placeholder: "0987xxxxxx",
    type: "tel",
    required: true,
    width: "half",
  },
  {
    id: "location",
    label: "ĐỊA BÀN TRIỂN KHAI",
    placeholder: "Chọn địa bàn",
    type: "select",
    options: ["Toàn quốc", "Miền Bắc", "Miền Trung", "Miền Nam", "TP. Hồ Chí Minh", "Hà Nội"],
    required: true,
    width: "half",
  },
  {
    id: "collaboration_need",
    label: "NHU CẦU HỢP TÁC",
    placeholder: "Chọn nhu cầu hợp tác",
    type: "select",
    options: [
      "Đề cử xác lập Kỷ lục Quốc gia & Cố vấn chuyên môn",
      "Tư vấn chiến lược & Bảo trợ truyền thông",
      "Đầu tư sản xuất & Thương mại hóa",
      "Kết nối mạng lưới chuyên gia & Nhà khoa học",
    ],
    required: true,
    width: "full",
  },
];

// Mặc định 3 cam kết chuẩn
const DEFAULT_BENEFITS = [
  { icon: "badge", text: "Bảo chứng Kỷ lục Quốc gia" },
  { icon: "scroll", text: "Tư vấn Sở hữu Trí tuệ" },
  { icon: "network", text: "Kết nối Mạng lưới Chuyên gia" },
];

export default function ProjectForm({ formData }) {
  const tag = formData?.tag || "HỢP TÁC PHÁT TRIỂN & ĐỒNG HÀNH CHIẾN LƯỢC";
  const title =
    formData?.title || "ĐỀ XUẤT DỰ ÁN SÁNG TẠO HOẶC ĐĂNG KÝ ĐỒNG HÀNH CÙNG TRUNG TÂM";
  const description =
    formData?.description ||
    "Bạn là tổ chức, địa phương hay nhà sáng lập sở hữu công trình, giải pháp nghệ thuật hoặc công nghệ đột phá? Hãy nộp hồ sơ để nhận thẩm định chuyên gia, bảo trợ pháp lý và tiếp cận nguồn lực hệ sinh thái Viện Kỷ lục Việt Nam.";

  // Chuẩn hóa benefits
  const rawBenefits =
    Array.isArray(formData?.benefits) && formData.benefits.length > 0
      ? formData.benefits
      : DEFAULT_BENEFITS;

  const benefits = rawBenefits.map((b, idx) => {
    if (typeof b === "string") {
      const defaultIconKeys = ["badge", "scroll", "network"];
      return {
        icon: defaultIconKeys[idx % defaultIconKeys.length],
        text: b,
      };
    }
    return {
      icon: b.icon || "badge",
      text: b.text || b.label || "",
    };
  });

  const formTitle = formData?.form_title || "Gửi Đề Xuất Dự Án Mới";
  const formDescription =
    formData?.form_description ||
    "Ban Thư ký Hội đồng Khoa học sẽ phản hồi văn bản trong vòng 03 ngày làm việc.";
  const buttonText = formData?.button_text || "Gửi Hồ Sơ Dự Án";

  const formFields =
    Array.isArray(formData?.form_fields) && formData.form_fields.length > 0
      ? formData.form_fields
      : DEFAULT_FORM_FIELDS;

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

  const renderBenefitIcon = (iconKey) => {
    switch (iconKey) {
      case "badge":
      case "award":
        return <Award className="text-[#f59e0b] shrink-0" size={20} />;
      case "scroll":
      case "file":
      case "legal":
        return <Scroll className="text-[#f59e0b] shrink-0" size={20} />;
      case "network":
      case "users":
      case "share":
        return <Share2 className="text-[#f59e0b] shrink-0" size={20} />;
      case "shield":
        return <ShieldCheck className="text-[#f59e0b] shrink-0" size={20} />;
      default:
        return <CheckCircle className="text-[#f59e0b] shrink-0" size={20} />;
    }
  };

  return (
    <section className="bg-[#710008] text-white py-16 px-6 md:px-14 lg:px-20 mt-16 relative overflow-hidden">
      {/* Nền hiệu ứng hoa văn nhẹ */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-50" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Cột trái: Thông tin giới thiệu & Quyền lợi */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#ffffff18] border border-amber-300/30 text-amber-200 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
            <span>{tag}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold leading-tight uppercase  tracking-tight text-white">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-[#ffb4ac] leading-relaxed max-w-2xl font-light">
            {description}
          </p>

          {/* 3 Cam kết / Lợi ích */}
          {benefits.length > 0 && (
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs hover:bg-white/10 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    {renderBenefitIcon(b.icon)}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                    {b.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cột phải: Form nộp hồ sơ */}
        <div className="bg-white text-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl lg:col-span-5 w-full border border-white/20">
          <h3 className="text-xl sm:text-2xl font-bold text-[#710008] mb-1.5">
            {formTitle}
          </h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {formDescription}
          </p>

          {submitted ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl font-medium text-center leading-relaxed space-y-2">
              <div className="inline-flex p-2 rounded-full bg-emerald-100 text-emerald-600 mb-1">
                <CheckCircle size={24} />
              </div>
              <p className="font-bold text-emerald-900">Gửi hồ sơ thành công!</p>
              <p className="text-xs text-emerald-700">
                Ban Thư ký Hội đồng Khoa học sẽ phản hồi văn bản trong vòng 03 ngày làm việc.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-12 gap-3.5">
                {formFields.map((field, idx) => {
                  const fieldKey = field.id || `field_${idx}`;
                  const isRequired = Boolean(field.required);
                  const colSpan =
                    field.width === 'half' || field.colSpan === 1
                      ? 'col-span-12 sm:col-span-6'
                      : field.width === 'third'
                      ? 'col-span-12 sm:col-span-4'
                      : field.width === 'quarter'
                      ? 'col-span-12 sm:col-span-3'
                      : field.width === 'two-thirds'
                      ? 'col-span-12 sm:col-span-8'
                      : 'col-span-12';

                  return (
                    <div
                      key={fieldKey}
                      className={colSpan}
                    >
                      <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5 text-[11px]">
                        {field.label}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {field.type === "select" ? (
                        <div className="relative">
                          <select
                            required={isRequired}
                            value={formValues[fieldKey] || ""}
                            onChange={(e) =>
                              handleInputChange(fieldKey, e.target.value)
                            }
                            className="w-full bg-[#fdfaf5] border border-amber-200/60 rounded-lg px-3.5 py-2.5 text-gray-800 text-xs appearance-none focus:outline-none focus:border-[#710008] focus:ring-1 focus:ring-[#710008] transition"
                          >
                            <option value="">
                              {field.placeholder || "Chọn " + field.label}
                            </option>
                            {Array.isArray(field.options) &&
                              field.options.map((opt, oIdx) => (
                                <option key={oIdx} value={opt}>
                                  {opt}
                                </option>
                              ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-xs">
                            ▼
                          </div>
                        </div>
                      ) : field.type === "textarea" ? (
                        <textarea
                          rows={3}
                          required={isRequired}
                          placeholder={field.placeholder || ""}
                          value={formValues[fieldKey] || ""}
                          onChange={(e) =>
                            handleInputChange(fieldKey, e.target.value)
                          }
                          className="w-full bg-[#fdfaf5] border border-amber-200/60 rounded-lg px-3.5 py-2.5 text-gray-800 text-xs placeholder-gray-400 focus:outline-none focus:border-[#710008] focus:ring-1 focus:ring-[#710008] transition"
                        />
                      ) : (
                        <input
                          type={field.type || "text"}
                          required={isRequired}
                          placeholder={field.placeholder || ""}
                          value={formValues[fieldKey] || ""}
                          onChange={(e) =>
                            handleInputChange(fieldKey, e.target.value)
                          }
                          className="w-full bg-[#fdfaf5] border border-amber-200/60 rounded-sm px-3.5 py-2.5 text-gray-800 text-xs placeholder-gray-400 focus:outline-none focus:border-[#710008] focus:ring-1 focus:ring-[#710008] transition"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="submit"
                className="w-full bg-[#710008] hover:bg-[#560006] text-white font-bold py-3.5 px-5 rounded-xl transition-all duration-200 uppercase tracking-wider text-xs shadow-md mt-3 flex items-center justify-center gap-2.5 cursor-pointer group active:scale-[0.99]"
              >
                <Play
                  size={13}
                  className="fill-white text-white transform group-hover:translate-x-0.5 transition-transform"
                />
                <span>{buttonText}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
