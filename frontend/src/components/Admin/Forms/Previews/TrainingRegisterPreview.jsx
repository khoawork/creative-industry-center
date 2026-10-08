import React from 'react';
import { FaUserCheck } from 'react-icons/fa';
import { Lock } from 'lucide-react';

export default function TrainingRegisterPreview({ config }) {
  const subtitle =
    config?.subtitle ||
    'Ghi danh trực tiếp cho các khóa huấn luyện chuyên gia & khởi nghiệp sáng tạo';
  const badgeText = config?.badgeText || 'Đăng ký tham gia';
  const buttonText = config?.submitButtonText || 'Đăng ký khóa học';

  return (
    <div className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-lg border border-amber-900/10 bg-[#f4f3f1] p-6 sm:p-8">
      {/* Vạch kẻ vàng đỏ trên cùng mang phong cách Viện Kỷ lục */}
      <div className="flex h-1 justify-between overflow-hidden bg-[#710008] -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 mb-6">
        <span className="w-24 bg-[#f4b42c]" />
        <span className="w-8 bg-[#f4b42c]" />
      </div>

      <div className="mb-4">
        <span className="text-[12px] leading-4 font-bold uppercase tracking-[0.05em] text-[#490003] block">
          {badgeText}
        </span>
        <p className="text-[14px] leading-[22px] text-[#58413f] mt-0.5">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Hàng 1: Mã khóa học & Tên khóa học (Cố định - Không cho sửa) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 flex items-center justify-between text-[12px] leading-4 font-semibold text-[#1a1c1b]">
              <span>Mã khóa học *</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded">
                <Lock size={10} /> Cố định
              </span>
            </label>
            <input
              type="text"
              readOnly
              value="CR-2026"
              className="w-full rounded bg-gray-100/90 px-3 py-2 text-[14px] leading-[22px] text-gray-700 shadow-xs border border-gray-300 font-mono font-bold cursor-not-allowed select-none"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center justify-between text-[12px] leading-4 font-semibold text-[#1a1c1b]">
              <span>Tên khóa học *</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded">
                <Lock size={10} /> Cố định
              </span>
            </label>
            <input
              type="text"
              readOnly
              value="Chuyên gia Khởi nghiệp Sáng tạo"
              className="w-full rounded bg-gray-100/90 px-3 py-2 text-[14px] leading-[22px] text-gray-700 shadow-xs border border-gray-300 font-medium cursor-not-allowed select-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
            Họ và tên học viên *
          </label>
          <input
            type="text"
            readOnly
            placeholder="Nguyễn Văn A"
            className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-xs border border-gray-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
            Số điện thoại liên hệ *
          </label>
          <input
            type="tel"
            readOnly
            placeholder="0912 345 678"
            className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-xs border border-gray-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
            Địa chỉ Email học viên *
          </label>
          <input
            type="email"
            readOnly
            placeholder="hocvien@gmail.com"
            className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-xs border border-gray-200"
          />
        </div>

        <button
          type="button"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#490003] py-2.5 text-[14px] leading-5 font-bold text-white shadow-xs pointer-events-none"
        >
          <FaUserCheck className="text-[16px]" />
          {buttonText}
        </button>
      </div>
    </div>
  );
}
