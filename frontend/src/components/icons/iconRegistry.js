import {
  // Điều hướng & Khung nhìn
  House,
  LayoutDashboard,
  Menu,
  Compass,
  MapPin,
  Folder,
  FolderKanban,
  FileText,
  FileSpreadsheet,
  Layers,
  LayoutGrid,
  ExternalLink,
  Link,
  Bookmark,

  // Sự kiện & Thời gian
  Calendar,
  CalendarDays,
  CalendarCheck,
  Clock,
  Hourglass,
  History,

  // Giải thưởng & Danh hiệu
  Award,
  Trophy,
  Medal,
  Crown,
  Star,
  Sparkles,
  BadgeCheck,
  ShieldCheck,
  ShieldAlert,
  Gavel,
  Scale,

  // Liên hệ & Truyền thông
  Mail,
  Send,
  Inbox,
  MessageSquare,
  MessageCircle,
  Phone,
  PhoneCall,
  Share2,
  Headphones,
  Bell,

  // Người dùng & Doanh nghiệp
  User,
  Users,
  UsersRound,
  UserCheck,
  UserPlus,
  Building,
  Building2,
  Landmark,
  Briefcase,

  // Giáo dục & Sáng tạo
  GraduationCap,
  BookOpen,
  Book,
  Library,
  Lightbulb,
  Palette,
  Brush,
  Scroll,
  ScrollText,
  Rocket,

  // Công cụ & Hành động
  Hammer,
  Search,
  Plus,
  Check,
  CheckCircle,
  CheckCircle2,
  X,
  XCircle,
  Trash2,
  Edit,
  Pencil,
  Settings,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Unlock,
  Play,

  // Trạng thái & Xã hội
  Heart,
  Flame,
  Globe,
  Activity,
  TrendingUp,
  BarChart,
  HelpCircle,
  Info,
  AlertTriangle,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";

export const ICON_CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "navigation", label: "Điều hướng & Trang" },
  { id: "awards", label: "Giải thưởng & Kỷ lục" },
  { id: "events", label: "Sự kiện & Lịch" },
  { id: "communication", label: "Liên hệ & Tin nhắn" },
  { id: "users", label: "Tổ chức & Con người" },
  { id: "creative", label: "Sáng tạo & Giáo dục" },
  { id: "actions", label: "Công cụ & Hành động" },
  { id: "status", label: "Trạng thái & Biểu tượng" },
];

