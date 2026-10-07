import { adminItemsById } from '../../config/Admin/adminNavigation.js';

export const adminDemoUser = {
  name: 'Quản trị viên',
  initials: 'QT',
  role: 'Quản trị viên',
};

export const adminMessages = [
  {
    id: 1,
    sender: 'Nguyễn Minh Anh',
    initials: 'MA',
    subject: 'Đề nghị hợp tác tổ chức sự kiện sáng tạo',
    receivedAt: '2026-09-28T09:15:00+07:00',
    body: 'Xin chào trung tâm, chúng tôi muốn trao đổi về cơ hội hợp tác tổ chức một sự kiện về công nghiệp sáng tạo.',
    unread: true,
  },
  {
    id: 2,
    sender: 'Trần Hoàng Nam',
    initials: 'HN',
    subject: 'Thông tin chương trình đào tạo',
    receivedAt: '2026-09-27T14:30:00+07:00',
    body: 'Tôi muốn nhận thêm thông tin về các chương trình đào tạo và điều kiện đăng ký.',
    unread: true,
  },
  {
    id: 3,
    sender: 'Lê Thu Hà',
    initials: 'TH',
    subject: 'Gửi hồ sơ dự án cộng đồng',
    receivedAt: '2026-09-26T10:00:00+07:00',
    body: 'Tôi gửi thông tin dự án cộng đồng để trung tâm tham khảo và kết nối.',
    unread: false,
  },
];

export const adminUnreadCount = adminMessages.filter((message) => message.unread).length;

export const adminStats = [
  {
    moduleId: 'events',
    label: 'Sự kiện',
    value: '12',
    detail: 'đang quản lý',
  },
  {
    moduleId: 'projects',
    label: 'Dự án',
    value: '08',
    detail: 'đang triển khai',
  },
  {
    moduleId: 'awards',
    label: 'Giải thưởng',
    value: '06',
    detail: 'hạng mục',
  },
  {
    moduleId: 'forms',
    label: 'Biểu mẫu (Sheets)',
    value: '07',
    detail: 'đã đồng bộ',
  },
  {
    moduleId: 'contact',
    label: 'Tin nhắn mới',
    value: String(adminUnreadCount).padStart(2, '0'),
    detail: 'chưa đọc',
  },
].filter((stat) => adminItemsById[stat.moduleId]);
