export const contactIntro = {
  badge: 'Ban Thư Ký & Tiếp Nhận Hồ Sơ',
  title: 'Liên hệ',
  description: 'Trung tâm Công nghiệp Sáng tạo luôn sẵn sàng lắng nghe, tư vấn và đồng hành cùng các tổ chức, doanh nghiệp và cá nhân trên hành trình đổi mới sáng tạo.',
}

// Địa chỉ TP.HCM do người dùng cung cấp; văn phòng Hà Nội và giờ làm việc giữ từ bản mẫu.
export const offices = [
  {
    id: 'ha-noi',
    label: 'Trụ sở chính',
    city: 'TP. Hà Nội',
    address: 'Tầng 6, Tòa nhà Liên hiệp các Hội Khoa học & Kỹ thuật Việt Nam, TP. Hà Nội.',
  },
  {
    id: 'ho-chi-minh',
    label: 'Văn phòng Đại diện phía Nam',
    city: 'TP. Hồ Chí Minh',
    address: '1 Đặng Văn Ngữ, Phường 10, Quận Phú Nhuận, TP. Hồ Chí Minh',
  },
]

export const workingHours = [
  { days: 'Thứ Hai — Thứ Sáu', time: '08:00 – 17:30' },
  { days: 'Thứ Bảy', time: '08:00 – 12:00' },
]

export const socialChannels = [
  { id: 'zalo', label: 'Zalo OA', href: null },
  { id: 'facebook', label: 'Fanpage', href: null },
  { id: 'youtube', label: 'Sáng Tạo Việt', href: null },
]

export const mapLocation = {
  label: 'Trụ sở VIETKINGS — TTCN Sáng Tạo',
  office: offices[1],
  address: offices[1].address,
  // Google Maps Share embed supplied by the user. No API key is needed.
  mapAddress: '16/1 Đặng Văn Ngữ, Phường 10, Quận Phú Nhuận, TP. Hồ Chí Minh',
  embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2025137972955!2d106.66687307480518!3d10.795795989354158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752900091dee09%3A0xe23cdfee230e065b!2zMTYvMSDEkOG6t25nIFbEg24gTmfhu68sUGjGsOG7nW5nIDEwLFBow7ogTmh14bqtbg!5e0!3m2!1svi!2s!4v1790769635883!5m2!1svi!2s&hl=vi',
}

mapLocation.directionsUrl = `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination: mapLocation.mapAddress })}`

export const contactCategories = [
  { value: 'de-cu', label: 'Đề cử kỷ lục sáng tạo' },
  { value: 'dao-tao', label: 'Khóa đào tạo & Phát triển kỹ năng' },
  { value: 'truyen-thong', label: 'Hợp tác truyền thông & Sự kiện' },
  { value: 'khac', label: 'Hoạt động / Yêu cầu khác' },
]
