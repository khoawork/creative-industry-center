export const adminDemoUser = {
  name: 'Minh Anh',
  initials: 'MA',
  role: 'Quản trị viên',
};

export const adminMessages = [
  { id: 'message-1', sender: 'Nguyễn Hoàng Nam', initials: 'HN', subject: 'Đề xuất hợp tác triển lãm sáng tạo', body: 'Kính gửi trung tâm,\n\nChúng tôi mong muốn trao đổi về việc phối hợp tổ chức triển lãm các sản phẩm sáng tạo. Nhờ trung tâm hướng dẫn đầu mối liên hệ và thông tin cần chuẩn bị.\n\nXin cảm ơn.', receivedAt: '2026-09-29T09:30:00+07:00', unread: true },
  { id: 'message-2', sender: 'Trần Thu Hà', initials: 'TH', subject: 'Thông tin chương trình đào tạo', body: 'Xin chào trung tâm,\n\nTôi muốn tìm hiểu các chương trình đào tạo sắp tới, đối tượng tham dự và cách đăng ký. Mong nhận được thông tin từ trung tâm.', receivedAt: '2026-09-28T15:45:00+07:00', unread: true },
  { id: 'message-3', sender: 'Lê Phương Linh', initials: 'PL', subject: 'Tìm hiểu quy trình đề cử kỷ lục', body: 'Tôi cần tìm hiểu quy trình đề cử kỷ lục và danh sách tài liệu cần chuẩn bị. Trung tâm có thể hướng dẫn các bước thực hiện không?', receivedAt: '2026-09-28T10:00:00+07:00', unread: false },
  { id: 'message-4', sender: 'Phạm Quang Huy', initials: 'QH', subject: 'Đăng ký nhận thông tin sự kiện', body: 'Tôi quan tâm đến các sự kiện kết nối sáng tạo. Xin hướng dẫn cách đăng ký nhận thông báo về những chương trình tiếp theo.', receivedAt: '2026-09-27T14:20:00+07:00', unread: false },
  { id: 'message-5', sender: 'Vũ Ngọc Anh', initials: 'NA', subject: 'Giới thiệu dự án sáng tạo cộng đồng', body: 'Nhóm chúng tôi đang thực hiện một dự án sáng tạo dành cho cộng đồng và muốn giới thiệu tới trung tâm để tìm cơ hội kết nối, hợp tác.', receivedAt: '2026-09-26T11:10:00+07:00', unread: false },
  { id: 'message-6', sender: 'Đỗ Thanh Tùng', initials: 'TT', subject: 'Kết nối với trung tâm', body: 'Xin chào, tôi muốn đặt lịch trao đổi với trung tâm về các hoạt động hỗ trợ sáng tạo. Nhờ trung tâm hướng dẫn cách liên hệ phù hợp.', receivedAt: '2026-09-25T08:30:00+07:00', unread: false },
];

export const adminUnreadCount = adminMessages.filter((message) => message.unread).length;

export const adminStats = [
  { moduleId: 'events', value: 12, detail: '3 sắp diễn ra' },
  { moduleId: 'projects', value: 8, detail: '6 đang hiển thị' },
  { moduleId: 'records', value: 15, detail: '4 chờ xem xét' },
  { moduleId: 'contact', label: 'Hộp thư liên hệ', value: adminMessages.length, detail: `${adminUnreadCount} chưa đọc` },
];
