import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { 
  HiChip, 
  HiBadgeCheck, 
  HiLocationMarker, 
  HiScale, 
  HiClock, 
  HiGlobeAlt, 
  HiOfficeBuilding,
  HiSparkles
} from 'react-icons/hi';

// Hàm tự động chọn icon dựa theo nhãn (label) của chi tiết dự án
const getDetailIcon = (label) => {
  const l = label.toLowerCase();
  if (l.includes('địa điểm') || l.includes('phạm vi')) return <HiLocationMarker className="text-[#d49520] text-sm shrink-0" />;
  if (l.includes('quy mô') || l.includes('mục tiêu')) return <HiScale className="text-[#d49520] text-sm shrink-0" />;
  if (l.includes('thời gian')) return <HiClock className="text-[#d49520] text-sm shrink-0" />;
  if (l.includes('công nghệ') || l.includes('kỹ thuật')) return <HiChip className="text-[#d49520] text-sm shrink-0" />;
  if (l.includes('mạng lưới') || l.includes('nghệ nhân') || l.includes('lĩnh vực')) return <HiGlobeAlt className="text-[#d49520] text-sm shrink-0" />;
  if (l.includes('đơn vị') || l.includes('tổ chức') || l.includes('startup')) return <HiOfficeBuilding className="text-[#d49520] text-sm shrink-0" />;
  return <HiSparkles className="text-[#d49520] text-sm shrink-0" />;
};

export default function ProjectCard({ project }) {
  return (
    <div className="font-main bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Ảnh và phần đè thông tin trên ảnh */}
        <div className="relative h-56 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          
          {/* Lớp phủ gradient mờ phía dưới ảnh */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a0000] via-black/40 to-transparent opacity-90"></div>

          {/* Tag danh mục ở góc trên bên trái */}
          <span className="absolute top-3 left-3 bg-[#4a0000] text-white text-[15px] font-semibold px-2.5 py-1 rounded flex items-center gap-1.5 shadow-md">
            <HiChip className="text-[#d49520]" />
            {project.categoryTag}
          </span>

          {/* Mã dự án và Tiêu đề nằm đè lên phần dưới của ảnh */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-[20px] font-semibold tracking-wide text-[#e7c393] mb-0.5">
              {project.code}
            </p>
            <h3 className="font-bold text-[20px] leading-snug line-clamp-2">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Nội dung chi tiết bên dưới */}
        <div className="p-4 px-10">
          <h4 className="text-xl text-[#4a0000] font-bold mb-1.5">{project.name}</h4>
          <p className="text-xl text-[#433b35] mb-4 line-clamp-3 leading-relaxed">
            {project.description}
          </p>

          {/* Khối thông tin chi tiết phụ có kèm icon tương ứng */}
          <div className="bg-[#f4f3f1] rounded-lg p-3 space-y-2.5 text-xm mb-2">
            {project.details.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-gray-500">
                  {getDetailIcon(item.label)}
                  <span>{item.label}:</span>
                </div>
                <span className="font-bold text-gray-900 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phần footer cuối card */}
      <div className="px-4 pb-4 pt-0 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1.5 text-xm font-bold text-gray-800">
          {project.footerText ? (
            <>
              <HiBadgeCheck className="text-[#d49520] text-lg shrink-0" />
              <span className="leading-tight">{project.footerText}</span>
            </>
          ) : (
            <span className="text-[#d49520] font-medium text-xl"></span>
          )}
        </div>

        <button className="bg-[#f4f3f1] hover:bg-gray-200 text-gray-900 text-xm font-semibold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 border border-gray-200">
          <span>{project.buttonLabel}</span>
          <FiArrowRight className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}