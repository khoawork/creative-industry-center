import { Calendar, Users, Award, Building2, Compass } from 'lucide-react';
import { EVENT_STATS } from '../../data/eventData';

export const EventHero = () => {
  const iconMap = {
    calendar: Calendar,
    users: Users,
    certificate: Award,
    building: Building2,
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#490003] via-[#710008] to-[#480004] text-white pt-10 pb-16 md:pt-14 md:pb-20">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ffba45]/10 rounded-full blur-3xl pointer-events-none transform -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-black/30 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#f4b42c]/40 text-[#ffddaf] text-xs font-semibold uppercase tracking-wider backdrop-blur-xs mb-4">
          <Compass className="w-3.5 h-3.5 text-[#f4b42c]" />
          <span>VIETKINGS - LỊCH TRÌNH QUỐC GIA</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white uppercase drop-shadow-sm ">
          SỰ KIỆN VÀ HOẠT ĐỘNG
        </h1>

        <p className="mt-4 text-[#ffdad6]/90 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed font-normal">
          Không gian kết nối tri thức đỉnh cao, nơi tôn vinh những kỳ tích sáng tạo, hội ngộ các kỷ lục gia, nhà khoa học và doanh nhân sáng nghiệp hàng đầu Việt Nam.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mt-8 pt-4">
          {EVENT_STATS.map((stat, idx) => {
            const IconComponent = iconMap[stat.icon] || Award;
            return (
              <div
                key={idx}
                className="bg-black/25 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center gap-3.5 hover:bg-black/35 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[#490003] text-[#f4b42c] flex items-center justify-center shrink-0 border border-[#f4b42c]/30 group-hover:scale-105 transition-transform">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-base sm:text-lg text-white tracking-tight leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-[#ffddaf]/80 truncate mt-0.5">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default EventHero;
