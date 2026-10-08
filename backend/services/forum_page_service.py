from typing import Any, Dict, Optional
from repositories import base_repo, forum_page_repository
from utils.error import NotFoundError
from models.PageModel import Page


DEFAULT_FORUM_HEADER = {
    "top_back_text": "Quay lại Cổng TTCN Sáng tạo",
    "top_back_link": "/",
    "top_slogan": "Chứng thực giá trị • Kiến tạo tài sản • Trao truyền ý chí",
    "top_hotline": "028.3847.7899",
    "logo_image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDsDJlGgOB3I3cw5G9GnuTFV_gYRilNrpep9_oTJ4gGyLoIAcH5db0gCUdMKWvsSKIRxI-ittCGulqOvVQf3Btj3pWOfkFHPn8dbBp87IW8KAx7xmioBz7D56ZSOh2RSuRrkm7LiImKyPamQyYHY0uRgy16hnuUUvsLX61AWTBgHIKuMZDyoP6jtlm2XD4KKCOwShzDi6_pPkSJkucZQN4wdFCJoXlErze1lqpBht-R2ee_Cvde2hrN1HxyKKG_M7wUpQ",
    "brand_title": "DIỄN ĐÀN KINH TẾ KỶ LỤC",
    "brand_subtitle": "Vietnam Record Economic Forum",
    "nav_items": [
        {"label": "Giới thiệu & Mục tiêu", "href": "#muc-tieu"},
        {"label": "Diễn giả", "href": "#dien-gia"},
        {"label": "Hoạt động", "href": "#chuong-trinh"},
        {"label": "Giải thưởng", "href": "#giai-thuong"},
        {"label": "Đơn vị tổ chức & Tài trợ", "href": "#doi-tac"},
    ],
    "button_text": "Đăng ký tham dự",
    "button_link": "#dang-ky",
    "show_user_icon": True,
}

DEFAULT_FORUM_HERO = {
    "badge": "HỘI NGHỊ THƯỢNG ĐỈNH KINH TẾ KỶ LỤC TOÀN QUỐC",
    "title": "DIỄN ĐÀN KINH TẾ KỶ LỤC 2026",
    "subtitle": "RECORD ECONOMIC FORUM",
    "motto": "“Chứng thực giá trị – Kiến tạo tài sản – Trao truyền ý chí”",
    "event_date": "Tháng 10/2026 (Phiên Toàn thể)",
    "event_location": "Trung tâm Hội nghị Quốc gia",
    "top_logo_image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDsDJlGgOB3I3cw5G9GnuTFV_gYRilNrpep9_oTJ4gGyLoIAcH5db0gCUdMKWvsSKIRxI-ittCGulqOvVQf3Btj3pWOfkFHPn8dbBp87IW8KAx7xmioBz7D56ZSOh2RSuRrkm7LiImKyPamQyYHY0uRgy16hnuUUvsLX61AWTBgHIKuMZDyoP6jtlm2XD4KKCOwShzDi6_pPkSJkucZQN4wdFCJoXlErze1lqpBht-R2ee_Cvde2hrN1HxyKKG_M7wUpQ",
    "banner_image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDsDJlGgOB3I3cw5G9GnuTFV_gYRilNrpep9_oTJ4gGyLoIAcH5db0gCUdMKWvsSKIRxI-ittCGulqOvVQf3Btj3pWOfkFHPn8dbBp87IW8KAx7xmioBz7D56ZSOh2RSuRrkm7LiImKyPamQyYHY0uRgy16hnuUUvsLX61AWTBgHIKuMZDyoP6jtlm2XD4KKCOwShzDi6_pPkSJkucZQN4wdFCJoXlErze1lqpBht-R2ee_Cvde2hrN1HxyKKG_M7wUpQ",
    "primary_button_text": "Đăng ký tham dự",
    "primary_button_link": "#dang-ky",
    "secondary_button_text": "Khám phá mục tiêu",
    "secondary_button_link": "#muc-tieu",
}

