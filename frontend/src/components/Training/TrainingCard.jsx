import {
  FaClock,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";

import RegistrationForm from "./RegistrationForm";

export default function TrainingCard({ training }) {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-lg bg-white shadow-sm lg:grid-cols-12">
      {/* Content */}
      <div className="flex flex-col justify-between p-8 lg:col-span-7">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#e9e8e6] px-2 py-1 text-[12px] leading-4 font-bold uppercase text-[#490003]">
              Mã khóa: {training.code}
            </span>

            <span className="inline-flex items-center gap-1 text-[12px] leading-4 text-[#58413f]">
              <FaClock className="text-[14px] text-[#805600]" />
              {training.duration}
            </span>

            <span className="inline-flex items-center gap-1 text-[12px] leading-4 text-[#58413f]">
              <FaUserTie className="text-[14px] text-[#805600]" />
              {training.audience}
            </span>
          </div>

          <h3 className="mb-3 text-[22px] leading-[30px] font-bold text-[#490003]">
            {training.title}
          </h3>

          <p className="mb-4 text-[16px] leading-[26px] text-[#58413f]">
            {training.description}
          </p>

          <div className="space-y-2">
            {training.benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-2"
              >
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
            {training.format}
          </span>

          <span className="text-[14px] leading-5 font-bold text-[#805600]">
            Chứng chỉ: {training.certificate}
          </span>
        </div>
      </div>

      {/* Form */}
      <RegistrationForm training={training} />
    </div>
  );
}