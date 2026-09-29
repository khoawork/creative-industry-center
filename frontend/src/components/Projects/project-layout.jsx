import React, { useState } from "react";
import ProjectHeader from "./project-header";
import ProjectFilter from "./project-filter";
import ProjectCard from "./project-card";
import ProjectForm from "./project-form";

// Dữ liệu mẫu giả lập mô phỏng thiết kế
const sampleProjects = [
  {
    id: 1,
    name: "Bảo tàng Không Gian Kỷ Lục Sáng Tạo Việt Nam (Giai đoạn 1)",
    categoryTag: "TRỌNG ĐIỂM QUỐC GIA",
    code: "MÃ DỰ ÁN: TTCNST-2024-EX01",
    title: "Quần thể Không Gian Kỷ Lục Sáng Tạo",
    description:
      "Khu phức hợp quần thể văn hóa triển lãm kiến trúc độc bản rộng 12 ha. Nơi lưu trữ, tôn vinh các sáng chế độc quyền, công trình kỷ lục...",
    image:
      "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&auto=format&fit=crop&q=80",
    details: [
      { label: "Địa điểm", value: "Đại lộ Sáng Tạo, Hà Nội" },
      { label: "Quy mô", value: "12 Hecta (GĐ 1: 4.8 ha)" },
    ],
    footerText: "",
    buttonLabel: "Khám phá dự án",
  },
  {
    id: 2,
    name: "Hệ Thống Số Hóa 3D 100 Di Sản Làng Nghề & Cổ Vật Quốc Gia",
    categoryTag: "CHUYỂN ĐỔI SỐ",
    code: "MÃ DỰ ÁN: TTCNST-2024-DIG02",
    title: "Nền Tảng Dữ Liệu Di Sản Số Hóa",
    description:
      "Số hóa mô hình không gian ba chiều có độ phân giải siêu nét (Sub-millimeter LiDAR) kết hợp gắn thẻ xác thực chuỗi khối (Blockchain)...",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    details: [
      { label: "Công nghệ lõi", value: "LiDAR 3D, WebAR, NFT Pass" },
      { label: "Mục tiêu số hóa", value: "100 Cổ vật & 45 Làng nghề" },
      { label: "Thời gian", value: "2023 – 2026" },
    ],
    footerText: "Chứng thực VIETKINGS",
    buttonLabel: "Xem chi tiết",
  },
  {
    id: 3,
    name: "Chuỗi Không Gian Trưng Bày Tinh Hoa Gốm Sứ Bát Tràng Đương Đại",
    categoryTag: "CÔNG NGHIỆP VĂN HÓA",
    code: "MÃ DỰ ÁN: TTCNST-2024-CUL03",
    title: "Bát Tràng Tinh Hoa Đương Đại",
    description:
      "Chuỗi showroom nghệ thuật bảo tồn kết hợp kiến trúc đất nung đương đại, thương mại hóa các dòng sản phẩm đạt giải kỷ lục tạo hình...",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
    details: [
      { label: "Mạng lưới", value: "Hà Nội, Hội An, TP. HCM" },
      { label: "Nghệ nhân chủ nhiệm", value: "12 Bàn tay Vàng Kỷ lục" },
      { label: "Lượt khách/năm", value: "180.000+ Khách" },
    ],
    footerText: "KẾT NỐI CHUỖI GIÁ TRỊ",
    buttonLabel: "Xem chi tiết",
  },
  {
    id: 4,
    name: "Vườn Ươm Doanh Nghiệp Sáng Nghiệp Kỷ Lục (Record Startup Hub)",
    categoryTag: "ƯƠM TẠO & ĐẦU TƯ",
    code: "MÃ DỰ ÁN: TTCNST-2024-HUB04",
    title: "Record Startup Hub Vietnam",
    description:
      "Cơ sở hỗ trợ hoàn thiện pháp lý sở hữu trí tuệ, tiêu chuẩn hóa thương hiệu và bảo trợ kết nối nguồn vốn mạo hiểm cho hơn 50 doanh nghiệp...",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
    details: [
      { label: "Đơn vị bảo trợ", value: "Viện Kỷ Lục & Quỹ Đổi Mới" },
      { label: "Startup được ươm tạo", value: "52 Doanh nghiệp" },
    ],
    footerText: "Cố vấn 1-1 chuyên sâu",
    buttonLabel: "Xem chi tiết",
  },
  {
    id: 5,
    name: "Bộ Kỷ Yếu & Bản Đồ Số Kỷ Lục Sáng Tạo 63 Tỉnh Thành",
    categoryTag: "NGHIÊN CỨU",
    code: "MÃ DỰ ÁN: TTCNST-2024-PUB05",
    title: "Bản Đồ Số Tài Nguyên Sáng Tạo",
    description:
      "Đề tài điều tra dữ liệu quốc gia về tài sản sở hữu trí tuệ, đặc sản bản địa và các kỷ lục văn hóa phi vật thể tại từng đơn vị hành chính, tr...",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
    details: [
      { label: "Phạm vi khảo sát", value: "63 Tỉnh & Thành phố" },
      { label: "Dữ liệu thu thập", value: "1.200+ Hồ sơ độc quyền" },
      { label: "Quy cách", value: "Song ngữ Việt – Anh" },
    ],
    footerText: "Ấn bản số & Giấy mỹ thuật",
    buttonLabel: "Xem chi tiết",
  },
  {
    id: 6,
    name: "Quỹ Bảo Trợ & Phát Triển Nghệ Nhân Trẻ Việt Nam",
    categoryTag: "BẢO TỒN VĂN HÓA",
    code: "MÃ DỰ ÁN: TTCNST-2024-FND06",
    title: "Chương Trình Trao Truyền Nghề",
    description:
      "Chương trình học bổng toàn phần, cấp kinh phí nghiên cứu chất liệu truyền thống và hỗ trợ không gian trưng bày cho các nghệ nhân trẻ...",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    details: [{ label: "Lĩnh vực", value: "Sơn mài, Gốm, Dệt đũi, Kim hoàn" }],
    footerText: "BẢO HỘ BÍ QUYẾT KỶ LỤC",
    buttonLabel: "Xem chi tiết",
  },
];

export default function ProjectLayout() {
  const [activeCategory, setActiveCategory] = useState("Tất cả dự án");

  return (
    <div className="max-w pb-16">
      {/* 1. Phần Header nội dung trang */}
      <ProjectHeader />

      {/* 2. Phần Bộ lọc danh mục dự án */}
      <ProjectFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* 3. Danh sách các Card dự án (Grid) */}
      <div className="px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* 4. Phần Form đề xuất dự án (Nền đỏ sẫm phía dưới) */}
      <ProjectForm />
    </div>
  );
}
