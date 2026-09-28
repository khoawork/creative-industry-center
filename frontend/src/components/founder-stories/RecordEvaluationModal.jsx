import { useState } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Scale,
  Sparkles,
  Download,
  Send,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const RecordEvaluationModal = ({ isOpen, onClose, onOpenSubmitModal }) => {
  const [activeSection, setActiveSection] = useState('criteria'); // 'criteria' | 'process' | 'dossier' | 'benefits'

  if (!isOpen) return null;

  const sections = [
    { id: 'criteria', label: 'Tiêu chuẩn & Tiêu chí', icon: Scale },
    { id: 'process', label: 'Quy trình 4 bước', icon: Layers },
    { id: 'dossier', label: 'Hồ sơ yêu cầu', icon: FileText },
    { id: 'benefits', label: 'Quyền lợi xác lập', icon: Award },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#faf8f5] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-amber-900/20 flex flex-col relative">
        
        <div className="bg-gradient-to-r from-[#590108] via-[#710008] to-[#430005] text-white p-5 sm:p-6 shrink-0 border-b-2 border-[#d49520]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d49520] to-[#b87d14] text-white flex items-center justify-center shadow-md shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest">
                    HỘI ĐỒNG THẨM ĐỊNH KỶ LỤC & ĐỔI MỚI SÁNG TẠO
                  </span>
                  <span className="hidden sm:inline-block bg-amber-400/20 text-amber-200 text-[10px] px-2 py-0.2 rounded-full border border-amber-400/30">
                    Ban hành 2026
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight uppercase mt-0.5 text-white">
                  QUY CHẾ XÉT DUYỆT KỶ LỤC & TÔN VINH SÁNG NGHIỆP
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Đóng"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sub navigation tabs inside modal */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto scrollbar-none pt-1">
            {sections.map((sec) => {
              const IconComp = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#d49520] text-white shadow-xs'
                      : 'bg-white/10 text-amber-100 hover:bg-white/20'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 text-[#2d2a29]">
          
          <div className="bg-white p-4 rounded-xl border border-[#ede5d8] shadow-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#710008] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#710008] uppercase tracking-wide">
                  Mục đích & Nguyên tắc cốt lõi
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed text-justify font-normal">
                  Quy chế này quy định nguyên tắc, tiêu chí và quy trình xét duyệt ghi danh, xác lập kỷ lục và tôn vinh các nhà sáng nghiệp, nghệ nhân, doanh nghiệp khởi nghiệp đổi mới sáng tạo tại Việt Nam. Quá trình xét duyệt đảm bảo tính <strong>minh bạch, khách quan, tôn trọng giá trị bản địa</strong> và <strong>tác động thực chất đến cộng đồng</strong>.
                </p>
              </div>
            </div>
          </div>

          {activeSection === 'criteria' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base sm:text-lg font-bold text-[#710008]  border-b border-[#e2d7c7] pb-2 flex items-center justify-between">
                <span>5 Tiêu chí Đánh giá & Xét duyệt Kỷ lục</span>
                <span className="text-xs font-sans text-gray-500 font-normal">Thang điểm 100</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] space-y-1.5 hover:border-[#d49520] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d49520] uppercase tracking-wider">Tiêu chí 01</span>
                    <span className="text-xs font-bold text-[#710008] bg-red-50 px-2 py-0.5 rounded">Trọng số 25%</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Tính Độc bản & Sáng tạo Tiên phong</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    Sản phẩm, công trình hoặc giải pháp mang tính đột phá, phục dựng thành công kỹ nghệ cổ truyền thất truyền, hoặc ứng dụng công nghệ tiên tiến chưa từng có tiền lệ.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] space-y-1.5 hover:border-[#d49520] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d49520] uppercase tracking-wider">Tiêu chí 02</span>
                    <span className="text-xs font-bold text-[#710008] bg-red-50 px-2 py-0.5 rounded">Trọng số 25%</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Hàm lượng Bản sắc & Di sản Dân tộc</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    Khai thác và làm giàu nguồn lực văn hóa, tri thức dân gian bản địa, sử dụng nguyên liệu tự nhiên hoặc bảo tồn nghệ thuật thủ công truyền thống của Việt Nam.
                  </p>
                </div>

                {/* Criterion 3 */}
                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] space-y-1.5 hover:border-[#d49520] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d49520] uppercase tracking-wider">Tiêu chí 03</span>
                    <span className="text-xs font-bold text-[#710008] bg-red-50 px-2 py-0.5 rounded">Trọng số 20%</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Quy mô & Năng lực Thực thi Thực tế</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    Thời gian vận hành liên tục tối thiểu 12 tháng; có dữ liệu kiểm chứng độc lập về sản lượng, số lượng nghệ nhân tham gia hoặc dung lượng thị trường trong và ngoài nước.
                  </p>
                </div>

                {/* Criterion 4 */}
                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] space-y-1.5 hover:border-[#d49520] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d49520] uppercase tracking-wider">Tiêu chí 04</span>
                    <span className="text-xs font-bold text-[#710008] bg-red-50 px-2 py-0.5 rounded">Trọng số 20%</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Tác động Xã hội & Phát triển Bền vững</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    Tạo sinh kế ổn định cho lao động yếu thế, nông dân vùng sâu vùng xa; áp dụng quy trình sản xuất tuần hoàn, thân thiện môi trường, giảm phát thải carbon.
                  </p>
                </div>
              </div>

              {/* Criterion 5 Full-width */}
              <div className="bg-white p-4 rounded-xl border border-[#ede5d8] space-y-1 hover:border-[#d49520] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#d49520] uppercase tracking-wider">Tiêu chí 05: Liêm chính & Pháp lý</span>
                  <span className="text-xs font-bold text-[#710008] bg-red-50 px-2 py-0.5 rounded">Trọng số 10% (Điều kiện tiên quyết)</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">Tuân thủ Pháp luật & Sở hữu Trí tuệ</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Có đầy đủ tư cách pháp nhân hợp lệ, không tranh chấp thương hiệu, vi phạm bản quyền tác giả hoặc vi phạm các quy định an toàn vệ sinh môi trường.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 2: PROCESS */}
          {activeSection === 'process' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base sm:text-lg font-bold text-[#710008]  border-b border-[#e2d7c7] pb-2">
                Quy trình 4 Bước Xét duyệt Kỷ lục
              </h3>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#710008] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">Tiếp nhận & Thẩm tra Sơ bộ (3 - 5 Ngày làm việc)</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed text-justify">
                      Ban thư ký tiếp nhận hồ sơ đăng ký trực tuyến hoặc văn bản, tiến hành đối chiếu danh mục giấy tờ pháp lý và yêu cầu bổ sung nếu còn thiếu sót.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#710008] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">Khảo sát Thực địa & Kiểm chứng Dữ liệu (7 - 10 Ngày làm việc)</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed text-justify">
                      Đoàn chuyên gia thẩm định trực tiếp tới xưởng sản xuất, vùng nguyên liệu hoặc phòng thí nghiệm để quan sát quy trình, phỏng vấn nhân sự và đo lường thông số thực tế.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#710008] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">Họp Hội đồng Khoa học & Bỏ phiếu Thẩm định</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed text-justify">
                      Hội đồng thẩm định gồm các nhà nghiên cứu, nghệ nhân nhân dân, đại diện bộ ngành chuyên môn phản biện và bỏ phiếu kín. Hồ sơ đạt từ 80/100 điểm được thông qua.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#d49520] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">Công bố Xác lập Kỷ lục & Trao Bằng Tôn vinh</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed text-justify">
                      Ban tổ chức ban hành quyết định xác lập kỷ lục chính thức, tổ chức lễ tôn vinh và lưu trữ hồ sơ vĩnh viễn trên Cổng dữ liệu Công nghiệp Sáng tạo Quốc gia.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: DOSSIER */}
          {activeSection === 'dossier' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base sm:text-lg font-bold text-[#710008]  border-b border-[#e2d7c7] pb-2">
                Hồ sơ & Tài liệu Yêu cầu Cung cấp
              </h3>

              <div className="bg-white p-5 rounded-xl border border-[#ede5d8] space-y-3">
                <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>1. Đơn đề nghị xác lập kỷ lục:</strong> Theo mẫu số 01/CIC ban hành kèm quy chế này.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>2. Hồ sơ pháp nhân:</strong> Giấy chứng nhận Đăng ký Doanh nghiệp, Hợp tác xã hoặc Quyết định công nhận Nghệ nhân.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>3. Báo cáo thuyết minh thành tựu:</strong> Mô tả chi tiết hành trình, công thức, quy trình công nghệ, số liệu doanh thu và quy mô việc làm tạo ra.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>4. Tài liệu kiểm chứng trực quan:</strong> Hình ảnh có độ phân giải cao, video tư liệu ghi hình công đoạn thủ công/công nghệ, các bài báo khoa học hoặc giải thưởng uy tín.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>5. Giấy tờ sở hữu trí tuệ:</strong> Bằng độc quyền sáng chế, giải pháp hữu ích, nhãn hiệu hoặc cam kết không xâm phạm quyền của bên thứ ba.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* SECTION 4: BENEFITS */}
          {activeSection === 'benefits' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-base sm:text-lg font-bold text-[#710008]  border-b border-[#e2d7c7] pb-2">
                Quyền lợi Dành cho Nhà Sáng Nghiệp Được Vinh Danh
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#b87d14] flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Bằng Xác Lập Kỷ Lục Quốc Gia</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    Cấp Bằng chứng nhận và Kỷ niệm chương mạ vàng từ Hội đồng Thẩm định, gia tăng uy tín thương hiệu trên trường quốc tế.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-[#710008] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Bảo trợ Truyền thông Độc quyền</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    Được xuất bản chuyên trang phóng sự truyền hình, phát hành sách ảnh và lưu trữ vĩnh viễn trên Cổng Di sản Sáng tạo.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Kết nối Nguồn vốn & Thị trường</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    Ưu tiên tiếp cận Quỹ Hỗ trợ Sáng kiến Bản địa và tham gia các đoàn xúc tiến thương mại quốc tế tại EU, Nhật Bản, Mỹ.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#ede5d8] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">Bảo hộ Pháp lý & Sở hữu Trí tuệ</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    Tư vấn miễn phí đăng ký bảo hộ chỉ dẫn địa lý, nhãn hiệu tập thể và bản quyền tác phẩm nghệ thuật.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="bg-white border-t border-[#e2d7c7] px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#d49520]" />
            <span>Kỳ xét duyệt gần nhất: Quý IV / 2026</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                alert('Tải xuống tài liệu Quy chế Xét duyệt Kỷ lục (File PDF - 1.2 MB)');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gray-600" />
              <span>Tải file PDF</span>
            </button>

          
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecordEvaluationModal;
