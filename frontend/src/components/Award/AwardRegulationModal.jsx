import React, { useEffect } from 'react';
import { X, FileDown, CheckCircle, Scale, Calendar, Award, Shield } from 'lucide-react';

export const AwardRegulationModal = ({ isOpen, onClose, mode = 'regulation' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isDossier = mode === 'dossier';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#680007] to-[#8c000a] text-white p-5 sm:p-6 pr-12 relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-400 text-gray-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded uppercase">
              {isDossier ? 'BẢNG VÀNG DANH DỰ' : 'VĂN BẢN QUY PHẠM'}
            </span>
            <span className="bg-white/20 text-white text-[11px] font-medium px-2 py-0.5 rounded">
              VIETKINGS • 2025
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold leading-snug">
            {isDossier
              ? 'Hồ Sơ Vinh Danh Gương Mặt & Tập Thể Mùa Xuân 2025'
              : 'Quy Chế Xét Tặng & Đề Cử Giải Thưởng Thường Niên'}
          </h3>

          <p className="text-xs sm:text-sm text-amber-200 mt-1">
            {isDossier
              ? 'Công bố chính thức danh sách đại biểu, kỷ lục gia và doanh nghiệp sáng tạo xuất sắc'
              : 'Quyết định số 128/QĐ-VIETKINGS về việc ban hành quy chế hệ thống tôn vinh quốc gia'}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-gray-700 text-sm">
          {isDossier ? (
            <>
              <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-amber-900 mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#b88628]" />
                  Tổng quan đợt vinh danh Mùa Xuân 2025
                </h4>
                <p className="text-xs text-amber-950 leading-relaxed">
                  Đợt xét tặng Mùa Xuân 2025 đã tiếp nhận 142 hồ sơ từ 38 tỉnh, thành phố. Hội đồng chuyên gia và Hội đồng Viện Kỷ lục Việt Nam đã làm việc công tâm qua 3 vòng thẩm định độc lập để chọn ra các đại diện tiêu biểu nhất.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#680007] uppercase tracking-wider">
                  Các đơn vị &amp; cá nhân tiêu biểu trong đợt xét này
                </h4>

                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Công ty CP Gốm Sứ Sen Việt</h5>
                    <p className="text-xs text-gray-500">Mã hồ sơ: KHOA-2024-001 • Giải Đổi Mới Sáng Tạo Di Sản</p>
                    <p className="text-xs text-gray-700 mt-1">Sáng chế men nano nung nhiệt độ thấp, tiết kiệm 40% nhiên liệu.</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Đã công nhận
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">NNƯT. Trần Quang Thái</h5>
                    <p className="text-xs text-gray-500">Mã hồ sơ: BTV-2024-042 • Bàn Tay Vàng Kỷ Lục Dân Tộc</p>
                    <p className="text-xs text-gray-700 mt-1">Tạo tác bình chạm đồng bạc kích thước lớn với hơn 3,000 chi tiết thủ công.</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Đã công nhận
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Dự án VR Di Sản Hoàng Cung</h5>
                    <p className="text-xs text-gray-500">Mã hồ sơ: STARTUP-2025-015 • Ngôi Sao Khởi Nghiệp Trẻ</p>
                    <p className="text-xs text-gray-700 mt-1">Không gian số hóa thực tế ảo 3D mô phỏng kiến trúc và nghi lễ triều Nguyễn.</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Đã công nhận
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Regulation Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <Scale className="w-5 h-5 text-[#680007] mx-auto mb-1.5" />
                  <span className="text-[11px] text-gray-500 font-medium block">Nguyên tắc</span>
                  <span className="text-xs font-bold text-gray-900">Khách quan • Minh bạch</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <Calendar className="w-5 h-5 text-[#680007] mx-auto mb-1.5" />
                  <span className="text-[11px] text-gray-500 font-medium block">Kỳ xét tặng</span>
                  <span className="text-xs font-bold text-gray-900">Thường niên hàng năm</span>
                </div>
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <Shield className="w-5 h-5 text-[#680007] mx-auto mb-1.5" />
                  <span className="text-[11px] text-gray-500 font-medium block">Cơ quan chủ quản</span>
                  <span className="text-xs font-bold text-gray-900">TW VIETKINGS</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#680007] uppercase tracking-wider mb-2">
                  1. Đối tượng tham gia và thẩm quyền đề cử
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Tất cả các tổ chức, doanh nghiệp, làng nghề truyền thống, kỷ lục gia, nghệ nhân nhân dân, nghệ nhân ưu tú và các cá nhân có cống hiến vượt bậc trên lãnh thổ Việt Nam hoặc cộng đồng người Việt ở nước ngoài đều có quyền gửi hồ sơ hoặc được các cơ quan chức năng, liên đoàn đề cử.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#680007] uppercase tracking-wider mb-2">
                  2. Quy trình thẩm định 3 vòng nghiêm ngặt
                </h4>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-start gap-2 bg-[#faf8f5] p-2.5 rounded-lg border border-gray-100">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Vòng 1 (Sơ duyệt hồ sơ):</strong> Ban Thư ký kiểm tra tính hợp lệ về mặt pháp lý, các bằng chứng xác thực và xác minh hiện trạng.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-[#faf8f5] p-2.5 rounded-lg border border-gray-100">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Vòng 2 (Hội đồng Chuyên gia):</strong> Đánh giá thực nghiệm, giám định chất lượng tác phẩm/giải pháp và thẩm định thực địa.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-[#faf8f5] p-2.5 rounded-lg border border-gray-100">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Vòng 3 (Hội đồng Viện Kỷ Lục):</strong> Biểu quyết độc lập và công bố kết quả trên Cổng thông tin Quốc gia.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#680007] uppercase tracking-wider mb-2">
                  3. Quyền lợi của cá nhân / tập thể được tôn vinh
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Được trao tặng Bằng Vinh danh chính thức, Cúp / Huy hiệu chế tác độc bản, ghi danh vào Niên giám Kỷ lục Việt Nam và được hỗ trợ truyền thông, quảng bá thương hiệu di sản trên hệ thống đối tác quốc tế của VIETKINGS.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100 transition cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={() => alert('Đang tải văn bản quy chế PDF chính thức về thiết bị của bạn...')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#680007] hover:bg-[#850009] text-white rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Tải văn bản hoàn chỉnh (.PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AwardRegulationModal;

