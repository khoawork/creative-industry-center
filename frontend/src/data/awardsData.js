import gatheringImg from '../assets/Home/event-gathering.jpg';
import artisanImg from '../assets/Home/story-artisan.jpg';
import aboutImg from '../assets/Home/about.jpg';
import exhibitionImg from '../assets/Home/event-exhibition.jpg';
import forumImg from '../assets/Home/event-forum.jpg';
import museumImg from '../assets/Home/project-museum.jpg';

import founder1 from '../assets/founders/founder1.png';
import founder2 from '../assets/founders/founder2.png';
import founder3 from '../assets/founders/founder3.png';

export const AWARD_CATEGORIES = [
  { id: 'all', label: 'Tất cả lĩnh vực xét chọn' },
  { id: 'kinh-te-sang-tao', label: 'Kinh tế & Doanh nghiệp sáng tạo' },
  { id: 'thu-cong-my-nghe', label: 'Thủ công mỹ nghệ & Kỹ nghệ dân tộc' },
  { id: 'lang-nghe-truyen-thong', label: 'Làng nghề & Gia tộc truyền thống' },
  { id: 'di-san-so', label: 'Di sản văn hóa & Ứng dụng số' },
  { id: 'cong-hien', label: 'Cống hiến & Nghiên cứu khoa học' },
  { id: 'khoi-nghiep-tre', label: 'Khởi nghiệp đổi mới sáng tạo trẻ' },
];

export const AWARD_YEARS = ['Tất cả', '2025', '2024', '2023'];

