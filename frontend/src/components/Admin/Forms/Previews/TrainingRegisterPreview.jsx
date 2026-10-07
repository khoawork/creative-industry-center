import React from 'react';
import { FaUserCheck } from 'react-icons/fa';

export default function TrainingRegisterPreview({ config }) {
  return (
    <div className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-lg border border-amber-900/10 bg-[#f4f3f1] p-6 sm:p-8">
      <div className="mb-4">
        <span className="text-[12px] leading-4 font-bold uppercase tracking-[0.05em] text-[#490003] block">
          Đăng ký tham gia
        </span>
        <p className="text-[14px] leading-[22px] text-[#58413f] mt-0.5">
          Ghi danh trực tiếp cho khóa học <strong>CR-2026: Chuyên gia Khởi nghiệp Sáng tạo</strong>
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        <div>
          <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
            Họ và tên *
          </label>
          <input
            type="text"
            readOnly
            placeholder="Nguyễn Văn A"
            className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-xs border border-transparent"
          />
        </div>

        <div>
          <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
            Số điện thoại *
          </label>
          <input
            type="tel"
            readOnly
            placeholder="0912 345 678"
            className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-xs border border-transparent"
          />
        </div>

        <div>
          <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
            Địa chỉ Email *
          </label>
          <input
            type="email"
            readOnly
            placeholder="hocvien@gmail.com"
            className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-xs border border-transparent"
          />
        </div>

        <button
          type="button"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded bg-[#490003] py-2.5 text-[14px] leading-5 font-bold text-white shadow-xs pointer-events-none"
        >
          <FaUserCheck className="text-[16px]" />
          Đăng ký khóa học
        </button>
      </div>
    </div>
  );
}

