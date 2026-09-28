import React from 'react';
import { HiEye, HiGlobeAlt, HiShieldCheck } from 'react-icons/hi';

export default function AboutVision() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Cột Trái: Ảnh Biểu Trưng Kỷ Lục Toàn Cầu */}
      <div className="lg:col-span-5 order-2 lg:order-1 relative">
        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-200 border-2 border-[#f4b42c]/50">
          <img
            className="w-full h-[450px] object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY8g95iAnCKub-dUIrPCcBv32e24CGvp8SQ970aCCP6Kp2kPIgKEakMuNN45EzXqIiH5RHx556-646GDpC7pqPvhnOeMTlmp66gwXasfbqWZJpfqXzCj776-tZZvAIDvNF_L4Rbd3vP-B9xlOy4h_pOrt-YFDtPkiNCdH5LeTM1Y-U4Uen0uFBKr4Zx0ksjJSlYvD0utQu6P4oIhYGSX2vilWSnfH-WeADgPCKkPE-n-oADE4PQcel"
            alt="Biểu trưng Danh Dự"
          />
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#490003]/95 via-[#490003]/85 to-transparent text-white">
            <span className="text-xs text-[#f4b42c] uppercase tracking-wider block mb-1 font-bold">Biểu trưng Danh Dự</span>
            <p className="text-base text-white leading-snug font-bold">Chuẩn mực Khảo thí & Ghi nhận Đẳng cấp Quốc tế</p>
          </div>
        </div>
      </div>

      {/* Cột Phải: Nội Dung Tầm Nhìn Chiến Lược */}
      <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4b42c]/15 border border-[#f4b42c]/40 text-[#490003] text-xs font-bold uppercase tracking-wide">
          <HiEye className="text-base text-[#f4b42c]" />
          Chiến Lược Dài Hạn 2025 - 2035
        </div>
        <h2 className="text-2xl lg:text-3xl text-[#490003] leading-tight font-extrabold">
          TẦM NHÌN CHIẾN LƯỢC: <br className="hidden sm:inline" />Định Vị Điểm Tựa Trí Tuệ Á Châu
        </h2>
        <div className="w-20 h-1.5 bg-[#f4b42c] rounded-full"></div>
        <p className="text-xl text-[#574542] leading-relaxed">
          Trung tâm Công nghiệp Sáng tạo định hướng trở thành tổ chức bảo trợ khoa học, văn hóa và đổi mới sáng tạo độc lập hàng đầu khu vực. Chúng tôi chủ trương xây dựng bộ tiêu chí xếp hạng minh bạch, nơi mỗi thành tựu kỷ lục không chỉ là dấu mốc số liệu mà là một di sản tinh thần có khả năng thương mại hóa và phụng sự nhân sinh.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-6 rounded-lg bg-white border-l-4 border-l-[#f4b42c] border-t border-r border-b border-gray-200 shadow-md">
            <h3 className="text-base text-[#490003] mb-2 flex items-center gap-2.5 font-bold">
              <HiGlobeAlt className="text-[#f4b42c] text-xl" />
              Mạng Lưới Toàn Cầu
            </h3>
            <p className="text-xm text-[#574542] leading-relaxed">
              Thiết lập kết nối với hơn 60 tổ chức kỷ lục đa quốc gia, mang phát minh và tác phẩm văn hóa Việt tiến vào các bảng xếp hạng danh giá.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-white border-l-4 border-l-[#f4b42c] border-t border-r border-b border-gray-200 shadow-md">
            <h3 className="text-base text-[#490003] mb-2 flex items-center gap-2.5 font-bold">
              <HiShieldCheck className="text-[#f4b42c] text-xl" />
              Vườn Ươm Tài Năng
            </h3>
            <p className="text-xm text-[#574542] leading-relaxed">
              Tạo lập quỹ bảo trợ sáng tạo, cung cấp hạ tầng pháp lý bảo hộ trí tuệ cho các nhà sáng lập và kỷ lục gia tiềm năng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}