DEFAULT_FORUM_PILLARS = {
    "tag": "TÔN CHỈ & MỤC ĐÍCH HÀNH ĐỘNG",
    "title": "Bốn Trụ Cột Chiến Lược 2026",
    "description": "Thiết lập nền tảng chuyển hóa các kỷ lục đỉnh cao thành giá trị thặng dư bền vững, nâng tầm thương hiệu quốc gia trên thị trường toàn cầu.",
    "pillars": [
        {
            "id": 1,
            "pillar_no": "TRỤ CỘT 01",
            "title": "Định vị & Khẳng định Giá trị Thương hiệu",
            "description": "Chuẩn hóa hồ sơ và bảo chứng giá trị doanh nghiệp thông qua hệ thống tiêu chí kỷ lục quốc gia & quốc tế, tạo lập lợi thế cạnh tranh độc bản.",
            "tag": "Nền tảng Tinh hoa",
            "icon": "shield-check",
            "action_text": "Tiêu chuẩn VietKings",
            "action_link": "#",
        },
        {
            "id": 2,
            "pillar_no": "TRỤ CỘT 02",
            "title": "Chuyển Hóa Kỷ Lục Thành Tài Sản",
            "description": "Mô hình hóa và định giá tài sản vô hình, tài sản số từ danh hiệu kỷ lục nhằm huy động vốn, phát hành cổ phiếu và mở rộng quy mô vốn hóa.",
            "tag": "Khai phóng Giá trị",
            "icon": "badge-dollar-sign",
            "action_text": "Thương mại hóa Sở hữu Trí tuệ",
            "action_link": "#",
        },
        {
            "id": 3,
            "pillar_no": "TRỤ CỘT 03",
            "title": "Kết Nối Hệ Sinh Thái Lãnh Đạo",
            "description": "Xây dựng mạng lưới liên kết chiến lược giữa các kỷ lục gia, nhà khởi nghiệp tài năng, các quỹ đầu tư tư nhân và chuyên gia kinh tế hàng đầu.",
            "tag": "Mạng lưới Hội tụ",
            "icon": "users",
            "action_text": "Mạng lưới Lãnh đạo Tinh hoa",
            "action_link": "#",
        },
        {
            "id": 4,
            "pillar_no": "TRỤ CỘT 04",
            "title": "Đổi Mới Sáng Tạo & Kinh Tế Tri Thức",
            "description": "Khởi xướng các sáng kiến công nghiệp văn hóa và kinh tế số, biến trí tuệ bản địa thành nguồn lực nội sinh đột phá cho kỷ nguyên số.",
            "tag": "Bền vững Quốc gia",
            "icon": "lightbulb",
            "action_text": "Phát triển Bền vững",
            "action_link": "#",
        },
    ],
}

DEFAULT_FORUM_SPEAKERS = {
    "tag": "HỘI ĐỒNG DIỄN GIẢ THƯỢNG ĐỈNH",
    "title": "Những Bộ Óc Chiến Lược & Chuyên Gia Cố Vấn",
    "description": "Lắng nghe phân tích chuyên sâu và khuyến nghị chính sách từ các nhà lãnh đạo viện nghiên cứu, cựu lãnh đạo bộ ngành cùng các nhà hoạch định chiến lược.",
    "speakers": [
        {
            "id": 1,
            "name": "GS. TS. Hoàng Quang Thuận",
            "role": "VIỆN TRƯỞNG • TRƯỞNG BAN CỐ VẤN DIỄN ĐÀN",
            "topic": "“Tầm nhìn kinh tế kỷ lục và giá trị văn hóa quốc gia”",
            "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            "icon_badge": "graduation-cap",
        },
        {
            "id": 2,
            "name": "TS. Lê Doãn Hợp",
            "role": "NGUYÊN BỘ TRƯỞNG • CT HĐ XÁC LẬP KỶ LỤC VN",
            "topic": "“Kinh tế sáng tạo và chiến lược phát triển tài sản vô hình”",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            "icon_badge": "landmark",
        },
        {
            "id": 3,
            "name": "TS. Thang Văn Phúc",
            "role": "NGUYÊN THỨ TRƯỞNG • CT TW HỘI KỶ LỤC GIA VN",
            "topic": "“Thể chế và động lực cho các doanh nghiệp tiên phong”",
            "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
            "icon_badge": "gavel",
        },
    ],
}

