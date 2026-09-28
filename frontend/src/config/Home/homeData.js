import conference from '../../assets/Home/conference.svg'
import exhibition from '../../assets/Home/exhibition.svg'
import heritage from '../../assets/Home/heritage.svg'
import museum from '../../assets/Home/museum.svg'
import artisan from '../../assets/Home/artisan.svg'

export const navigation = [
  { label: 'Trang chủ', href: '#trang-chu' },
  { label: 'Giới thiệu', href: '#gioi-thieu' },
  { label: 'Kỷ lục & Giải thưởng', href: '#giai-thuong' },
  { label: 'Dự án sáng nghiệp', href: '#du-an' },
  { label: 'Chuyện nhà sáng nghiệp', href: '#chuyen-nha-sang-nghiep' },
  { label: 'Hợp tác & Đào tạo', href: '#dao-tao' },
]

export const statistics = [
  { value: '500+', label: 'Kỷ lục được xác lập' },
  { value: '120+', label: 'Cộng đồng sáng tạo' },
  { value: '63', label: 'Tỉnh thành kết nối' },
  { value: '20+', label: 'Năm kiến tạo giá trị' },
]

export const events = [
  { id: 'hoi-ngo', category: 'HOẠT ĐỘNG NỔI BẬT', date: '18 THÁNG 06, 2026', title: 'Hội ngộ Kỷ lục gia Việt Nam lần thứ 54: Tôn vinh sáng tạo, giữ gìn giá trị', description: 'Gặp gỡ những con người và câu chuyện truyền cảm hứng trên hành trình khám phá, gìn giữ và lan tỏa các giá trị Việt Nam.', image: conference, imageAlt: 'Minh họa sân khấu hội ngộ và tôn vinh kỷ lục gia', body: 'Chương trình là không gian kết nối các kỷ lục gia, nhà sáng nghiệp và cộng đồng sáng tạo trên cả nước. Những ý tưởng, kinh nghiệm và câu chuyện được sẻ chia để mở ra các cơ hội hợp tác mới. Các hoạt động dự kiến gồm giao lưu, trưng bày sáng kiến và lễ tôn vinh những đóng góp cho cộng đồng.' },
  { id: 'trien-lam', category: 'TRIỂN LÃM SÁNG TẠO', date: '12 THÁNG 06, 2026', title: 'Không gian trưng bày tinh hoa thủ công mỹ nghệ & di sản Việt', description: 'Khám phá những sản phẩm độc đáo, nơi bàn tay nghệ nhân kết nối tinh hoa truyền thống với tư duy sáng tạo đương đại.', image: exhibition, imageAlt: 'Minh họa không gian triển lãm sản phẩm thủ công', body: 'Không gian trưng bày giới thiệu các chất liệu gần gũi như gốm, tre và sợi tự nhiên qua góc nhìn mới. Khách tham quan có thể tìm hiểu câu chuyện của từng sản phẩm, gặp gỡ người làm nghề và trải nghiệm các hoạt động sáng tạo.' },
  { id: 'di-san', category: 'TỌA ĐÀM CHUYÊN ĐỀ', date: '05 THÁNG 06, 2026', title: 'Tọa đàm: “Di sản và hành trình đi vào công nghiệp sáng tạo”', description: 'Cùng các chuyên gia trao đổi về hướng đi mới để những giá trị truyền thống trở thành nguồn lực cho tương lai.', image: heritage, imageAlt: 'Minh họa kiến trúc truyền thống và không gian di sản Việt', body: 'Buổi tọa đàm kết nối góc nhìn của nhà nghiên cứu, nghệ nhân và doanh nghiệp. Nội dung tập trung vào bảo tồn tri thức bản địa, thiết kế sản phẩm văn hóa và xây dựng những mô hình phát triển bền vững cho cộng đồng.' },
]

