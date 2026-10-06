import React from 'react';
import { Lightbulb, Send, ShieldCheck } from 'lucide-react';

export default function ProjectProposalPreview({ config }) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-amber-900/10 bg-white">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#490003] via-[#710008] to-[#480004] text-white p-6 relative">
        <span className="text-[10px] font-bold tracking-widest text-[#f4b42c] uppercase bg-white/10 px-2.5 py-1 rounded-full inline-block mb-2">
          {config?.badgeText || 'CỔNG ĐỀ XUẤT DỰ ÁN'}
        </span>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {config?.title || 'Đề Xuất Dự Án Sáng Tạo Mới'}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-200 leading-relaxed max-w-xl">
          {config?.subtitle || 'Kết nối cùng các chuyên gia và mạng lưới Kỷ lục để thẩm định, cố vấn và hiện thực hóa dự án.'}
        </p>
      </div>

      <div className="p-6 space-y-3.5 bg-[#faf9f8]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Họ và tên người đại diện *
            </label>
            <input
              type="text"
              readOnly
              placeholder="Nguyễn Văn B"
              className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Tổ chức / Nhóm dự án
            </label>
            <input
              type="text"
              readOnly
              placeholder="Công ty / Studio / Nhóm nghiên cứu"
              className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email liên hệ *
            </label>
            <input
              type="email"
              readOnly
              placeholder="project@creative.vn"
              className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Số điện thoại *
            </label>
            <input
              type="tel"
              readOnly
              placeholder="0912345678"
              className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Tên dự án sáng tạo *
          </label>
          <input
            type="text"
            readOnly
            placeholder="Ví dụ: Không gian trải nghiệm văn hóa số đa giác quan..."
            className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Tóm tắt nội dung và mục tiêu dự án *
          </label>
          <textarea
            readOnly
            rows="3"
            placeholder="Mô tả ngắn gọn về ý tưởng, quy mô và đối tượng thụ hưởng..."
            className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200 resize-none"
          ></textarea>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-200/60">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bảo mật ý tưởng và thông tin sở hữu trí tuệ của tác giả.</span>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg bg-[#490003] text-white shadow-sm pointer-events-none"
          >
            <Send className="w-3.5 h-3.5 text-[#f4b42c]" />
            <span>Gửi Đề Xuất Dự Án</span>
          </button>
        </div>
      </div>
    </div>
  );
}

