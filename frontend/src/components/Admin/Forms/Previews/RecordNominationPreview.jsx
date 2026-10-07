import React from 'react';
import { Award, Check, X } from 'lucide-react';

export default function RecordNominationPreview({ config }) {
  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-amber-900/10 bg-white p-6 sm:p-7 relative">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b8860b]">
          <Check size={16} />
          Đề cử chính thức
        </p>
        <div className="p-1 rounded-full text-gray-400">
          <X size={18} />
        </div>
      </div>

      <h3 className="mt-2 text-xl font-bold text-[#490003]">
        Kỷ lục gia Nghệ thuật Gốm Sứ Truyền Thống Việt Nam
      </h3>
      <p className="mt-1 text-xs text-gray-600 leading-relaxed">
        Vui lòng điền thông tin ban đầu. Hồ sơ sẽ được tiếp nhận và thẩm định trực tiếp bởi Ban Thư ký Viện Kỷ lục.
      </p>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#490003] mb-1">
              Người đại diện *
            </label>
            <input
              type="text"
              readOnly
              placeholder="Nguyễn Văn A"
              className="w-full rounded-lg border border-[#490003]/20 bg-white px-3 py-2 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#490003] mb-1">
              Số điện thoại liên hệ *
            </label>
            <input
              type="tel"
              readOnly
              placeholder="0912 345 678"
              className="w-full rounded-lg border border-[#490003]/20 bg-white px-3 py-2 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#490003] mb-1">
            Email *
          </label>
          <input
            type="email"
            readOnly
            placeholder="decu@tochuc.vn"
            className="w-full rounded-lg border border-[#490003]/20 bg-white px-3 py-2 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#490003] mb-1">
            Tên tổ chức, đơn vị hoặc làng nghề
          </label>
          <input
            type="text"
            readOnly
            placeholder="Làng gốm Bát Tràng, Hà Nội"
            className="w-full rounded-lg border border-[#490003]/20 bg-white px-3 py-2 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#490003] mb-1">
            Tóm tắt thành tựu / Đề tài nổi bật
          </label>
          <textarea
            readOnly
            rows="2"
            placeholder="Mô tả ngắn gọn về giải pháp, sản phẩm hoặc năm cống hiến..."
            className="w-full rounded-lg border border-[#490003]/20 bg-white px-3 py-2 text-xs resize-none"
          ></textarea>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            className="rounded-lg bg-amber-50 px-4 py-2 text-xs font-semibold text-[#490003] pointer-events-none"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            className="rounded-lg bg-[#490003] px-5 py-2 text-xs font-bold uppercase tracking-wide text-white pointer-events-none"
          >
            Gửi hồ sơ đề cử ngay
          </button>
        </div>
      </div>
    </div>
  );
}