export const iconList = [
  // --- Điều hướng & Trang ---
  {
    name: "House",
    label: "Trang chủ",
    icon: House,
    category: "navigation",
    keywords: ["home", "trang chu", "nha", "chinh"],
  },
  {
    name: "LayoutDashboard",
    label: "Bảng điều khiển",
    icon: LayoutDashboard,
    category: "navigation",
    keywords: ["dashboard", "tong quan", "bang dieu khien", "admin"],
  },
  {
    name: "Menu",
    label: "Menu danh mục",
    icon: Menu,
    category: "navigation",
    keywords: ["menu", "danh muc", "dieu huong", "hamburger"],
  },
  {
    name: "Compass",
    label: "Định hướng / La bàn",
    icon: Compass,
    category: "navigation",
    keywords: ["compass", "dinh huong", "kham pha", "la ban"],
  },
  {
    name: "MapPin",
    label: "Địa điểm / Vị trí",
    icon: MapPin,
    category: "navigation",
    keywords: ["map", "location", "dia diem", "vi tri", "ban do"],
  },
  {
    name: "Folder",
    label: "Thư mục",
    icon: Folder,
    category: "navigation",
    keywords: ["folder", "thu muc", "tai lieu"],
  },
  {
    name: "FolderKanban",
    label: "Dự án / Quản lý",
    icon: FolderKanban,
    category: "navigation",
    keywords: ["project", "du an", "kanban", "cong viec"],
  },
  {
    name: "FileText",
    label: "Văn bản / Tài liệu",
    icon: FileText,
    category: "navigation",
    keywords: ["document", "file", "van ban", "bai viet", "ho so"],
  },
  {
    name: "FileSpreadsheet",
    label: "Biểu mẫu / Bảng tính",
    icon: FileSpreadsheet,
    category: "navigation",
    keywords: ["sheet", "excel", "bieu mau", "google sheet", "bang"],
  },
  {
    name: "Layers",
    label: "Lớp dữ liệu / Danh mục",
    icon: Layers,
    category: "navigation",
    keywords: ["layers", "tang", "lop", "danh muc"],
  },
  {
    name: "LayoutGrid",
    label: "Lưới / Khối nội dung",
    icon: LayoutGrid,
    category: "navigation",
    keywords: ["grid", "luoi", "khoi", "bo cuc"],
  },
  {
    name: "ExternalLink",
    label: "Liên kết ngoài",
    icon: ExternalLink,
    category: "navigation",
    keywords: ["external", "link", "lien ket", "mo trang moi"],
  },
  {
    name: "Link",
    label: "Liên kết",
    icon: Link,
    category: "navigation",
    keywords: ["link", "url", "ket noi"],
  },
  {
    name: "Bookmark",
    label: "Đánh dấu / Lưu trữ",
    icon: Bookmark,
    category: "navigation",
    keywords: ["bookmark", "danh dau", "luu"],
  },

  // --- Sự kiện & Thời gian ---
  {
    name: "Calendar",
    label: "Lịch",
    icon: Calendar,
    category: "events",
    keywords: ["calendar", "lich", "ngay", "thang"],
  },
  {
    name: "CalendarDays",
    label: "Lịch sự kiện",
    icon: CalendarDays,
    category: "events",
    keywords: ["calendar", "su kien", "hoi thao", "chuong trinh"],
  },
  {
    name: "CalendarCheck",
    label: "Đã lên lịch",
    icon: CalendarCheck,
    category: "events",
    keywords: ["schedule", "da len lich", "xac nhan lich"],
  },
  {
    name: "Clock",
    label: "Đồng hồ / Giờ",
    icon: Clock,
    category: "events",
    keywords: ["clock", "time", "gio", "thoi gian"],
  },
  {
    name: "Hourglass",
    label: "Đang diễn ra",
    icon: Hourglass,
    category: "events",
    keywords: ["hourglass", "dong ho cat", "dang dien ra", "cho"],
  },
  {
    name: "History",
    label: "Lịch sử / Nhật ký",
    icon: History,
    category: "events",
    keywords: ["history", "nhat ky", "lich su", "hoat dong"],
  },

  // --- Giải thưởng & Kỷ lục ---
  {
    name: "Award",
    label: "Giải thưởng",
    icon: Award,
    category: "awards",
    keywords: ["award", "giai thuong", "khen thuong", "ton vinh"],
  },
  {
    name: "Trophy",
    label: "Cúp / Kỷ lục",
    icon: Trophy,
    category: "awards",
    keywords: ["trophy", "cup", "ky luc", "vo dich", "thanh tuu"],
  },
  {
    name: "Medal",
    label: "Huy chương",
    icon: Medal,
    category: "awards",
    keywords: ["medal", "huy chuong", "danh hieu"],
  },
  {
    name: "Crown",
    label: "Vương miện / Đỉnh cao",
    icon: Crown,
    category: "awards",
    keywords: ["crown", "vuong mien", "dan dau", "cao nhat"],
  },
  {
    name: "Star",
    label: "Ngôi sao / Nổi bật",
    icon: Star,
    category: "awards",
    keywords: ["star", "sao", "noi bat", "danh gia"],
  },
  {
    name: "Sparkles",
    label: "Tinh hoa / Tỏa sáng",
    icon: Sparkles,
    category: "awards",
    keywords: ["sparkles", "sang tao", "tinh hoa", "dac biet"],
  },
  {
    name: "BadgeCheck",
    label: "Huy hiệu xác thực",
    icon: BadgeCheck,
    category: "awards",
    keywords: ["badge", "xac thuc", "chung nhan", "chinh hang"],
  },
  {
    name: "ShieldCheck",
    label: "Bảo chứng an toàn",
    icon: ShieldCheck,
    category: "awards",
    keywords: ["shield", "bao chung", "an toan", "bao ve", "uy tin"],
  },
  {
    name: "ShieldAlert",
    label: "Cảnh báo / Bảo mật",
    icon: ShieldAlert,
    category: "awards",
    keywords: ["shield", "canh bao", "bao mat"],
  },
  {
    name: "Gavel",
    label: "Búa hội đồng / Thẩm định",
    icon: Gavel,
    category: "awards",
    keywords: ["gavel", "bua", "hoi dong", "tham dinh", "toa an", "phap ly"],
  },
  {
    name: "Scale",
    label: "Cán cân / Chuẩn mực pháp lý",
    icon: Scale,
    category: "awards",
    keywords: ["scale", "can can", "cong ly", "quy che", "chuan muc", "phap ly"],
  },

  // --- Liên hệ & Truyền thông ---
  {
    name: "Mail",
    label: "Hộp thư / Email",
    icon: Mail,
    category: "communication",
    keywords: ["email", "mail", "thu", "lien he"],
  },
  {
    name: "Send",
    label: "Gửi thông tin",
    icon: Send,
    category: "communication",
    keywords: ["send", "gui", "nop", "chuyen"],
  },
  {
    name: "Inbox",
    label: "Hòm thư đến",
    icon: Inbox,
    category: "communication",
    keywords: ["inbox", "hom thu", "tiep nhan"],
  },
  {
    name: "MessageSquare",
    label: "Tin nhắn / Phản hồi",
    icon: MessageSquare,
    category: "communication",
    keywords: ["message", "tin nhan", "trao doi", "y kien"],
  },
  {
    name: "MessageCircle",
    label: "Hội thoại / Thảo luận",
    icon: MessageCircle,
    category: "communication",
    keywords: ["chat", "thao luan", "dien dan"],
  },
  {
    name: "Phone",
    label: "Số điện thoại",
    icon: Phone,
    category: "communication",
    keywords: ["phone", "dien thoai", "hotline", "goi"],
  },
  {
    name: "PhoneCall",
    label: "Cuộc gọi hotline",
    icon: PhoneCall,
    category: "communication",
    keywords: ["call", "hotline", "tu van"],
  },
  {
    name: "Share2",
    label: "Chia sẻ / Mạng lưới",
    icon: Share2,
    category: "communication",
    keywords: ["share", "chia se", "mang luoi", "ket noi"],
  },
  {
    name: "Headphones",
    label: "Hỗ trợ / Trực tuyến",
    icon: Headphones,
    category: "communication",
    keywords: ["support", "ho tro", "cham soc", "tai nghe"],
  },
  {
    name: "Bell",
    label: "Thông báo",
    icon: Bell,
    category: "communication",
    keywords: ["bell", "thong bao", "chuong"],
  },

  // --- Người dùng & Doanh nghiệp ---
  {
    name: "User",
    label: "Cá nhân / Tài khoản",
    icon: User,
    category: "users",
    keywords: ["user", "ca nhan", "tai khoan", "dai bieu"],
  },
  {
    name: "Users",
    label: "Đoàn thể / Cộng đồng",
    icon: Users,
    category: "users",
    keywords: ["users", "cong dong", "nhom", "tap the"],
  },
  {
    name: "UsersRound",
    label: "Mạng lưới chuyên gia",
    icon: UsersRound,
    category: "users",
    keywords: ["team", "chuyen gia", "mang luoi", "hoi dong"],
  },
  {
    name: "UserCheck",
    label: "Đại biểu xác nhận",
    icon: UserCheck,
    category: "users",
    keywords: ["check", "xac nhan", "diem danh", "hop le"],
  },
  {
    name: "UserPlus",
    label: "Thêm thành viên",
    icon: UserPlus,
    category: "users",
    keywords: ["add user", "them nguoi", "dang ky moi"],
  },
  {
    name: "Building",
    label: "Tòa nhà / Cơ quan",
    icon: Building,
    category: "users",
    keywords: ["building", "co quan", "to chuc", "tru so"],
  },
  {
    name: "Building2",
    label: "Doanh nghiệp / Tập đoàn",
    icon: Building2,
    category: "users",
    keywords: ["company", "doanh nghiep", "cong ty", "tap doan"],
  },
  {
    name: "Landmark",
    label: "Viện / Tổ chức di sản",
    icon: Landmark,
    category: "users",
    keywords: ["landmark", "vien", "di san", "nha nuoc", "bao tang"],
  },
  {
    name: "Briefcase",
    label: "Công tác / Sự nghiệp",
    icon: Briefcase,
    category: "users",
    keywords: ["briefcase", "cong tac", "sang nghiep", "kinh doanh"],
  },

  // --- Giáo dục & Sáng tạo ---
  {
    name: "GraduationCap",
    label: "Đào tạo / Học viện",
    icon: GraduationCap,
    category: "creative",
    keywords: ["training", "dao tao", "khoa hoc", "hoc vien"],
  },
  {
    name: "BookOpen",
    label: "Sách / Kỷ yếu",
    icon: BookOpen,
    category: "creative",
    keywords: ["book", "sach", "ky yeu", "tai lieu", "chuyen"],
  },
  {
    name: "Book",
    label: "Cẩm nang tri thức",
    icon: Book,
    category: "creative",
    keywords: ["book", "cam nang", "giao trinh"],
  },
  {
    name: "Library",
    label: "Thư viện / Lưu trữ",
    icon: Library,
    category: "creative",
    keywords: ["library", "thu vien", "kho tri thuc"],
  },
  {
    name: "Lightbulb",
    label: "Ý tưởng / Sáng kiến",
    icon: Lightbulb,
    category: "creative",
    keywords: ["idea", "sang kien", "y tuong", "giai phap"],
  },
  {
    name: "Palette",
    label: "Nghệ thuật / Mỹ thuật",
    icon: Palette,
    category: "creative",
    keywords: ["art", "nghe thuat", "my thuat", "thiet ke", "mau sac"],
  },
  {
    name: "Brush",
    label: "Hội họa / Điêu khắc",
    icon: Brush,
    category: "creative",
    keywords: ["brush", "hoi hoa", "sang tao"],
  },
  {
    name: "Scroll",
    label: "Văn bản cổ / Di sản",
    icon: Scroll,
    category: "creative",
    keywords: ["scroll", "di san", "chieu chi", "phap ly"],
  },
  {
    name: "ScrollText",
    label: "Bằng chứng nhận / Văn kiện",
    icon: ScrollText,
    category: "creative",
    keywords: ["scroll", "chung nhan", "bang khen", "nghi quyet", "van kien"],
  },
  {
    name: "Rocket",
    label: "Đột phá / Khởi nghiệp",
    icon: Rocket,
    category: "creative",
    keywords: ["startup", "dot pha", "khoi nghiep", "tang truong"],
  },

  // --- Công cụ & Hành động ---
  {
    name: "Hammer",
    label: "Búa chế tác / Tinh hoa nghề",
    icon: Hammer,
    category: "actions",
    keywords: ["hammer", "bua", "che tac", "nghe nhan", "handyman", "lang nghe"],
  },
  {
    name: "Search",
    label: "Tìm kiếm",
    icon: Search,
    category: "actions",
    keywords: ["search", "tim kiem", "tra cuu"],
  },
  {
    name: "Plus",
    label: "Thêm mới",
    icon: Plus,
    category: "actions",
    keywords: ["add", "plus", "them", "tao moi"],
  },
  {
    name: "Check",
    label: "Đồng ý / Chọn",
    icon: Check,
    category: "actions",
    keywords: ["check", "chon", "dong y", "xong"],
  },
  {
    name: "CheckCircle",
    label: "Thành công",
    icon: CheckCircle,
    category: "actions",
    keywords: ["success", "thanh cong", "hoan tat"],
  },
  {
    name: "CheckCircle2",
    label: "Đã duyệt / Xác thực",
    icon: CheckCircle2,
    category: "actions",
    keywords: ["verified", "da duyet", "xac nhan"],
  },
  {
    name: "X",
    label: "Đóng / Hủy",
    icon: X,
    category: "actions",
    keywords: ["close", "dong", "huy", "tat"],
  },
  {
    name: "XCircle",
    label: "Từ chối / Lỗi",
    icon: XCircle,
    category: "actions",
    keywords: ["error", "loi", "that bai", "tu choi"],
  },
  {
    name: "Trash2",
    label: "Xóa bản ghi",
    icon: Trash2,
    category: "actions",
    keywords: ["delete", "remove", "xoa", "thung rac"],
  },
  {
    name: "Edit",
    label: "Chỉnh sửa",
    icon: Edit,
    category: "actions",
    keywords: ["edit", "sua", "cap nhat"],
  },
  {
    name: "Pencil",
    label: "Bút sửa",
    icon: Pencil,
    category: "actions",
    keywords: ["pencil", "but", "viet", "sua"],
  },
  {
    name: "Settings",
    label: "Cấu hình / Cài đặt",
    icon: Settings,
    category: "actions",
    keywords: ["settings", "cai dat", "he thong", "thiet lap"],
  },
  {
    name: "Filter",
    label: "Bộ lọc",
    icon: Filter,
    category: "actions",
    keywords: ["filter", "loc", "phan loai"],
  },
  {
    name: "Download",
    label: "Tải xuống",
    icon: Download,
    category: "actions",
    keywords: ["download", "tai ve", "xuat du lieu"],
  },
  {
    name: "Upload",
    label: "Tải lên",
    icon: Upload,
    category: "actions",
    keywords: ["upload", "tai len", "gui tap tin"],
  },
  {
    name: "Eye",
    label: "Hiển thị / Xem",
    icon: Eye,
    category: "actions",
    keywords: ["view", "eye", "hien thi", "xem truoc"],
  },
  {
    name: "EyeOff",
    label: "Ẩn",
    icon: EyeOff,
    category: "actions",
    keywords: ["hide", "an", "khong hien thi"],
  },
  {
    name: "RefreshCw",
    label: "Làm mới / Đồng bộ",
    icon: RefreshCw,
    category: "actions",
    keywords: ["reload", "refresh", "lam moi", "dong bo"],
  },
  {
    name: "Lock",
    label: "Khóa bảo mật",
    icon: Lock,
    category: "actions",
    keywords: ["lock", "khoa", "bao mat"],
  },
  {
    name: "Unlock",
    label: "Mở khóa",
    icon: Unlock,
    category: "actions",
    keywords: ["unlock", "mo khoa"],
  },
  {
    name: "Play",
    label: "Bắt đầu / Thực thi",
    icon: Play,
    category: "actions",
    keywords: ["play", "chay", "bat dau", "gui"],
  },

  // --- Trạng thái & Biểu tượng ---
  {
    name: "Heart",
    label: "Yêu thích / Tri ân",
    icon: Heart,
    category: "status",
    keywords: ["heart", "yeu thich", "tam huyet", "tri an"],
  },
  {
    name: "Flame",
    label: "Thịnh hành / Sôi động",
    icon: Flame,
    category: "status",
    keywords: ["fire", "hot", "thinh hanh", "noi bat"],
  },
  {
    name: "Globe",
    label: "Toàn cầu / Quốc tế",
    icon: Globe,
    category: "status",
    keywords: ["globe", "quoc te", "toan cau", "the gioi"],
  },
  {
    name: "Activity",
    label: "Hoạt động / Nhịp sống",
    icon: Activity,
    category: "status",
    keywords: ["activity", "nhip dap", "hoat dong"],
  },
  {
    name: "TrendingUp",
    label: "Tăng trưởng / Phát triển",
    icon: TrendingUp,
    category: "status",
    keywords: ["growth", "tang truong", "phat trien"],
  },
  {
    name: "BarChart",
    label: "Biểu đồ / Thống kê",
    icon: BarChart,
    category: "status",
    keywords: ["chart", "thong ke", "bao cao"],
  },
  {
    name: "HelpCircle",
    label: "Trợ giúp / Hỏi đáp",
    icon: HelpCircle,
    category: "status",
    keywords: ["help", "tro giup", "faq", "huong dan"],
  },
  {
    name: "Info",
    label: "Thông tin chi tiết",
    icon: Info,
    category: "status",
    keywords: ["info", "thong tin", "gioi thieu"],
  },
  {
    name: "AlertTriangle",
    label: "Lưu ý quan trọng",
    icon: AlertTriangle,
    category: "status",
    keywords: ["warning", "canh bao", "chu y"],
  },
  {
    name: "AlertCircle",
    label: "Thông báo lỗi",
    icon: AlertCircle,
    category: "status",
    keywords: ["alert", "loi", "can thiep"],
  },
  {
    name: "ThumbsUp",
    label: "Đồng thuận / Tán thành",
    icon: ThumbsUp,
    category: "status",
    keywords: ["like", "dong y", "tot"],
  },
];

