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
const getDetailIcon = (label = '') => {
  const l = String(label).toLowerCase();
  if (l.includes('địa điểm') || l.includes('phạm vi')) return <HiLocationMarker className="text-[#d49520] text-sm shrink-0" />;
  if (l.includes('quy mô') || l.includes('mục tiêu') || l.includes('achievement')) return <HiScale className="text-[#d49520] text-sm shrink-0" />;
  if (l.includes('thời gian') || l.includes('career_span')) return <HiClock className="text-[#d49520] text-sm shrink-0" />;
  if (l.includes('công nghệ') || l.includes('kỹ thuật') || l.includes('field')) return <HiChip className="text-[#d49520] text-sm shrink-0" />;
  if (l.includes('mạng lưới') || l.includes('nghệ nhân') || l.includes('lĩnh vực')) return <HiGlobeAlt className="text-[#d49520] text-sm shrink-0" />;
  if (l.includes('đơn vị') || l.includes('tổ chức') || l.includes('startup')) return <HiOfficeBuilding className="text-[#d49520] text-sm shrink-0" />;
  return <HiSparkles className="text-[#d49520] text-sm shrink-0" />;
};

const formatDetailLabel = (label = '') => {
  const map = {
    career_span: 'Thời gian',
    achievement: 'Thành tựu',
    field: 'Lĩnh vực',
  };
  return map[label] || label;
};

export default function ProjectCard({ project }) {
  const categoryTag = project.category?.name || project.categoryTag || "TRỌNG ĐIỂM QUỐC GIA";
  const code = project.code || `MÃ DỰ ÁN: TTCNST-2025-0${project.id}`;
  const image = project.image || project.project_info?.image;
  const title = project.title || project.name || "";
  const name = project.name || project.title || "";
  const description = project.description || "";
  const details = (project.details || project.research_info || []).map((item) => ({
    label: formatDetailLabel(item.label),
    value: item.value,
  }));
  const footerText = project.footerText || project.slogan || "Chứng thực VIETKINGS";
  const buttonLabel = project.buttonLabel || project.project_info?.btn_action || "Khám phá dự án";
  const link = project.project_info?.link || `/projects/${project.id}`;

  return (
    <div className="font-main bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
      <div>
        {/* Ảnh và phần đè thông tin trên ảnh */}
        <div className="relative h-56 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          
          {/* Lớp phủ gradient mờ phía dưới ảnh */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#4a0000] via-black/40 to-transparent opacity-90"></div>

          {/* Tag danh mục ở góc trên bên trái */}
          <span className="absolute top-3 left-3 bg-[#4a0000] text-white text-[13px] font-semibold px-2.5 py-1 rounded flex items-center gap-1.5 shadow-md">
            <HiChip className="text-[#d49520]" />
            {categoryTag}
          </span>

          {/* Mã dự án và Tiêu đề nằm đè lên phần dưới của ảnh */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-[13px] font-semibold tracking-wide text-[#e7c393] mb-0.5">
              {code}
            </p>
            <h3 className="font-bold text-[18px] leading-snug line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        {/* Nội dung chi tiết bên dưới */}
        <div className="p-4 px-6">
          <h4 className="text-lg text-[#4a0000] font-bold mb-1.5 line-clamp-1">{name}</h4>
          <p className="text-sm text-[#433b35] mb-4 line-clamp-3 leading-relaxed">
            {description}
          </p>

          {/* Khối thông tin chi tiết phụ có kèm icon tương ứng */}
          {details.length > 0 && (
            <div className="bg-[#f4f3f1] rounded-lg p-3 space-y-2 text-xs mb-2">
              {details.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    {getDetailIcon(item.label)}
                    <span>{item.label}:</span>
                  </div>
                  <span className="font-bold text-gray-900 text-right truncate max-w-[55%]">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Phần footer cuối card */}
      <div className="px-6 pb-4 pt-3 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
          {footerText ? (
            <>
              <HiBadgeCheck className="text-[#d49520] text-base shrink-0" />
              <span className="leading-tight text-gray-700 line-clamp-1 max-w-[140px]">{footerText}</span>
            </>
          ) : (
            <span className="text-[#d49520] font-medium text-xs"></span>
          )}
        </div>

        <a
          href={link}
          className="bg-[#f4f3f1] hover:bg-gray-200 text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 border border-gray-200"
        >
          <span>{buttonLabel}</span>
          <FiArrowRight className="text-gray-700" />
        </a>
      </div>
    </div>
  );
}