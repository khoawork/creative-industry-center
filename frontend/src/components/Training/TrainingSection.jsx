import { FaGraduationCap } from "react-icons/fa";
import TrainingCard from "./TrainingCard";

export default function TrainingSection({ trainings }) {
  return (
    <section className="mx-auto w-full max-w-[75rem] px-6 py-[72px]">
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-1 inline-flex items-center gap-1 text-[#805600]">
            <FaGraduationCap className="text-[18px]" />

            <span className="text-[12px] leading-4 font-semibold uppercase tracking-[0.05em]">
              Học viện Kỷ lục & Khởi nghiệp Sáng tạo
            </span>
          </div>

          <h2 className="text-[32px] leading-10 font-bold text-[#490003]">
            Danh Sách Khóa Đào Tạo Tiêu Biểu
          </h2>
        </div>

        <p className="max-w-md text-[14px] leading-[22px] text-[#58413f]">
          Các chuyên đề đào tạo thực chiến được cố vấn trực tiếp bởi hội đồng
          khoa học Viện Kỷ lục Việt Nam. Vui lòng đăng ký tham dự trực tiếp
          bên cạnh từng khóa học.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {trainings.map((training) => (
          <TrainingCard key={training.code} training={training} />
        ))}
      </div>
    </section>
  );
}