// Bản đồ tra cứu nhanh name -> icon object
export const iconMap = Object.fromEntries(
  iconList.map((item) => [item.name, item])
);

const iconAliases = {
  bank: "Landmark",
  "shield-check": "ShieldCheck",
};

/**
 * Lấy Icon component theo tên
 * @param {string} name Tên icon (vd: "Award", "Trophy")
 * @returns {React.ComponentType} Lucide icon component hoặc HelpCircle mặc định
 */
export const getIconComponent = (name) => {
  if (!name) return HelpCircle;
  const normalizedName = iconAliases[name] || name;
  const iconItem = iconMap[normalizedName]
    || iconMap[normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)];
  return iconItem?.icon || HelpCircle;
};

/**
 * Tìm kiếm danh sách icon theo từ khóa và danh mục
 * @param {string} query Từ khóa tìm kiếm
 * @param {string} category Danh mục (mặc định "all")
 * @returns {Array} Danh sách icon thỏa mãn
 */
export const searchIcons = (query = "", category = "all") => {
  const cleanQuery = query.toLowerCase().trim();

  return iconList.filter((item) => {
    // Lọc theo category
    if (category && category !== "all" && item.category !== category) {
      return false;
    }

    if (!cleanQuery) return true;

    // Tìm theo tên icon
    if (item.name.toLowerCase().includes(cleanQuery)) return true;

    // Tìm theo nhãn tiếng Việt
    if (item.label.toLowerCase().includes(cleanQuery)) return true;

    // Tìm theo keywords
    return item.keywords.some((kw) => kw.includes(cleanQuery));
  });
};
