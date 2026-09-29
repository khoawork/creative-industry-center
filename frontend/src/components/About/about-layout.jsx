import React from 'react';
import AboutHero from './about-hero';
import AboutOverview from './about-overview';
import AboutVision from './about-vision';
import AboutMission from './about-mission';
import AboutPillars from './about-pillars';

export default function AboutLayout() {
  return (
    <div className="flex flex-col w-full bg-[#faf9f7] text-[#1a1c1b]">
      {/* 1. Banner Tiêu Đề */}
      <AboutHero />

      {/* 2. Nội dung chính đan xen 3 phần */}
      <div className="max-w-1xl mx-auto px-6 lg:px-12 py-16 lg:py-24 space-y-24">
        <AboutOverview />
        
        {/* Đường kẻ chỉ phân cách trang trọng */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="h-px flex-1 bg-[#f4b42c]/30"></div>
          <span className="text-[#f4b42c] text-lg font-bold">★</span>
          <div className="h-px flex-1 bg-[#f4b42c]/30"></div>
        </div>

        <AboutVision />

        {/* Đường kẻ chỉ phân cách trang trọng */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="h-px flex-1 bg-[#f4b42c]/30"></div>
          <span className="text-[#f4b42c] text-lg font-bold">★</span>
          <div className="h-px flex-1 bg-[#f4b42c]/30"></div>
        </div>

        <AboutMission />
      </div>

      {/* 3. Phần Tổng kết: 4 Trụ cột giá trị cốt lõi */}
      <AboutPillars />
    </div>
  );
}