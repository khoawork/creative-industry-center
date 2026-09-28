import aboutImage from '../../assets/Home/about.jpg'
import gatheringImage from '../../assets/Home/event-gathering.jpg'
import exhibitionImage from '../../assets/Home/event-exhibition.jpg'
import forumImage from '../../assets/Home/event-forum.jpg'
import museumImage from '../../assets/Home/project-museum.jpg'
import artisanImage from '../../assets/Home/story-artisan.jpg'
import { sectionIds, site } from '../shared/site.js'

export const hero = {
  badge: 'VIỆN KỶ LỤC VIỆT NAM — VIETKINGS',
  subtitle: 'NƠI KẾT TINH TRÍ TUỆ, XÁC LẬP KỶ LỤC VÀ TÔN VINH GIÁ TRỊ VIỆT',
  slogan: '“Chứng thực giá trị — Kiến tạo tài sản — Trao truyền ý chí”',
}

export const statistics = [
  { value: '500+', label: 'Kỷ lục Gia & Tổ chức' },
  { value: '120+', label: 'Công trình Sáng tạo' },
  { value: '63', label: 'Tỉnh Thành Kết Nối' },
  { value: '20+', label: 'Năm Di Sản Tôn Vinh' },
]

export const about = {
  eyebrow: 'SỨ MỆNH & TẦM NHÌN QUỐC GIA',
  title: `Về ${site.name}`,
  image: aboutImage,
  imageAlt: 'Không gian trưng bày của Viện Kỷ lục Việt Nam',
  captionTitle: 'Viện Kỷ lục Việt Nam (VietKings)',
  caption: 'Thành trì kết nối những trí tuệ ưu tú, gìn giữ tinh hoa văn hóa và đổi mới sáng tạo.',
  missionTitle: 'Tôn chỉ Hoạt động',
  mission: 'Trung tâm Công nghiệp Sáng tạo được thành lập với mục tiêu trở thành hạt nhân nghiên cứu, bảo tồn, kích hoạt các tiềm năng trí tuệ vô tận của con người Việt Nam. Chúng tôi đóng vai trò cầu nối thể chế và thị trường, biến các ý tưởng và phát minh độc bản thành tài sản sở hữu trí tuệ có giá trị thương mại bền vững.',
  values: [
    { icon: 'check', title: 'Xác Lập Chuẩn Mực', description: 'Chứng thực công trình, phát minh, giải pháp đạt tiêu chí kỷ lục và sáng tạo tầm vóc.' },
    { icon: 'globe', title: 'Vươn Tầm Quốc Tế', description: 'Đưa các kỷ lục gia và sản phẩm tinh hoa dân tộc tiếp cận các thị trường toàn cầu.' },
  ],
}

export const events = [
  {
    id: 'hoi-ngo', date: '15 THÁNG 04, 2025', category: 'Đại Hội Thường Niên',
    title: 'Hội ngộ Kỷ lục gia Việt Nam lần thứ 54: Tôn vinh Sáng tạo Quốc gia',
    description: 'Quy tụ hơn 300 kỷ lục gia và các nhà sáng chế trên toàn quốc nhằm đúc kết thành tựu đổi mới trong công nghệ và văn hóa di sản.',
    image: gatheringImage, imageAlt: 'Lễ công bố và vinh danh kỷ lục gia Việt Nam',
  },
  {
    id: 'trien-lam', date: '28 THÁNG 04, 2025', category: 'Triển Lãm Độc Bản',
    title: 'Không Gian Trưng Bày Tinh Hoa Thủ Công Mỹ Nghệ Đạt Kỷ Lục',
    description: 'Khám phá những kiệt tác sơn mài, khảm xà cừ và gốm sứ đạt đỉnh cao nghệ thuật của các nghệ nhân nhân dân kỳ cựu.',
    image: exhibitionImage, imageAlt: 'Nghệ nhân chế tác tác phẩm sơn mài trong xưởng',
  },
  {
    id: 'toa-dam', date: '10 THÁNG 05, 2025', category: 'Tọa Đàm Kinh Tế',
    title: 'Tọa đàm: “Tài sản Vô hình & Định giá Thương hiệu Kỷ lục”',
    description: 'Chia sẻ từ các chuyên gia kinh tế đầu ngành về phương pháp định giá thương quyền sở hữu trí tuệ và mở rộng dòng vốn đầu tư.',
    image: forumImage, imageAlt: 'Các diễn giả trao đổi tại diễn đàn kinh tế sáng tạo',
  },
]

