import React from "react";
import {
  FaClock,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";

import RegistrationForm from "./RegistrationForm";

const DEFAULT_TRAINING_IMAGES = [
  "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
];

function getDefaultImage(key = "") {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i)) % DEFAULT_TRAINING_IMAGES.length;
  }
  return DEFAULT_TRAINING_IMAGES[hash];
}

export default function TrainingCard({ training }) {
  const code = training.id || training.code || training.props?.code || "VK";
  const title = training.name || training.title || "";
  const description = training.props?.description || training.description || "";
  const duration = training.props?.duration || training.time || "";
  const audience = training.props?.audience || training.props?.target_audience || training.audience || "";
  const benefits =
    Array.isArray(training.props?.benefits) && training.props.benefits.length > 0
      ? training.props.benefits
      : Array.isArray(training.benefits) && training.benefits.length > 0
      ? training.benefits
      : Array.isArray(training.props?.highlights) && training.props.highlights.length > 0
      ? training.props.highlights
      : [
          "Bảo chứng chuẩn mực Viện Kỷ lục",
          "Đồng hành chuyên môn cùng các Chuyên gia đầu ngành",
          "Cấp chứng nhận tốt nghiệp lưu trữ hồ sơ quốc gia",
        ];
  const format =
    training.props?.format ||
    training.format ||
    (Array.isArray(training.props?.locations) ? training.props.locations.join(", ") : "") ||
    "Trực tiếp kết hợp Trực tuyến";
  const certificate = training.certificate || training.props?.certificate || "Chứng nhận VIETKINGS";

  const cardBgImage =
    training.props?.image ||
    training.props?.bg_image ||
    training.image ||
    training.bg_image ||
    getDefaultImage(code || title);

  const trainingAdapter = {
    ...training,
    code,
    title,
    description,
    duration,
    audience,
    benefits,
    format,
    certificate,
    placeholderName: training.props?.placeholderName || training.placeholderName || "Ví dụ: Nguyễn Văn A",
    placeholderPhone: training.props?.placeholderPhone || training.placeholderPhone || "0987 xxx xxx",
    placeholderEmail: training.props?.placeholderEmail || training.placeholderEmail || "contact@domain.vn",
  };

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-lg border border-[#e8dfd3] lg:grid-cols-12 transition-all">
      {/* Content Side with Background Illustration */}
      <div className="cursor-pointer  group relative isolate overflow-hidden p-8 lg:col-span-7 flex flex-col justify-between min-h-[420px] bg-slate-900 text-white">
        {/* Background Image */}
        {cardBgImage && (
          <img
            src={cardBgImage}
            alt={title}
            loading="lazy"
            className="absolute cursor-pointer inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Dark Gradient Overlay - softened to make image brighter and clearer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/20 transition-colors duration-300 group-hover:from-black/70 group-hover:via-black/40 group-hover:to-black/15"
        />

        {/* Content Top */}
        <div className="relative z-10">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <span className="rounded-md bg-black/50 backdrop-blur-md border border-white/30 px-2.5 py-1 text-[12px] leading-4 font-bold uppercase tracking-wide text-white shadow-sm">
              Mã khóa: {code}
            </span>

            {duration && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/50 backdrop-blur-xs border border-white/20 px-2.5 py-1 text-[12px] leading-4 text-white">
                <FaClock className="text-[13px] text-amber-300" />
                {duration}
              </span>
            )}

            {audience && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-black/50 backdrop-blur-xs border border-white/20 px-2.5 py-1 text-[12px] leading-4 text-white">
                <FaUserTie className="text-[13px] text-amber-300" />
                {audience}
              </span>
            )}
          </div>

          <h3 className="mb-3 text-[24px] md:text-[28px] leading-[34px] md:leading-[38px] font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] group-hover:text-amber-300 transition-colors">
            {title}
          </h3>

          {description && (
            <p className="mb-5 text-[15px] md:text-[16px] leading-[26px] text-white/95 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {description}
            </p>
          )}

          <div className="space-y-2.5">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <FaCheckCircle className="mt-1 shrink-0 text-[15px] text-amber-400 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                <span className="text-[14px] leading-[22px] text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Bottom / Footer */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/25 pt-4">
          <span className="text-[13px] leading-5 text-white font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {format}
          </span>

          <span className="text-[14px] leading-5 font-bold text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Chứng chỉ: {certificate}
          </span>
        </div>
      </div>

      {/* Form */}
      <RegistrationForm training={trainingAdapter} />
    </div>
  );
}