import React from 'react';
import { Mail, ShieldCheck, Send } from 'lucide-react';

export default function EventNewsletterPreview({ config }) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-amber-900/10 bg-white">
      {/* Banner thương hiệu */}
      <div className="bg-gradient-to-r from-[#490003] via-[#710008] to-[#480004] text-white p-6 sm:p-7 relative">
        <span className="text-[10px] font-bold tracking-widest text-[#f4b42c] uppercase bg-white/10 px-2.5 py-1 rounded-full inline-block mb-2">
          {config?.badgeText || 'BẢN TIN VIỆN KỶ LỤC'}
        </span>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {config?.title || 'Đăng Ký Nhận Bản Tin & Thông Báo Sự Kiện'}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-200 leading-relaxed max-w-xl">
          {config?.subtitle || 'Nhận thư mời ưu tiên, tài liệu kỷ yếu và thông cáo báo chí chính thức từ Ban Thư ký.'}
        </p>
      </div>

      {/* Form giả lập */}
      <div className="p-6 space-y-4 bg-[#faf9f8]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Họ và tên đại biểu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              readOnly
              placeholder="Nguyễn Văn A"
              className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Đơn vị / Doanh nghiệp
            </label>
            <input
              type="text"
              readOnly
              placeholder="Tên cơ quan, tổ chức hoặc doanh nghiệp"
              className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200 text-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Địa chỉ Email liên hệ <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              readOnly
              placeholder="daibieu@tochuc.vn"
              className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Số điện thoại liên hệ
            </label>
            <input
              type="tel"
              readOnly
              placeholder="0901234567"
              className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200 text-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Ghi chú / Yêu cầu thêm
          </label>
          <textarea
            readOnly
            rows="2"
            placeholder="Nêu rõ lĩnh vực quan tâm hoặc yêu cầu đặc biệt..."
            className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200 text-gray-700 resize-none"
          ></textarea>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-200/60">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bảo mật thông tin theo tiêu chuẩn viện nghiên cứu.</span>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg bg-[#490003] text-white shadow-sm pointer-events-none"
          >
            <Send className="w-3.5 h-3.5 text-[#f4b42c]" />
            <span>Xác Nhận Đăng Ký Thông Báo</span>
          </button>
        </div>
      </div>
    </div>
  );
}

