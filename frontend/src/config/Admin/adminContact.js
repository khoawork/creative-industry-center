import { FileText, Info, Inbox } from "lucide-react";

export const adminContactTabs = [
  {
    id: "form",
    label: "Cấu hình Form",
    icon: FileText,
    description:
      "Cấu hình trường nhập và nội dung form hiển thị trên trang Liên hệ.",
  },
  { id: "info", label: "Thông tin liên hệ", icon: Info },
];

export const contactFixedFieldIds = [
  "fullName",
  "email",
  "phone",
  "category",
  "message",
];
