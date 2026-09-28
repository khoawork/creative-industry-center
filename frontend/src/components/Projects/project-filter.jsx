import React from "react";
import {
  HiViewGrid,
  HiHome,
  HiChip,
  HiGlobeAlt,
  HiUserGroup,
} from "react-icons/hi";

const categories = [
  { name: "Tất cả dự án", count: "06", icon: <HiViewGrid /> },
  { name: "Không gian Kỷ lục & Bảo tàng", icon: <HiHome /> },
  { name: "Số hóa Di sản & Công nghệ", icon: <HiChip /> },
  { name: "Công nghiệp Văn hóa", icon: <HiGlobeAlt /> },
  { name: "Dự án Xã hội & Cộng đồng", icon: <HiUserGroup /> },
];

export default function ProjectFilter({ activeCategory, setActiveCategory }) {
  return (
    <div className="mx-20 bg-[#f4f3f1] p-2 rounded-xl shadow-sm border border-gray-200 mb-8">
      {/* Sử dụng flex w-full để các nút trải đều */}
      <div className="flex flex-col md:flex-row items-stretch gap-2 w-full">
        {categories.map((cat, index) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={index}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? "bg-[#710008] text-white shadow-sm"
                  : " text-[#710008]  hover:bg-[#710008] hover:bg-opacity-10 hover:text-white"
              }`}
            >
              {/* Icon danh mục */}
              <span
                className={`text-base shrink-0 ${isActive ? "text-white" : "text-[#710008]"}`}
              >
                {cat.icon}
              </span>

              {/* Tên danh mục (thêm text-center để chữ dài tự ngắt dòng cân đối) */}
              <span className="text-center">{cat.name}</span>

              {/* Badge số lượng (nếu có) */}
              {cat.count && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 transition ${
                    isActive
                      ? "bg-[#4a0000] text-white"
                      : "bg-[#f4f3f1] text-gray-700 group-hover:bg-[#710008] group-hover:text-white"
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




































































































