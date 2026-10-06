import React from 'react';

export function AwardPageUnavailable() {
  return (
    <main className="min-h-[55vh] flex items-center justify-center px-6 py-20 bg-[#faf9f7]">
      <section className="max-w-xl text-center">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#680007]">Giải thưởng</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-gray-900">Trang chưa có nội dung</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Nội dung giải thưởng đang được cập nhật. Vui lòng quay lại sau.
        </p>
      </section>
    </main>
  );
}

export default AwardPageUnavailable;