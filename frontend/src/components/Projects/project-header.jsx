import React from "react";

export default function ProjectHeader({ headerData }) {
  const title = headerData?.title ;
  const description = headerData?.description ;
  const statistics = Array.isArray(headerData?.statistics) && headerData.statistics.length > 0
    ? headerData.statistics
    : [
        { label: "", value: "", sublabel: "" },
        { label: "", value: "", sublabel: "" },
      ];

  return (
    <div className="mb-8 px-6 md:px-20 py-10 bg-gradient-to-r from-[#580006]/5 via-[#710008]/10 to-transparent">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl py-4 font-bold text-[#4a0000] uppercase tracking-tight">
            {title}
          </h1>
          <p className="text-base md:text-lg text-[#433b35] mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Khối thống kê số lượng */}
{statistics?.map((stat, idx) => (
  <div 
    key={idx} 
    className="p-[2px] rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 shadow-sm shrink-0"
  >
    <div className="flex flex-wrap gap-4 bg-white px-5 py-3 rounded-[10px] h-full">
      <div className="px-3 py-2 text-left min-w-[120px]">
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
    </div>
  </div>
))}
      </div>
    </div>
  );
}
