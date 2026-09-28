import { X, Calendar, MapPin, Sparkles, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const EventDetailModal = ({ event, isOpen, onClose, onRegister }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-amber-900/20 relative">
        
        {/* Modal Top Image */}
        <div className="relative aspect-16/9 w-full bg-gray-100 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="inline-block bg-[#ffba45] text-[#704b00] text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider mb-1.5">
              {event.statusText}
            </span>
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight leading-snug">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Metadata quick row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-gray-100 text-xs text-gray-700">
            <div className="flex items-center gap-2 bg-[#f4f3f1] p-2.5 rounded-xl">
              <Calendar className="w-4 h-4 text-[#9c6800] shrink-0" />
              <span><strong>Thời gian:</strong> {event.day} {event.monthYear}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#f4f3f1] p-2.5 rounded-xl">
              <MapPin className="w-4 h-4 text-[#9c6800] shrink-0" />
              <span className="truncate"><strong>Địa điểm:</strong> {event.location}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-[#490003] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#f4b42c]" />
              Giới thiệu sự kiện
            </h4>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
              {event.description}
            </p>
          </div>

          {/* Speaker / Organizing Box */}
          <div className="bg-[#faf9f7] border border-[#e0bfbb]/40 p-4 rounded-2xl flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${event.speaker.avatarBg}`}>
              {event.speaker.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1a1c1b]">
                {event.speaker.name}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {event.speaker.role}
              </p>
            </div>
          </div>

          {/* Key highlights */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-[#490003] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#f4b42c]" />
              Điểm nhấn chương trình
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Quy tụ các chuyên gia hàng đầu, kỷ lục gia và lãnh đạo cơ quan ban ngành quốc gia.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Nhận chứng nhận đại biểu tham dự chính thức từ Viện Kỷ lục Việt Nam (VIETKINGS).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Kết nối trực tiếp mạng lưới doanh nghiệp, quỹ ươm tạo và đối tác truyền thông quốc tế.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-[#f4f3f1] border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            Đóng
          </button>

          <button
            onClick={() => {
              onClose();
              if (onRegister) onRegister(event);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#490003] hover:bg-[#710008] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-[#ffba45]" />
            <span>{event.actionText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default EventDetailModal;
