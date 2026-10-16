import { DynamicIcon } from "../icons/index.js";

const defaultCertifications = [
  {
    icon: "Award",
    title: "Chứng nhận Quốc gia",
    description: "Ký duyệt trực tiếp bởi lãnh đạo Viện Kỷ lục Việt Nam.",
  },
  {
    icon: "BadgeCheck",
    title: "Mã số Tra cứu Toàn quốc",
    description: "Tích hợp mã định danh điện tử trên cổng tra cứu hồ sơ quốc gia.",
  },
  {
    icon: "Users",
    title: "Mạng lưới Kỷ lục gia",
    description: "Quyền tham gia Câu lạc bộ Sáng tạo & Kỷ lục gia doanh nghiệp.",
  },
  {
    icon: "Handshake",
    title: "Cố vấn Dự án Thực tế",
    description: "Hỗ trợ kết nối chuyên gia đồng hành 6 tháng sau đào tạo.",
  },
];

const aliasMap = {
  award: "Award",
  "id-badge": "BadgeCheck",
  users: "Users",
  handshake: "Handshake",
  check: "CheckCircle",
};


export default function CertificationSection({ certificationData }) {
  const tag = certificationData?.tag || "Bảo chứng Pháp lý & Học thuật";
  const title = certificationData?.title || "Cam Kết Chất Lượng Đào Tạo & Giá Trị Chứng Nhận";
  const description =
    certificationData?.description ||
    "Mọi chương trình đào tạo tại Trung tâm Công nghiệp Sáng tạo đều tuân thủ các chuẩn mực nghiêm ngặt của Hội đồng Viện Kỷ lục Việt Nam (VIETKINGS). Học viên sau khi hoàn thành khóa học và bảo vệ đề án thành công sẽ được cấp chứng nhận chính thức có giá trị lưu trữ trong cơ sở dữ liệu quốc gia.";
  const sealTitle = certificationData?.seal_title || "VIETKINGS SEAL";
  const sealSubtitle = certificationData?.seal_subtitle || "Hội đồng Xác lập Kỷ lục";
  const sealDescription =
    certificationData?.seal_description ||
    "Mỗi học viên tốt nghiệp là một đại sứ thúc đẩy tinh thần sáng tạo và kỷ lục bền vững trong tổ chức của mình.";
  const sealBadge = certificationData?.seal_badge || "Tiêu Chuẩn Học Thuật 2024";

  const items =
    Array.isArray(certificationData?.items) && certificationData.items.length > 0
      ? certificationData.items.map((it) => ({
          icon: aliasMap[it.icon] || it.icon || "Award",
          title: it.title,
          description: it.description,
        }))
      : defaultCertifications;

  return (
    <section className="w-full bg-[#f4f3f1] py-[72px]">
      <div className="mx-auto max-w-[75rem] px-6">
        <div className="rounded-lg bg-white p-12 shadow-sm">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mb-2 inline-flex items-center gap-1.5 text-[12px] leading-4 font-semibold uppercase text-[#805600]">
                <DynamicIcon name="CheckCircle" size={18} />
                {tag}
              </div>

              <h2 className="mb-3 text-[32px] leading-10 font-bold text-[#490003]">
                {title}
              </h2>

              <p className="mb-4 text-[16px] leading-[26px] text-[#58413f]">
                {description}
              </p>


              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                {items.map((item, idx) => {
                  return (
                    <div
                      key={item.title || idx}
                      className="flex items-start gap-2"
                    >
                      <DynamicIcon
                        name={item.icon}
                        size={22}
                        className="mt-0.5 shrink-0 text-[#805600]"
                        fallback="Award"
                      />

                      <div>
                        <h4 className="text-[18px] leading-6 font-bold text-[#1a1c1b]">
                          {item.title}
                        </h4>

                        <p className="text-[14px] leading-[22px] text-[#58413f]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Khối VIETKINGS SEAL bao quanh viền gradient vàng gold */}
            <div className="relative rounded-2xl p-[3px] bg-gradient-to-br from-[#ffd54f] via-[#d49520] to-[#805600] shadow-[0_8px_30px_rgba(212,149,32,0.18)] lg:col-span-4 transition-all duration-300 hover:shadow-[0_12px_36px_rgba(212,149,32,0.28)] hover:-translate-y-0.5">
              <div className="flex h-full flex-col items-center rounded-[13px] bg-gradient-to-b from-[#fdfbf7] to-[#f7f3ea] p-6 sm:p-7 text-center">
                <div className="mb-3.5 flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#490003] shadow-md border-2 border-[#d49520]/40">
                  <DynamicIcon
                    name="Award"
                    size={40}
                    className="text-[#805600]"
                    fallback="Award"
                  />
                </div>

                <span className="mb-1 text-[20px] leading-6 font-extrabold uppercase tracking-tight text-[#490003]">
                  {sealTitle}
                </span>

                <span className="mb-4 text-[12px] leading-4 font-semibold uppercase tracking-[0.08em] text-[#805600]">
                  {sealSubtitle}
                </span>

                <p className="mb-5 text-[14px] leading-[22px] text-[#58413f]">
                  {sealDescription}
                </p>

                <div className="w-full rounded-xl bg-white border border-[#d49520]/40 py-2.5 px-4 text-[14px] leading-5 font-bold text-[#805600] shadow-sm">
                  {sealBadge}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}