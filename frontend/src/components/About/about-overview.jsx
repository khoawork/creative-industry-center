import React from 'react';
import { HiLibrary, HiCheckCircle, HiBadgeCheck } from 'react-icons/hi';

export default function AboutOverview() {
  return (
    <section className="max-width grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Cột Trái: Nội dung lịch sử & vai trò */}
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4b42c]/15 border border-[#f4b42c]/40 text-[#490003] text-xs font-bold uppercase tracking-wide">
          <HiLibrary className="text-base text-[#f4b42c]" />
          Hồ sơ Pháp lý & Thể chế
        </div>
        <h2 className="text-2xl lg:text-3xl text-[#490003] leading-tight font-extrabold">
          Cơ Quan Kiến Tạo & Định Hình <br className="hidden sm:inline" />Hệ Sinh Thái Sáng Tạo Quốc Gia
        </h2>
        <div className="w-20 h-1.5 bg-[#f4b42c] rounded-full"></div>
        <p className="text-xl text-gray-800 leading-relaxed">
          Trung tâm Công nghiệp Sáng tạo trực thuộc Viện Kỷ lục Việt Nam (VietKings) là đơn vị tiên phong giữ vai trò nghiên cứu, quy chuẩn hóa và bảo trợ các công trình trí tuệ tiêu biểu. Được thành lập với thẩm quyền chuyên trách ghi nhận những cột mốc phát triển phi thường của người Việt, Trung tâm đặt trọng tâm vào việc chuyển hóa di sản văn hóa thành tài nguyên số hóa và năng lực cạnh tranh toàn cầu.
        </p>
        <p className="text-xl text-[#574542] leading-relaxed">
          Bằng việc liên kết chặt chẽ cùng các viện nghiên cứu, doanh nghiệp đầu ngành và các chuyên gia tư vấn chiến lược, chúng tôi bảo chứng các giá trị thực học, thực nghiệp và sáng tạo bền vững, đồng thời đại diện Việt Nam tham gia đối thoại thường niên tại Liên minh Kỷ lục Thế giới (WorldKings).
        </p>
        <div className="pt-2 flex items-center gap-6">
          <div className="flex items-center gap-3.5 bg-white p-3.5 rounded-lg border border-[#f4b42c]/40 shadow-sm">
            <HiCheckCircle className="text-[#f4b42c] text-3xl font-bold" />
            <div className="flex flex-col">
              <span className="text-lg text-[#490003] font-bold">100%</span>
              <span className="text-xs text-gray-600 font-medium">Thẩm định minh bạch</span>
            </div>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div className="flex items-center gap-3.5 bg-white p-3.5 rounded-lg border border-[#f4b42c]/40 shadow-sm">
            <HiBadgeCheck className="text-[#f4b42c] text-3xl font-bold" />
            <div className="flex flex-col">
              <span className="text-lg text-[#490003] font-bold">500+</span>
              <span className="text-xs text-gray-600 font-medium">Công trình bảo hộ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cột Phải: Ảnh Trụ Sở / Lễ Ra Mắt */}
      <div className="lg:col-span-5 relative">
        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-200 border-2 border-[#f4b42c]/50">
          <img
            className="w-full h-[450px] object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJN5Csi3izNnPgDvAHWa3NPPVpHJri8_CopvgEeA0C3jlHu31Q6ECh833er0ecVSnzjrBVOLSz1Qa3eiFz65aDbwOaDqsZJL_STsMWkpkDOKQbC3qB-d346YSA0gZ2IcWl5nQFFQLJB8YULiK4ierU7MHU8UKkmWmGF3s5ohj8VuUkX2SpaWWRXM_deTgKEPXx1F1uUVT1TkcHVKO18pAQfuPvWRzxwUmozR9inLDK0RzL_-pw6f86"
            alt="Trụ sở Viện Kỷ lục Việt Nam"
          />
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-[#490003]/95 via-[#490003]/85 to-transparent text-white">
            <span className="text-xs text-[#f4b42c] uppercase tracking-wider block mb-1 font-bold">Nghi thức Khánh thành</span>
            <p className="text-base text-white leading-snug font-bold">Trụ sở Viện Kỷ lục Việt Nam - Không gian Tôn vinh Trí tuệ Việt</p>
          </div>
        </div>
      </div>
    </section>
  );
}