DEFAULT_FORUM_AGENDA = {
    "tag": "CHƯƠNG TRÌNH NGHỊ SỰ TOÀN DIỆN",
    "title": "Lịch Trình 4 Phiên Làm Việc Chủ Chốt",
    "description": "Diễn đàn được thiết kế thành chuỗi các phiên đối thoại đỉnh cao, không gian xúc tiến thương mại và đêm tiệc vinh danh tinh hoa doanh nghiệp Việt Nam.",
    "certificate_title": "Chứng nhận Đại biểu Tham dự",
    "certificate_subtitle": "Cấp bởi Viện Kỷ lục Việt Nam & WorldKings",
    "sessions": [
        {
            "id": 1,
            "session_no": "PHIÊN 01 • 08:30 - 11:30",
            "location": "Hội trường Thống Nhất A",
            "hall_icon": "building",
            "title": "Khai mạc & Tọa đàm Cấp cao: Định vị Kinh tế Kỷ lục trong Kỷ nguyên Mới",
            "description": "Phát biểu chỉ đạo định hướng từ các nguyên lãnh đạo chính phủ, báo cáo tổng quan về vị thế kỷ lục Việt Nam và công bố khung tiêu chí xác lập tài sản kinh tế kỷ lục.",
            "tags": ["Phát biểu khai mạc", "Báo cáo Chiến lược Viện", "Thảo luận chính sách"],
            "accent_color": "primary",
        },
        {
            "id": 2,
            "session_no": "PHIÊN 02 • 13:30 - 15:30",
            "location": "Phòng Hội thảo Quốc tế B",
            "hall_icon": "building",
            "title": "Diễn đàn Bàn tròn Doanh nghiệp: Chuyển giao Công nghệ & Tạo lập Tài sản Số",
            "description": "Tọa đàm bàn tròn đa phương với các tập đoàn công nghệ và tổ chức kiểm toán quốc tế, nghiên cứu bài toán số hóa dữ liệu kỷ lục và bảo chứng bản quyền trí tuệ số.",
            "tags": ["Số hóa Kỷ lục", "Thẩm định Tài sản Vô hình", "Bảo hộ Quốc tế"],
            "accent_color": "primary",
        },
        {
            "id": 3,
            "session_no": "PHIÊN 03 • SUỐT NGÀY HỘI NGHỊ",
            "location": "Đại sảnh Triển lãm Grand Atrium",
            "hall_icon": "layout",
            "title": "Không gian Triển lãm & Trưng bày Thành tựu Kỷ lục Sáng tạo (B2B Matching)",
            "description": "Giao thương trực tiếp giữa hơn 100 gian hàng thương hiệu kỷ lục đặc sắc, kết nối các nhà đầu tư tổ chức, doanh nghiệp phân phối và chuỗi cung ứng cao cấp.",
            "tags": ["Không gian Gian hàng VIP", "Bàn đàm phán 1:1", "Trải nghiệm Hiện vật Kỷ lục"],
            "accent_color": "primary",
        },
        {
            "id": 4,
            "session_no": "PHIÊN 04 • 18:30 - 21:30",
            "location": "Dạ tiệc Hoàng Gia Ballroom",
            "hall_icon": "glass-water",
            "title": "Dạ tiệc Networking & Ký kết Hợp tác Chiến lược Giữa Các Tập Đoàn",
            "description": "Lễ trao kỷ lục kinh tế 2026, chứng kiến các biên bản ghi nhớ hợp tác đầu tư (MOU) quy mô ngàn tỷ và dạ tiệc kết nối thượng lưu của giới tinh hoa.",
            "tags": ["Ký kết MOU Đầu tư", "Dạ tiệc Tinh hoa", "Vinh danh Giải thưởng"],
            "accent_color": "primary",
        },
    ],
}

