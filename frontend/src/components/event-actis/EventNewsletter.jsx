import { useState } from "react";
import { Mail, ShieldCheck, Send, CheckCircle2 } from "lucide-react";

export const EventNewsletter = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    organization: "",
    email: "",
    agreed: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ fullName: "", organization: "", email: "", agreed: true });
    }, 4000);
  };

  return (
    <section className="max-w-5xl mx-auto my-14 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-[#e0bfbb]/50 shadow-md p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#490003] via-[#710008] to-[#f4b42c]"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Info & Trust */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="inline-flex items-center gap-2 text-[#9c6800] text-xs font-bold uppercase tracking-wider">
              <Mail className="w-4 h-4 text-[#f4b42c]" />
              <span>BẢN TIN VIỆN KỶ LỤC</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1c1b] tracking-tight leading-snug ">
              Đăng Ký Nhận Thông Báo Sự Kiện Sớm
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify sm:text-left">
              Nhận thư mời ưu tiên, tài liệu kỷ yếu và thông cáo báo chí chính
              thức trực tiếp từ Ban Thư ký Trung tâm Công nghiệp Sáng tạo.
            </p>

            <div className="pt-3 flex items-start gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-[#9c6800] shrink-0 mt-0.5" />
              <span>
                Bảo mật thông tin theo tiêu chuẩn viện nghiên cứu quốc gia.
              </span>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-[#faf9f7] border border-emerald-200 rounded-2xl p-8 text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#1a1c1b]">
                  Đăng ký nhận bản tin thành công!
                </h4>
                <p className="text-xs text-gray-600">
                  Cảm ơn Quý đại biểu. Thông báo sự kiện mới nhất sẽ được gửi
                  đến hộp thư của Quý vị.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm bg-white border border-[#e2d9cd] text-[#1a1c1b] placeholder-gray-400 focus:outline-hidden focus:bg-white focus:border-[#710008] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                      Đơn vị / Doanh nghiệp
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      placeholder="Tổ chức / Doanh nghiệp"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm bg-white border border-[#e2d9cd] text-[#1a1c1b] placeholder-gray-400 focus:outline-hidden focus:bg-white focus:border-[#710008] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1a1c1b] mb-1">
                    Địa chỉ Email đại biểu *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="daibieu@tochuc.vn"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-sm bg-white border border-[#e2d9cd] text-[#1a1c1b] placeholder-gray-400 focus:outline-hidden focus:bg-white focus:border-[#710008] transition-all"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="agreed"
                    checked={formData.agreed}
                    onChange={(e) =>
                      setFormData({ ...formData, agreed: e.target.checked })
                    }
                    className="mt-0.5 rounded border-gray-300 text-[#490003] focus:ring-[#490003] cursor-pointer bg-white"
                  />
                  <label
                    htmlFor="agreed"
                    className="text-xs text-gray-600 leading-snug cursor-pointer select-none"
                  >
                    Tôi đồng ý tiếp nhận các tài liệu và thông tin sự kiện từ
                    VIETKINGS.
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-sm bg-[#490003] hover:bg-[#710008] text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#ffba45]" />
                    <span>Xác Nhận Đăng Ký Thông Báo</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventNewsletter;
