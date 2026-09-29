import React from 'react';
import { HiShieldExclamation, HiBriefcase, HiAcademicCap, HiBookOpen } from 'react-icons/hi';

export default function AboutMission() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Cột Trái: Nội Dung Sứ Mệnh Cao Cả */}
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4b42c]/15 border border-[#f4b42c]/40 text-[#490003] text-xs font-bold uppercase tracking-wide">
          <HiShieldExclamation className="text-base text-[#f4b42c]" />
          Tuyên Ngôn Hành Động
        </div>
        <h2 className="text-2xl lg:text-3xl text-[#490003] leading-tight font-extrabold">
          SỨ MỆNH CAO CẢ: <br className="hidden sm:inline" />Khơi Nguồn Tinh Hoa - Phụng Sự Tổ Quốc
        </h2>
        <div className="w-20 h-1.5 bg-[#f4b42c] rounded-full"></div>
        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-4 p-5 rounded-lg bg-white border border-gray-200 hover:border-[#f4b42c]/60 shadow-sm transition-all">
            <div className="w-11 h-11 rounded-full bg-[#490003] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md border border-[#f4b42c]/40">
              <HiBriefcase className="text-[#f4b42c] text-xl font-bold" />
            </div>
            <div>
              <h3 className="text-xl text-[#490003] mb-1 font-bold">Đồng hành cùng Doanh Nghiệp Quốc Gia</h3>
              <p className="text-xl text-[#574542] leading-relaxed">
                Tư vấn, định chuẩn và xây dựng thương hiệu dựa trên các cột mốc kỷ lục, giúp các tập đoàn trong nước khẳng định uy thế và gia tăng định giá trên trường quốc tế.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-lg bg-white border border-gray-200 hover:border-[#f4b42c]/60 shadow-sm transition-all">
            <div className="w-11 h-11 rounded-full bg-[#490003] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md border border-[#f4b42c]/40">
              <HiBookOpen className="text-[#f4b42c] text-xl font-bold" />
            </div>
            <div>
              <h3 className="text-xl text-[#490003] mb-1 font-bold">Tôn vinh Cộng đồng Kỷ lục gia Tiên phong</h3>
              <p className="text-xl text-[#574542] leading-relaxed">
                Lưu trữ biên niên sử, ghi chép hành trình cống hiến trọn đời của các nhân tài, nghệ nhân thủ công truyền thống và các nhà phát minh kiệt xuất.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-lg bg-white border border-gray-200 hover:border-[#f4b42c]/60 shadow-sm transition-all">
            <div className="w-11 h-11 rounded-full bg-[#490003] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md border border-[#f4b42c]/40">
              <HiAcademicCap className="text-[#f4b42c] text-xl font-bold" />
            </div>
            <div>
              <h3 className="text-xl text-[#490003] mb-1 font-bold">Chắp cánh Thế Hệ Trí thức Trẻ</h3>
              <p className="text-xl text-[#574542] leading-relaxed">
                Tổ chức các khóa bồi dưỡng, trại sáng tạo thực tiễn và cấp học bổng nghiên cứu nhằm truyền lửa đam mê chinh phục các đỉnh cao tri thức mới.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cột Phải: Khung Ảnh Lễ Ký Kết & Thành Tựu */}
      <div className="lg:col-span-5 relative">
        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-200 border-2 border-[#f4b42c]/50">
          <img
            className="w-full h-[450px] object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOVpOFo8izzO-zpMmXM1MXymaLwTsKqPhuA1wOCcWCD3QJKqFh5I-Vbr5QnkG09sYOF8HXYBK8cDdi0e55sXrLyGiCBVMoXBSs82Hj6juuqOWQCnC-L0L2no0yTPHg5kVASX-TLe_4RlRyZhKmxjiSJSt4jNU4itZjV2n0Q162Wy4VpwwOpY09WoukWW4qP4UvhfIJPn-EP6LCGm4BpeaQ1fiWsOAMunpe3eGfUvn6tSfPKO7mkIX5"
            alt="Lễ Ký kết Thỏa thuận Chiến lược"
          />
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#490003]/95 via-[#490003]/85 to-transparent text-white">
            <span className="text-xs text-[#f4b42c] uppercase tracking-wider block mb-1 font-bold">Hợp Tác Toàn Diện</span>
            <p className="text-base text-white leading-snug font-bold">Lễ Ký kết Thỏa thuận Chiến lược Phát triển Kỷ lục Công nghiệp Sáng tạo</p>
          </div>
        </div>
      </div>
    </section>
  );
}