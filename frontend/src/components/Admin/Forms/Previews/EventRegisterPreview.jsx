import React from 'react';
import { Calendar, MapPin, UserCheck, Send, X } from 'lucide-react';

export default function EventRegisterPreview({ config }) {
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-amber-900/20 bg-white">
      {/* Header Modal */}
      <div className="bg-gradient-to-r from-[#490003] via-[#710008] to-[#480004] text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-[#f4b42c] flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#ffddaf] uppercase tracking-wider block">
              DIỄN ĐÀN &amp; HỘI NGHỊ
            </span>
            <h3 className="text-base sm:text-lg font-bold tracking-tight">
              Đăng Ký Tham Gia Sự Kiện (Đại Biểu)
            </h3>
          </div>
        </div>
        <div className="p-1 rounded text-white/60">
          <X className="w-5 h-5" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 bg-white">
        {/* Hộp sự kiện tóm tắt */}
        <div className="bg-[#faf9f7] p-3 rounded-xl border border-[#e0bfbb]/40 space-y-1">
          <h4 className="text-xs font-bold text-[#490003]">
            Hội nghị Thượng đỉnh Công nghiệp Sáng tạo Việt Nam 2026
          </h4>
          <div className="flex items-center gap-4 text-[11px] text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#9c6800]" />
              25 Tháng 11, 2026
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#9c6800]" />
              Trung tâm Hội nghị Quốc tế, Hà Nội
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Họ và tên đại biểu *
            </label>
            <input
              type="text"
              readOnly
              placeholder="Nguyễn Văn A"
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#f4f3f1] border-transparent text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Số điện thoại liên hệ *
            </label>
            <input
              type="tel"
              readOnly
              placeholder="0912 345 678"
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#f4f3f1] border-transparent text-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Email đại biểu *
            </label>
            <input
              type="email"
              readOnly
              placeholder="daibieu@tochuc.vn"
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#f4f3f1] border-transparent text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Cơ quan / Doanh nghiệp
            </label>
            <input
              type="text"
              readOnly
              placeholder="Tên viện / công ty"
              className="w-full px-3 py-2 text-xs rounded-lg bg-[#f4f3f1] border-transparent text-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">
            Hình thức tham dự
          </label>
          <select
            disabled
            className="w-full px-3 py-2 text-xs rounded-lg bg-[#f4f3f1] border-transparent text-gray-700"
          >
            <option>Đại biểu chính thức (Trực tiếp tại khán phòng)</option>
          </select>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-gray-500 rounded-lg pointer-events-none"
          >
            Đóng
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#490003] rounded-lg shadow-sm pointer-events-none"
          >
            <Send className="w-3.5 h-3.5 text-[#ffba45]" />
            <span>Xác nhận đăng ký</span>
          </button>
        </div>
      </div>
    </div>
  );
}