export const awards = [
  {
    id: 'bang-chung-nhan', icon: 'medal', title: 'Bằng Chứng Nhận Kỷ Lục Sáng Tạo Quốc Gia',
    description: 'Danh vị cao quý trao tặng cho các cá nhân, tập thể phát minh giải pháp đột phá, tạo tác động thực tiễn cho nền kinh tế văn hóa nước nhà.',
    tag: 'Hội đồng Viện Thẩm Định',
  },
  {
    id: 'giai-thuong', icon: 'trophy', title: 'Giải Thưởng “Ngọn Hải Đăng Sáng Nghiệp”',
    description: 'Tôn vinh các thủ lĩnh công nghiệp sáng tạo bền bỉ qua năm tháng, gìn giữ đạo đức kinh doanh và lan tỏa giá trị sống cao đẹp cho cộng đồng.',
    tag: 'Trao tặng hàng năm', featured: true, featuredLabel: 'Biểu Trưng Danh Giá Nhất',
  },
  {
    id: 'huy-hieu', icon: 'star', title: 'Huy Hiệu Tinh Hoa Nghề Truyền Thống',
    description: 'Ghi nhận công đức các truyền nhân giữ lửa tinh hoa làng nghề, kế thừa kho báu tri thức bản địa và ứng dụng vật liệu sáng tạo mới.',
    tag: 'Hồ sơ xét duyệt mở',
  },
]

export const projects = [
  {
    id: 'bao-tang', icon: 'architecture', category: 'Dự Án Trọng Điểm Quốc Gia',
    title: 'Bảo Tàng Không Gian Kỷ Lục Sáng Tạo Việt Nam (Giai Đoạn 1)',
    description: 'Khu phức hợp lưu trữ, bảo tồn và ứng dụng công nghệ thực tế ảo tương tác nhằm tái hiện hành trình xác lập các kỳ tích quốc gia. Công trình tạo điểm đến văn hóa giáo dục tự hào cho thế hệ trẻ.',
    image: museumImage, imageAlt: 'Phối cảnh bảo tàng không gian kỷ lục sáng tạo Việt Nam',
    caption: 'Khởi công 2025 - Quy mô 12 Hecta', action: 'Tìm hiểu tiến độ dự án',
  },
  {
    id: 'nghe-nhan', sectionId: sectionIds.stories, icon: 'person', featured: true,
    category: 'Gương Mặt Kỷ Lục Gia Tiêu Biểu',
    title: 'Chuyện Nhà Sáng Nghiệp: Nghệ Nhân Vũ Văn Hùng & Hành Trình 40 Năm Giữ Lửa Gốm Dân Tộc',
    description: 'Từ xưởng gốm thủ công thô mộc đến việc xác lập kỷ lục chiếc bình gốm độc bản khắc họa 54 dân tộc anh em. Câu chuyện về lòng kiên định vượt qua ba lần suy thoái để xây dựng cơ đồ bền vững.',
    image: artisanImage, imageAlt: 'Nghệ nhân chế tác gốm trong xưởng truyền thống',
    caption: 'Kỷ Lục Gia Văn Hóa Dân Gian', action: 'Đọc toàn bộ câu chuyện sáng nghiệp',
  },
]

export const programs = [
  {
    id: 'quan-tri', icon: 'cap', title: 'Đào Tạo Quản Trị Tài Sản Trí Tuệ & Thương Quyền Kỷ Lục',
    description: 'Khóa học chuyên sâu dành cho chủ doanh nghiệp, giúp biến giá trị vô hình thành công cụ tăng trưởng doanh thu vượt bậc.',
    detail: 'Thời lượng: 6 tuần • Trực tiếp & Trực tuyến', action: 'Đăng ký tham vấn',
  },
  {
    id: 'uom-tao', icon: 'bulb', title: 'Ươm Tạo Doanh Nghiệp Công Nghiệp Văn Hóa Sáng Tạo',
    description: 'Chương trình cố vấn 1-1 cùng các Kỷ lục gia và chuyên gia công nghệ, hoàn thiện mô hình sản phẩm từ phôi thai đến thị trường.',
    detail: 'Chỉ tiêu: 20 dự án mỗi khóa', action: 'Đăng ký tham vấn',
  },
  {
    id: 'hop-tac', icon: 'handshake', title: 'Liên Minh Hợp Tác Viện - Doanh Nghiệp - Địa Phương',
    description: 'Ký kết hợp tác chiến lược nhằm xây dựng hồ sơ kỷ lục chỉ dẫn địa lý, quảng bá văn hóa ẩm thực và thắng cảnh du lịch tỉnh thành.',
    detail: 'Hỗ trợ pháp lý & Xúc tiến truyền thông', action: 'Liên hệ hợp tác',
  },
]

export const advisory = {
  title: 'Cần tư vấn trực tiếp từ Chuyên viên Viện Kỷ lục?',
  description: 'Đường dây nóng tiếp nhận hồ sơ hoạt động 24/7 sẵn sàng đồng hành cùng quý vị.',
}
