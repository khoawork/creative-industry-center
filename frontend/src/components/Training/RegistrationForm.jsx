import { useState, useEffect } from "react";
import { FaUserCheck } from "react-icons/fa";
import {
  fetchFormConfig,
  submitFormToBackend,
  DEFAULT_FORM_CONFIGS,
} from "../../services/googleSheetService.js";

export default function RegistrationForm({ training }) {
  const [config, setConfig] = useState(DEFAULT_FORM_CONFIGS.training_registration);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchFormConfig("training_registration").then((loaded) => {
      if (loaded) setConfig(loaded);
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        trainingCourse: training.code ? `${training.code} - ${training.title || ""}` : (training.title || "Khóa học CIC"),
        ...formData,
      };
      await submitFormToBackend("training_registration", payload, config);
      setSubmitted(true);
      setFormData({ fullName: "", phone: "", email: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error("Lỗi khi đăng ký khóa đào tạo:", err);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center bg-[#f4f3f1] p-8 lg:col-span-5 rounded-sx">
      <div className="mb-4">
        <span className="text-[12px] leading-4 font-bold uppercase tracking-[0.05em] text-[#490003]">
          Đăng ký tham gia
        </span>

        <p className="text-[14px] leading-[22px] text-[#58413f]">
          Ghi danh trực tiếp cho khóa học {training.code}
        </p>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
          <p className="font-bold">Đăng ký thành công!</p>
          <p className="text-xs text-emerald-700 mt-1">
            Cảm ơn Quý học viên. Ban Tuyển sinh đã ghi nhận hồ sơ và sẽ liên hệ trong 24 giờ làm việc.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >
          <div>
            <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
              Họ và tên *
            </label>

            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder={training.placeholderName || "Nguyễn Văn A"}
              required
              className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-xs placeholder:text-[#58413f]/50 focus:outline-hidden focus:ring-1 focus:ring-[#490003]"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
              Số điện thoại *
            </label>

            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={training.placeholderPhone || "0912 345 678"}
              required
              className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-xs placeholder:text-[#58413f]/50 focus:outline-hidden focus:ring-1 focus:ring-[#490003]"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
              Địa chỉ Email *
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={training.placeholderEmail || "hocvien@gmail.com"}
              required
              className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-xs placeholder:text-[#58413f]/50 focus:outline-hidden focus:ring-1 focus:ring-[#490003]"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded bg-[#490003] py-2.5 text-[14px] leading-5 font-bold text-white shadow-xs transition-all hover:bg-[#710008] cursor-pointer disabled:opacity-50"
          >
            <FaUserCheck className="text-[18px]" />
            {isSubmitting ? "Đang ghi danh..." : "Đăng ký khóa học"}
          </button>
        </form>
      )}
    </div>
  );
}