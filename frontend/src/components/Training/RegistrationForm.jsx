import { useState, useEffect } from "react";
import { FaUserCheck } from "react-icons/fa";
import { Lock } from "lucide-react";
import {
  fetchFormConfig,
  submitFormToBackend,
  DEFAULT_FORM_CONFIGS,
} from "../../services/googleSheetService.js";

export default function RegistrationForm({ training = {} }) {
  const [config, setConfig] = useState(DEFAULT_FORM_CONFIGS.training_registration);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const derivedCode = training.code || training.props?.code || training.id || "VK";
  const derivedTitle = training.title || training.name || "Khóa học CIC";

  useEffect(() => {
    fetchFormConfig("training_registration").then((loaded) => {
      const cfg = loaded || DEFAULT_FORM_CONFIGS.training_registration;
      setConfig(cfg);

      const initial = {
        courseCode: derivedCode,
        courseName: derivedTitle,
        trainingCourse: `${derivedCode} - ${derivedTitle}`,
      };

      (cfg.fields || []).forEach((f) => {
        if (f.key === "courseCode") {
          initial[f.key] = derivedCode;
        } else if (f.key === "courseName") {
          initial[f.key] = derivedTitle;
        } else if (f.key === "trainingCourse") {
          initial[f.key] = `${derivedCode} - ${derivedTitle}`;
        } else if (initial[f.key] === undefined) {
          initial[f.key] = "";
        }
      });
      setFormData((prev) => ({
        ...initial,
        ...prev,
        courseCode: derivedCode,
        courseName: derivedTitle,
        trainingCourse: `${derivedCode} - ${derivedTitle}`,
      }));
    });
  }, [training, derivedCode, derivedTitle]);

  const handleChange = (key, value) => {
    // Không cho phép chỉnh sửa mã khóa học và tên khóa học
    if (key === "courseCode" || key === "courseName") return;

    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      return updated;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const codeVal = derivedCode;
      const nameVal = derivedTitle;

      const payload = {
        ...formData,
        courseCode: codeVal,
        courseName: nameVal,
        trainingCourse: `${codeVal} - ${nameVal}`,
      };

      await submitFormToBackend("training_registration", payload, config);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error("Lỗi khi đăng ký khóa đào tạo:", err);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chuẩn hóa fields: đảm bảo luôn có courseCode và courseName
  const rawFields = config.fields || [];
  let fields = [...rawFields];

  const hasCourseCode = fields.some((f) => f.key === "courseCode");
  const hasCourseName = fields.some((f) => f.key === "courseName");

  if (!hasCourseCode || !hasCourseName) {
    // Lọc bỏ trainingCourse cũ nếu có để thay bằng 2 trường mới rõ ràng
    fields = fields.filter((f) => f.key !== "trainingCourse");
    const newPrefixFields = [];
    if (!hasCourseCode) {
      newPrefixFields.push({
        key: "courseCode",
        label: "Mã khóa học",
        type: "text",
        placeholder: "Mã khóa học",
        required: true,
        readOnly: true,
        colSpan: 1,
      });
    }
    if (!hasCourseName) {
      newPrefixFields.push({
        key: "courseName",
        label: "Tên khóa học",
        type: "text",
        placeholder: "Tên khóa học",
        required: true,
        readOnly: true,
        colSpan: 1,
      });
    }
    fields = [...newPrefixFields, ...fields];
  }

  return (
    <div className="flex flex-col justify-center bg-[#f4f3f1] p-8 lg:col-span-5 rounded-sx">
    <div className="flex flex-col justify-center bg-[#f4f3f1] p-6 sm:p-8 lg:col-span-5 rounded-2xl border border-amber-900/10 shadow-xs">
      <div className="mb-4">
        <span className="text-[12px] leading-4 font-bold uppercase tracking-[0.05em] text-[#490003]">
          {config.badgeText || "Đăng ký tham gia"}
        </span>

        <p className="text-[14px] leading-[22px] text-[#58413f]">
          {config.subtitle || `Ghi danh trực tiếp cho khóa học ${training.code || ""}`}
        </p>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm animate-in fade-in">
          <p className="font-bold">Đăng ký thành công!</p>
          <p className="text-xs text-emerald-700 mt-1">
            Cảm ơn Quý học viên. Ban Tuyển sinh đã ghi nhận hồ sơ và sẽ liên hệ trong 24 giờ làm việc.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-12 gap-3">
            {fields.map((field, idx) => {
              const key = field.key || `field_${idx}`;
              const isLocked = field.readOnly || field.disabled || key === "courseCode" || key === "courseName";
              const colSpan =
                field.width === 'half' || field.colSpan === 1
                  ? 'col-span-12 sm:col-span-6'
                  : field.width === 'third'
                  ? 'col-span-12 sm:col-span-4'
                  : 'col-span-12';

              return (
                <div key={key} className={colSpan}>
                  <label className="mb-1 flex items-center justify-between text-[12px] leading-4 font-semibold text-[#1a1c1b]">
                    <span>
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </span>
                    {isLocked && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded">
                        <Lock size={10} /> Cố định
                      </span>
                    )}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formData[key] ?? ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={field.placeholder || ''}
                      required={field.required}
                      readOnly={isLocked}
                      className={`w-full rounded-lg px-3 py-2 text-[14px] leading-[22px] shadow-xs border ${
                        isLocked
                          ? "bg-gray-100/90 text-gray-700 border-gray-300 cursor-not-allowed select-none font-medium focus:outline-hidden"
                          : "bg-white text-[#1a1c1b] border-gray-200 placeholder:text-[#58413f]/50 focus:outline-hidden focus:ring-1 focus:ring-[#490003]"
                      }`}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[key] ?? ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      required={field.required}
                      disabled={isLocked}
                      className={`w-full rounded-lg px-3 py-2 text-[14px] leading-[22px] shadow-xs border ${
                        isLocked
                          ? "bg-gray-100/90 text-gray-700 border-gray-300 cursor-not-allowed select-none font-medium"
                          : "bg-white text-[#1a1c1b] border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-[#490003]"
                      }`}
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
                      value={formData[key] ?? ''}
                      onChange={(e) => {
                        if (isLocked) return;
                        handleChange(key, e.target.value);
                      }}
                      placeholder={field.placeholder || ''}
                      required={field.required}
                      readOnly={isLocked}
                      tabIndex={isLocked ? -1 : undefined}
                      className={`w-full rounded-lg px-3 py-2 text-[14px] leading-[22px] shadow-xs border transition ${
                        isLocked
                          ? "bg-gray-100/90 text-gray-700 border-gray-300 cursor-not-allowed select-none font-medium focus:outline-hidden"
                          : "bg-white text-[#1a1c1b] border-gray-200 placeholder:text-[#58413f]/50 focus:outline-hidden focus:ring-1 focus:ring-[#490003]"
                      } ${key === 'courseCode' ? 'font-mono font-bold text-amber-950' : ''}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#490003] py-3 text-[14px] leading-5 font-bold text-white shadow-sm transition-all hover:bg-[#710008] cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <FaUserCheck className="text-[18px]" />
            {isSubmitting ? "Đang ghi danh..." : (config.submitButtonText || "Đăng ký khóa học")}
          </button>
        </form>
      )}
    </div>
    </div>
  );
}