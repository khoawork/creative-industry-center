import {
  Award,
  BookOpen,
  CalendarDays,
  Database,
  FileSpreadsheet,
  FolderKanban,
  GraduationCap,
  House,
  Info,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  Trophy,
  UsersRound,
} from "lucide-react";
import { siteLinks } from "../../config/shared/site.js";
import { adminRoot } from "./adminPaths.js";

export { adminRoot } from "./adminPaths.js";

export const adminDashboard = {
  id: "dashboard",
  label: "Bảng điều khiển",
  path: adminRoot,
  icon: LayoutDashboard,
};

const contentModules = [
  {
    id: "home",
    icon: House,
    description: "Ảnh bìa, giới thiệu và các nội dung nổi bật trên trang chủ.",
  },
  {
    id: "about",
    icon: Info,
    description: "Câu chuyện, sứ mệnh và định hướng của trung tâm.",
  },
  {
    id: "events",
    icon: CalendarDays,
    description: "Thông tin, lịch trình và nội dung các sự kiện.",
  },
  {
    id: "records",
    icon: Trophy,
    description: "Hồ sơ đề cử và thông tin các giá trị kỷ lục.",
  },
  {
    id: "projects",
    icon: FolderKanban,
    description: "Giới thiệu dự án và những dấu ấn sáng tạo.",
  },
  {
    id: "awards",
    icon: Award,
    description: "Hạng mục giải thưởng và các hoạt động tôn vinh.",
  },
  {
    id: "stories",
    icon: BookOpen,
    description: "Câu chuyện, chân dung và hành trình nhà sáng nghiệp.",
  },
  {
    id: "forum",
    icon: MessageSquare,
    description: "Thông tin và các hoạt động Diễn đàn Kinh tế Kỷ lục.",
  },
  {
    id: "training",
    icon: GraduationCap,
    description: "Chương trình hợp tác, kết nối và đào tạo.",
  },
  {
    id: "contact",
    icon: Mail,
    description: "Hộp thư, cấu hình form và thông tin liên hệ của trung tâm.",
  },
];

export const adminContentModules = contentModules.map((module) => ({
  ...module,
  label: siteLinks[module.id].label,
  path: `${adminRoot}/${module.id}`,
  publicPath: siteLinks[module.id].href,
}));

export const adminGroups = [
  { id: "overview", label: "Tổng quan", items: [adminDashboard] },
  { id: "content", label: "Nội dung website", items: adminContentModules },
  {
    id: "system",
    label: "Hệ thống",
    items: [
      {
        id: "catalog",
        label: "Danh mục dữ liệu",
        path: `${adminRoot}/catalog`,
        icon: Database,
        description:
          "Quản lý toàn bộ danh mục Sự kiện, Giải thưởng, Đào tạo, Dự án.",
      },
      {
        id: "users",
        label: "Tài khoản & Phân quyền",
        path: `${adminRoot}/users`,
        icon: UsersRound,
        description: "Quản lý thành viên và quyền truy cập khu vực quản trị.",
      },
      {
        id: "navigation",
        label: "Menu & Điều hướng",
        path: `${adminRoot}/navigation`,
        icon: Menu,
        description: "Sắp xếp các mục menu và liên kết của website.",
      },
      {
        id: "forms",
        label: "Quản lý Biểu mẫu (Forms)",
        path: `${adminRoot}/forms`,
        icon: FileSpreadsheet,
        description:
          "Cấu hình Google Sheet và các trường nhập liệu cho từng biểu mẫu trên website.",
      },
      {
        id: "logo & footer",
        label: "Logo & Footer",
        path: `${adminRoot}/logo-footer`,
        icon: LayoutDashboard,
        description: "Quản lý logo và nội dung footer của website.",
      },
    ],
  },
];

export const adminItems = adminGroups.flatMap((group) => group.items);
export const adminModules = adminItems.filter(
  (item) => item.id !== adminDashboard.id,
);
export const adminItemsById = Object.fromEntries(
  adminItems.map((item) => [item.id, item]),
);

export function findAdminItem(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  return adminItems.find((item) => item.path === path);
}