export const ANNUAL_AWARDS_DATA = [
  {
    id: 'hai-dang-sang-nghiep',
    number: '01',
    categoryBadge: 'HẠNG MỤC 01',
    code: 'MÃ HIỆU: HG-ANG-01',
    scope: 'XÉT TẶNG TOÀN QUỐC',
    title: 'Giải thưởng Ngọn Hải Đăng Sáng Nghiệp',
    subtitle: 'HẠNG MỤC TIÊN PHONG PHÁT TRIỂN KINH TẾ SÁNG TẠO',
    description:
      'Giải thưởng thường niên vinh danh các doanh nghiệp, nhà sáng lập tiên phong đổi mới mô hình kinh tế xanh, ứng dụng giải pháp và đột phá và có đóng góp then chốt vào sự phát triển của nền công nghiệp sáng tạo quốc gia.',
    image: gatheringImg,
    year: '2025',
    category: 'kinh-te-sang-tao',
    iconName: 'Flame',
    criteria: [
      'Doanh nghiệp thành lập và hoạt động hợp pháp tại Việt Nam từ 3 năm trở lên.',
      'Sở hữu mô hình tăng trưởng bền vững, thân thiện với môi trường và có ứng dụng sáng tạo rõ rệt.',
      'Có đóng góp ngân sách, giải quyết việc làm và kiến tạo giá trị xã hội tích cực.',
      'Được hiệp hội chuyên ngành, chính quyền địa phương hoặc Hội đồng Kỷ lục đề cử.',
    ],
    dossier: [
      'Bản đăng ký tham gia xét tặng theo mẫu của Hội đồng VIETKINGS.',
      'Báo cáo thành tích và minh chứng tăng trưởng sáng tạo trong 3 năm gần nhất.',
      'Bản sao bằng độc quyền sáng chế / giải pháp hữu ích / bản quyền thương hiệu (nếu có).',
    ],
  },
  {
    id: 'ban-tay-vang-ky-luc',
    number: '02',
    categoryBadge: 'HẠNG MỤC 02',
    code: 'MÃ HIỆU: HG-ANG-02',
    scope: 'ĐỀ CỬ QUỐC GIA - THƯỜNG NIÊN',
    title: 'Cúp Bàn Tay Vàng Kỷ Lục Dân Tộc',
    subtitle: 'VINH DANH ĐỈNH CAO KỸ NGHỆ THỦ CÔNG MỸ NGHỆ',
    description:
      'Tôn vinh các nghệ nhân đỉnh cao nghệ thuật, nghệ nhân quốc gia các ngành gốm sứ, kim hoàn, đan dệt, sơn mài... Trao tặng cho các nghệ nhân mang đậm tinh hoa kỹ nghệ cổ truyền, bảo tồn bản sắc dân tộc kết hợp tư duy sáng tạo hiện đại.',
    image: artisanImg,
    year: '2024',
    category: 'thu-cong-my-nghe',
    iconName: 'Award',
    criteria: [
      'Nghệ nhân có thâm niên làm nghề từ 15 năm trở lên hoặc được Nhà nước phong tặng danh hiệu NNƯT, NNND.',
      'Tạo tác được các tác phẩm đỉnh cao, có tính độc bản hoặc được xác lập kỷ lục Việt Nam.',
      'Đào tạo thế hệ kế thừa, gìn giữ bí quyết kỹ nghệ cổ truyền không để mai một.',
      'Tác phẩm kết hợp hài hòa giữa chất liệu truyền thống và thẩm mỹ đương đại.',
    ],
    dossier: [
      'Bản giới thiệu quá trình làm nghề và danh mục các tác phẩm tiêu biểu.',
      'Hình ảnh/video chất lượng cao về quá trình thực hiện và tác phẩm hoàn thiện.',
      'Giấy xác nhận danh hiệu hoặc văn bản giới thiệu của Hiệp hội Làng nghề Việt Nam.',
    ],
  },
  {
    id: 'tinh-hoa-nghe-truyen-thong',
    number: '03',
    categoryBadge: 'HẠNG MỤC 03',
    code: 'MÃ HIỆU: HG-ANG-03',
    scope: 'XÉT ĐỀ CỬ ĐỊNH KỲ',
    title: 'Huy Hiệu Tinh Hoa Nghề Truyền Thống',
    subtitle: 'CÔNG NHẬN LÀNG NGHỀ & GIA TỘC CÓ TRUYỀN THỐNG VÀNG',
    description:
      'Tôn vinh các nghệ nhân, dòng họ nghệ nhân và gia tộc nghề cổ truyền qua nhiều thế hệ giữ gìn ngọn lửa nghề, đưa các giá trị di sản bản địa vươn tầm thị trường trong nước và quốc tế.',
    image: aboutImg,
    year: '2024',
    category: 'lang-nghe-truyen-thong',
    iconName: 'Medal',
    criteria: [
      'Gia tộc hoặc làng nghề có lịch sử hình thành và phát triển từ 50 năm trở lên qua ít nhất 3 thế hệ.',
      'Gìn giữ được quy trình sản xuất thủ công độc đáo và bản sắc văn hóa vùng miền.',
      'Có sản phẩm tiêu biểu xuất khẩu hoặc đạt giải thưởng cấp quốc gia, quốc tế.',
      'Đóng góp tích cực vào kinh tế địa phương và phát triển du lịch làng nghề di sản.',
    ],
    dossier: [
      'Tư liệu lịch sử làng nghề / gia phả nghề của gia tộc.',
      'Xác nhận của chính quyền cấp huyện/tỉnh về làng nghề truyền thống tiêu biểu.',
      'Ảnh tư liệu các thế hệ nghệ nhân và sản phẩm di sản qua các thời kỳ.',
    ],
  },
  {
    id: 'doi-moi-sang-tao-di-san',
    number: '04',
    categoryBadge: 'HẠNG MỤC 04',
    code: 'MÃ HIỆU: HG-ANG-04',
    scope: 'GIẢI THƯỞNG MỞ RỘNG TOÀN QUỐC',
    title: 'Giải Thưởng Đổi Mới Sáng Tạo Di Sản Việt',
    subtitle: 'ĐỘT PHÁ SỐ HÓA & ỨNG DỤNG DI SẢN ĐƯƠNG ĐẠI',
    description:
      'Vinh danh các dự án ứng dụng công nghệ hiện đại (công nghệ số 3D, chuyển đổi số VR/AR, nghệ thuật tương tác đa phương tiện) nhằm tái hiện và đưa di sản văn hóa, lịch sử dân tộc đến gần hơn với thế hệ trẻ.',
    image: exhibitionImg,
    year: '2025',
    category: 'di-san-so',
    iconName: 'Sparkles',
    criteria: [
      'Dự án ứng dụng công nghệ chuyển đổi số (3D Scan, VR/AR, AI, Metaverse...) vào bảo tồn di sản.',
      'Sản phẩm đã ra mắt công chúng hoặc triển khai thử nghiệm thực tế với phản hồi tích cực.',
      'Đảm bảo tính chính xác lịch sử, tôn trọng bản sắc văn hóa dân tộc.',
      'Tạo ra trải nghiệm tương tác mới mẻ, thu hút đông đảo bạn trẻ và du khách.',
    ],
    dossier: [
      'Thuyết minh kỹ thuật và ý tưởng nghệ thuật của dự án số hóa.',
      'Bản demo hoặc đường link trải nghiệm trực tuyến sản phẩm.',
      'Đánh giá chuyên môn từ các chuyên gia di sản học hoặc hội đồng chuyên ngành.',
    ],
  },
  {
    id: 'cong-hien-vi-su-nghiep-sang-tao',
    number: '05',
    categoryBadge: 'HẠNG MỤC 05',
    code: 'MÃ HIỆU: HG-ANG-05',
    scope: 'HUY HIỆU DANH DỰ TOÀN QUỐC',
    title: 'Kỷ Niệm Chương Cống Hiến Vì Sự Nghiệp Sáng Tạo',
    subtitle: 'HUY HIỆU DANH DỰ CẤP CAO CỦA VIỆN KỶ LỤC VIỆT NAM',
    description:
      'Huy hiệu danh dự trao tặng cho các nhà khoa học, chuyên gia có ít nhất 10 năm cống hiến liên tục cơ quan đồng hành, bảo trợ pháp lý và mở rộng nghiên cứu cho phong trào sáng tạo kỷ lục Việt Nam.',
    image: forumImg,
    year: '2023',
    category: 'cong-hien',
    iconName: 'Award',
    criteria: [
      'Cá nhân là nhà khoa học, chuyên gia, nhà quản lý văn hóa có ít nhất 10 năm gắn bó.',
      'Có công trình nghiên cứu, đề án hoặc đóng góp cố vấn chiến lược cho tổ chức VIETKINGS.',
      'Có uy tín xã hội cao và tinh thần phụng sự cộng đồng không ngừng nghỉ.',
      'Được Hội đồng Viện Kỷ lục Việt Nam trực tiếp đề xuất và biểu quyết thông qua.',
    ],
    dossier: [
      'Trích ngang lý lịch khoa học và quá trình công tác.',
      'Danh mục các công trình, đóng góp tiêu biểu cho phong trào kỷ lục sáng tạo.',
      'Tờ trình đề xuất của Thường trực Viện Kỷ lục Việt Nam.',
    ],
  },
  {
    id: 'ngoi-sao-khoi-nghiep-ky-luc-tre',
    number: '06',
    categoryBadge: 'HẠNG MỤC 06',
    code: 'MÃ HIỆU: HG-ANG-06',
    scope: 'DÀNH CHO ĐỐI TƯỢNG DƯỚI 35 TUỔI',
    title: 'Giải Thưởng Ngôi Sao Khởi Nghiệp Kỷ Lục Trẻ',
    subtitle: 'ƯƠM MẦM TÀI NĂNG TRẺ & Ý TƯỞNG ĐỘT PHÁ CẢM HỨNG',
    description:
      'Giải thưởng dành riêng cho các tài năng trẻ, sinh viên và nhà nghiên cứu dưới 35 tuổi sở hữu những sáng kiến sáng tạo, sản phẩm thử nghiệm hoặc mô hình kinh doanh khởi nghiệp mang đột phá xác lập kỷ lục mới.',
    image: museumImg,
    year: '2025',
    category: 'khoi-nghiep-tre',
    iconName: 'Trophy',
    criteria: [
      'Người sáng lập hoặc đại diện dự án không quá 35 tuổi tại thời điểm xét duyệt.',
      'Dự án khởi nghiệp thuộc lĩnh vực công nghiệp sáng tạo, di sản hoặc công nghệ văn hóa.',
      'Sản phẩm/dịch vụ có tính mới, khả năng thương mại hóa cao và tiềm năng xác lập kỷ lục.',
      'Đã hoàn thành vòng ươm tạo hoặc có sản phẩm khả dụng tối thiểu (MVP).',
    ],
    dossier: [
      'Bản thuyết minh mô hình kinh doanh khởi nghiệp (Pitch Deck).',
      'Minh chứng độ tuổi của nhóm sáng lập.',
      'Video giới thiệu sản phẩm / mô hình giải pháp thực tế.',
    ],
  },
];