DEFAULT_FORUM_AWARDS = {
    "tag": "Tôn Vinh Tinh Hoa & Thành Tựu",
    "title": "Hệ Thống Giải Thưởng Vinh Danh 2026",
    "description": "Biểu tượng danh giá chứng nhận đóng góp xuất sắc của doanh nghiệp và doanh nhân tiên phong trong sự nghiệp xác lập kỷ lục và kiến tạo di sản kinh tế.",
    "award_ids": [],
}

DEFAULT_FORUM_PARTNERS = {
    "organizers_tag": "Đơn Vị Chủ Trì & Sáng Lập",
    "organizers": [
        {
            "name": "VIỆN KỶ LỤC VIỆT NAM (VIETKINGS)",
            "desc": "Tổ chức xác lập và quản lý hệ thống kỷ lục quốc gia",
            "tier": "Đơn vị Sáng lập",
            "icon": "stars",
            "image": "",
        },
        {
            "name": "TRUNG TÂM CÔNG NGHIỆP SÁNG TẠO",
            "desc": "Đơn vị điều phối và xúc tiến thương mại hóa di sản kỷ lục",
            "tier": "Đơn vị Điều phối",
            "icon": "military_tech",
            "image": "",
        },
    ],
    "sponsors_tag": "Đơn Vị Đồng Hành Chiến Lược & Tài Trợ",
    "sponsors": [
        {
            "name": "PETROVIETNAM",
            "desc": "Tập đoàn Năng lượng Quốc gia",
            "tier": "Kim Cương",
            "icon": "verified",
            "image": "",
        },
        {
            "name": "VINAMILK",
            "desc": "Thương hiệu Dinh dưỡng Kỷ lục",
            "tier": "Bạch Kim",
            "icon": "verified",
            "image": "",
        },
        {
            "name": "VIETCOMBANK",
            "desc": "Ngân hàng Thương mại Tiên phong",
            "tier": "Vàng",
            "icon": "verified",
            "image": "",
        },
        {
            "name": "TH GROUP",
            "desc": "Tập đoàn Nông nghiệp Công nghệ cao",
            "tier": "Đồng hành",
            "icon": "verified",
            "image": "",
        },
        {
            "name": "TRUNG NGUYÊN LEGEND",
            "desc": "Thương hiệu Cà phê Toàn cầu",
            "tier": "Đồng hành",
            "icon": "verified",
            "image": "",
        },
        {
            "name": "FPT CORPORATION",
            "desc": "Tập đoàn Công nghệ Chuyển đổi số",
            "tier": "Đồng hành",
            "icon": "verified",
            "image": "",
        },
    ],
}

DEFAULT_FORUM_REGISTRATION = {
    "tag": "Đăng Ký Tham Dự",
    "title": "Đăng Ký Tham Dự Diễn Đàn Kinh Tế Kỷ Lục 2026",
    "description": "Vui lòng hoàn thiện thông tin dưới đây để Ban Tổ chức chuẩn bị chu đáo và gửi thẻ đại biểu chính thức.",
    "hotline": "028.3847.7899",
    "email": "bandoingoai@kinhtekyluc.vn",
    "address": "Trung tâm Hội nghị Quốc gia, Hà Nội / TP. Hồ Chí Minh",
    "privacy_text": "Thông tin của quý đại biểu được bảo mật và chỉ sử dụng cho công tác tổ chức diễn đàn.",
    "button_text": "Xác Nhận Đăng Ký",
    "form_fields": [
        {
            "id": "fullName",
            "label": "Họ và tên đại biểu",
            "type": "text",
            "placeholder": "Nguyễn Văn A",
            "required": True,
            "width": "half",
        },
        {
            "id": "phone",
            "label": "Số điện thoại liên hệ",
            "type": "tel",
            "placeholder": "0912 345 678",
            "required": True,
            "width": "half",
        },
        {
            "id": "email",
            "label": "Địa chỉ email công vụ",
            "type": "email",
            "placeholder": "daibieu@tochuc.vn",
            "required": True,
            "width": "full",
        },
        {
            "id": "organization",
            "label": "Cơ quan / Doanh nghiệp",
            "type": "text",
            "placeholder": "Tên cơ quan / doanh nghiệp",
            "required": False,
            "width": "half",
        },
        {
            "id": "position",
            "label": "Chức danh / Chức vụ",
            "type": "text",
            "placeholder": "Chức danh / chức vụ",
            "required": False,
            "width": "half",
        },
        {
            "id": "session",
            "label": "Phiên hội nghị đăng ký tham dự",
            "type": "select",
            "placeholder": "Chọn phiên tham dự",
            "options": [
                "Toàn bộ 4 phiên làm việc",
                "Phiên I & II - Hội nghị Chiến lược",
                "Phiên III - Triển lãm & Kết nối B2B",
                "Phiên IV - Gala Vinh danh Doanh nghiệp",
            ],
            "required": True,
            "width": "full",
        },
    ],
}


