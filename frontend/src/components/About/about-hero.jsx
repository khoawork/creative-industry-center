import React from 'react';
import { HiStar } from 'react-icons/hi';

export default function AboutHero() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#490003] via-[#710008] to-[#490003] text-white py-16 lg:py-24 px-6 lg:px-12 shadow-xl border-b-4 border-[#f4b42c]">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Breadcrumb Danh Dự */}
        <nav className="flex items-center gap-2 mb-6 text-[#f4b42c] font-semibold text-sm tracking-wider uppercase">
          <a href="#" className="hover:underline transition-all">Trang chủ</a>
          <span className="text-[#f4b42c]/60">/</span>
          <span className="text-white font-bold">Giới thiệu</span>
        </nav>

        {/* Họa tiết trục đối xứng trung tâm */}
        <div className="flex items-center justify-center gap-4 w-full max-w-md mb-6">
          <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#f4b42c] to-[#f4b42c]"></div>
          <HiStar className="text-[#f4b42c] text-2xl" />
          <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent via-[#f4b42c] to-[#f4b42c]"></div>
        </div>

        {/* Tiêu đề lớn */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl text-center uppercase drop-shadow-md">
          GIỚI THIỆU TRUNG TÂM CÔNG NGHIỆP SÁNG TẠO
        </h1>

        {/* Khẳng định sứ mạng & Vị thế */}
        <div className="bg-[#310002]/85 border border-[#f4b42c]/40 backdrop-blur-md p-8 rounded-xl max-w-3xl shadow-2xl">
          <p className="text-base md:text-lg text-[#f4b42c] leading-relaxed text-center font-medium italic">
            “Khởi tạo nền tảng định vị giá trị Việt, kết nối tinh hoa trí tuệ và mở rộng kỷ lục sáng tạo quốc gia vươn tầm thời đại mới.”
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 text-[#f4b42c]/90 text-xs uppercase tracking-widest font-semibold">
            <span className="inline-block w-8 h-px bg-[#f4b42c]"></span>
            VIỆN KỶ LỤC VIỆT NAM - VIETKINGS
            <span className="inline-block w-8 h-px bg-[#f4b42c]"></span>
          </div>
        </div>
      </div>
    </section>
  );
}