export const awards = [
  { id: 'bang-chung-nhan', icon: 'trophy', title: 'Bằng chứng nhận Kỷ lục Sáng tạo Quốc gia', description: 'Ghi nhận những thành tựu xuất sắc, những dấu ấn tiên phong góp phần tạo nên bản sắc và vị thế của trí tuệ Việt Nam.', tag: 'TÔN VINH GIÁ TRỊ SÁNG TẠO' },
  { id: 'giai-thuong', icon: 'medal', title: 'Giải thưởng “Ngọn lửa Sáng tạo Việt”', description: 'Tôn vinh những cá nhân và tổ chức bền bỉ nuôi dưỡng ý tưởng, lan tỏa tinh thần đổi mới và mang đến giá trị cho cộng đồng.', tag: 'THẮP SÁNG ĐAM MÊ', featured: true },
  { id: 'huy-hieu', icon: 'star', title: 'Huy hiệu Nhà sáng nghiệp Tiên phong', description: 'Ghi nhận những đóng góp bền bỉ của người sáng nghiệp trên hành trình kết nối tri thức và kiến tạo những giá trị mới.', tag: 'KẾT NỐI & TIẾP BƯỚC' },
]

export const projects = [
  { id: 'bao-tang', category: 'DỰ ÁN TRỌNG ĐIỂM QUỐC GIA', title: 'Bảo tàng Không gian Kỷ lục Sáng tạo Việt Nam (VietSpace)', description: 'Một không gian kết nối các giá trị sáng tạo, lưu giữ di sản tri thức và mang đến những trải nghiệm khám phá mới cho cộng đồng.', image: museum, imageAlt: 'Minh họa kiến trúc bảo tàng không gian sáng tạo', caption: 'NƠI CÁC GIÁ TRỊ VIỆT ĐƯỢC LƯU GIỮ', action: 'Tìm hiểu về dự án', body: 'Dự án mẫu hướng đến xây dựng một điểm hẹn văn hóa, giáo dục và trải nghiệm. Không gian dự kiến bao gồm khu trưng bày kỷ lục, thư viện tri thức sáng tạo và khu tương tác dành cho thế hệ trẻ.' },
  { id: 'nghe-nhan', category: 'CHUYÊN MỤC ĐƯỢC YÊU THÍCH', title: 'Chuyện nhà sáng nghiệp: Nghệ nhân với hồn làng & hành trình 40 năm giữ lửa đam mê', description: 'Theo chân người nghệ nhân gìn giữ nghề truyền thống, để lắng nghe câu chuyện về lòng kiên trì, sự tận tâm và khát vọng tiếp nối.', image: artisan, imageAlt: 'Minh họa nghệ nhân bên bàn chế tác gốm', caption: 'GIỮ LỬA NGHỀ · LAN TỎA GIÁ TRỊ', action: 'Đọc toàn bộ câu chuyện', body: 'Từ một góc xưởng nhỏ, từng sản phẩm được tạo nên bằng sự kiên nhẫn và tình yêu với chất liệu. Câu chuyện mẫu kể về hành trình một người thợ truyền lại kỹ năng cho thế hệ trẻ, đồng thời thử nghiệm các thiết kế mới để nghề truyền thống tiếp tục sống trong đời sống hôm nay.' },
]

export const programs = [
  { id: 'quan-tri', icon: 'cap', title: 'Đào tạo Quản trị Tài sản Trí tuệ & Thương quyền Kỷ lục', description: 'Kiến thức nền tảng và thực tiễn dành cho tổ chức, cá nhân trên hành trình xác lập, khai thác và phát triển tài sản trí tuệ.', audience: 'Doanh nghiệp · Nhà sáng nghiệp' },
  { id: 'uom-tao', icon: 'bulb', title: 'Ươm tạo Doanh nghiệp Công nghiệp Văn hóa Sáng tạo', description: 'Chương trình kết nối ý tưởng sáng tạo với nguồn lực, chuyên gia và cộng đồng, đồng hành từ ý tưởng đến thực tiễn.', audience: 'Startup · Dự án sáng tạo' },
  { id: 'hop-tac', icon: 'globe', title: 'Liên minh Hợp tác Viện – Doanh nghiệp – Địa phương', description: 'Kết nối nghiên cứu và nguồn lực xã hội để cùng phát triển những mô hình sáng tạo bền vững, gắn với bản sắc địa phương.', audience: 'Viện nghiên cứu · Địa phương' },
]

export const eligibility = [
  { title: 'Người có tài năng', description: 'Sở hữu tài năng, thành tựu và giá trị khác biệt.' },
  { title: 'Nhà sáng tạo & nhà sáng nghiệp', description: 'Có ý tưởng, sản phẩm hoặc giải pháp mang lại giá trị.' },
  { title: 'Cộng đồng & đơn vị', description: 'Đóng góp vào sự phát triển sáng tạo và bản sắc Việt.' },
]