def _get_forum_page(page_id: Optional[int] = None) -> Page:
    page = None
    if page_id is not None:
        page = base_repo.getPageById(page_id)
    if not page or page.slug != "forum":
        page = base_repo.getPageBySlug("forum")
    if not page:
        page = base_repo.getPageById(8)
    if not page:
        raise NotFoundError("Không tìm thấy trang Diễn đàn Kinh tế Kỷ lục")
    return page


def _merge_forum_defaults(props: Dict[str, Any]) -> Dict[str, Any]:
    merged = dict(props or {})
    if not merged.get("header_section"):
        merged["header_section"] = DEFAULT_FORUM_HEADER
    if not merged.get("hero_section"):
        merged["hero_section"] = DEFAULT_FORUM_HERO
    if not merged.get("pillars_section"):
        merged["pillars_section"] = DEFAULT_FORUM_PILLARS
    if not merged.get("speakers_section"):
        merged["speakers_section"] = DEFAULT_FORUM_SPEAKERS
    if not merged.get("agenda_section"):
        merged["agenda_section"] = DEFAULT_FORUM_AGENDA
    if not merged.get("awards_section"):
        merged["awards_section"] = DEFAULT_FORUM_AWARDS
    if not merged.get("partners_section"):
        merged["partners_section"] = DEFAULT_FORUM_PARTNERS
    if not merged.get("registration_section"):
        merged["registration_section"] = DEFAULT_FORUM_REGISTRATION
    else:
        # If registration_section exists but lacks form_fields, inject default form_fields
        if "form_fields" not in merged["registration_section"] or not merged["registration_section"]["form_fields"]:
            merged["registration_section"]["form_fields"] = DEFAULT_FORUM_REGISTRATION["form_fields"]
    return merged


def get_forum_page(page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    props = _merge_forum_defaults(page.props or {})

    return {
        "id": page.id,
        "name": page.name,
        "slug": page.slug,
        "props": props,
        "created_date": page.created_date.isoformat() if hasattr(page, "created_date") and page.created_date else None,
        "updated_date": page.updated_date.isoformat() if hasattr(page, "updated_date") and page.updated_date else None,
    }


def update_forum_page(page_id: Optional[int] = None, data: Any = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    name = data.get("name") if isinstance(data, dict) else getattr(data, "name", None)
    slug = data.get("slug") if isinstance(data, dict) else getattr(data, "slug", None)
    props = data.get("props") if isinstance(data, dict) else getattr(data, "props", None)

    page = base_repo.updatePage(page=page, name=name, slug=slug, props=props)
    return get_forum_page(page.id)


def update_header_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_header(page=page, data=data)


def update_hero_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_hero(page=page, data=data)


def update_pillars_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_pillars(page=page, data=data)


def update_speakers_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_speakers(page=page, data=data)


def update_agenda_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_agenda(page=page, data=data)


def update_awards_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_awards(page=page, data=data)


def update_partners_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_partners(page=page, data=data)


def update_registration_section(data: Any, page_id: Optional[int] = None) -> Dict[str, Any]:
    page = _get_forum_page(page_id)
    return forum_page_repository.update_registration(page=page, data=data)
