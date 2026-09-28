import React from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function ProjectForm() {
  return (
    <div className="bg-[#710008] text-white py-16 px-4 md:px-12 mt-16 rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      {/* Cột trái: Thông tin giới thiệu */}
      <div className="lg:col-span-7">
        <span className="text-2xl uppercase tracking-wider bg-[#ffffff30] text-[#e9c8a3] px-2.5 py-1 rounded font-semibold">
          HỢP TÁC PHÁT TRIỂN & ĐỒNG HÀNH CHIẾN LƯỢC
        </span>
        <h2 className="text-[2.5rem] md:text-5xl font-semibold leading-tight mt-4 mb-4">
          ĐỀ XUẤT DỰ ÁN SÁNG TẠO HOẶC ĐĂNG KÝ ĐỒNG HÀNH CÙNG TRUNG TÂM
        </h2>
        <p className="text-2xl text-[#f7b8a9] leading-relaxed mb-6">
          Bạn là tổ chức, địa phương hay nhà sáng lập sở hữu công trình, giải
          pháp nghệ thuật hoặc công nghệ đột phá? Hãy nộp hồ sơ để nhận thẩm
          định chuyên gia, bảo trợ pháp lý và tiếp cận nguồn lực hệ sinh thái
          Viện Kỷ lục Việt Nam.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-[#d49520] text-base shrink-0" />
            <span>Bảo chứng Kỷ lục Quốc gia</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-[#d49520] text-base shrink-0" />
            <span>Tư vấn Sở hữu trí tuệ</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-[#d49520] text-base shrink-0" />
            <span>Kết nối Mạng lưới Chuyên gia</span>
          </div>
        </div>
      </div>

      {/* Cột phải: Form nhập */}
      <div className="bg-white text-gray-800 p-6 md:p-8 rounded-xl shadow-lg lg:col-span-5 w-full">
        <h3 className="text-lg font-bold text-[#710008] mb-1">
          Gửi Đề Xuất Dự Án Mới
        </h3>
        <p className="text-xs text-gray-500 mb-5">
          Ban Thư ký Hội đồng Khoa học sẽ phản hồi văn bản trong vòng 03 ngày
          làm việc.
        </p>

        <form className="space-y-4 text-xs">
          {/* Tên cơ quan / chủ nhiệm dự án */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              TÊN CƠ QUAN / CHỦ NHIỆM DỰ ÁN
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Tập đoàn Công nghệ & Di sản Văn hóa..."
              className="w-full bg-[#fdf6ec] border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#710008]"
            />
          </div>

          {/* Tên dự án sáng tạo */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              TÊN DỰ ÁN SÁNG TẠO
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Khu bảo tồn tương tác nghệ thuật số..."
              className="w-full bg-[#fdf6ec] border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#710008]"
            />
          </div>

          {/* Số điện thoại và Địa bàn triển khai */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                SỐ ĐIỆN THOẠI
              </label>
              <input
                type="text"
                placeholder="0987xxxxxx"
                className="w-full bg-[#fdf6ec] border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#710008]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                ĐỊA BÀN TRIỂN KHAI
              </label>
              <select className="w-full bg-[#fdf6ec] border border-gray-300 rounded-lg px-3.5 py-2.5 text-gray-700 focus:outline-none focus:border-[#710008]">
                <option>Miền Bắc</option>
                <option>Miền Trung</option>
                <option>Miền Nam</option>
                <option>Toàn quốc</option>
              </select>
            </div>
          </div>

          {/* Nhu cầu hợp tác */}
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              NHU CẦU HỢP TÁC
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 bg-[#fdf6ec] text-gray-700 focus:outline-none focus:border-[#710008]">
              <option>Đề cử xác lập Kỷ lục Quốc gia & Cố vấn chuyên môn</option>
              <option>Chuyển đổi số di sản & Công nghệ</option>
              <option>Đầu tư & Ươm tạo Startup</option>
            </select>
          </div>

          {/* Nút gửi hồ sơ */}
          <button
            type="submit"
            className="w-full bg-[#4a0000] hover:bg-[#710008] text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-md tracking-wide"
          >
            <span>&gt; Gửi Hồ Sơ Dự Án</span>
          </button>
        </form>
      </div>
    </div>
  );
}
