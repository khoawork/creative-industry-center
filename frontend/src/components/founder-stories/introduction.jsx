import React from 'react';

export const Introduction = ({ totalStories = 54 }) => {
  return (
    <section 
      className="relative overflow-hidden text-white py-14 md:py-20 border-b-4 border-[#d49520]"
      style={{
        background: 'linear-gradient(52deg, rgba(73, 0, 3, 1) 60%, rgba(128, 36, 10, 1) 81%)'
      }}
    >
      {/* Hiệu ứng ánh sáng nền */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#d49520]/10 rounded-full blur-3xl pointer-events-none transform -translate-y-1/2"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          <div className="w-full space-y-4">
            {/* Badge phía trên */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#4d0105]/80 border border-[#d49520]/30 rounded-md text-xs md:text-sm tracking-wider uppercase">
              <span className="text-[#d49520] font-semibold">✪ CHUYÊN TRANG NHÂN VẬT • VIETKINGS ARCHIVE</span>
            </div>

            {/* Tiêu đề chính */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase drop-shadow-sm leading-tight">
              CHUYỆN NHÀ SÁNG NGHIỆP
            </h1>

            {/* Đường gạch ngang */}
            <div className="bg-[#710008] h-[6px] w-[100px] rounded-lg"></div>

            {/* Khối chứa Paragraph và Thẻ Stats nằm ngang hàng */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pt-2">
              <p className="text-amber-100/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl font-normal">
                Hành trình khởi nguồn ý chí — Những câu chuyện cống hiến truyền cảm hứng từ các Kỷ lục gia, Nhà khoa học và Doanh nhân tiên phong trong sự nghiệp công nghiệp sáng tạo quốc gia.
              </p>
              
              {/* Thẻ thống kê */}
              <div className="shrink-0 self-start xl:self-center">
                <div className="bg-[#4d0208]/90 backdrop-blur-md border border-[#d49520]/40 rounded-xl p-5 shadow-2xl flex items-center gap-4 hover:border-[#d49520] transition-all duration-300 group">
                  <div className="w-16 h-16 rounded-lg bg-[#d49520] text-white flex items-center justify-center font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
                    {totalStories}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[#d49520] font-extrabold text-sm sm:text-base tracking-wider uppercase">
                      NIÊN GIÁM KỶ LỤC GIA
                    </span>
                    <span className="text-xs text-amber-100/80 mt-0.5">
                      Hồ sơ sáng tạo & cống hiến thực chứng
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Introduction;