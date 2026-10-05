import {
  FaCheckCircle,
  FaAward,
  FaIdBadge,
  FaUsers,
  FaHandshake,
} from "react-icons/fa";

const defaultCertifications = [
  {
    icon: FaAward,
    title: "Chứng nhận Quốc gia",
    description:
      "Ký duyệt trực tiếp bởi lãnh đạo Viện Kỷ lục Việt Nam.",
  },
  {
    icon: FaIdBadge,
    title: "Mã số Tra cứu Toàn quốc",
    description:
      "Tích hợp mã định danh điện tử trên cổng tra cứu hồ sơ quốc gia.",
  },
  {
    icon: FaUsers,
    title: "Mạng lưới Kỷ lục gia",
    description:
      "Quyền tham gia Câu lạc bộ Sáng tạo & Kỷ lục gia doanh nghiệp.",
  },
  {
    icon: FaHandshake,
    title: "Cố vấn Dự án Thực tế",
    description:
      "Hỗ trợ kết nối chuyên gia đồng hành 6 tháng sau đào tạo.",
  },
];

const iconMap = {
  award: FaAward,
  'id-badge': FaIdBadge,
  users: FaUsers,
  handshake: FaHandshake,
  check: FaCheckCircle,
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
          icon: iconMap[it.icon] || FaAward,
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
              <div className="mb-2 inline-flex items-center gap-1 text-[12px] leading-4 font-semibold uppercase text-[#805600]">
                <FaCheckCircle className="text-[18px]" />
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
                  const Icon = item.icon || FaAward;


                  return (
                    <div
                      key={item.title}
                      className="flex items-start gap-2"
                    >
                      <Icon className="mt-0.5 shrink-0 text-[22px] text-[#805600]" />

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

            <div className="flex flex-col items-center rounded-lg bg-[#e9e8e6] p-6 text-center lg:col-span-4">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#490003] shadow-sm">
                <FaAward className="text-[40px] text-[#805600]" />
              </div>

              <span className="mb-1 text-[18px] leading-6 font-bold text-[#490003]">
                {sealTitle}
              </span>

              <span className="mb-4 text-[12px] leading-4 uppercase tracking-[0.05em] text-[#58413f]">
                {sealSubtitle}
              </span>

              <p className="mb-4 text-[14px] leading-[22px] text-[#58413f]">
                {sealDescription}
              </p>

              <div className="w-full rounded bg-white py-2 text-[14px] leading-5 font-bold text-[#805600] shadow-sm">
                {sealBadge}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}