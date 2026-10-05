import React from "react";
import {
  FaClock,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";

import RegistrationForm from "./RegistrationForm";

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
    <div className="grid grid-cols-1 overflow-hidden rounded-lg bg-white shadow-sm lg:grid-cols-12">
      {/* Content */}
      <div className="flex flex-col justify-between p-8 lg:col-span-7">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#e9e8e6] px-2 py-1 text-[12px] leading-4 font-bold uppercase text-[#490003]">
              Mã khóa: {code}
            </span>

            <span className="inline-flex items-center gap-1 text-[12px] leading-4 text-[#58413f]">
              <FaClock className="text-[14px] text-[#805600]" />
              {duration}
            </span>

            <span className="inline-flex items-center gap-1 text-[12px] leading-4 text-[#58413f]">
              <FaUserTie className="text-[14px] text-[#805600]" />
              {audience}
            </span>
          </div>

          <h3 className="mb-3 text-[22px] leading-[30px] font-bold text-[#490003]">
            {title}
          </h3>

          <p className="mb-4 text-[16px] leading-[26px] text-[#58413f]">
            {description}
          </p>

          <div className="space-y-2">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <FaCheckCircle className="mt-0.5 shrink-0 text-[16px] text-[#805600]" />

                <span className="text-[14px] leading-[22px] text-[#1a1c1b]">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#e0bfbb] pt-4">
          <span className="text-[12px] leading-4 text-[#58413f]">
            {format}
          </span>

          <span className="text-[14px] leading-5 font-bold text-[#805600]">
            Chứng chỉ: {certificate}
          </span>
        </div>
      </div>

      {/* Form */}
      <RegistrationForm training={trainingAdapter} />
    </div>
  );
}