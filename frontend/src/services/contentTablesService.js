import gatheringImage from '../assets/Home/event-gathering.jpg';
import exhibitionImage from '../assets/Home/event-exhibition.jpg';
import forumImage from '../assets/Home/event-forum.jpg';
import museumImage from '../assets/Home/project-museum.jpg';
import artisanImage from '../assets/Home/story-artisan.jpg';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Danh sách định nghĩa các bảng dữ liệu liên kết với Home Nav Sections
 */
export const CONTENT_TABLES = [
  {
    key: 'events',
    label: 'Bảng Sự kiện (Event)',
    shortLabel: 'Sự kiện',
    tableName: 'event',
    defaultTag: 'DÒNG THỜI GIAN HOẠT ĐỘNG',
    defaultTitle: 'SỰ KIỆN NỔI BẬT & HOẠT ĐỘNG MỚI',
    defaultLink: '/events',
    actionText: 'XEM TẤT CẢ SỰ KIỆN',
    color: 'emerald',
    iconName: 'Calendar',
  },
  {
    key: 'projects',
    label: 'Bảng Dự án & Câu chuyện (Project)',
    shortLabel: 'Dự án',
    tableName: 'project',
    defaultTag: 'HÀNH TRÌNH THỰC TIỄN',
    defaultTitle: 'DỰ ÁN TIÊU BIỂU & CHUYỆN NHÀ SÁNG NGHIỆP',
    defaultLink: '/projects',
    actionText: 'XEM TẤT CẢ DỰ ÁN',
    color: 'blue',
    iconName: 'FolderKanban',
  },
  {
    key: 'trainings',
    label: 'Bảng Đào tạo & Hợp tác (Training)',
    shortLabel: 'Đào tạo',
    tableName: 'training',
    defaultTag: 'BỒI DƯỠNG & LAN TỎA',
    defaultTitle: 'CHƯƠNG TRÌNH HỢP TÁC & ĐÀO TẠO',
    defaultLink: '/trainings',
    actionText: 'XEM TẤT CẢ CHƯƠNG TRÌNH',
    color: 'amber',
    iconName: 'GraduationCap',
  },
  {
    key: 'awards',
    label: 'Bảng Kỷ lục & Giải thưởng (Award)',
    shortLabel: 'Giải thưởng',
    tableName: 'award',
    defaultTag: 'DANH HIỆU & VINH DANH',
    defaultTitle: 'GIẢI THƯỞNG SÁNG NGHIỆP THƯỜNG NIÊN',
    defaultLink: '/awards',
    actionText: 'TRA CỨU BẢNG VÀNG',
    color: 'rose',
    iconName: 'Trophy',
  },
];

/**
 * Bộ dữ liệu hạt nhân đồng bộ 100% với backend seed.py và database schema
 */
