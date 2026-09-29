import { useState } from 'react';
import { X, Calendar, MapPin, CheckCircle2, UserCheck, Send } from 'lucide-react';

export const EventRegisterModal = ({ event, isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    organization: '',
    ticketType: 'standard',
    notes: '',
  });

  if (!isOpen || !event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-amber-900/20 relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#490003] via-[#710008] to-[#480004] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#f4b42c] flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#ffddaf] uppercase tracking-wider block">
                {event.categoryLabel}
              </span>
              <h3 className="text-base sm:text-lg font-bold tracking-tight line-clamp-1">
                {event.actionText}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#1a1c1b]">
                Đăng ký thành công!
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                Mã xác nhận tham dự và hướng dẫn chi tiết đã được gửi đến email của Quý đại biểu.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Event Mini Box */}
              <div className="bg-[#faf9f7] p-3 rounded-xl border border-[#e0bfbb]/40 space-y-1">
                <h4 className="text-xs font-bold text-[#490003] line-clamp-1 ">
                  {event.title}
                </h4>
                <div className="flex items-center gap-4 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#9c6800]" />
                    {event.day} {event.monthYear}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#9c6800]" />
                    {event.location}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                    Họ và tên đại biểu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#f4f3f1] border border-transparent text-[#1a1c1b] focus:outline-hidden focus:bg-white focus:border-[#8c716e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#f4f3f1] border border-transparent text-[#1a1c1b] focus:outline-hidden focus:bg-white focus:border-[#8c716e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                    Email đại biểu *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="daibieu@tochuc.vn"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#f4f3f1] border border-transparent text-[#1a1c1b] focus:outline-hidden focus:bg-white focus:border-[#8c716e]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                    Cơ quan / Doanh nghiệp
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Tên viện / công ty"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#f4f3f1] border border-transparent text-[#1a1c1b] focus:outline-hidden focus:bg-white focus:border-[#8c716e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                  Hình thức tham dự
                </label>
                <select
                  value={formData.ticketType}
                  onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-[#f4f3f1] border border-transparent text-[#1a1c1b] focus:outline-hidden focus:bg-white focus:border-[#8c716e]"
                >
                  <option value="standard">Đại biểu chính thức (Trực tiếp tại khán phòng)</option>
                  <option value="online">Đại biểu trực tuyến (Qua cầu truyền hình Zoom)</option>
                  <option value="vip">Khách mời VIP / Cơ quan Báo chí truyền thông</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#490003] hover:bg-[#710008] rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5 text-[#ffba45]" />
                  <span>Xác nhận đăng ký</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default EventRegisterModal;
