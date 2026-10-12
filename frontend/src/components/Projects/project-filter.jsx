import React from "react";
import {
  HiViewGrid,
  HiHome,
  HiChip,
  HiGlobeAlt,
  HiUserGroup,
} from "react-icons/hi";

const defaultIcons = [<HiViewGrid />, <HiHome />, <HiChip />, <HiGlobeAlt />, <HiUserGroup />];

export default function ProjectFilter({
  categories: dynamicCategories,
  activeCategory,
  setActiveCategory,
}) {
  const categories = dynamicCategories && dynamicCategories.length > 0
    ? dynamicCategories
    : [
        { name: "Tất cả dự án", count: "06", icon: <HiViewGrid /> },
        { name: "Không gian Kỷ lục & Bảo tàng", icon: <HiHome /> },
        { name: "Số hóa Di sản & Công nghệ", icon: <HiChip /> },
        { name: "Công nghiệp Văn hóa", icon: <HiGlobeAlt /> },
        { name: "Dự án Xã hội & Cộng đồng", icon: <HiUserGroup /> },
      ];

  return (
    <div className="mx-6 md:mx-20 bg-[#f4f3f1] p-2 rounded-xl shadow-sm border border-gray-200 mb-8 overflow-x-auto">
      {/* Sử dụng flex w-full để các nút trải đều */}
      <div className="flex flex-col md:flex-row items-stretch gap-2 min-w-full">
        {categories.map((cat, index) => {
          const isActive = activeCategory === cat.name;
          const icon = cat.icon || defaultIcons[index % defaultIcons.length];
          return (
            <button
              key={index}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-lg md:text-[12px] font-semibold transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#710008] text-white shadow-sm"
                  : "text-[#710008] hover:bg-[#710008]/10"
              }`}
            >
              {/* Icon danh mục */}
              <span
                className={`text-base shrink-0 ${isActive ? "text-white" : "text-[#710008]"}`}
              >
                {icon}
              </span>

              {/* Tên danh mục */}
              <span className="text-center">{cat.name}</span>

              {/* Badge số lượng (nếu có) */}
              {cat.count !== undefined && cat.count !== null && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0 transition ${
                    isActive
                      ? "bg-[#4a0000] text-white"
                      : "bg-[#e8e4df] text-gray-700"
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
