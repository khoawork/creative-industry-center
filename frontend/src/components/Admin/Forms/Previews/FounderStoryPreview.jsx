import React from 'react';
import { Sparkles, Send, X } from 'lucide-react';

export default function FounderStoryPreview({ config }) {
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-amber-900/10 bg-white">
      {/* Header gradient đỏ rượu vang */}
      <div className="bg-gradient-to-r from-[#710008] to-[#450105] text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/10 text-amber-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">Gửi Câu Chuyện Sáng Nghiệp</h3>
            <p className="text-xs text-amber-200/80">Chia sẻ hành trình của bạn cùng Trung tâm</p>
          </div>
        </div>
        <div className="text-white/60">
          <X className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 space-y-3.5 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Họ và tên nhà sáng lập *
            </label>
            <input
              type="text"
              readOnly
              placeholder="VD: Nguyễn Văn A"
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tên thương hiệu / Doanh nghiệp *
            </label>
            <input
              type="text"
              readOnly
              placeholder="VD: Gốm Sứ Bát Tràng"
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Lĩnh vực hoạt động
            </label>
            <select
              disabled
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
            >
              <option>Thủ công mỹ nghệ &amp; Làng nghề</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Địa chỉ Email *
            </label>
            <input
              type="email"
              readOnly
              placeholder="founder@brand.vn"
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Số điện thoại liên hệ *
          </label>
          <input
            type="tel"
            readOnly
            placeholder="0912 345 678"
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Tóm tắt câu chuyện / Dự án sáng tạo *
          </label>
          <textarea
            readOnly
            rows="2"
            placeholder="Chia sẻ ngắn gọn về hành trình khởi nghiệp, khó khăn đã vượt qua hoặc dấu ấn đặc biệt..."
            className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 resize-none"
          ></textarea>
        </div>

        <div className="flex justify-end gap-2.5 pt-1">
          <button
            type="button"
            className="px-4 py-2 text-xs font-semibold text-gray-600 rounded-lg pointer-events-none"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#710008] rounded-lg shadow-sm pointer-events-none"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi Ban Biên Tập</span>
          </button>
        </div>
      </div>
    </div>
  );
}