export const DEFAULT_TABLE_DATA = {
  events: [
    {
      id: 1,
      name: 'Hội ngộ Kỷ lục gia Việt Nam lần thứ 54: Tôn vinh Sáng tạo Quốc gia',
      subtitle: 'Quy tụ hơn 300 kỷ lục gia và các nhà sáng chế trên toàn quốc',
      category: 'ĐẠI HỘI THƯỜNG NIÊN',
      date: '15/04/2025',
      location: 'Trung tâm Hội nghị Quốc gia, Hà Nội',
      image: gatheringImage,
      status: 'UPCOMING',
    },
    {
      id: 2,
      name: 'Không Gian Trưng Bày Tinh Hoa Thủ Công Mỹ Nghệ Đạt Kỷ Lục',
      subtitle: 'Khám phá những kiệt tác sơn mài, khảm xà cừ và gốm sứ đạt đỉnh cao nghệ thuật',
      category: 'TRIỂN LÃM ĐỘC BẢN',
      date: '28/04/2025',
      location: 'Bảo tàng Hà Nội, Nam Từ Liêm',
      image: exhibitionImage,
      status: 'UPCOMING',
    },
    {
      id: 3,
      name: 'Tọa đàm: "Tài sản Vô hình & Định giá Thương hiệu Kỷ lục"',
      subtitle: 'Chia sẻ từ các chuyên gia kinh tế đầu ngành về phương pháp định giá thương quyền',
      category: 'TỌA ĐÀM KINH TẾ',
      date: '10/05/2025',
      location: 'Khách sạn Rex, Quận 1, TP. Hồ Chí Minh',
      image: forumImage,
      status: 'UPCOMING',
    },
    {
      id: 4,
      name: 'Diễn Đàn Chuyển Đổi Số Trong Bảo Tồn Di Sản & Công Nghiệp Sáng Tạo',
      subtitle: 'Ứng dụng công nghệ thực tế ảo và số hóa tư liệu kỷ lục quốc gia',
      category: 'DIỄN ĐÀN CÔNG NGHỆ',
      date: '18/06/2025',
      location: 'Trung tâm Đổi mới Sáng tạo Quốc gia (NIC), Hà Nội',
      image: forumImage,
      status: 'UPCOMING',
    },
    {
      id: 5,
      name: 'Lễ Vinh Danh Tinh Hoa Nghệ Nhân & Truyền Nhân Làng Nghề Truyền Thống',
      subtitle: 'Trao bằng khen và kỷ niệm chương cho 50 gia tộc gìn giữ di sản dân tộc',
      category: 'LỄ TÔN VINH',
      date: '02/07/2025',
      location: 'Nhà hát Lớn Hà Nội',
      image: gatheringImage,
      status: 'UPCOMING',
    },
  ],

  projects: [
    {
      id: 1,
      name: 'Bảo Tàng Không Gian Kỷ Lục Sáng Tạo Việt Nam (Giai Đoạn 1)',
      subtitle: 'Khu phức hợp lưu trữ, bảo tồn và ứng dụng công nghệ thực tế ảo tương tác',
      category: 'DỰ ÁN TRỌNG ĐIỂM QUỐC GIA',
      slogan: 'KHỞI CÔNG 2025 – QUY MÔ 12 HECTA',
      image: museumImage,
    },
    {
      id: 2,
      name: 'Chuyện Nhà Sáng Nghiệp: Nghệ Nhân Vũ Văn Hùng & Hành Trình 40 Năm Giữ Lửa Gốm Dân Tộc',
      subtitle: 'Hành trình phục chế dòng men lam thời Lê sơ và xác lập kỷ lục bình gốm 54 dân tộc',
      category: 'GƯƠNG MẶT KỶ LỤC GIA TIÊU BIỂU',
      slogan: 'KỶ LỤC GIA VĂN HÓA DÂN GIAN',
      image: artisanImage,
    },
    {
      id: 3,
      name: 'Dự Án Số Hóa Bản Đồ Di Sản & Kỷ Lục 63 Tỉnh Thành',
      subtitle: 'Hệ thống bản đồ tương tác định vị trực quan các kỷ lục địa phương trên toàn quốc',
      category: 'DỰ ÁN DI SẢN SỐ',
      slogan: 'DỮ LIỆU ĐỊA LÝ KỶ LỤC VIỆT NAM',
      image: museumImage,
    },
    {
      id: 4,
      name: 'Chuyện Nhà Sáng Nghiệp: Dược Sĩ Hoàng Minh & Khát Vọng Nâng Tầm Sâm Ngọc Linh',
      subtitle: 'Xây dựng vùng dược liệu đạt chuẩn quốc tế và sở hữu 3 bằng sáng chế chiết xuất thảo mộc',
      category: 'DOANH NHÂN SÁNG NGHIỆP',
      slogan: 'BẢO TỒN NGUỒN GEN DƯỢC LIỆU QUÝ',
      image: artisanImage,
    },
  ],

  trainings: [
    {
      id: 1,
      name: 'Đào Tạo Quản Trị Tài Sản Trí Tuệ & Thương Quyền Kỷ Lục',
      subtitle: 'Khóa học chuyên sâu biến giá trị vô hình thành công cụ tăng trưởng doanh thu vượt bậc',
      category: 'QUẢN TRỊ TRÍ TUỆ',
      certificate: 'Chứng chỉ Quản trị Tài sản Trí tuệ - VietKings',
      duration: '6 tuần • Trực tiếp & Trực tuyến',
      time: '01/06/2025',
    },
    {
      id: 2,
      name: 'Ươm Tạo Doanh Nghiệp Công Nghiệp Văn Hóa Sáng Tạo',
      subtitle: 'Cố vấn 1–1 cùng các Kỷ lục gia và chuyên gia, hoàn thiện mô hình sản phẩm ra thị trường',
      category: 'ƯƠM TẠO DOANH NGHIỆP',
      certificate: 'Chứng nhận Ươm tạo Doanh nghiệp Sáng tạo',
      duration: 'Chỉ tiêu: 20 dự án mỗi khóa',
      time: '01/07/2025',
    },
    {
      id: 3,
      name: 'Liên Minh Hợp Tác Viện – Doanh Nghiệp – Địa Phương',
      subtitle: 'Ký kết hợp tác chiến lược xây dựng hồ sơ chỉ dẫn địa lý và quảng bá văn hóa ẩm thực',
      category: 'HỢP TÁC CHIẾN LƯỢC',
      certificate: 'Chứng thư Liên minh Hợp tác Chiến lược',
      duration: 'Hỗ trợ pháp lý & Xúc tiến truyền thông',
      time: '01/08/2025',
    },
    {
      id: 4,
      name: 'Kỹ Năng Hoàn Thiện Hồ Sơ Thẩm Định & Xác Lập Kỷ Lục Việt Nam',
      subtitle: 'Quy trình chuẩn hóa chứng thực số liệu, độc bản và tính xác thực theo tiêu chí VIETKINGS',
      category: 'NGHIỆP VỤ XÁC LẬP',
      certificate: 'Chứng chỉ Nghiệp vụ Thẩm định Kỷ lục',
      duration: '4 tuần • Cấp chứng chỉ chính quy',
      time: '15/09/2025',
    },
  ],

  awards: [
    {
      id: 1,
      name: 'Bằng Chứng Nhận Kỷ Lục Sáng Tạo Quốc Gia',
      subtitle: 'Danh vị cao quý trao tặng cho cá nhân, tập thể phát minh giải pháp đột phá',
      category: 'CHỨNG NHẬN QUỐC GIA',
      tag: 'Hội đồng Viện Thẩm Định',
      decision: 'QĐ-VK-2025/01',
    },
    {
      id: 2,
      name: 'Giải Thưởng "Ngọn Hải Đăng Sáng Nghiệp"',
      subtitle: 'Tôn vinh các thủ lĩnh công nghiệp sáng tạo bền bỉ qua năm tháng, gìn giữ đạo đức kinh doanh',
      category: 'GIẢI THƯỞNG THƯỜNG NIÊN',
      tag: 'Trao tặng hàng năm',
      decision: 'QĐ-VK-2025/02',
    },
    {
      id: 3,
      name: 'Huy Hiệu Tinh Hoa Nghề Truyền Thống',
      subtitle: 'Ghi nhận công đức các truyền nhân giữ lửa tinh hoa làng nghề, kế thừa tri thức bản địa',
      category: 'HUY HIỆU DI SẢN',
      tag: 'Hồ sơ xét duyệt mở',
      decision: 'QĐ-VK-2025/03',
    },
    {
      id: 4,
      name: 'Bằng Vinh Danh Doanh Nghiệp Tiên Phong Phát Triển Bền Vững',
      subtitle: 'Biểu dương các thương hiệu ứng dụng quy chuẩn xanh và chuyển giao công nghệ cộng đồng',
      category: 'VINH DANH DOANH NGHIỆP',
      tag: 'Xét chọn thường niên',
      decision: 'QĐ-VK-2025/04',
    },
  ],
};

