import React from 'react';
import { FilePenLine, Mail, MessageSquareText, Phone, Send, User, ChevronDown } from 'lucide-react';

export default function ContactFeedbackPreview({ config }) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden relative p-6 sm:p-7">
      {/* Vạch kẻ vàng đỏ trên cùng đặc trưng */}
      <div className="absolute inset-x-0 top-0 flex h-1.5 justify-between overflow-hidden bg-[#710008]">
        <span className="w-32 bg-[#f4b42c]" />
        <span className="w-12 bg-[#f4b42c]" />
      </div>

      <div className="pb-5">
        <p className="mb-1 flex items-center gap-2 text-xs font-bold tracking-wider text-[#710008] uppercase">
          <FilePenLine size={18} className="shrink-0 text-[#f4b42c]" />
          Cổng Tiếp Nhận Trực Tuyến
        </p>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#710008] uppercase">
          Gửi phản hồi hoặc yêu cầu tư vấn
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-600">
          Quý vị vui lòng để lại thông tin và nội dung cần tư vấn để Ban Thư ký Trung tâm hỗ trợ.
        </p>
      </div>

      <div className="space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Họ và tên *
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full rounded bg-[#faf8f5] pl-9 pr-3 py-2 text-xs text-black border border-gray-200"
              />
              <User size={15} className="absolute left-3 top-2.5 text-[#f4b42c]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Địa chỉ Email *
            </label>
            <div className="relative">
              <input
                type="email"
                readOnly
                placeholder="name@domain.com"
                className="w-full rounded bg-[#faf8f5] pl-9 pr-3 py-2 text-xs text-black border border-gray-200"
              />
              <Mail size={15} className="absolute left-3 top-2.5 text-[#f4b42c]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Số điện thoại liên hệ
            </label>
            <div className="relative">
              <input
                type="tel"
                readOnly
                placeholder="0912 345 678"
                className="w-full rounded bg-[#faf8f5] pl-9 pr-3 py-2 text-xs text-black border border-gray-200"
              />
              <Phone size={15} className="absolute left-3 top-2.5 text-[#f4b42c]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Lĩnh vực quan tâm
            </label>
            <div className="relative">
              <select
                disabled
                className="w-full rounded bg-[#faf8f5] px-3 py-2 text-xs text-black border border-gray-200 appearance-none"
              >
                <option>Đề cử kỷ lục &amp; Tôn vinh danh hiệu</option>
              </select>
              <ChevronDown size={15} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Nội dung lời nhắn / Đề xuất chi tiết *
          </label>
          <div className="relative">
            <textarea
              readOnly
              rows="3"
              placeholder="Mô tả tóm tắt nội dung đề xuất hoặc nguyện vọng hợp tác..."
              className="w-full rounded bg-[#faf8f5] pl-9 pr-3 py-2 text-xs text-black border border-gray-200 resize-none"
            ></textarea>
            <MessageSquareText size={15} className="absolute left-3 top-2.5 text-[#f4b42c]" />
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded bg-[#710008] px-6 py-2.5 text-xs font-bold text-white shadow-sm pointer-events-none mt-1"
        >
          <span className="h-3 w-1 rounded-full bg-[#f4b42c]" />
          GỬI LỜI NHẮN NGAY
          <Send size={15} className="text-[#f4b42c]" />
        </button>
      </div>
    </div>
  );
}