export const RECENT_HONOREES_DATA = [
  {
    id: 'sen-viet',
    badge: 'GIẢI ĐỔI MỚI SÁNG TẠO DI SẢN',
    title: 'Công ty CP Gốm Sứ Sen Việt',
    subtitle: 'Đại diện: Doanh nhân Nguyễn Tiến An',
    description:
      'Ứng dụng công nghệ men nano xử lý nhiệt độ thấp bảo tồn nguồn tài nguyên năng lượng và chế tác gốm sứ hoa văn thời Lý đạt kỷ lục.',
    date: '10/12/2024',
    code: 'KHOA-2024-001',
    avatar: founder1,
    iconType: 'bookmark',
    year: '2024',
  },
  {
    id: 'tran-quang-thai',
    badge: 'BÀN TAY VÀNG KỶ LỤC DÂN TỘC',
    title: 'NNƯT. Trần Quang Thái',
    subtitle: 'Làng chạm bạc Đồng Xâm',
    description:
      'Tác phẩm gò bình đồng tam giác tượng phật Thiên Thủ Thiên Nhãn đạt kỷ lục quốc gia về độ tinh xảo và số lượng chi tiết hoa văn thủ công.',
    date: '14/11/2024',
    code: 'BTV-2024-042',
    avatar: founder2,
    iconType: 'award',
    year: '2024',
  },
  {
    id: 'vr-di-san',
    badge: 'NGÔI SAO KHỞI NGHIỆP TRẺ',
    title: 'Dự án VR Di Sản Hoàng Cung',
    subtitle: 'Nhóm HeritageX Tech',
    description:
      'Tái hiện 3D toàn cảnh không gian tế lễ cung đình triều Nguyễn, cho phép trải nghiệm thực tế ảo tương tác trực tuyến đa nền tảng đạt giải.',
    date: '05/01/2025',
    code: 'STARTUP-2025-015',
    avatar: founder3,
    iconType: 'trophy',
    year: '2025',
  },
];

