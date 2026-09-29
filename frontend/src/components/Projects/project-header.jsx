import React from "react";
import { FaFolder } from "react-icons/fa";

export default function ProjectHeader() {
  return (
    <div className="mb-8 px-20 py-10">
      <div className="flex items-center gap-2 ">
        <FaFolder className="text-[#7d5900] text-xl shrink-0" />
        <p className="text-3xl  font-normal  tracking-wider text-[#7d5900] uppercase m-0">
          DANH MỤC DỰ ÁN TRỌNG ĐIỂM
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-8xl md:text-12xl py-2 font-semibold text-[#4a0000]">
            CÁC DỰ ÁN NỔI BẬT
          </h1>
          <p className="text-xl text-[#433b35] mt-2 max-w-2xl">
            Hiện thực hóa giá trị sáng tạo Việt — Từ ý tưởng đến công trình thế
            kỷ. Trung tâm trực tiếp đồng hành, thẩm định giải pháp kỹ nghệ và
            kết nối nguồn lực cho các công trình mang tầm vóc biểu tượng.
          </p>
        </div>

        {/* Khối thống kê số lượng */}
        <div className="flex gap-4 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200 max-w-[500px]">
          <div className=" px-5 py-3  text-left">
            <span className="text-xl text-[#7d5900] block">
              DỰ ÁN ĐANG TRIỂN KHAI 
            </span>
            <span className="text-2xl  font-bold text-[#4a0000]">
              24
              <span className="text-sm">+ {""}</span>
            </span>
          </div>
          <div className=" px-5 py-3   text-left">
            <span className="text-xl text-[#7d5900] block">
              ĐỊA PHƯƠNG KẾT NỐI
            </span>
            <span className="text-2xl font-bold text-[#4a0000] flex items-baseline gap-1">
              35
              <span className="text-xs font-semibold">+</span>
              <span className="text-[10px] font-normal text-[#4a0000]">
                Tỉnh thành
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
