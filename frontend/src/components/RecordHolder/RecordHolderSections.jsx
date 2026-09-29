import { useState } from 'react'
import RecordHolderIcon from './RecordHolderIcon.jsx'

export default function RecordHolderBody({ onNominate }) {
  const [filter, setFilter] = useState('all')

  function onDownloadDoc(filename) {
    window.alert(`Tài liệu ${filename} chưa được cung cấp.`)
  }

  return (
<div className="record-holder-page flex w-full flex-col" data-filter={filter}>
<header className="relative w-full bg-record-primary-container text-record-on-primary overflow-hidden shadow-xl">
<div className="absolute inset-0 bg-gradient-to-r from-record-primary via-record-primary-container to-record-tertiary-container opacity-90"></div>
<div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-around">
<RecordHolderIcon name="military_tech" size={320} className="text-record-secondary-fixed" />
<RecordHolderIcon name="workspace_premium" size={280} className="text-record-secondary-fixed lg:-translate-x-14" />
</div>
<div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20 flex flex-col gap-6">
<nav aria-label="Breadcrumb" className="flex items-center gap-2 text-record-surface-container-high font-label-md text-label-md">
<a className="hover:text-record-secondary-container transition-colors flex items-center gap-1" data-path="trang-chu" href="/trang-chu">
<RecordHolderIcon name="home" size={18} className="" />
          Trang chủ
        </a>
<span className="opacity-40">/</span>
<span className="text-record-secondary-fixed font-semibold tracking-wide">Đề cử kỷ lục</span>
</nav>
<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-2">
<div className="max-w-3xl space-y-4">
<div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-record-surface-container-lowest/10 backdrop-blur-md shadow-sm">
<RecordHolderIcon name="stars" size={20} filled className="text-record-secondary-container" />
<span className="text-record-secondary-fixed font-label-sm text-label-sm uppercase tracking-widest font-bold">CỔNG THÔNG TIN ĐỀ CỬ KỶ LỤC QUỐC GIA</span>
</div>
<h1 className="font-display-lg text-display-lg text-record-on-primary tracking-tight leading-tight uppercase drop-shadow-sm">HỆ THỐNG ĐỀ CỬ KỶ LỤC &amp; TÔN VINH DANH HIỆU</h1>
<p className="font-body-lg text-body-lg text-record-secondary-fixed-dim italic [font-synthesis:style] font-medium tracking-wide">
            <i>"Tôn vinh trí tuệ — Ghi nhận cống hiến — Xác lập giá trị trường tồn"</i>
          </p>
</div>
<div className="flex flex-row sm:flex-col gap-6 p-6 rounded-xl bg-record-surface-container-lowest/10 backdrop-blur-md shadow-inner text-right min-w-[240px]">
<div>
<div className="font-display-lg text-display-lg text-record-secondary-container font-bold leading-none">05</div>
<div className="font-label-sm text-label-sm text-record-surface-container uppercase tracking-wider mt-1">HẠNG MỤC ĐỀ CỬ</div>
</div>
<div>
<div className="font-headline-lg text-headline-lg text-record-on-primary font-bold leading-none">100%</div>
<div className="font-label-sm text-label-sm text-record-surface-container uppercase tracking-wider mt-1">HẠNG MỤC ĐỀ CỬ</div>
</div>
</div>
</div>
</div>
</header>
<section className="w-full py-16 lg:py-24 bg-record-surface">
<div className="max-w-7xl mx-auto px-6 lg:px-10">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
<div className="lg:col-span-7 flex flex-col gap-6">
<div className="space-y-2">
<div className="inline-flex items-center gap-2 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold">
<span className="w-2 h-2 rounded-full bg-record-secondary-container"></span>
              QUY CHẾ PHÁP LÝ &amp; CHUẨN MỰC
            </div>
<h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold">
              Quy Chế &amp; Hội Đồng Thẩm Định Khoa Học
            </h2>
</div>
<p className="font-body-md text-body-md text-record-on-surface-variant leading-relaxed text-justify">Mọi hồ sơ xác lập và đề cử kỷ lục được Trung tâm Công nghiệp Sáng tạo trực thuộc Viện Kỷ lục Việt Nam (VIETKINGS) khởi xướng và thẩm định đều tuân thủ nguyên tắc khách quan, độc lập và chuẩn mực quốc tế liên minh với Liên minh Kỷ lục Thế giới (WorldKings).</p>
<p className="font-body-md text-body-md text-record-on-surface-variant leading-relaxed text-justify">
            Hội đồng Thẩm định quy tụ các nhà khoa học, giáo sư, chuyên gia đầu ngành trong các lĩnh vực di sản văn hóa, kinh tế tri thức, thủ công mỹ nghệ tinh hoa và công nghệ đổi mới sáng tạo, đảm bảo các giá trị được tôn vinh mang tính biểu tượng bền vững của quốc gia.
          </p>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
<div className="p-5 rounded-xl bg-record-surface-container-low shadow-sm flex flex-col gap-2">
<RecordHolderIcon name="verified_user" size={32} filled className="text-record-primary" />
<h3 className="font-headline-sm text-headline-sm text-record-on-surface font-bold">Minh Bạch</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant">Mọi hồ sơ xác lập và đề cử kỷ lục được Trung tâm Công nghiệp Sáng tạo trực thuộc Viện Kỷ lục Việt Nam (VIETKINGS) khởi xướng và thẩm định đều tuân thủ nguyên tắc khách quan, độc lập và chuẩn mực quốc tế liên minh với Liên minh Kỷ lục Thế giới (WorldKings).</p>
</div>
<div className="p-5 rounded-xl bg-record-surface-container-low shadow-sm flex flex-col gap-2">
<RecordHolderIcon name="public" size={32} filled className="text-record-secondary" />
<h3 className="font-headline-sm text-headline-sm text-record-on-surface font-bold">Chuẩn Quốc Tế</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant">Mọi hồ sơ xác lập và đề cử kỷ lục được Trung tâm Công nghiệp Sáng tạo trực thuộc Viện Kỷ lục Việt Nam (VIETKINGS) khởi xướng và thẩm định đều tuân thủ nguyên tắc khách quan, độc lập và chuẩn mực quốc tế liên minh với Liên minh Kỷ lục Thế giới (WorldKings).</p>
</div>
<div className="p-5 rounded-xl bg-record-surface-container-low shadow-sm flex flex-col gap-2">
<RecordHolderIcon name="balance" size={32} filled className="text-record-primary-container" />
<h3 className="font-headline-sm text-headline-sm text-record-on-surface font-bold">Di Sản &amp; Giá Trị</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant">Mọi hồ sơ xác lập và đề cử kỷ lục được Trung tâm Công nghiệp Sáng tạo trực thuộc Viện Kỷ lục Việt Nam (VIETKINGS) khởi xướng và thẩm định đều tuân thủ nguyên tắc khách quan, độc lập và chuẩn mực quốc tế liên minh với Liên minh Kỷ lục Thế giới (WorldKings).</p>
</div>
</div>
</div>
<div className="lg:col-span-5 flex flex-col gap-6">
<div className="relative p-8 rounded-xl bg-record-surface-container shadow-md overflow-hidden flex flex-col gap-6">
<div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-record-secondary-container/20 pointer-events-none blur-2xl"></div>
<div className="flex items-center gap-4 pb-4 bg-record-surface-container-high/60 p-4 rounded-lg">
<div className="w-14 h-14 rounded-xl bg-record-primary text-record-on-primary flex items-center justify-center shrink-0 shadow-md">
<RecordHolderIcon name="gavel" size={32} className="" />
</div>
<div>
<h4 className="font-headline-sm text-headline-sm text-record-primary font-bold">Hội Đồng Khoa Học Độc Lập</h4>
<p className="font-label-sm text-label-sm text-record-on-surface-variant">Nhiệm kỳ 2024 - 2029 | Quyết định số 18/QĐ-VIETKINGS</p>
</div>
</div>
<div className="space-y-3">
<div className="flex items-start gap-3">
<RecordHolderIcon name="check_circle" size={20} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="font-body-sm text-body-sm text-record-on-surface"><strong>Chủ tịch Hội đồng:</strong> TS. Thang Văn Phúc - Nguyên Thứ trưởng Bộ Nội vụ, Chủ tịch T.Ư Hội Kỷ lục gia VN.</span>
</div>
<div className="flex items-start gap-3">
<RecordHolderIcon name="check_circle" size={20} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="font-body-sm text-body-sm text-record-on-surface"><strong>Tổng thư ký:</strong> Ban Thường trực Viện Kỷ lục Việt Nam &amp; Viện Trưởng Viện Sáng tạo.</span>
</div>
<div className="flex items-start gap-3">
<RecordHolderIcon name="check_circle" size={20} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="font-body-sm text-body-sm text-record-on-surface"><strong>Chuyên gia phản biện:</strong> 15 Giáo sư, Viện sĩ, Nghệ nhân Nhân dân danh dự.</span>
</div>
</div>
<div className="pt-4 mt-2">
<a className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-record-primary text-record-on-primary font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-record-tertiary shadow-md transition-colors" href="#danh-sach-giai-thuong"><RecordHolderIcon name="menu_book" size={20} className="" /> TRA CỨU DANH MỤC ĐỀ CỬ</a>
</div>
</div>
</div>
</div>
</div>
</section>
<section className="w-full py-16 lg:py-24 bg-record-surface-container-low" id="danh-sach-giai-thuong">
<div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-12">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div className="space-y-2">
<div className="inline-flex items-center gap-2 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold"><RecordHolderIcon name="military_tech" size={18} className="" /> DANH MỤC ĐỀ CỬ KỶ LỤC NIÊN KHÓA 2025</div>
<h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold">DANH MỤC HẠNG MỤC ĐỀ CỬ KỶ LỤC</h2>
</div>
<p className="font-body-sm text-body-sm text-record-on-surface-variant max-w-md text-left md:text-right">
          Các hạng mục được phân định chặt chẽ theo đặc thù cống hiến, dành cho từng nhóm chủ thể tiên phong trong nền kinh tế tri thức và di sản.
        </p>
</div>
<div className="flex flex-col gap-8">
<article className="bg-record-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
<div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-record-surface-container-low to-record-surface-container text-center shadow-inner">
<div className="w-24 h-24 rounded-full bg-record-secondary-container/20 flex items-center justify-center text-record-secondary mb-3 shadow-sm">
<RecordHolderIcon name="flare" size={54} filled className="text-record-secondary" />
</div>
<span className="font-label-sm text-label-sm text-record-primary font-bold uppercase tracking-widest">HẠNG MỤC TỐI CAO</span>
<span className="font-label-sm text-label-sm text-record-on-surface-variant mt-1">Biểu tượng ngọn hải đăng bằng đồng mạ vàng</span>
</div>
<div className="lg:col-span-6 flex flex-col gap-4">
<div className="space-y-1">
<div className="flex flex-wrap items-center gap-2 text-label-sm text-label-sm">
<span className="px-2.5 py-1 rounded bg-record-secondary-fixed text-record-on-secondary-fixed font-bold uppercase">Doanh nhân &amp; Nhà sáng lập</span>
<span className="px-2.5 py-1 rounded bg-record-surface-container-high text-record-on-surface-variant font-semibold">Chu kỳ: Thường niên (Tháng 12)</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-record-primary font-bold pt-1">Đề Cử Ngọn Hải Đăng Sáng Nghiệp</h3>
</div>
<p className="font-body-sm text-body-sm text-record-on-surface-variant">
              Giải thưởng danh giá tôn vinh những người đứng đầu doanh nghiệp kiên định dẫn lối, có mô hình kinh doanh đổi mới đột phá, vượt qua khủng hoảng kinh tế và lan tỏa động lực sáng tạo phụng sự cộng đồng.
            </p>
<div className="space-y-2 pt-1">
<div className="font-label-md text-label-md text-record-primary font-bold uppercase tracking-wide">Tiêu chí xét duyệt cốt lõi:</div>
<ul className="space-y-1.5 font-body-sm text-body-sm text-record-on-surface">
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Doanh nghiệp sở hữu tối thiểu 01 giải pháp hoặc sản phẩm có tính đột phá độc bản trên thị trường.</span>
</li>
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Tạo lập từ 100 việc làm bền vững hoặc đóng góp tối thiểu 10% doanh thu thường niên cho hoạt động cộng đồng.</span>
</li>
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Được Hội đồng Viện Kỷ lục Quốc gia xác nhận chỉ số ảnh hưởng tích cực trong hệ sinh thái khởi nghiệp.</span>
</li>
</ul>
</div>
</div>
<div className="lg:col-span-3 flex flex-col gap-3 justify-center lg:pl-6 bg-record-surface-container-low/50 p-6 rounded-xl">
<span className="font-label-sm text-label-sm text-record-on-surface-variant uppercase text-center font-semibold">CỔNG TIẾP NHẬN 2025</span>
<button type="button" className="w-full py-3 px-4 rounded-lg bg-record-primary text-record-on-primary font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-record-tertiary transition-all shadow-md flex items-center justify-center gap-2" onClick={() => onNominate('Giải Thưởng Ngọn Hải Đăng Sáng Nghiệp')}>
<RecordHolderIcon name="assignment_turned_in" size={18} className="" />
              Đề Cử / Nộp Hồ Sơ
            </button>
<button type="button" className="w-full py-3 px-4 rounded-lg bg-record-surface-container text-record-primary font-label-md text-label-md font-semibold tracking-wider hover:bg-record-surface-container-high transition-all flex items-center justify-center gap-2" onClick={() => onDownloadDoc('QuyChe_HaiDangSangNghiep_2025.pdf')}><RecordHolderIcon name="download" size={18} className="" /> Tải Hồ Sơ Tiêu Chí Đề Cử</button>
</div>
</article>
<article className="bg-record-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
<div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-record-surface-container-low to-record-surface-container text-center shadow-inner">
<div className="w-24 h-24 rounded-full bg-record-secondary-container/20 flex items-center justify-center text-record-secondary mb-3 shadow-sm">
<RecordHolderIcon name="handyman" size={54} filled className="text-record-secondary" />
</div>
<span className="font-label-sm text-label-sm text-record-primary font-bold uppercase tracking-widest">HUY CHƯƠNG VÀNG DI SẢN</span>
<span className="font-label-sm text-label-sm text-record-on-surface-variant mt-1">Đúc kim hoàn truyền thống chạm nổi</span>
</div>
<div className="lg:col-span-6 flex flex-col gap-4">
<div className="space-y-1">
<div className="flex flex-wrap items-center gap-2 text-label-sm text-label-sm">
<span className="px-2.5 py-1 rounded bg-record-secondary-fixed text-record-on-secondary-fixed font-bold uppercase">Nghệ nhân &amp; Làng nghề Di sản</span>
<span className="px-2.5 py-1 rounded bg-record-surface-container-high text-record-on-surface-variant font-semibold">Chu kỳ: Định kỳ 2 năm một lần</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-record-primary font-bold pt-1">
                Huy Hiệu Tinh Hoa Nghề Truyền Thống
              </h3>
</div>
<p className="font-body-sm text-body-sm text-record-on-surface-variant">
              Tôn vinh các bậc nghệ nhân, thợ giỏi và cộng đồng bảo tồn đã gìn giữ linh hồn bí quyết thủ công mỹ nghệ cổ truyền, kết hợp sáng tạo tư duy đương đại đưa sản phẩm vươn ra năm châu.
            </p>
<div className="space-y-2 pt-1">
<div className="font-label-md text-label-md text-record-primary font-bold uppercase tracking-wide">Tiêu chí xét duyệt cốt lõi:</div>
<ul className="space-y-1.5 font-body-sm text-body-sm text-record-on-surface">
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Thời gian gắn bó và cống hiến liên tục tối thiểu 20 năm cho nghề thủ công di sản.</span>
</li>
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Đào tạo, truyền thụ thành công ngón nghề cho tối thiểu 3 thế hệ học trò hoặc 50 lao động địa phương.</span>
</li>
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Có tác phẩm đạt kỷ lục kích thước, độ tinh xảo hoặc giải thưởng tinh hoa nghề thuật cấp tỉnh/quốc gia.</span>
</li>
</ul>
</div>
</div>
<div className="lg:col-span-3 flex flex-col gap-3 justify-center lg:pl-6 bg-record-surface-container-low/50 p-6 rounded-xl">
<span className="font-label-sm text-label-sm text-record-on-surface-variant uppercase text-center font-semibold">NIÊN KHÓA VINH DANH 2024-2025</span>
<button type="button" className="w-full py-3 px-4 rounded-lg bg-record-primary text-record-on-primary font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-record-tertiary transition-all shadow-md flex items-center justify-center gap-2" onClick={() => onNominate('Huy Hiệu Tinh Hoa Nghề Truyền Thống')}>
<RecordHolderIcon name="assignment_turned_in" size={18} className="" />
              Đề Cử / Nộp Hồ Sơ
            </button>
<button type="button" className="w-full py-3 px-4 rounded-lg bg-record-surface-container text-record-primary font-label-md text-label-md font-semibold tracking-wider hover:bg-record-surface-container-high transition-all flex items-center justify-center gap-2" onClick={() => onDownloadDoc('QuyChe_TinhHoaNgheTruyenThong.pdf')}><RecordHolderIcon name="download" size={18} className="" /> Tải Hồ Sơ Tiêu Chí Đề Cử</button>
</div>
</article>
<article className="bg-record-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
<div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-record-surface-container-low to-record-surface-container text-center shadow-inner">
<div className="w-24 h-24 rounded-full bg-record-secondary-container/20 flex items-center justify-center text-record-secondary mb-3 shadow-sm">
<RecordHolderIcon name="history_edu" size={54} filled className="text-record-secondary" />
</div>
<span className="font-label-sm text-label-sm text-record-primary font-bold uppercase tracking-widest">CHỨNG NHẬN KỶ LỤC</span>
<span className="font-label-sm text-label-sm text-record-on-surface-variant mt-1">Bằng da đính ấn tín vàng Hoàng Gia</span>
</div>
<div className="lg:col-span-6 flex flex-col gap-4">
<div className="space-y-1">
<div className="flex flex-wrap items-center gap-2 text-label-sm text-label-sm">
<span className="px-2.5 py-1 rounded bg-record-secondary-fixed text-record-on-secondary-fixed font-bold uppercase">Nhà Khoa học, Viện nghiên cứu, Sáng chế</span>
<span className="px-2.5 py-1 rounded bg-record-surface-container-high text-record-on-surface-variant font-semibold">Chu kỳ: Thường xuyên theo đợt thẩm định</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-record-primary font-bold pt-1">
                Bằng Chứng Nhận Kỷ Lục Sáng Tạo Quốc Gia
              </h3>
</div>
<p className="font-body-sm text-body-sm text-record-on-surface-variant">
              Chứng chỉ pháp lý tôn vinh các sáng chế khoa học kỹ thuật, phần mềm, giải pháp hữu ích độc bản đầu tiên tại Việt Nam mở ra khả năng ứng dụng thực tế trên quy mô công nghiệp lớn.
            </p>
<div className="space-y-2 pt-1">
<div className="font-label-md text-label-md text-record-primary font-bold uppercase tracking-wide">Tiêu chí xét duyệt cốt lõi:</div>
<ul className="space-y-1.5 font-body-sm text-body-sm text-record-on-surface">
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Có bằng độc quyền sáng chế hoặc giải pháp hữu ích đã được Cục Sở hữu Trí tuệ cấp văn bằng bảo hộ.</span>
</li>
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Đã thương mại hóa thực tế hoặc chuyển giao công nghệ cho tối thiểu 03 đơn vị sử dụng thành công.</span>
</li>
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Mang thông số vượt trội định lượng được so với các giải pháp hiện hành trong khu vực.</span>
</li>
</ul>
</div>
</div>
<div className="lg:col-span-3 flex flex-col gap-3 justify-center lg:pl-6 bg-record-surface-container-low/50 p-6 rounded-xl">
<span className="font-label-sm text-label-sm text-record-on-surface-variant uppercase text-center font-semibold">ĐĂNG KÝ XÁC LẬP KỶ LỤC</span>
<button type="button" className="w-full py-3 px-4 rounded-lg bg-record-primary text-record-on-primary font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-record-tertiary transition-all shadow-md flex items-center justify-center gap-2" onClick={() => onNominate('Bằng Chứng Nhận Kỷ Lục Sáng Tạo Quốc Gia')}>
<RecordHolderIcon name="assignment_turned_in" size={18} className="" />
              Đề Cử / Nộp Hồ Sơ
            </button>
<button type="button" className="w-full py-3 px-4 rounded-lg bg-record-surface-container text-record-primary font-label-md text-label-md font-semibold tracking-wider hover:bg-record-surface-container-high transition-all flex items-center justify-center gap-2" onClick={() => onDownloadDoc('QuyChe_KyLucSangTaoQuocGia.pdf')}><RecordHolderIcon name="download" size={18} className="" /> Tải Hồ Sơ Tiêu Chí Đề Cử</button>
</div>
</article>
<article className="bg-record-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
<div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-record-surface-container-low to-record-surface-container text-center shadow-inner">
<div className="w-24 h-24 rounded-full bg-record-secondary-container/20 flex items-center justify-center text-record-secondary mb-3 shadow-sm">
<RecordHolderIcon name="account_balance" size={54} filled className="text-record-secondary" />
</div>
<span className="font-label-sm text-label-sm text-record-primary font-bold uppercase tracking-widest">HẠNG MỤC ĐỀ CỬ CÔNG NGHIỆP VĂN HÓA</span>
<span className="font-label-sm text-label-sm text-record-on-surface-variant mt-1">Cúp Pha lê Đế Gỗ Quý Khảm Đồng</span>
</div>
<div className="lg:col-span-6 flex flex-col gap-4">
<div className="space-y-1">
<div className="flex flex-wrap items-center gap-2 text-label-sm text-label-sm">
<span className="px-2.5 py-1 rounded bg-record-secondary-fixed text-record-on-secondary-fixed font-bold uppercase">Doanh nghiệp Di sản, Du lịch Văn hóa &amp; Nghệ thuật</span>
<span className="px-2.5 py-1 rounded bg-record-surface-container-high text-record-on-surface-variant font-semibold">Chu kỳ: Thường niên (Tháng 10)</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-record-primary font-bold pt-1">Đề Cử Đổi Mới Sáng Tạo Di Sản Việt</h3>
</div>
<p className="font-body-sm text-body-sm text-record-on-surface-variant">
              Khích lệ các dự án ứng dụng công nghệ thực tế ảo, số hóa bảo tàng, thiết kế bao bì di sản và công nghiệp điện ảnh/ẩm thực biến kho tàng văn hóa dân tộc thành tài sản kinh tế hiện đại.
            </p>
<div className="space-y-2 pt-1">
<div className="font-label-md text-label-md text-record-primary font-bold uppercase tracking-wide">Tiêu chí xét duyệt cốt lõi:</div>
<ul className="space-y-1.5 font-body-sm text-body-sm text-record-on-surface">
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Sản phẩm lấy chất liệu văn hóa di sản vật thể hoặc phi vật thể của Việt Nam làm nguồn cảm hứng cốt lõi.</span>
</li>
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Tích hợp công nghệ hiện đại, thúc đẩy thương hiệu quốc gia trên thị trường quốc tế.</span>
</li>
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Có đánh giá tác động tích cực tới bảo tồn di sản của cơ quan quản lý văn hóa địa phương.</span>
</li>
</ul>
</div>
</div>
<div className="lg:col-span-3 flex flex-col gap-3 justify-center lg:pl-6 bg-record-surface-container-low/50 p-6 rounded-xl">
<span className="font-label-sm text-label-sm text-record-on-surface-variant uppercase text-center font-semibold">BÌNH CHỌN &amp; XÉT ĐỀ CỬ 2025</span>
<button type="button" className="w-full py-3 px-4 rounded-lg bg-record-primary text-record-on-primary font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-record-tertiary transition-all shadow-md flex items-center justify-center gap-2" onClick={() => onNominate('Giải Thưởng Đổi Mới Sáng Tạo Di Sản Việt')}>
<RecordHolderIcon name="assignment_turned_in" size={18} className="" />
              Đề Cử / Nộp Hồ Sơ
            </button>
<button type="button" className="w-full py-3 px-4 rounded-lg bg-record-surface-container text-record-primary font-label-md text-label-md font-semibold tracking-wider hover:bg-record-surface-container-high transition-all flex items-center justify-center gap-2" onClick={() => onDownloadDoc('QuyChe_SangTaoDiSanViet.pdf')}><RecordHolderIcon name="download" size={18} className="" /> Tải Hồ Sơ Tiêu Chí Đề Cử</button>
</div>
</article>
<article className="bg-record-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
<div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-record-surface-container-low to-record-surface-container text-center shadow-inner">
<div className="w-24 h-24 rounded-full bg-record-secondary-container/20 flex items-center justify-center text-record-secondary mb-3 shadow-sm">
<RecordHolderIcon name="trophy" size={54} filled className="text-record-secondary" />
</div>
<span className="font-label-sm text-label-sm text-record-primary font-bold uppercase tracking-widest">CÚP TÔN VINH ĐỈNH CAO</span>
<span className="font-label-sm text-label-sm text-record-on-surface-variant mt-1">Cúp bàn tay vàng đúc đồng nguyên khối</span>
</div>
<div className="lg:col-span-6 flex flex-col gap-4">
<div className="space-y-1">
<div className="flex flex-wrap items-center gap-2 text-label-sm text-label-sm">
<span className="px-2.5 py-1 rounded bg-record-secondary-fixed text-record-on-secondary-fixed font-bold uppercase">Nghệ nhân Chế tác &amp; Điêu khắc Điển hình</span>
<span className="px-2.5 py-1 rounded bg-record-surface-container-high text-record-on-surface-variant font-semibold">Chu kỳ: Thường niên tại Đại hội Kỷ lục</span>
</div>
<h3 className="font-headline-lg text-headline-lg text-record-primary font-bold pt-1">
                Cúp Vinh Danh Nghệ Nhân Bàn Tay Vàng Kỷ Lục
              </h3>
</div>
<p className="font-body-sm text-body-sm text-record-on-surface-variant">
              Vinh danh những cá nhân sở hữu kỹ thuật thao tác thủ công đạt tới độ thần kỳ, tạo tác nên những tuyệt phẩm kỷ lục thế giới và Việt Nam trong các lĩnh vực ngọc bích, thêu tay, gốm sứ và kim hoàn.
            </p>
<div className="space-y-2 pt-1">
<div className="font-label-md text-label-md text-record-primary font-bold uppercase tracking-wide">Tiêu chí xét duyệt cốt lõi:</div>
<ul className="space-y-1.5 font-body-sm text-body-sm text-record-on-surface">
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Là tác giả trực tiếp của tối thiểu 01 tác phẩm xác lập Kỷ lục Quốc gia hoặc Châu Á.</span>
</li>
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Có công trình phục chế hoặc chế tác phục vụ công trình văn hóa tầm vóc quốc gia.</span>
</li>
<li className="flex items-start gap-2">
<RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
<span className="">Được sự tín nhiệm tuyệt đối (100% phiếu thuận) từ Hội đồng Nghệ nhân Viện Kỷ lục.</span>
</li>
</ul>
</div>
</div>
<div className="lg:col-span-3 flex flex-col gap-3 justify-center lg:pl-6 bg-record-surface-container-low/50 p-6 rounded-xl">
<span className="font-label-sm text-label-sm text-record-on-surface-variant uppercase text-center font-semibold">HỒ SƠ BẢO TRỢ ĐẶC BIỆT</span>
<button type="button" className="w-full py-3 px-4 rounded-lg bg-record-primary text-record-on-primary font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-record-tertiary transition-all shadow-md flex items-center justify-center gap-2" onClick={() => onNominate('Cúp Vinh Danh Nghệ Nhân Bàn Tay Vàng Kỷ Lục')}>
<RecordHolderIcon name="assignment_turned_in" size={18} className="" />
              Đề Cử / Nộp Hồ Sơ
            </button>
<button type="button" className="w-full py-3 px-4 rounded-lg bg-record-surface-container text-record-primary font-label-md text-label-md font-semibold tracking-wider hover:bg-record-surface-container-high transition-all flex items-center justify-center gap-2" onClick={() => onDownloadDoc('QuyChe_BanTayVangKyLuc.pdf')}><RecordHolderIcon name="download" size={18} className="" /> Tải Hồ Sơ Tiêu Chí Đề Cử</button>
</div>
</article>
</div>
</div>
</section>
<section className="w-full py-16 lg:py-24 bg-record-surface">
<div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-12">
<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
<div className="space-y-2">
<div className="inline-flex items-center gap-2 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold">
<RecordHolderIcon name="verified" size={18} className="" />
            BẢNG VÀNG DANH DỰ
          </div>
<h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold">
            Cá Nhân &amp; Tập Thể Được Tôn Vinh Gần Đây
          </h2>
<p className="font-body-md text-body-md text-record-on-surface-variant">
            Ghi nhận những tấm gương cống hiến vượt bậc đã được trao chứng nhận và cúp vàng tại các kỳ hội ngộ Kỷ lục gia toàn quốc.
          </p>
</div>
<div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
<button type="button" className="honoree-filter-btn px-4 py-2 rounded-lg bg-record-primary text-record-on-primary font-label-sm text-label-sm font-semibold tracking-wider transition-all shadow-sm" onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>Tất cả</button>
<button type="button" className="honoree-filter-btn px-4 py-2 rounded-lg bg-record-surface-container-high text-record-on-surface-variant font-label-sm text-label-sm font-semibold tracking-wider hover:bg-record-secondary-fixed transition-all" onClick={() => setFilter('doanh-nhan')} aria-pressed={filter === 'doanh-nhan'}>Doanh nghiệp</button>
<button type="button" className="honoree-filter-btn px-4 py-2 rounded-lg bg-record-surface-container-high text-record-on-surface-variant font-label-sm text-label-sm font-semibold tracking-wider hover:bg-record-secondary-fixed transition-all" onClick={() => setFilter('nghe-nhan')} aria-pressed={filter === 'nghe-nhan'}>Nghệ nhân</button>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="honoreesGrid">
<div className="honoree-card group bg-record-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col" data-category="nghe-nhan">
<div className="relative h-64 w-full overflow-hidden bg-record-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="A dignified senior Vietnamese artisan in traditional brocade attire receiving a national golden record certification medal with deep crimson and gold velvet ceremonial background, cinematic high-contrast lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS1TARyyCxTKQtgTJsZ9IOZ32Dx8Bc13ClciI-mdPYYJ2LHpd_7fX04uuJsixjyjk9QE9UgwTNSnkSSnrqTNYRv_RkSbMZ5ul81-fW188wSTKYLhMJ5zGAnsU7gYzMVqnix9Ox68WqFafWw3c-mN_8UzzxrcBnF9XFlXxW12Or3SAEekSNgo-i1yT_B8tkpEmFwSgATN4U6may_WfctqVG4-e_kiTS_4zpfD50U8U9atJTn260fAmx" />
<div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-record-primary-container text-record-on-primary font-label-sm text-label-sm font-bold shadow-md">
              Năm 2024
            </div>
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
<div className="absolute bottom-3 left-3 right-3 text-white">
<span className="font-label-sm text-label-sm text-record-secondary-fixed uppercase font-bold tracking-wider">Kỷ lục gia Nhân dân</span>
</div>
</div>
<div className="p-5 flex flex-col flex-grow justify-between gap-4">
<div>
<h3 className="font-headline-sm text-headline-sm text-record-on-surface font-bold">Nghệ nhân Trần Duy Long</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant mt-1">Làng nghề Gốm Bát Tràng, Hà Nội</p>
</div>
<div className="pt-3 bg-record-surface-container-low p-3 rounded-lg flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-record-primary font-bold">Đề Cử Được Vinh Danh:</span>
<span className="font-body-sm text-body-sm text-record-on-surface font-medium flex items-center gap-1.5">
<RecordHolderIcon name="trophy" size={18} className="text-record-secondary" />
                Bàn Tay Vàng Kỷ Lục 2024
              </span>
</div>
</div>
</div>
<div className="honoree-card group bg-record-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col" data-category="doanh-nhan">
<div className="relative h-64 w-full overflow-hidden bg-record-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="A distinguished female Vietnamese business founder and creative innovator holding a golden lighthouse trophy at an institutional awards ceremony with red plum drapes and gold accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY8UUm59mr25wadoxzaZgeLybbYTIZkOqF0I_OQgFHagOyuIpgpHuP4Ey0GOto13uLLCjAR6F6jSMN6E_-hrKprk8dzSy9IdMOpZlIbJwTWwNAmp0YetpQLFXh4GDtDKVTGHqdQh8LKXtZcc3UV-HLXqzNWTxrhPJ2Fzlq7qFoJuKBuobthtpw77Qbzl9I9AQZsq8yVNInFgADz3h24yVkZ3b3VNu1ROLaxK17CEUJqr_VpgYj7If0" />
<div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-record-primary-container text-record-on-primary font-label-sm text-label-sm font-bold shadow-md">
              Năm 2024
            </div>
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
<div className="absolute bottom-3 left-3 right-3 text-white">
<span className="font-label-sm text-label-sm text-record-secondary-fixed uppercase font-bold tracking-wider">Doanh nghiệp Tiên phong</span>
</div>
</div>
<div className="p-5 flex flex-col flex-grow justify-between gap-4">
<div>
<h3 className="font-headline-sm text-headline-sm text-record-on-surface font-bold">Bà Nguyễn Hồng Trang</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant mt-1">Chủ tịch HĐQT Tập đoàn Dược Liệu Tự Nhiên</p>
</div>
<div className="pt-3 bg-record-surface-container-low p-3 rounded-lg flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-record-primary font-bold">Đề Cử Được Vinh Danh:</span>
<span className="font-body-sm text-body-sm text-record-on-surface font-medium flex items-center gap-1.5">
<RecordHolderIcon name="flare" size={18} className="text-record-secondary" />
                Hải Đăng Sáng Nghiệp 2024
              </span>
</div>
</div>
</div>
<div className="honoree-card group bg-record-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col" data-category="doanh-nhan">
<div className="relative h-64 w-full overflow-hidden bg-record-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Official stage ceremony presenting the prestigious Vietnam Heritage Creative Innovation award plaque to a cultural technology enterprise, warm golden spotlight and sharp plum banners." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwyCVIYXsaV9TP4uYQ0nDJqSw1eVzLr-b6eYsaq8pwUE-J5Pi3cGIplaRM0JCh_3nf16N2fW3tGcy98hOUDu2jEsN206MCEgF6P8mIHOwMWvItGpS3Q2y-iYPYV19eiWRTVJbLOqLKO3HwMgmNAwRTfaiQQTQBFZ3oFuFQbHt7O_b9w1mM_noDTfUdrLWPyD4biepV7j8VwnaUMzbcWB7CyMXEgp1wE59WhtE5v68lx9WwtJ-k_xHl" />
<div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-record-primary-container text-record-on-primary font-label-sm text-label-sm font-bold shadow-md">
              Năm 2023
            </div>
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
<div className="absolute bottom-3 left-3 right-3 text-white">
<span className="font-label-sm text-label-sm text-record-secondary-fixed uppercase font-bold tracking-wider">Tổ hợp Công nghệ Di sản</span>
</div>
</div>
<div className="p-5 flex flex-col flex-grow justify-between gap-4">
<div>
<h3 className="font-headline-sm text-headline-sm text-record-on-surface font-bold">Công ty CP Di Sản Số Đông Dương</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant mt-1">Dự án Số hóa 3D Đại Nội Huế</p>
</div>
<div className="pt-3 bg-record-surface-container-low p-3 rounded-lg flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-record-primary font-bold">Đề Cử Được Vinh Danh:</span>
<span className="font-body-sm text-body-sm text-record-on-surface font-medium flex items-center gap-1.5">
<RecordHolderIcon name="account_balance" size={18} className="text-record-secondary" />
                Đổi Mới Di Sản Việt 2023
              </span>
</div>
</div>
</div>
<div className="honoree-card group bg-record-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col" data-category="nghe-nhan">
<div className="relative h-64 w-full overflow-hidden bg-record-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="A celebrated master silk weaver from Van Phuc village holding a gold medal badge from the Vietnam Record Institute in an elegant ambient ceremony hall." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5p7JP_llg7T2p7NsSAG8NnEWaA4s1nViH9N_MTHZYnCjIicQpqS1Len5LPJ58qJqg0vCfRU11ZPZU1qb6ORshseWI1dd0zMZlZB4NSOQU8HiAqAd1CeRfsNEa13VFs5SuBLaROtEzx6tw5DijXB4pspY9cinsAFvuJpBAjuiKXAuXLwt7jwnhIIQeV1Dv9rNieL-QJ7pOrWH_9GoMK8wP6stoY_d-raSCJc_r8STmu86D7z99O5D" />
<div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-record-primary-container text-record-on-primary font-label-sm text-label-sm font-bold shadow-md">
              Năm 2023
            </div>
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
<div className="absolute bottom-3 left-3 right-3 text-white">
<span className="font-label-sm text-label-sm text-record-secondary-fixed uppercase font-bold tracking-wider">Nghệ nhân Ưu tú</span>
</div>
</div>
<div className="p-5 flex flex-col flex-grow justify-between gap-4">
<div>
<h3 className="font-headline-sm text-headline-sm text-record-on-surface font-bold">Nghệ nhân Đỗ Quang Hùng</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant mt-1">Lụa Vạn Phúc - Hà Đông</p>
</div>
<div className="pt-3 bg-record-surface-container-low p-3 rounded-lg flex flex-col gap-1">
<span className="font-label-sm text-label-sm text-record-primary font-bold">Đề Cử Được Vinh Danh:</span>
<span className="font-body-sm text-body-sm text-record-on-surface font-medium flex items-center gap-1.5">
<RecordHolderIcon name="handyman" size={18} className="text-record-secondary" />
                Huy Hiệu Tinh Hoa Nghề 2023
              </span>
</div>
</div>
</div>
</div>
</div>
</section>
<section className="w-full py-16 lg:py-24 bg-record-surface-container-high text-record-on-surface">
<div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-14">
<div className="text-center max-w-2xl mx-auto space-y-3">
<div className="inline-flex items-center gap-2 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold">
<span className="w-2 h-2 rounded-full bg-record-primary"></span>
          QUY TRÌNH CHUẨN HÓA
        </div>
<h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold">QUY TRÌNH 4 BƯỚC THẨM ĐỊNH &amp; XÁC LẬP ĐỀ CỬ KỶ LỤC</h2>
<p className="font-body-md text-body-md text-record-on-surface-variant">Đảm bảo tính pháp lý, độc lập tuyệt đối và đánh giá giá trị sáng tạo theo quy chế Viện Kỷ lục Việt Nam.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<div className="p-6 rounded-xl bg-record-surface-container-lowest shadow-sm flex flex-col justify-between gap-6 relative">
<div className="space-y-3">
<div className="flex items-center justify-between">
<span className="w-10 h-10 rounded-lg bg-record-primary text-record-on-primary font-headline-sm text-headline-sm font-bold flex items-center justify-center">01</span>
<RecordHolderIcon name="description" size={28} className="text-record-secondary" />
</div>
<h3 className="font-headline-sm text-headline-sm text-record-primary font-bold">Nộp Hồ Sơ Sơ Khảo</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant leading-relaxed">
              Tổ chức hoặc cá nhân gửi bộ hồ sơ đề cử theo biểu mẫu ban hành, đính kèm văn bằng sở hữu trí tuệ, báo cáo tài chính kiểm toán và tư liệu minh chứng.
            </p>
</div>
<div className="pt-4 bg-record-surface-container-low p-3 rounded-lg text-label-sm text-record-on-surface-variant">
<strong className="text-record-primary">Thời gian:</strong> Tiếp nhận liên tục theo đợt công bố.
          </div>
</div>
<div className="p-6 rounded-xl bg-record-surface-container-lowest shadow-sm flex flex-col justify-between gap-6 relative">
<div className="space-y-3">
<div className="flex items-center justify-between">
<span className="w-10 h-10 rounded-lg bg-record-primary text-record-on-primary font-headline-sm text-headline-sm font-bold flex items-center justify-center">02</span>
<RecordHolderIcon name="psychology" size={28} className="text-record-secondary" />
</div>
<h3 className="font-headline-sm text-headline-sm text-record-primary font-bold">HĐ Khoa Học Thẩm Định</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant leading-relaxed">
              Hội đồng Khoa học gồm các Giáo sư, Nhà nghiên cứu họp phiên chuyên đề đánh giá tính xác thực, đóng góp xã hội và giá trị độc bản của đề cử.
            </p>
</div>
<div className="pt-4 bg-record-surface-container-low p-3 rounded-lg text-label-sm text-record-on-surface-variant">
<strong className="text-record-primary">Thời gian:</strong> 15 – 20 ngày làm việc.
          </div>
</div>
<div className="p-6 rounded-xl bg-record-surface-container-lowest shadow-sm flex flex-col justify-between gap-6 relative">
<div className="space-y-3">
<div className="flex items-center justify-between">
<span className="w-10 h-10 rounded-lg bg-record-primary text-record-on-primary font-headline-sm text-headline-sm font-bold flex items-center justify-center">03</span>
<RecordHolderIcon name="travel_explore" size={28} className="text-record-secondary" />
</div>
<h3 className="font-headline-sm text-headline-sm text-record-primary font-bold">Khảo Sát Thực Địa</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant leading-relaxed">
              Đoàn Thư ký và Giám định viên trực tiếp xuống cơ sở, xưởng sản xuất, viện nghiên cứu để kiểm tra quy trình thực tế và phỏng vấn nhân chứng.
            </p>
</div>
<div className="pt-4 bg-record-surface-container-low p-3 rounded-lg text-label-sm text-record-on-surface-variant">
<strong className="text-record-primary">Biên bản:</strong> Lập biên bản giám định thực tế.
          </div>
</div>
<div className="p-6 rounded-xl bg-record-surface-container-lowest shadow-sm flex flex-col justify-between gap-6 relative">
<div className="space-y-3">
<div className="flex items-center justify-between">
<span className="w-10 h-10 rounded-lg bg-record-secondary-container text-record-on-secondary-container font-headline-sm text-headline-sm font-bold flex items-center justify-center">04</span>
<RecordHolderIcon name="military_tech" size={28} filled className="text-record-primary" />
</div>
<h3 className="font-headline-sm text-headline-sm text-record-primary font-bold">Công Bố &amp; Xác Lập Kỷ Lục</h3>
<p className="font-body-sm text-body-sm text-record-on-surface-variant leading-relaxed">
              Ban hành Nghị quyết Vinh danh, cấp Bằng chứng nhận, Huy chương vàng và truyền thông chính thống tại Đại hội Kỷ lục Gia Toàn Quốc.
            </p>
</div>
<div className="pt-4 bg-record-surface-container-low p-3 rounded-lg text-label-sm text-record-on-surface-variant">
<strong className="text-record-primary">Địa điểm:</strong> Khách sạn Rex / Dinh Độc Lập / Hà Nội.
          </div>
</div>
</div>
</div>
</section>
</div>
  )
}
