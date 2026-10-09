import React from "react";
import { Check, X, Award } from "lucide-react";

export default function RecordNominationPreview({ config }) {
  const title = config?.title || "Kỷ lục gia Nghệ thuật Gốm Sứ Truyền Thống Việt Nam";
  const subtitle =
    config?.subtitle ||
    "Vui lòng điền thông tin ban đầu. Hồ sơ sẽ được tiếp nhận và thẩm định trực tiếp bởi Ban Thư ký Viện Kỷ lục.";
  const badgeText = config?.badgeText || "Đề cử chính thức";
  const buttonText = config?.submitButtonText || "Gửi hồ sơ đề cử ngay";

  const fields = Array.isArray(config?.fields) && config.fields.length > 0
    ? config.fields.filter((f) => f.key !== "award")
    : [
        { key: "name", label: "Người đại diện", placeholder: "Nguyễn Văn A", required: true, colSpan: 1, type: "text" },
        { key: "phone", label: "Số điện thoại liên hệ", placeholder: "0912 345 678", required: true, colSpan: 1, type: "tel" },
        { key: "email", label: "Email", placeholder: "decu@tochuc.vn", required: true, colSpan: 2, type: "email" },
        { key: "organization", label: "Tên tổ chức, đơn vị hoặc làng nghề", placeholder: "Làng gốm Bát Tràng, Hà Nội", required: false, colSpan: 2, type: "text" },
        { key: "summary", label: "Tóm tắt thành tựu / Đề tài nổi bật", placeholder: "Mô tả ngắn gọn về giải pháp, sản phẩm hoặc năm cống hiến...", required: false, colSpan: 2, type: "textarea" },
      ];

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white p-6 sm:p-7 relative text-gray-900">
      {/* Vạch kẻ vàng đỏ trên cùng đặc trưng Viện Kỷ lục */}
      <div className="absolute inset-x-0 top-0 flex h-1.5 justify-between overflow-hidden bg-[#710008]">
        <span className="w-32 bg-[#f4b42c]" />
        <span className="w-12 bg-[#f4b42c]" />
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9c6800]">
          <Check size={16} className="text-[#9c6800]" />
          {badgeText}
        </p>
        <div className="p-1 rounded-full text-gray-400">
          <X size={18} />
        </div>
      </div>

      <h3 className="mt-2 text-lg sm:text-xl font-bold text-[#710008] uppercase tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-xs text-gray-600 leading-relaxed">
        {subtitle}
      </p>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((field) => {
            const isFullWidth = field.colSpan === 2 || field.width === "full";
            const colClass = isFullWidth ? "sm:col-span-2" : "sm:col-span-1";

            return (
              <div key={field.key} className={colClass}>
                <label className="block text-xs font-semibold text-gray-800 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    readOnly
                    rows={2}
                    placeholder={field.placeholder || "Mô tả ngắn gọn..."}
                    className="w-full rounded-lg border border-gray-300 bg-[#faf8f5] px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none resize-none"
                  />
                ) : field.type === "select" ? (
                  <select
                    disabled
                    className="w-full rounded-lg border border-gray-300 bg-[#faf8f5] px-3 py-2 text-xs text-gray-900 outline-none cursor-default"
                  >
                    <option>{field.placeholder || "-- Chọn --"}</option>
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    readOnly
                    placeholder={field.placeholder || "Nhập thông tin..."}
                    className="w-full rounded-lg border border-gray-300 bg-[#faf8f5] px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 pointer-events-none transition"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            className="rounded-lg border border-[#710008] bg-[#710008] hover:bg-[#8b000b] px-5 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-xs pointer-events-none transition"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
