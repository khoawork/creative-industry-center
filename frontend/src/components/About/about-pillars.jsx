import React from "react";
import {
  HiLightBulb,
  HiBadgeCheck,
  HiSparkles,
  HiStar,
  HiUsers,
  HiCalendar,
} from "react-icons/hi";

export default function AboutPillars() {
  return (
    <section className="w-full bg-[#f2efe9] py-20 px-6 lg:px-12 border-t border-b border-gray-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-sm text-[#490003] tracking-widest uppercase font-bold">
            Tôn chỉ Thể chế
          </span>
          <h2 className="text-2xl lg:text-3xl text-[#490003] leading-tight uppercase font-extrabold">
            4 TRỤ CỘT GIÁ TRỊ CỐT LÕI
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-0.5 w-12 bg-[#f4b42c]"></span>
            <HiStar className="text-[#f4b42c] text-xl" />
            <span className="h-0.5 w-12 bg-[#f4b42c]"></span>
          </div>
          <p className="text-xl text-[#574542] leading-relaxed">
            Kim chỉ nam dẫn lối toàn bộ các chương trình nghiên cứu, thẩm định
            và vinh danh danh dự tại Trung tâm Công nghiệp Sáng tạo.
          </p>
        </div>

        {/* 4 Ô Cân Xứng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Trụ Cột 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center group hover:shadow-xl transition-all border-t-4 border-t-[#490003] border-x border-b border-gray-200 hover:border-t-[#f4b42c]">
            <div className="w-20 h-20 rounded-full bg-[#490003]/10 border border-[#f4b42c]/40 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <HiLightBulb className="text-[#490003] text-4xl" />
            </div>
            <h3 className="text-lg text-[#490003] mb-3 font-extrabold tracking-wide">
              TRÍ TUỆ
            </h3>
            <p className="text-xm text-[#574542] leading-relaxed">
              Hàm lượng khoa học, tính độc sáng và giá trị đóng góp nhân văn sâu
              sắc là thước đo cao nhất cho mọi đề án được xác lập.
            </p>
          </div>

          {/* Trụ Cột 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center group hover:shadow-xl transition-all border-t-4 border-t-[#490003] border-x border-b border-gray-200 hover:border-t-[#f4b42c]">
            <div className="w-20 h-20 rounded-full bg-[#490003]/10 border border-[#f4b42c]/40 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <HiBadgeCheck className="text-[#490003] text-4xl" />
            </div>
            <h3 className="text-lg text-[#490003] mb-3 font-extrabold tracking-wide">
              KỶ LỤC
            </h3>
            <p className="text-xm text-[#574542] leading-relaxed">
              Biểu thị cho ý chí vượt qua giới hạn của người Việt, sự kiên định
              chinh phục những nấc thang mới trong công nghiệp hiện đại.
            </p>
          </div>

          {/* Trụ Cột 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center group hover:shadow-xl transition-all border-t-4 border-t-[#490003] border-x border-b border-gray-200 hover:border-t-[#f4b42c]">
            <div className="w-20 h-20 rounded-full bg-[#490003]/10 border border-[#f4b42c]/40 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <HiSparkles className="text-[#490003] text-4xl" />
            </div>
            <h3 className="text-lg text-[#490003] mb-3 font-extrabold tracking-wide">
              BỀN VỮNG
            </h3>
            <p className="text-xm text-[#574542] leading-relaxed">
              Gắn kết chặt chẽ sự phát triển kinh tế sáng tạo với bảo tồn di sản
              sinh thái, kế thừa và chuyển giao chuẩn mực qua nhiều thế hệ.
            </p>
          </div>

          {/* Trụ Cột 4 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center flex flex-col items-center group hover:shadow-xl transition-all border-t-4 border-t-[#490003] border-x border-b border-gray-200 hover:border-t-[#f4b42c]">
            <div className="w-20 h-20 rounded-full bg-[#490003]/10 border border-[#f4b42c]/40 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <HiStar className="text-[#490003] text-4xl" />
            </div>
            <h3 className="text-lg text-[#490003] mb-3 font-extrabold tracking-wide">
              TÔN VINH
            </h3>
            <p className="text-xm text-[#574542] leading-relaxed">
              Trao gửi vị thế xứng đáng cho những nhân cách quả cảm, những công
              trình cống hiến thầm lặng vì sự phồn vinh của non sông.
            </p>
          </div>
        </div>

        {/* CỤM HÀNH ĐỘNG / LIÊN HỆ HỢP TÁC */}
        <div className="mt-16 pt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#490003] text-white text-base hover:bg-[#710008] border border-[#f4b42c]/60 shadow-lg hover:shadow-xl transition-all font-bold"
          >
            <HiUsers className="text-[#f4b42c] text-xl" />
            <span>Đăng ký Đề án Hợp tác & Bảo trợ</span>
          </a>
          <a
            href="#"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-[#490003] text-base hover:bg-gray-50 border-2 border-[#490003] shadow-md hover:shadow-lg transition-all font-bold"
          >
            <HiCalendar className="text-[#490003] text-xl" />
            <span>Lịch Sự kiện & Lễ Vinh danh</span>
          </a>
        </div>
      </div>
    </section>
  );
}
