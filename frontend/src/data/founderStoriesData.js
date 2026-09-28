

export const CATEGORIES = [
  { id: 'all', label: 'Tất cả lĩnh vực' },
  { id: 'craft', label: 'Thủ công mỹ nghệ' },
  { id: 'cosmetics', label: 'Mỹ phẩm & Dược liệu' },
  { id: 'tech', label: 'Công nghệ sáng tạo' },
  { id: 'fashion', label: 'Thời trang bền vững' },
  { id: 'culinary', label: 'Ẩm thực truyền thống' },
];

export const FOUNDER_STORIES = [
  {
    id: 'vu-van-hung',
    category: 'craft',
    badgeText: 'Thủ công mỹ nghệ',
    categoryLabel: 'GỐM SỨ MỸ NGHỆ TRUYỀN THỐNG',
    name: 'NNƯT. Vũ Văn Hùng',
    title: 'Nghệ nhân Bát Tràng thế hệ thứ 6, Người sáng lập & Giám đốc Nghệ thuật Gốm Sứ Hùng Thịnh',
    image:  'https://internetviettel.vn/wp-content/uploads/2017/05/1-2.jpg',
    meta: [
      { label: 'Năm thành lập', value: '1998' },
      { label: 'Quy mô', value: '65 nghệ nhân & thợ' },
      { label: 'Thị trường', value: 'Việt Nam, Nhật Bản, Pháp' },
      { label: 'Doanh thu', value: '15+ Tỷ VNĐ/năm' },
    ],
    tabs: {
      about: {
        title: 'Giữ hồn gốm cổ qua 60 năm thăng trầm',
        content:
          'Sinh ra và lớn lên tại cái nôi gốm Bát Tràng, Nghệ nhân Ưu tú Vũ Văn Hùng đã dành trọn cuộc đời mình cho ngọn lửa lò nung và từng thớ đất sét phù sa sông Hồng. Không chỉ bảo tồn kỹ thuật men lam, men rạn cung đình, ông còn tiên phong ứng dụng công nghệ nung điện – gas sạch giúp giảm 75% khí thải độc hại, đồng thời nâng tầm gốm thủ công Việt Nam trở thành tác phẩm nghệ thuật cao cấp xuất hiện tại nhiều bảo tàng quốc tế.',
        quote:
          'Gốm không chỉ là đất và men nung qua lửa, đó là linh hồn, giọt mồ hôi và văn hóa ngàn năm của tổ tiên kết tinh trong từng nét vẽ.',
        quoteAuthor: 'NNƯT. Vũ Văn Hùng, Giám đốc Nghệ thuật Gốm Sứ Hùng Thịnh',
      },
      journey: {
        title: 'Từ xưởng gốm vách đất đến thương hiệu vươn tầm thế giới',
        content:
          'Năm 1998, khi đồ gốm công nghiệp giá rẻ tràn ngập thị trường, xưởng gốm gia đình đứng trước bờ vực phá sản. Thay vì chạy theo xu hướng hạ giá thành, ông kiên quyết rẽ sang lối đi độc bản: nghiên cứu 5 năm ròng rã để phục chế thành công dòng men lam thời Lê sơ đã thất truyền. Từng mẻ gốm hỏng chất đống không làm nhụt chí người thợ. Đến nay, sản phẩm của Hùng Thịnh đã có mặt tại hơn 12 quốc gia.',
        quote:
          'Khi cả thị trường chọn làm nhanh và rẻ, tôi chọn đi chậm để tìm lại chiều sâu bản sắc văn hóa dân tộc.',
        quoteAuthor: 'NNƯT. Vũ Văn Hùng',
      },
      achievements: {
        title: 'Bảo tồn di sản phi vật thể và vinh danh quốc gia',
        content:
          'Được Chủ tịch nước phong tặng danh hiệu Nghệ nhân Ưu tú năm 2016. Tác phẩm "Bình Gốm Hồn Việt" được chọn làm tặng phẩm ngoại giao trong các hội nghị thượng đỉnh quốc tế. Ông còn mở lớp truyền nghề miễn phí cho hơn 300 thanh niên địa phương, giúp duy trì ngọn lửa nghề gốm ngàn năm.',
        quote:
          'Thành tựu lớn nhất đời tôi không phải là những tấm bằng khen, mà là thấy thế hệ trẻ vẫn say sưa bên bàn xoay làm gốm.',
        quoteAuthor: 'NNƯT. Vũ Văn Hùng',
      },
    },
  },
  {
    id: 'nguyen-hong-trang',
    category: 'cosmetics',
    badgeText: 'Mỹ phẩm thiên nhiên',
    categoryLabel: 'MỸ PHẨM THIÊN NHIÊN & DƯỢC LIỆU SẠCH',
    name: 'Bà Nguyễn  Trang ',
    title: 'Đồng sáng lập & Tổng Giám đốc NatureCare Vietnam - Tiên phong nâng tầm thảo mộc bản địa',
    image:  'https://internetviettel.vn/wp-content/uploads/2017/05/1-2.jpg',
    meta: [
      { label: 'Năm thành lập', value: '2017' },
      { label: 'Quy mô', value: '120+ nhân sự' },
      { label: 'Chuỗi giá trị', value: '500 ha dược liệu sạch' },
      { label: 'Xuất khẩu', value: '8 quốc gia (EU, Nhật, Mỹ)' },
    ],
    tabs: {
      about: {
        title: 'Đổi mới sáng tạo từ nguồn dược liệu bản địa Việt',
        content:
          'Xuất phát từ tình yêu mãnh liệt với nguồn thảo mộc nhiệt đới phong phú của Việt Nam, bà Nguyễn Hồng Trang đã từ bỏ vị trí cấp cao tại tập đoàn đa quốc gia để xây dựng mô hình liên kết khép kín với hơn 350 hộ nông dân vùng cao. NatureCare ứng dụng công nghệ trích ly CO2 siêu tới hạn, tạo ra các dòng sản phẩm chăm sóc sức khỏe và làm đẹp hữu cơ đạt tiêu chuẩn quốc tế Ecocert.',
        quote:
          'Khởi nghiệp từ tài nguyên bản địa không chỉ là câu chuyện kinh doanh, mà là trách nhiệm bảo tồn tri thức dân gian và chia sẻ thịnh vượng bền vững cùng cộng đồng.',
        quoteAuthor: 'Bà Nguyễn Hồng Trang, CEO NatureCare Vietnam',
      },
      journey: {
        title: '7 năm kiên trì phủ xanh những đồi trọc miền Trung',
        content:
          'Khởi đầu với 2 ha tràm gió cằn cỗi tại Quảng Trị, chị Trang cùng bà con đồng bào Vân Kiều kiên trì cải tạo đất trong suốt 3 năm ròng mà không sử dụng phân bón hóa học hay thuốc trừ sâu. Đến nay, vùng nguyên liệu đã mở rộng lên 500 ha đạt chuẩn GACP-WHO, giúp nâng cao thu nhập ổn định gấp 4 lần cho hàng trăm hộ dân.',
        quote:
          'Chỉ khi nông dân thực sự ấm no và đất đai được hồi sinh, sản phẩm của chúng tôi mới trọn vẹn giá trị tinh khiết.',
        quoteAuthor: 'Bà Nguyễn Hồng Trang',
      },
      achievements: {
        title: 'Doanh nghiệp tác động xã hội xuất sắc & Đạt chuẩn quốc tế',
        content:
          'Đạt chứng nhận Hữu cơ Quốc tế USDA Organic và Ecocert Cosmos. Vinh danh Top 10 Doanh nghiệp Tạo Tác động Xã hội Tiêu biểu 2022. Sản phẩm hiện có mặt tại hơn 1.200 chuỗi nhà thuốc, spa cao cấp trong nước và xuất khẩu chính ngạch sang Nhật Bản, Hàn Quốc, Đức.',
        quote:
          'Mỗi lọ tinh dầu thảo mộc Việt bay ra thế giới là một đại sứ mang theo lòng tự hào về cỏ cây xứ sở nhiệt đới.',
        quoteAuthor: 'Bà Nguyễn Hồng Trang',
      },
    },
  },
  {
    id: 'tran-quang-huy',
    category: 'tech',
    badgeText: 'Công nghệ sáng tạo',
    categoryLabel: 'TRÍ TUỆ NHÂN TẠO & CÔNG NGHỆ SỐ',
    name: 'TS. Trần Huy',
    title: 'Nhà sáng lập & Giám đốc Công nghệ AI-Culture Lab - Số hóa và phục dựng di sản bằng AI',
    image:  'https://internetviettel.vn/wp-content/uploads/2017/05/1-2.jpg',
    meta: [
      { label: 'Năm thành lập', value: '2021' },
      { label: 'Quy mô', value: '45 kỹ sư AI & 3D Artist' },
      { label: 'Sản phẩm cốt lõi', value: 'Nền tảng 3D Heritage' },
      { label: 'Thành tựu', value: 'Quán quân TechFest 2023' },
    ],
    tabs: {
      about: {
        title: 'Đưa di sản ngàn năm vào kỷ nguyên số bằng AI & VR',
        content:
          'Sau khi hoàn thành bằng Tiến sĩ Khoa học Máy tính tại Pháp, TS. Trần Quang Huy quyết định trở về Việt Nam thành lập AI-Culture Lab với sứ mệnh tái hiện các không gian văn hóa phi vật thể bằng công nghệ thực tế ảo và trí tuệ nhân tạo. Dự án "Số hóa 100 làng nghề cổ" của anh đã giúp hàng triệu bạn trẻ trong và ngoài nước trải nghiệm không gian văn hóa sống động và chân thực đến từng chi tiết.',
        quote:
          'Công nghệ chỉ thực sự có ý nghĩa khi trở thành chiếc cầu nối đưa giá trị văn hóa ngàn năm chạm đến trái tim của thế hệ trẻ hôm nay.',
        quoteAuthor: 'TS. Trần Quang Huy, Founder & CTO AI-Culture Lab',
      },
      journey: {
        title: 'Vượt qua nghi ngại để dung hòa khoa học và lịch sử',
        content:
          'Những ngày đầu nghiên cứu thuật toán Neural Radiance Fields (NeRF), nhóm vấp phải sự hoài nghi của nhiều nhà nghiên cứu lịch sử vì lo ngại AI sẽ "làm biến dạng" hiện vật. Bằng sự nghiêm túc và cầu thị, Huy cùng các kỹ sư đã cộng tác chặt chẽ cùng Viện Khảo cổ học suốt 18 tháng, đối chiếu hàng nghìn trang tư liệu để cho ra đời mô hình phục dựng chính xác 99.8%.',
        quote:
          'Thách thức lớn nhất không phải là viết thuật toán, mà là học cách lắng nghe tiếng vọng của tiền nhân qua từng di chỉ.',
        quoteAuthor: 'TS. Trần Quang Huy',
      },
      achievements: {
        title: 'Giải thưởng Đổi mới Sáng tạo châu Á & Hợp tác quốc tế',
        content:
          'Đoạt giải Quán quân cuộc thi Khởi nghiệp Đổi mới Sáng tạo Quốc gia TechFest 2023; Giải thưởng Sáng tạo Công nghệ châu Á (AIIA 2024). Đã hợp tác số hóa thành công 35 bảo tàng và di tích lịch sử quốc gia, thu hút hơn 2 triệu lượt tham quan trực tuyến.',
        quote:
          'Đất nước có một kho tàng di sản khổng lồ; nhiệm vụ của chúng tôi là trang bị cho nó đôi cánh số để bay xa.',
        quoteAuthor: 'TS. Trần Quang Huy',
      },
    },
  },
  {
    id: 'le-hoang-yen',
    category: 'fashion',
    badgeText: 'Thời trang bền vững',
    categoryLabel: 'THỜI TRANG BẢN ĐỊA & PHÁT TRIỂN BỀN VỮNG',
    name: 'ThS. Lê Hoàng Yến',
    title: 'Sáng lập Hợp tác xã Dệt Thổ cẩm Chăm & Nhà thiết kế thương hiệu thời trang AnNam Craft',
    image: 'https://internetviettel.vn/wp-content/uploads/2017/05/1-2.jpg',
    meta: [
      { label: 'Năm thành lập', value: '2019' },
      { label: 'Quy mô', value: '80+ nghệ nhân thổ cẩm' },
      { label: 'Chứng nhận', value: 'Fair Trade Certified' },
      { label: 'Thị trường', value: 'EU, Nhật Bản, Mỹ' },
    ],
    tabs: {
      about: {
        title: 'Tái sinh làng nghề dệt thổ cẩm và trao quyền phụ nữ bản địa',
        content:
          'Tốt nghiệp Thạc sĩ Thiết kế Thời trang Bền vững tại Melbourne, ThS. Lê Hoàng Yến đã dành trọn đam mê cho văn hóa thổ cẩm dân tộc. Chị lặn lội đến từng buôn làng xa xôi để tìm hiểu kỹ thuật dệt nhuộm tự nhiên từ lá cây, vỏ tràm. Chị kết hợp hoa văn cổ truyền với kiểu dáng thời trang ứng dụng cao cấp, đưa sản phẩm thổ cẩm Việt Nam xuất hiện ấn tượng trên các sàn diễn tuần lễ thiết kế quốc tế.',
        quote:
          'Thời trang bền vững không phải là trào lưu nhất thời, mà là cam kết tôn trọng người thợ dệt, cội nguồn văn hóa và tương lai của Trái Đất.',
        quoteAuthor: 'ThS. Lê Hoàng Yến, Sáng lập AnNam Craft',
      },
      journey: {
        title: 'Hồi sinh những khung dệt cổ bên bờ vực mai một',
        content:
          'Năm 2019, nhiều nghệ nhân cao tuổi buông khung cửi vì sản phẩm dệt tay thu nhập quá thấp so với hàng dệt máy công nghiệp. Chị Yến đã đứng ra thành lập Hợp tác xã, cam kết bao tiêu 100% sản phẩm và đào tạo lại thẩm mỹ màu sắc hiện đại cho các chị em phụ nữ dân tộc Chăm và Mông. Từ một tổ hợp tác 7 người, HTX nay đã mở rộng lên hơn 80 thợ dệt tay lành nghề.',
        quote:
          'Mỗi tấm vải dệt bằng sợi tự nhiên là một câu chuyện tình yêu thương, kiên nhẫn và sự hòa hợp diệu kỳ giữa con người với thiên nhiên.',
        quoteAuthor: 'ThS. Lê Hoàng Yến',
      },
      achievements: {
        title: 'Chứng nhận Thương mại Công bằng Quốc tế & Sàn diễn Paris',
        content:
          'Đạt chứng nhận Thương mại Công bằng Toàn cầu Fair Trade (WFTO) năm 2021. Bộ sưu tập thổ cẩm "Hồn Đất Thơm" được mời trình diễn chính thức tại Paris Sustainable Fashion Week 2023. Tạo việc làm và thu nhập gấp 3 lần cho phụ nữ đồng bào thiểu số.',
        quote:
          'Vẻ đẹp truyền thống chỉ thực sự sống mãi khi nó có thể nuôi sống chính những đôi bàn tay đang gìn giữ nó.',
        quoteAuthor: 'ThS. Lê Hoàng Yến',
      },
    },
  },
];
