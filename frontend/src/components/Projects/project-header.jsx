import React from "react";
import { FaFolder } from "react-icons/fa";

export default function ProjectHeader({ headerData }) {
  const badge = headerData?.badge || "DANH MỤC DỰ ÁN TRỌNG ĐIỂM";
  const title = headerData?.title || "CÁC DỰ ÁN NỔI BẬT";
  const description = headerData?.description || "Hiện thực hóa giá trị sáng tạo Việt — Từ ý tưởng đến công trình thế kỷ. Trung tâm trực tiếp đồng hành, thẩm định giải pháp kỹ nghệ và kết nối nguồn lực cho các công trình mang tầm vóc biểu tượng.";
  const statistics = Array.isArray(headerData?.statistics) && headerData.statistics.length > 0
    ? headerData.statistics
    : [
        { label: "DỰ ÁN ĐANG TRIỂN KHAI", value: "24+", sublabel: "" },
        { label: "ĐỊA PHƯƠNG KẾT NỐI", value: "35+", sublabel: "Tỉnh thành" },
      ];

  return (
    <div className="mb-8 px-6 md:px-20 py-10">
      <div className="flex items-center gap-2">
        <FaFolder className="text-[#7d5900] text-xl shrink-0" />
        <p className="text-xl md:text-2xl font-semibold tracking-wider text-[#7d5900] uppercase m-0">
          {badge}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mt-2">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl py-4 font-semibold text-[#4a0000] uppercase tracking-tight">
            {title}
          </h1>
          <p className="text-base md:text-lg text-[#433b35] mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Khối thống kê số lượng */}
        <div className="flex flex-wrap gap-4 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 shrink-0">
          {statistics.map((stat, idx) => (
            <div key={idx} className="px-3 py-2 text-left min-w-[120px]">
              <span className="text-base text-[#7d5900] font-semibold block uppercase">
                {stat.label}
              </span>
              <span className="text-2xl font-bold text-[#4a0000] flex items-baseline gap-1 mt-0.5">
                {stat.value}
                {stat.sublabel && (
                  <span className="text-base font-normal text-[#4a0000]">
                    {stat.sublabel}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
