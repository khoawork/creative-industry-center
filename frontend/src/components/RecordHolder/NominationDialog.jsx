import { useEffect, useRef, useState } from "react";
import Icon from "../shared/Icon.jsx";
import { site } from "../../config/shared/site.js";
import {
  fetchFormConfig,
  submitFormToBackend,
  DEFAULT_FORM_CONFIGS,
} from "../../services/googleSheetService.js";

const inputClasses =
  "mt-1 w-full rounded-lg border border-primary/20 bg-white px-4 py-2.5 text-sm text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function NominationDialog({ award, onClose }) {
  const dialogRef = useRef(null);
  const openerRef = useRef(document.activeElement);
  const [config, setConfig] = useState(DEFAULT_FORM_CONFIGS.record_nomination);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchFormConfig("record_nomination").then((loaded) => {
      if (loaded) setConfig(loaded);
    });
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const opener = openerRef.current;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector("input")?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        "button, input, textarea, a[href]",
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      opener?.focus();
    };
  }, [onClose]);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setIsSubmitting(true);

    const payload = {};
    for (const [k, v] of form.entries()) {
      payload[k] = v;
    }
    if (award) payload.award = award;

    try {
      await submitFormToBackend("record_nomination", payload, config);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Lỗi khi gửi đề cử kỷ lục:", err);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  }

  const fields = (config.fields || []).filter((f) => f.key !== "award");

  return (
    <div
      className="record-holder-dialog fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nomination-title"
        aria-describedby="nomination-description"
        className="relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          aria-label="Đóng biểu mẫu"
          className="absolute right-4 top-4 rounded-full p-2 text-primary hover:bg-cream"
          onClick={onClose}
        >
          <Icon name="close" size={20} />
        </button>
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
          <Icon name="check" size={18} />
          {config.badgeText || "Đề cử chính thức"}
        </p>
        <h2
          id="nomination-title"
          className="mt-3 pr-7 text-2xl font-bold text-primary"
        >
          {award || config.title}
        </h2>
        <p
          id="nomination-description"
          className="mt-3 text-sm leading-6 text-black/70"
        >
          {config.subtitle ||
            "Vui lòng điền thông tin ban đầu để Ban Thư ký Trung tâm tiếp nhận và hỗ trợ."}
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-3.5">
            {fields.map((field, idx) => {
              const key = field.key || `field_${idx}`;
              const colSpan =
                field.width === "half" || field.colSpan === 1
                  ? "col-span-12 sm:col-span-6"
                  : field.width === "third"
                    ? "col-span-12 sm:col-span-4"
                    : "col-span-12";

              return (
                <div key={key} className={colSpan}>
                  <label
                    className="block text-sm font-semibold text-primary mb-1"
                    htmlFor={`nomination-${key}`}
                  >
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={`nomination-${key}`}
                      name={key}
                      className={inputClasses}
                      rows={3}
                      placeholder={field.placeholder || ""}
                      required={field.required}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={`nomination-${key}`}
                      name={key}
                      className={inputClasses}
                      required={field.required}
                    >
                      <option value="">
                        {field.placeholder || "-- Chọn --"}
                      </option>
                      {(field.options || []).map((opt, oIdx) => (
                        <option
                          key={oIdx}
                          value={typeof opt === "object" ? opt.value : opt}
                        >
                          {typeof opt === "object" ? opt.label : opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`nomination-${key}`}
                      name={key}
                      type={field.type || "text"}
                      className={inputClasses}
                      placeholder={field.placeholder || ""}
                      required={field.required}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {submitted && (
            <p
              role="status"
              className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm leading-6 text-emerald-800 font-medium"
            >
              Hồ sơ đề cử kỷ lục đã được gửi thành công! Ban Thư ký Trung tâm sẽ
              liên hệ thẩm định trong vòng 48 giờ làm việc.
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <button
              type="button"
              className="rounded-lg border border-black bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
              onClick={onClose}
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg border border-black bg-[#490003] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-black hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Đang gửi hồ sơ..." : "Gửi hồ sơ đề cử ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