/**
 * Tự động đoán bảng dữ liệu phù hợp dựa vào link hoặc tiêu đề của Nav Section
 */
export function detectTableForNav(nav) {
  if (!nav) return 'events';
  const link = (nav.action_button?.link || '').toLowerCase();
  const text = `${nav.tag || ''} ${nav.title_main || ''} ${nav.action_button?.text || ''}`.toLowerCase();

  if (link.includes('project') || text.includes('dự án') || text.includes('chuyện')) return 'projects';
  if (link.includes('train') || text.includes('đào tạo') || text.includes('hợp tác') || text.includes('khóa')) return 'trainings';
  if (link.includes('award') || text.includes('giải thưởng') || text.includes('vinh danh') || text.includes('kỷ lục')) return 'awards';
  if (link.includes('event') || text.includes('sự kiện') || text.includes('hoạt động')) return 'events';

  return 'events';
}


export async function fetchTableItems(tableKey) {
  const fallbackItems = DEFAULT_TABLE_DATA[tableKey] || [];

  try {
    if (tableKey === 'awards') {
      const res = await fetch(`${API_BASE_URL}/api/awards?per_page=50`);
      if (res.ok) {
        const json = await res.json();
        const list = json?.data?.items || json?.data || [];
        if (Array.isArray(list) && list.length > 0) {
          return list.map((a) => ({
            id: a.id,
            name: a.name,
            subtitle: a.description || a.title || '',
            category: a.category || 'GIẢI THƯỞNG',
            tag: a.decision_number || 'Hội đồng Viện',
            decision: a.decision_number || '',
          }));
        }
      }
    } else if (tableKey === 'trainings') {
      const res = await fetch(`${API_BASE_URL}/api/trainings?per_page=50`);
      if (res.ok) {
        const json = await res.json();
        const list = json?.data?.items || json?.data || [];
        if (Array.isArray(list) && list.length > 0) {
          return list.map((t) => ({
            id: t.id,
            name: t.name,
            subtitle: t.props?.description || '',
            category: 'ĐÀO TẠO',
            certificate: t.certificate || '',
            duration: t.props?.info_highlight || '',
            time: t.time || '',
          }));
        }
      }
    }
  } catch {
    // API chưa sẵn sàng hoặc offline -> dùng DEFAULT_TABLE_DATA
  }

  return fallbackItems;
}

/**
 * Tìm thông tin của một item qua ID trong tất cả các bảng
 */
export function findItemById(id, preferTableKey = null) {
  const numId = Number(id);

  if (preferTableKey && DEFAULT_TABLE_DATA[preferTableKey]) {
    const found = DEFAULT_TABLE_DATA[preferTableKey].find((it) => it.id === numId);
    if (found) return { ...found, tableKey: preferTableKey };
  }

  for (const [key, items] of Object.entries(DEFAULT_TABLE_DATA)) {
    const found = items.find((it) => it.id === numId);
    if (found) return { ...found, tableKey: key };
  }

  return {
    id: numId,
    name: `Mục ID #${numId}`,
    subtitle: '',
    category: 'TÙY CHỌN',
    tableKey: preferTableKey || 'custom',
  };
}
