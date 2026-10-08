import datetime
import argparse
from copy import deepcopy
import sys
from types import SimpleNamespace

from dto import contact_dto, event_dto

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

from sqlalchemy import or_
from sqlalchemy.orm.attributes import flag_modified
from extensions import db
from models import (
    Award,
    Event,
    EventCategory,
    Page,
    Project,
    ProjectCategory,
    Record,
    Training,
    User,
)
from dto.home_dto import (
    AboutSectionRequestDTO,
    HeroSectionRequestDTO,
    NavSectionRequestDTO,
    SupportBannerRequestDTO,
)
from dto import (
    award_dto,
    project_dto,
    project_page_dto,
    record_dto,
    training_dto,
    training_page_dto,
)
from models.EventModel import EventStatus
from models.UserModel import RoleEnum
from dto import introduce_dto
from app import create_app
from forum_seed_data import (
    DEFAULT_FORUM_AGENDA,
    DEFAULT_FORUM_AWARDS,
    DEFAULT_FORUM_HEADER,
    DEFAULT_FORUM_HERO,
    DEFAULT_FORUM_PARTNERS,
    DEFAULT_FORUM_PILLARS,
    DEFAULT_FORUM_REGISTRATION,
    DEFAULT_FORUM_SPEAKERS,
)


def _dto_data(schema, payload):
    def to_builtin(value):
        if isinstance(value, SimpleNamespace):
            return {key: to_builtin(item) for key, item in vars(value).items()}
        if isinstance(value, dict):
            return {key: to_builtin(item) for key, item in value.items()}
        if isinstance(value, list):
            return [to_builtin(item) for item in value]
        return value

    return to_builtin(schema.load(payload))


# Nội dung đầu trang theo mẫu Events; chỉ bổ sung các trường chưa có trong DB.
EVENTS_HERO_EVENT = {
    "breadcrumbs": [
        {"text": "Trang chủ", "link": "/"},
        {"text": "Sự kiện & Diễn đàn", "link": None},
    ],
    "badge": "VIETKINGS • LỊCH TRÌNH QUỐC GIA",
    "title": "SỰ KIỆN & HOẠT ĐỘNG",
    "description": "Không gian kết nối tri thức đỉnh cao, nơi tôn vinh những kỳ tích sáng tạo, hội ngộ các kỷ lục gia, nhà khoa học và doanh nhân sáng nghiệp hàng đầu Việt Nam.",
    "statistics": [
        {"icon": "calendar", "value": "54+ Kỳ", "label": "Hội ngộ Kỷ lục"},
        {"icon": "users", "value": "12.000+", "label": "Đại biểu tham gia"},
        {"icon": "certificate", "value": "3.200+", "label": "Bằng chứng nhận"},
        {"icon": "building", "value": "63 Tỉnh/TP", "label": "Quy mô bảo trợ"},
    ],
}
EVENTS_FILTER_EVENT = {
    "status_filters": [
        {"statuses": ["ALL"], "label": "Tất cả sự kiện"},
        {"statuses": ["REGISTRATION_OPEN", "UPCOMING"], "label": "Đang diễn ra & Sắp tới"},
        {"statuses": ["REGISTRATION_OPEN"], "label": "Đang mở đăng ký"},
    ],
    "search_placeholder": "Tìm tên sự kiện...",
    "show_year_filter": True,
}
NEWSLETTER_EVENT = {
    "tag": "BẢN TIN VIỆN KỶ LỤC",
    "title": "Đăng Ký Nhận Thông Báo Sự Kiện Sớm",
    "description": "Nhận thư mời ưu tiên, tài liệu kỷ yếu và thông cáo báo chí chính thức trực tiếp từ Ban Thư ký Trung tâm Công nghiệp Sáng tạo.",
    "privacy_text": "Bảo mật thông tin theo tiêu chuẩn viện nghiên cứu quốc gia.",
    "full_name_label": "Họ và tên", "full_name_placeholder": "Nguyễn Văn A",
    "organization_label": "Đơn vị / Doanh nghiệp", "organization_placeholder": "Tổ chức / Doanh nghiệp",
    "email_label": "Địa chỉ Email đại biểu", "email_placeholder": "daibieu@tochuc.vn",
    "consent_text": "Tôi đồng ý tiếp nhận các tài liệu và thông tri sự kiện từ VIETKINGS.",
    "button_text": "Xác Nhận Đăng Ký Thông Báo",
    "success_message": "Cảm ơn Quý vị! Đăng ký nhận thông tin sự kiện đã được ghi nhận.",
}
EVENT_DATES_EVENT = {
    "Hội ngộ Kỷ lục gia Việt Nam lần thứ 54: Tôn vinh Sáng tạo Quốc gia": datetime.date(2025, 5, 15),
    "Không Gian Trưng Bày Tinh Hoa Thủ Công Mỹ Nghệ Đạt Kỷ Lục": datetime.date(2025, 5, 28),
    'Tọa đàm: "Tài sản Vô hình & Định giá Thương hiệu Kỷ lục"': datetime.date(2025, 6, 8),
}

CONTACT_PAGE_PROPS = {
    "intro": {
        "badge": "Ban Thư Ký & Tiếp Nhận Hồ Sơ",
        "title": "Liên hệ",
        "description": "Trung tâm Công nghiệp Sáng tạo luôn sẵn sàng lắng nghe, tư vấn và đồng hành cùng các tổ chức, doanh nghiệp và cá nhân trên hành trình đổi mới sáng tạo.",
    },
    "contact": {
        "organization": "Trung tâm Công nghiệp Sáng tạo",
        "address": "Trung tâm Công nghiệp Sáng tạo, Viện Kỷ lục Việt Nam, TP. Hồ Chí Minh & Hà Nội",
        "phone": "(+84) 28 3847 7777",
        "phoneHref": "tel:+842838477777",
        "phones": [{"number": "(+84) 28 3847 7777", "href": "tel:+842838477777"}],
        "emails": ["bbt@kyluc.vn", "contact@vietkings.org"],
    },
    "offices": [
        {
            "id": "ha-noi",
            "label": "Trụ sở chính",
            "city": "TP. Hà Nội",
            "address": "Tầng 6, Tòa nhà Liên hiệp các Hội Khoa học & Kỹ thuật Việt Nam, TP. Hà Nội.",
        },
        {
            "id": "ho-chi-minh",
            "label": "Văn phòng Đại diện phía Nam",
            "city": "TP. Hồ Chí Minh",
            "address": "1 Đặng Văn Ngữ, Phường 10, Quận Phú Nhuận, TP. Hồ Chí Minh",
        },
    ],
    "workingHours": [
        {"days": "Thứ Hai — Thứ Sáu", "time": "08:00 – 17:30"},
        {"days": "Thứ Bảy", "time": "08:00 – 12:00"},
    ],
    "socialChannels": [
        {"id": "zalo", "label": "Zalo OA", "href": None},
        {"id": "facebook", "label": "Fanpage", "href": None},
        {"id": "youtube", "label": "Sáng Tạo Việt", "href": None},
    ],
    "mapLocation": {
        "label": "Trụ sở VIETKINGS — TTCN Sáng Tạo",
        "office": {
            "id": "ho-chi-minh",
            "label": "Văn phòng Đại diện phía Nam",
            "city": "TP. Hồ Chí Minh",
            "address": "1 Đặng Văn Ngữ, Phường 10, Quận Phú Nhuận, TP. Hồ Chí Minh",
        },
        "address": "1 Đặng Văn Ngữ, Phường 10, Quận Phú Nhuận, TP. Hồ Chí Minh",
        "mapAddress": "16/1 Đặng Văn Ngữ, Phường 10, Quận Phú Nhuận, TP. Hồ Chí Minh",
        "embedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2025137972955!2d106.66687307480518!3d10.795795989354158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752900091dee09%3A0xe23cdfee230e065b!2zMTYvMSDEkOG6t25nIFbEg24gTmfhu68sUGjGsOG7nW5nIDEwLFBow7ogTmh14bqtbg!5e0!3m2!1svi!2s!4v1790769635883!5m2!1svi!2s&hl=vi",
        "directionsUrl": "https://www.google.com/maps/dir/?api=1&destination=16%2F1%20%C4%90%E1%BA%B7ng%20V%C4%83n%20Ng%E1%BB%AF%2C%20Ph%C6%B0%E1%BB%9Dng%2010%2C%20Qu%E1%BA%ADn%20Ph%C3%BA%20Nhu%E1%BA%ADn%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh",
    },
    "contactCategories": [
        {"value": "de-cu", "label": "Đề cử kỷ lục sáng tạo"},
        {"value": "dao-tao", "label": "Khóa đào tạo & Phát triển kỹ năng"},
        {"value": "truyen-thong", "label": "Hợp tác truyền thông & Sự kiện"},
        {"value": "khac", "label": "Hoạt động / Yêu cầu khác"},
    ],
    "form": {
        "form_title": "Gửi phản hồi hoặc yêu cầu tư vấn",
        "form_description": "Quý vị vui lòng để lại thông tin và nội dung cần tư vấn để Ban Thư ký Trung tâm hỗ trợ.",
        "button_text": "GỬI LỜI NHẮN NGAY",
        "availability_text": "Biểu mẫu hiện chưa tiếp nhận trực tuyến. Quý vị vui lòng liên hệ qua {hotline} hoặc {email}.",
        "privacy_text": "Nội dung đang nhập chỉ được giữ trên trang, chưa được gửi hoặc lưu vào hệ thống. Quý vị có thể liên hệ trực tiếp Ban Thư ký để được hướng dẫn tiếp nhận hồ sơ.",
        "form_fields": [
            {"id": "fullName", "label": "Họ và tên", "placeholder": "Ví dụ: Nguyễn Văn An", "type": "text", "options": [], "required": True, "width": "half"},
            {"id": "email", "label": "Địa chỉ Email", "placeholder": "name@domain.com", "type": "email", "options": [], "required": True, "width": "half"},
            {"id": "phone", "label": "Số điện thoại liên hệ", "placeholder": "Ví dụ: 0912 345 678", "type": "tel", "options": [], "required": False, "width": "half"},
            {"id": "category", "label": "Lĩnh vực quan tâm", "placeholder": "Vui lòng chọn lĩnh vực", "type": "select", "options": ["Đề cử kỷ lục sáng tạo", "Khóa đào tạo & Phát triển kỹ năng", "Hợp tác truyền thông & Sự kiện", "Hoạt động / Yêu cầu khác"], "required": False, "width": "half"},
            {"id": "message", "label": "Nội dung lời nhắn / Đề xuất chi tiết", "placeholder": "Quý vị vui lòng mô tả tóm tắt nội dung đề xuất, nguyện vọng hợp tác, hoặc các thông số đề cử kỷ lục cụ thể để Ban Thư ký chuẩn bị phương án tốt nhất...", "type": "textarea", "options": [], "required": True, "width": "full"},
        ],
    },
}


def seed_events_page(page_id=3):
    """Bổ sung props trang Events, giữ nguyên các giá trị đã lưu."""
    page = Page.query.filter_by(slug="events").first()
    if page is None:
        page = db.session.get(Page, page_id)
    if page is None or page.slug != "events":
        raise ValueError(f"Không tìm thấy trang Sự kiện (id={page_id}).")
    if not isinstance(page.props, dict):
        raise ValueError("Props trang Sự kiện không hợp lệ.")

    hero = _dto_data(event_dto.EventPageHeroDTO(), EVENTS_HERO_EVENT)
    filters = _dto_data(event_dto.EventPageFilterDTO(), EVENTS_FILTER_EVENT)
    displayed_events = _dto_data(
        event_dto.EventPageDisplayDTO(),
        {"event_ids": [event.id for event in Event.query.order_by(Event.id.asc()).all()]},
    )
    newsletter = _dto_data(
        event_dto.EventPageNewsletterDTO(), NEWSLETTER_EVENT
    )
    props = dict(page.props)
    changed = False
    for key, defaults in [("hero_section", hero), ("filter_section", filters), ("displayed_events", displayed_events), ("newsletter_section", newsletter)]:
        section = props.get(key, {})
        if not isinstance(section, dict):
            raise ValueError(f"{key} không hợp lệ; cần kiểm tra dữ liệu đã lưu.")
        missing = {field: value for field, value in defaults.items() if field not in section}
        if missing:
            props[key] = {**section, **missing}
            changed = True
    if changed:
        try:
            page.props = props
            flag_modified(page, "props")
            db.session.commit()
        except Exception:
            db.session.rollback()
            raise
    return page


def seed_event_dates():
    """Bổ sung ngày cho sự kiện mẫu đang thiếu, không ghi đè ngày đã chỉnh."""
    changed = False
    for name, event_date in EVENT_DATES_EVENT.items():
        event = Event.query.filter_by(name=name).first()
        if event is not None and event.event_date is None:
            event.event_date = event_date
            changed = True
    if changed:
        try:
            db.session.commit()
        except Exception:
            db.session.rollback()
            raise


def seed_contact_page(page_id=10):
    """Bổ sung nội dung trang Contact, giữ nguyên giá trị đã chỉnh trong DB."""
    page = db.session.get(Page, page_id)
    if page is None or page.slug != "contact":
        page = Page.query.filter_by(slug="contact").first()
    if page is None:
        page = Page(id=page_id, name="Liên hệ", slug="contact", props={})
        db.session.add(page)
        db.session.flush()

    defaults = _dto_data(contact_dto.ContactPagePropsDTO(), CONTACT_PAGE_PROPS)
    def merge_missing(current, fallback):
        if not isinstance(current, dict) or not isinstance(fallback, dict):
            return deepcopy(fallback), True
        merged = deepcopy(current)
        changed = False
        for key, value in fallback.items():
            if key not in merged:
                merged[key] = deepcopy(value)
                changed = True
            elif isinstance(value, dict) and isinstance(merged[key], dict):
                merged[key], nested_changed = merge_missing(merged[key], value)
                changed = changed or nested_changed
        return merged, changed

    props, changed = merge_missing(page.props or {}, defaults)
    if changed:
        page.props = props
        flag_modified(page, "props")
        db.session.commit()
    return page


# Seed images are served from frontend/public/images/about/.
INTRODUCE_SECTIONS = {
    "hero_section": {
        "breadcrumbs": [
            {"text": "Trang chủ", "link": "/"},
            {"text": "Giới thiệu", "link": None},
        ],
        "title_main": "Trung tâm Công nghiệp Sáng tạo",
        "quote": "Kết nối tri thức, khơi nguồn sáng tạo, lan tỏa giá trị Việt.",
        "quote_author": "",
    },
    "overview_section": {
        "tag": "Tổng quan",
        "title_main": "Không gian kết nối và sáng tạo",
        "paragraphs": [
            "Trung tâm Công nghiệp Sáng tạo kết nối cộng đồng sáng tạo, doanh nghiệp và chuyên gia để cùng phát triển các giá trị văn hóa, tri thức và đổi mới."
        ],
        "featured_image": {
            "url": "/images/about/overview.jpg",
            "alt": "Hội trường VietKings với khu vực trưng bày biểu trưng danh dự",
            "tag": "Kết nối",
            "caption_title": "Nơi hội tụ những giá trị sáng tạo",
        },
        "statistics": [],
    },
    "vision_section": {
        "tag": "Tầm nhìn",
        "title_main": "Lan tỏa giá trị sáng tạo Việt",
        "paragraphs": [
            "Xây dựng cộng đồng hợp tác bền vững, đưa tri thức và bản sắc Việt đến gần hơn với đời sống."
        ],
        "featured_image": {
            "url": "/images/about/vision.jpg",
            "alt": "Các diễn giả trao đổi tại diễn đàn kinh tế sáng tạo",
            "caption_title": "Cùng định hướng tương lai",
        },
        "items": [
            {
                "icon": "globe",
                "title": "Kết nối rộng mở",
                "description": "Thúc đẩy trao đổi tri thức và hợp tác giữa các cộng đồng sáng tạo.",
            }
        ],
    },
    "mission_section": {
        "tag": "Sứ mệnh",
        "title_main": "Đồng hành cùng cộng đồng sáng tạo",
        "featured_image": {
            "url": "/images/about/mission.jpg",
            "alt": "Lễ công bố và vinh danh kỷ lục Việt Nam",
            "caption_title": "Tôn vinh những đóng góp cho cộng đồng",
        },
        "items": [
            {
                "icon": "lightbulb",
                "title": "Khơi nguồn ý tưởng",
                "description": "Tạo điều kiện để ý tưởng được chia sẻ, phát triển và ứng dụng.",
            }
        ],
    },
    "core_values_section": {
        "tag": "Giá trị cốt lõi",
        "title_main": "Tri thức, sáng tạo và hợp tác",
        "description": "Lấy con người và giá trị cộng đồng làm nền tảng cho các hoạt động.",
        "items": [
            {
                "icon": "handshake",
                "title": "Hợp tác",
                "description": "Cùng chia sẻ nguồn lực và phát triển những giá trị lâu dài.",
            }
        ],
    },
    "actions_section": {
        "buttons": [
            {"text": "Liên hệ hợp tác", "link": "/contact", "icon": "handshake"},
            {
                "text": "Khám phá chương trình",
                "link": "/training",
                "icon": "graduation_cap",
            },
        ]
    },
}


def seed_introduce():
    """Chỉ bổ sung section chưa có; không sửa nội dung hiện hữu hoặc Home."""
    schemas = {
        "hero_section": introduce_dto.HeroSectionRequestDTO,
        "overview_section": introduce_dto.OverviewSectionRequestDTO,
        "vision_section": introduce_dto.VisionSectionRequestDTO,
        "mission_section": introduce_dto.MissionSectionRequestDTO,
        "core_values_section": introduce_dto.CoreValuesSectionRequestDTO,
        "actions_section": introduce_dto.ActionsSectionRequestDTO,
    }
    try:
        page = Page.query.filter_by(slug="introduce").one_or_none()
        if page is not None and not isinstance(page.props, dict):
            raise ValueError(
                "Page introduce có props sai kiểu; cần sửa dữ liệu trước khi seed."
            )
        props = dict(page.props) if page is not None else {}
        missing = [key for key in schemas if key not in props]

        additions = {}
        for key in missing:
            schema = schemas[key]()
            additions[key] = schema.dump(schema.load(INTRODUCE_SECTIONS[key]))

        if page is None:
            page = Page(
                id=2,
                name="Giới thiệu",
                slug="introduce",
                props={**additions, "show_in_header": True, "header_order": 2},
            )
            db.session.add(page)
        elif additions:
            current_props = dict(page.props or {})
            current_props.update(additions)
            current_props["show_in_header"] = True
            current_props["header_order"] = 2
            page.props = current_props
            flag_modified(page, "props")

        if additions or page is not None:
            db.session.commit()
        return page
    except Exception:
        db.session.rollback()
        raise


def normalize_date(value):
    if isinstance(value, datetime.datetime):
        return value.date().isoformat()
    if isinstance(value, datetime.date):
        return value.isoformat()
    return str(value)


def seed_founder_page():
    """Seed hoặc cập nhật thông tin trang Founder."""
    founder_seed_data = {
        "name": "Chuyện nhà sáng nghiệp",
        "slug": "founder",
        "props": {
            "show_in_header": True,
            "header_order": 7,
            "id": "founder_props_1",
            "hero_section": {
                "id": 1,
                "title": "Người đứng sau thương hiệu",
                "description": "Khám phá câu chuyện, hành trình và tầm nhìn của những người sáng lập.",
                "name": "Đội ngũ sáng lập",
                "number_of_founders": 2,
                "subtitle": "Những người đứng sau thương hiệu",
                "subdescription": "Hai nhà sáng lập cùng chung tầm nhìn xây dựng những giá trị bền vững.",
            },
            "section": [
                {
                    "id": "section_1",
                    "major": "Founder & CEO",
                    "name": "Nguyễn Văn A",
                    "description": "Với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ và quản trị doanh nghiệp, Nguyễn Văn A là người đồng sáng lập và dẫn dắt định hướng phát triển của công ty.",
                    "founder_info": [
                        {
                            "id": "founder_info_1",
                            "label": "Chức danh",
                            "value": "Founder & CEO",
                        },
                        {
                            "id": "founder_info_2",
                            "label": "Kinh nghiệm",
                            "value": "10+ năm",
                        },
                        {
                            "id": "founder_info_3",
                            "label": "Lĩnh vực",
                            "value": "Technology & Business",
                        },
                    ],
                    "is_verified": True,
                    "image": "/images/founder/founder-1.jpg",
                    "founder_profile": {
                        "id": "profile_1",
                        "filter": "bio",
                        "title": "Tiểu sử & Triết lý",
                        "description": "Tôi tin rằng công nghệ cần được xây dựng dựa trên những giá trị thực tế và tạo ra tác động tích cực cho cộng đồng.",
                        "slogan": "Build with purpose.",
                        "sub_slogan": "Kiến tạo hôm nay, hướng đến tương lai.",
                    },
                },
                {
                    "id": "section_2",
                    "major": "Co-Founder & CTO",
                    "name": "Trần Văn B",
                    "description": "Với nền tảng chuyên sâu về công nghệ và phát triển sản phẩm, Trần Văn B phụ trách định hướng kỹ thuật và xây dựng các giải pháp công nghệ cho công ty.",
                    "founder_info": [
                        {
                            "id": "founder_info_4",
                            "label": "Chức danh",
                            "value": "Co-Founder & CTO",
                        },
                        {
                            "id": "founder_info_5",
                            "label": "Kinh nghiệm",
                            "value": "8+ năm",
                        },
                        {
                            "id": "founder_info_6",
                            "label": "Lĩnh vực",
                            "value": "Software Engineering",
                        },
                    ],
                    "is_verified": True,
                    "image": "/images/founder/founder-2.jpg",
                    "founder_profile": {
                        "id": "profile_2",
                        "filter": "projects",
                        "title": "Dự án tiêu biểu",
                        "description": "Đã tham gia xây dựng và phát triển nhiều sản phẩm công nghệ phục vụ doanh nghiệp và người dùng.",
                        "slogan": "Technology creates possibilities.",
                        "sub_slogan": "Công nghệ mở ra những khả năng mới.",
                    },
                },
            ],
            "cta_section": {
                "id": "cta_1",
                "subtitle": "Cùng chúng tôi tạo nên giá trị",
                "title": "Bắt đầu hành trình mới",
                "description": "Hãy kết nối với chúng tôi để cùng khám phá những cơ hội hợp tác và phát triển.",
                "btn_cta": "Liên hệ ngay",
                "sub_btn_cta": "Tìm hiểu thêm về chúng tôi",
                "form_url": "/contact",
                "certificate": [
                    {"id": "certificate_1", "name": "ISO 9001"},
                    {"id": "certificate_2", "name": "Top Trusted Brand"},
                    {"id": "certificate_3", "name": "Best Innovation Award"},
                ],
            },
        },
    }

    existing_page = Page.query.filter_by(slug=founder_seed_data["slug"]).first()
    if existing_page:
        existing_page.name = founder_seed_data["name"]
        merged_props = dict(existing_page.props or {})
        merged_props.update(founder_seed_data["props"])
        merged_props["show_in_header"] = True
        merged_props["header_order"] = 7
        existing_page.props = merged_props
        flag_modified(existing_page, "props")
        print("  -> Đã cập nhật trang Founder thành công!")
    else:
        page = Page(
            id=7,
            name=founder_seed_data["name"],
            slug=founder_seed_data["slug"],
            props=founder_seed_data["props"],
        )
        db.session.add(page)
        print("  -> Đã tạo mới trang Founder thành công!")


def seed_nav_pages():
    """Tạo hoặc cập nhật các trang điều hướng mà không xóa dữ liệu trang hiện có."""
    print("\n[Nav] Đang chuẩn hóa thứ tự các trang trong bảng Page (id 1 -> 10)...")
    nav_specs = [
        {"id": 1, "name": "Trang chủ", "slug": "home"},
        {"id": 2, "name": "Giới thiệu", "slug": "introduce"},
        {"id": 3, "name": "Sự kiện", "slug": "events"},
        {"id": 4, "name": "Đề cử kỷ lục", "slug": "records"},
        {"id": 5, "name": "Dự án nổi bật", "slug": "projects"},
        {"id": 6, "name": "Giải thưởng", "slug": "awards"},
        {"id": 7, "name": "Chuyện nhà sáng nghiệp", "slug": "founder"},
        {"id": 8, "name": "Diễn đàn Kinh tế Kỷ lục", "slug": "forum"},
        {"id": 9, "name": "Hợp tác & Đào tạo", "slug": "trainings"},
        {"id": 10, "name": "Liên hệ", "slug": "contact"},
    ]

    aliases = {"introduce": "about", "founder": "stories"}
    for item in nav_specs:
        target_id = item["id"]
        slug = item["slug"]
        name = item["name"]

        page = Page.query.filter_by(slug=slug).first()
        if page is None and slug in aliases:
            page = Page.query.filter_by(slug=aliases[slug]).first()

        if page is None:
            page = db.session.get(Page, target_id)
            if page is not None and page.slug != slug:
                page = None

        if page is None:
            page = Page(name=name, slug=slug, props={}, order_index=target_id)
            if db.session.get(Page, target_id) is None:
                page.id = target_id
            db.session.add(page)

        page.name = name
        page.slug = slug
        page.order_index = target_id
        if page.props is not None and not isinstance(page.props, dict):
            raise ValueError(f"Props trang '{slug}' không hợp lệ.")
        props = dict(page.props or {})
        props["show_in_header"] = True
        props["header_order"] = target_id
        page.props = props
        flag_modified(page, "props")
        print(f"  + [{target_id}] {name} (slug: {slug}) -> header_order: {target_id}")

    db.session.commit()


    print("  -> Cập nhật 10 trang điều hướng thành công với id từ 1 đến 10!")

    def seed_awards():
        awards_data = [
            {
                "code": "HG-ANG-01",
                "name": "Giải thưởng Ngọn Hải Đăng Sáng Nghiệp",
                "title": "Kinh tế & Doanh nghiệp sáng tạo",
                "description": "Vinh danh doanh nghiệp và nhà sáng lập tiên phong đổi mới mô hình kinh tế xanh, tạo ra giá trị bền vững cho cộng đồng.",
                "decision_number": "QĐ-VK-2025/01",
                "year": 2025,
                "image": "/images/awards/event-gathering.jpg",
                "icon": "Flame",
                "props": {
                    "category_badge": "HẠNG MỤC 01",
                    "scope": "XÉT TẶNG TOÀN QUỐC",
                    "subtitle": "HẠNG MỤC TIÊN PHONG PHÁT TRIỂN KINH TẾ SÁNG TẠO",
                    "iconName": "Flame",
                    "award_evaluation_criteria": [
                        "Hoạt động hợp pháp tại Việt Nam từ 3 năm trở lên.",
                        "Có mô hình tăng trưởng bền vững và ứng dụng sáng tạo rõ rệt.",
                    ],
                    "nomination_dossier": [
                        "Bản đăng ký tham gia xét tặng.",
                        "Báo cáo thành tích và minh chứng tăng trưởng trong 3 năm gần nhất.",
                    ],
                },
            },
            {
                "code": "HG-ANG-02",
                "name": "Cúp Bàn Tay Vàng Kỷ Lục Dân Tộc",
                "title": "Thủ công mỹ nghệ & Kỹ nghệ dân tộc",
                "description": "Tôn vinh nghệ nhân đỉnh cao gìn giữ tinh hoa kỹ nghệ cổ truyền và kết hợp tư duy sáng tạo hiện đại.",
                "decision_number": "QĐ-VK-2024/02",
                "year": 2024,
                "image": "/images/awards/story-artisan.jpg",
                "icon": "Award",
                "props": {
                    "category_badge": "HẠNG MỤC 02",
                    "scope": "ĐỀ CỬ QUỐC GIA - THƯỜNG NIÊN",
                    "subtitle": "VINH DANH ĐỈNH CAO KỸ NGHỆ THỦ CÔNG MỸ NGHỆ",
                    "iconName": "Award",
                    "award_evaluation_criteria": [
                        "Có thâm niên làm nghề từ 15 năm trở lên.",
                        "Tạo tác phẩm độc bản, tiêu biểu cho kỹ nghệ dân tộc.",
                    ],
                    "nomination_dossier": [
                        "Giới thiệu quá trình làm nghề và tác phẩm tiêu biểu.",
                        "Hình ảnh chất lượng cao về tác phẩm và quy trình thực hiện.",
                    ],
                },
            },
            {
                "code": "HG-ANG-03",
                "name": "Huy Hiệu Tinh Hoa Nghề Truyền Thống",
                "title": "Làng nghề & Gia tộc truyền thống",
                "description": "Tôn vinh làng nghề và gia tộc nhiều thế hệ gìn giữ ngọn lửa nghề, đưa giá trị di sản vươn ra thị trường.",
                "decision_number": "QĐ-VK-2024/03",
                "year": 2024,
                "image": "/images/awards/about.jpg",
                "icon": "Medal",
                "props": {
                    "category_badge": "HẠNG MỤC 03",
                    "scope": "XÉT ĐỀ CỬ ĐỊNH KỲ",
                    "subtitle": "CÔNG NHẬN LÀNG NGHỀ & GIA TỘC CÓ TRUYỀN THỐNG VÀNG",
                    "iconName": "Medal",
                    "award_evaluation_criteria": [
                        "Có lịch sử hình thành và phát triển từ 50 năm trở lên.",
                        "Gìn giữ quy trình sản xuất thủ công và bản sắc vùng miền.",
                    ],
                    "nomination_dossier": [
                        "Tư liệu lịch sử làng nghề hoặc gia phả nghề.",
                        "Xác nhận của chính quyền địa phương về làng nghề tiêu biểu.",
                    ],
                },
            },
            {
                "code": "HG-ANG-04",
                "name": "Giải Thưởng Đổi Mới Sáng Tạo Di Sản Việt",
                "title": "Di sản văn hóa & Ứng dụng số",
                "description": "Vinh danh các dự án ứng dụng công nghệ hiện đại để bảo tồn và đưa di sản văn hóa đến gần hơn với thế hệ trẻ.",
                "decision_number": "QĐ-VK-2025/04",
                "year": 2025,
                "image": "/images/awards/event-exhibition.jpg",
                "icon": "Sparkles",
                "props": {
                    "category_badge": "HẠNG MỤC 04",
                    "scope": "GIẢI THƯỞNG MỞ RỘNG TOÀN QUỐC",
                    "subtitle": "ĐỘT PHÁ SỐ HÓA & ỨNG DỤNG DI SẢN ĐƯƠNG ĐẠI",
                    "iconName": "Sparkles",
                    "award_evaluation_criteria": [
                        "Ứng dụng công nghệ số vào bảo tồn hoặc giới thiệu di sản.",
                        "Đã ra mắt công chúng hoặc triển khai thử nghiệm thực tế.",
                    ],
                    "nomination_dossier": [
                        "Thuyết minh kỹ thuật và ý tưởng nghệ thuật.",
                        "Bản demo hoặc đường link trải nghiệm sản phẩm.",
                    ],
                },
            },
            {
                "code": "HG-ANG-05",
                "name": "Kỷ Niệm Chương Cống Hiến Vì Sự Nghiệp Sáng Tạo",
                "title": "Cống hiến & Nghiên cứu khoa học",
                "description": "Ghi nhận các nhà khoa học, chuyên gia và nhà quản lý có đóng góp bền bỉ cho phong trào sáng tạo và kỷ lục Việt Nam.",
                "decision_number": "QĐ-VK-2023/05",
                "year": 2023,
                "image": "/images/awards/event-forum.jpg",
                "icon": "Award",
                "props": {
                    "category_badge": "HẠNG MỤC 05",
                    "scope": "HUY HIỆU DANH DỰ TOÀN QUỐC",
                    "subtitle": "HUY HIỆU DANH DỰ CẤP CAO CỦA VIỆN KỶ LỤC VIỆT NAM",
                    "iconName": "Award",
                    "award_evaluation_criteria": [
                        "Có ít nhất 10 năm gắn bó với nghiên cứu hoặc hoạt động sáng tạo.",
                        "Có công trình, đề án hoặc đóng góp cố vấn tiêu biểu.",
                    ],
                    "nomination_dossier": [
                        "Trích ngang lý lịch khoa học và quá trình công tác.",
                        "Danh mục công trình và đóng góp tiêu biểu.",
                    ],
                },
            },
            {
                "code": "HG-ANG-06",
                "name": "Giải Thưởng Ngôi Sao Khởi Nghiệp Kỷ Lục Trẻ",
                "title": "Khởi nghiệp đổi mới sáng tạo trẻ",
                "description": "Tôn vinh tài năng trẻ sở hữu sáng kiến, sản phẩm hoặc mô hình khởi nghiệp tạo ra giá trị mới cho công nghiệp sáng tạo.",
                "decision_number": "QĐ-VK-2025/06",
                "year": 2025,
                "image": "/images/awards/project-museum.jpg",
                "icon": "Trophy",
                "props": {
                    "category_badge": "HẠNG MỤC 06",
                    "scope": "DÀNH CHO ĐỐI TƯỢNG DƯỚI 35 TUỔI",
                    "subtitle": "ƯƠM MẦM TÀI NĂNG TRẺ & Ý TƯỞNG ĐỘT PHÁ CẢM HỨNG",
                    "iconName": "Trophy",
                    "award_evaluation_criteria": [
                        "Người sáng lập hoặc đại diện dự án không quá 35 tuổi.",
                        "Sản phẩm có tính mới và tiềm năng thương mại hóa.",
                    ],
                    "nomination_dossier": [
                        "Bản thuyết minh mô hình kinh doanh khởi nghiệp.",
                        "Video giới thiệu sản phẩm hoặc giải pháp thực tế.",
                    ],
                },
            },
        ]

        for item in awards_data:
            validated = _dto_data(award_dto.AwardRequestDTO(), item)
            award = Award.query.filter(
                or_(Award.code == item["code"], Award.name == item["name"])
            ).first()
            if award is None:
                award = Award(id=item["code"])
                db.session.add(award)
            for field, value in validated.items():
                setattr(award, field, value)
            award.id = award.id or item["code"]
            print(f"  + Đã seed award {item['code']}: {item['name']}")

        legacy_award = Award.query.filter_by(name="Kỷ lục Quốc gia").first()
        seeded_codes = {item["code"] for item in awards_data}
        if legacy_award and legacy_award.code not in seeded_codes:
            db.session.delete(legacy_award)

        db.session.commit()

    def seed_award_page():
        page_props = {
            "header": {
                "tittle": "Hệ thống giải thưởng sáng tạo",
                "title": "Hệ thống giải thưởng sáng tạo",
                "sub_title": "BẢNG VINH DANH THƯỜNG NIÊN",
                "description": "Hệ thống giải thưởng tôn vinh những đóng góp nổi bật trong bảo tồn di sản, đổi mới sáng tạo và xác lập giá trị Việt Nam.",
            },
            "list_card": {
                "count": Award.query.count(),
                "title": "Danh mục giải thưởng thường niên",
                "award_ids": [
                    str(award.id) for award in Award.query.order_by(Award.id).all()
                ],
            },
            "latest_honor_board": [
                {
                    "id": "honor_board_1",
                    "icon": "/images/awards/about.jpg",
                    "image": "/images/awards/about.jpg",
                    "title": "GIẢI ĐỔI MỚI SÁNG TẠO DI SẢN",
                    "name": "Công ty CP Gốm Sứ Sen Việt",
                    "sub_name": "Đại diện: Doanh nhân Nguyễn Tiến An",
                    "description": "Ứng dụng công nghệ men nano để bảo tồn kỹ thuật gốm truyền thống và mở rộng giá trị di sản Việt ra thị trường quốc tế.",
                    "time": "10/12/2024",
                    "decision_number": "KHOA-2024-001",
                },
                {
                    "id": "honor_board_2",
                    "icon": "/images/awards/story-artisan.jpg",
                    "image": "/images/awards/story-artisan.jpg",
                    "title": "BÀN TAY VÀNG KỶ LỤC DÂN TỘC",
                    "name": "NNƯT. Trần Quang Thái",
                    "sub_name": "Làng chạm bạc Đồng Xâm",
                    "description": "Gìn giữ kỹ nghệ chạm bạc truyền thống và đào tạo thế hệ nghệ nhân kế thừa giá trị thủ công dân tộc.",
                    "time": "14/11/2024",
                    "decision_number": "BTV-2024-042",
                },
                {
                    "id": "honor_board_3",
                    "icon": "/images/awards/project-museum.jpg",
                    "image": "/images/awards/project-museum.jpg",
                    "title": "NGÔI SAO KHỞI NGHIỆP TRẺ",
                    "name": "Dự án VR Di Sản Hoàng Cung",
                    "sub_name": "Nhóm HeritageX Tech",
                    "description": "Tái hiện không gian di sản bằng công nghệ 3D và thực tế ảo, đưa lịch sử Việt Nam đến gần hơn với công chúng trẻ.",
                    "time": "05/01/2025",
                    "decision_number": "STARTUP-2025-015",
                },
            ],
            "show_in_header": True,
            "header_order": 6,
        }
        page = Page.query.filter_by(slug="awards").first() or Page.query.filter_by(slug="award").first() or db.session.get(Page, 6)
        if page is None:
            page = Page(name="Giải thưởng", slug="awards", props=page_props)
            db.session.add(page)
        else:
            page.name = "Giải thưởng"
            page.slug = "awards"
            page.props = {**(page.props or {}), **page_props}
            flag_modified(page, "props")
        db.session.commit()
        print("  -> Đã seed page awards và latest honor board.")

    seed_awards()
    seed_award_page()


def seed_forum_page():
    """Add missing forum page content without replacing admin-edited values."""
    page = Page.query.filter_by(slug="forum").first()
    if page is None:
        page = db.session.get(Page, 8)
        if page is not None and page.slug != "forum":
            page = None

    if page is None:
        page = Page(
            name="Diễn đàn Kinh tế Kỷ lục",
            slug="forum",
            props={},
        )
        if db.session.get(Page, 8) is None:
            page.id = 8
        db.session.add(page)

    def merge_missing(current, defaults):
        if not isinstance(current, dict):
            return deepcopy(defaults)
        merged = dict(current)
        for key, value in defaults.items():
            if key not in merged:
                merged[key] = deepcopy(value)
            elif isinstance(value, dict):
                merged[key] = merge_missing(merged[key], value)
        return merged

    page.name = "Diễn đàn Kinh tế Kỷ lục"
    page.slug = "forum"
    if page.props is not None and not isinstance(page.props, dict):
        raise ValueError("Props trang 'forum' không hợp lệ.")
    props = merge_missing(page.props or {}, {
        "header_section": DEFAULT_FORUM_HEADER,
        "hero_section": DEFAULT_FORUM_HERO,
        "pillars_section": DEFAULT_FORUM_PILLARS,
        "speakers_section": DEFAULT_FORUM_SPEAKERS,
        "agenda_section": DEFAULT_FORUM_AGENDA,
        "awards_section": DEFAULT_FORUM_AWARDS,
        "partners_section": DEFAULT_FORUM_PARTNERS,
        "registration_section": DEFAULT_FORUM_REGISTRATION,
    })
    props.setdefault("show_in_header", True)
    props.setdefault("header_order", 8)
    page.props = props
    flag_modified(page, "props")
    db.session.commit()
    print("  -> Đã seed nội dung trang Diễn đàn.")
    return page


def _upsert_page_with_defaults(page_id, name, slug, defaults):
    page = Page.query.filter_by(slug=slug).first()
    if page is None:
        page = db.session.get(Page, page_id)
        if page is not None and page.slug != slug:
            page = None

    if page is None:
        page = Page(name=name, slug=slug, props={})
        if db.session.get(Page, page_id) is None:
            page.id = page_id
        db.session.add(page)

    if page.props is not None and not isinstance(page.props, dict):
        raise ValueError(f"Props trang '{slug}' không hợp lệ.")

    props = dict(page.props or {})
    changed = False
    for key, value in defaults.items():
        if key not in props:
            props[key] = deepcopy(value)
            changed = True

    page.name = name
    page.slug = slug
    if changed or page.props is None:
        page.props = props
        flag_modified(page, "props")
    return page


def seed_project_page():
    project_ids = [project.id for project in Project.query.order_by(Project.id).all()]
    header = {
        "badge": "DỰ ÁN & CÂU CHUYỆN SÁNG NGHIỆP",
        "title": "Dự án tiêu biểu",
        "description": "Khám phá các dự án và hành trình sáng tạo tiêu biểu.",
        "statistics": [
            {"label": "Dự án tiêu biểu", "value": str(len(project_ids))}
        ],
    }
    proposal = {
        "tag": "ĐỀ XUẤT DỰ ÁN",
        "title": "Cùng phát triển ý tưởng sáng tạo",
        "description": "Gửi đề xuất để Trung tâm xem xét cơ hội hợp tác.",
        "benefits": ["Kết nối chuyên gia", "Đồng hành phát triển dự án"],
        "form_title": "Thông tin đề xuất",
        "form_description": "Vui lòng để lại thông tin và mô tả dự án.",
        "button_text": "GỬI HỒ SƠ ĐỀ XUẤT DỰ ÁN",
        "form_fields": [],
    }
    header = _dto_data(project_page_dto.HeaderSectionRequestDTO(), header)
    proposal = _dto_data(project_page_dto.ProposalSectionRequestDTO(), proposal)
    selected = _dto_data(
        project_page_dto.SelectedProjectsRequestDTO(),
        {"project_ids": project_ids},
    )
    defaults = {
        "header_section": header,
        "proposal_section": proposal,
        "selected_project_ids": selected["project_ids"],
        "show_in_header": True,
        "header_order": 5,
    }
    page = _upsert_page_with_defaults(5, "Dự án nổi bật", "projects", defaults)
    db.session.commit()
    print(f"  -> Đã seed trang Projects với {len(project_ids)} dự án.")
    return page


def seed_training_page():
    training_ids = [
        training.id for training in Training.query.order_by(Training.id).all()
    ]
    header = {
        "badge": "HỢP TÁC & ĐÀO TẠO",
        "title": "Chương trình hợp tác và đào tạo",
        "description": "Các chương trình nâng cao năng lực và lan tỏa tri thức sáng tạo.",
        "statistics": [
            {"label": "Chương trình", "value": str(len(training_ids))}
        ],
    }
    proposal = {
        "tag": "ĐỀ XUẤT HỢP TÁC",
        "title": "Cùng xây dựng chương trình đào tạo",
        "description": "Kết nối với Trung tâm để phát triển chương trình phù hợp.",
        "benefits": ["Nội dung thực tiễn", "Kết nối chuyên gia"],
        "form_title": "Thông tin đề xuất",
        "form_description": "Vui lòng để lại thông tin chương trình.",
        "button_text": "GỬI ĐỀ XUẤT HỢP TÁC",
        "form_fields": [],
    }
    header = _dto_data(training_page_dto.HeaderSectionRequestDTO(), header)
    proposal = _dto_data(training_page_dto.ProposalSectionRequestDTO(), proposal)
    selected = _dto_data(
        training_page_dto.SelectedTrainingsRequestDTO(),
        {"training_ids": training_ids},
    )
    defaults = {
        "header_section": header,
        "proposal_section": proposal,
        "selected_training_ids": selected["training_ids"],
        "show_in_header": True,
        "header_order": 9,
    }
    page = _upsert_page_with_defaults(
        9, "Hợp tác & Đào tạo", "trainings", defaults
    )
    db.session.commit()
    print(f"  -> Đã seed trang Trainings với {len(training_ids)} chương trình.")
    return page


def seed_database():
    """Seed toàn bộ dữ liệu mẫu cho hệ thống."""
    print("=" * 60)
    print(" BẮT ĐẦU SEED TOÀN BỘ DỮ LIỆU VÀO DATABASE")
    print("=" * 60)

    db.create_all()

    # ========================================================
    # BƯỚC 1: NGƯỜI DÙNG QUẢN TRỊ
    # ========================================================
    print("\n[1/7] Đang kiểm tra & seed tài khoản Người dùng (User)...")
    accounts = [
        {
            "username": "admin",
            "email": "admin@vietkings.org",
            "password": "admin123",
            "full_name": "Quản Trị Viên (Admin)",
            "role": RoleEnum.ADMIN.value,
            "can_admin_access": True,
        },
        {
            "username": "manager",
            "email": "manager@vietkings.org",
            "password": "manager123",
            "full_name": "Quản Lý (Manager)",
            "role": RoleEnum.MANAGER.value,
            "can_admin_access": True,
        },
    ]

    for acc in accounts:
        user = User.query.filter_by(username=acc["username"]).first()
        if not user:
            user = User(
                username=acc["username"],
                email=acc["email"],
                full_name=acc["full_name"],
                role=acc["role"],
                is_active=True,
                can_admin_access=acc["can_admin_access"],
            )
            user.set_password(acc["password"])
            db.session.add(user)
            print(f"  + Đã tạo tài khoản: {acc['username']} ({acc['role']})")
        else:
            user.email = acc["email"]
            user.full_name = acc["full_name"]
            user.role = acc["role"]
            user.is_active = True
            user.can_admin_access = acc["can_admin_access"]
            user.set_password(acc["password"])
            print(f"  . Đã cập nhật tài khoản: {acc['username']}")
    db.session.commit()

    # ========================================================
    # BƯỚC 2: DANH MỤC VÀ SỰ KIỆN NỔI BẬT
    # ========================================================
    print("\n[2/7] Đang seed Sự kiện nổi bật...")
    for cat_name in ["ĐẠI HỘI THƯỜNG NIÊN", "TRIỂN LÃM ĐỘC BẢN", "TỌA ĐÀM KINH TẾ"]:
        if not EventCategory.query.filter_by(name=cat_name).first():
            db.session.add(EventCategory(name=cat_name))
    db.session.commit()

    events_data = [
        {
            "name": "Hội ngộ Kỷ lục gia Việt Nam lần thứ 54: Tôn vinh Sáng tạo Quốc gia",
            "event_date": EVENT_DATES_EVENT["Hội ngộ Kỷ lục gia Việt Nam lần thứ 54: Tôn vinh Sáng tạo Quốc gia"],
            "category": "ĐẠI HỘI THƯỜNG NIÊN",
            "description": "Quy tụ hơn 300 kỷ lục gia và các nhà sáng chế trên toàn quốc nhằm đúc kết thành tựu đổi mới trong công nghệ và văn hóa di sản.",
            "speakers": [{
                "role": "Chủ tịch hội đồng",
                "name": "TS. Lê Doãn Hợp",
                "description": "Chủ tịch Hội đồng Xác lập Kỷ lục Việt Nam",
                "image": "/images/speakers/le-doan-hop.jpg",
            }],
            "location": "Trung tâm Hội nghị Quốc gia, Hà Nội",
            "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
            "status": EventStatus.UPCOMING,
            "btn_action": "ĐỌC BÁO CÁO SỰ KIỆN",
            "form_url": "/events/hoi-ngo-ky-luc-gia-54",
        },
        {
            "name": "Không Gian Trưng Bày Tinh Hoa Thủ Công Mỹ Nghệ Đạt Kỷ Lục",
            "event_date": EVENT_DATES_EVENT["Không Gian Trưng Bày Tinh Hoa Thủ Công Mỹ Nghệ Đạt Kỷ Lục"],
            "category": "TRIỂN LÃM ĐỘC BẢN",
            "description": "Khám phá những kiệt tác sơn mài, khảm xà cừ và gốm sứ đạt đỉnh cao nghệ thuật của các nghệ nhân nhân dân kỳ cựu.",
            "speakers": [{
                "role": "Nghệ nhân",
                "name": "Nghệ nhân Nhân dân Trần Độ",
                "description": "Bậc thầy Gốm sứ Bát Tràng",
                "image": "/images/speakers/tran-do.jpg",
            }],
            "location": "Bảo tàng Hà Nội, Phạm Hùng, Nam Từ Liêm",
            "image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
            "status": EventStatus.UPCOMING,
            "btn_action": "ĐỌC BÁO CÁO SỰ KIỆN",
            "form_url": "/events/khong-gian-tinh-hoa-thu-cong",
        },
        {
            "name": 'Tọa đàm: "Tài sản Vô hình & Định giá Thương hiệu Kỷ lục"',
            "event_date": EVENT_DATES_EVENT['Tọa đàm: "Tài sản Vô hình & Định giá Thương hiệu Kỷ lục"'],
            "category": "TỌA ĐÀM KINH TẾ",
            "description": "Chia sẻ từ các chuyên gia kinh tế đầu ngành về phương pháp định giá thương quyền sở hữu trí tuệ và mở rộng dòng vốn đầu tư.",
            "speakers": [{
                "role": "Diễn giả",
                "name": "TS. Võ Trí Thành",
                "description": "Viện trưởng Viện Nghiên cứu Chiến lược Thương hiệu",
                "image": "/images/speakers/vo-tri-thanh.jpg",
            }],
            "location": "Khách sạn Rex, Quận 1, TP. Hồ Chí Minh",
            "image": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
            "status": EventStatus.UPCOMING,
            "btn_action": "ĐỌC BÁO CÁO SỰ KIỆN",
            "form_url": "/events/toa-dam-tai-san-vo-hinh",
        },
    ]

    event_ids = []
    for item in events_data:
        category = EventCategory.query.filter_by(name=item["category"]).one()
        validated = _dto_data(event_dto.EventRequest(), {
            **{key: value for key, value in item.items() if key != "category"},
            "status": item["status"].value,
            "category_id": category.id,
        })
        existing = Event.query.filter_by(name=item["name"]).first()
        if not existing:
            new_event = Event(
                name=validated["name"],
                description=validated["description"],
                speaker=validated["speakers"],
                location=validated["location"],
                event_date=validated.get("event_date"),
                image=validated["image"],
                status=validated["status"],
                btn_action=validated["btn_action"],
                form_url=validated["form_url"],
                category_id=validated["category_id"],
            )
            db.session.add(new_event)
            db.session.flush()
            event_ids.append(new_event.id)
            print(f"  + Đã thêm sự kiện ID {new_event.id}: {new_event.name}")
        else:
            event_ids.append(existing.id)
            print(f"  . Đã có sự kiện ID {existing.id}: {existing.name}")
    db.session.commit()

    # ========================================================
    # BƯỚC 3: DỰ ÁN TIÊU BIỂU & CHUYỆN SÁNG NGHIỆP
    # ========================================================
    print("\n[3/7] Đang seed Dự án & Chuyện nhà sáng nghiệp...")
    project_categories = [
        {"name": "DỰ ÁN TIÊU BIỂU", "description": "Các dự án sáng tạo tiêu biểu."},
        {"name": "CHUYỆN NHÀ SÁNG NGHIỆP", "description": "Câu chuyện của các nhà sáng nghiệp."},
    ]
    for category_data in project_categories:
        category_data = _dto_data(
            project_dto.ProjectCategoryRequest(), category_data
        )
        if not ProjectCategory.query.filter_by(name=category_data["name"]).first():
            db.session.add(ProjectCategory(**category_data))
    db.session.commit()

    projects_data = [
        {
            "name": "Bảo Tàng Không Gian Kỷ Lục Sáng Tạo Việt Nam (Giai Đoạn 1)",
            "category": "DỰ ÁN TIÊU BIỂU",
            "title": "DỰ ÁN TRỌNG ĐIỂM QUỐC GIA",
            "slogan": "KHỞI CÔNG 2025 – QUY MÔ 12 HECTA",
            "description": "Khu phức hợp lưu trữ, bảo tồn và ứng dụng công nghệ thực tế ảo tương tác nhằm tái hiện hành trình xác lập các kỳ tích quốc gia. Công trình tạo điểm đến văn hóa giáo dục tự hào cho thế hệ trẻ.",
            "research_info": [
                {"label": "Quy mô", "value": "12 Hecta"},
                {"label": "Khởi công", "value": "2025"},
                {"label": "Công nghệ", "value": "VR/AR Interactive 3D"},
                {"label": "Trọng tâm", "value": "Lưu trữ, giáo dục & bảo tồn văn hóa"},
            ],
            "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
            "project_info": {
                "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
                "btn_action": "TÌM HIỂU TIẾN ĐỘ DỰ ÁN",
                "link": "/projects/bao-tang-khong-gian-ky-luc",
            },
        },
        {
            "name": "Chuyện Nhà Sáng Nghiệp: Nghệ Nhân Vũ Văn Hùng & Hành Trình 40 Năm Giữ Lửa Gốm Dân Tộc",
            "category": "CHUYỆN NHÀ SÁNG NGHIỆP",
            "title": "GƯƠNG MẶT KỶ LỤC GIA TIÊU BIỂU",
            "slogan": "KỶ LỤC GIA VĂN HÓA DÂN GIAN",
            "description": "Từ xưởng gốm thủ công thô mộc đến việc xác lập kỷ lục chiếc bình gốm độc bản khắc họa 54 dân tộc anh em. Câu chuyện về lòng kiên định vượt qua ba lần suy thoái để xây dựng cơ đồ bền vững.",
            "research_info": [
                {"label": "Hành trình", "value": "40 năm gìn giữ nghề"},
                {"label": "Thành tựu", "value": "Xác lập kỷ lục bình gốm 54 dân tộc"},
                {"label": "Lĩnh vực", "value": "Gốm mỹ nghệ truyền thống"},
            ],
            "image": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
            "project_info": {
                "image": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
                "btn_action": "ĐỌC TOÀN BỘ CÂU CHUYỆN SÁNG NGHIỆP",
                "link": "/stories/nghe-nhan-vu-van-hung",
            },
        },
    ]

    project_ids = []
    for item in projects_data:
        existing = Project.query.filter_by(name=item["name"]).first()
        if not existing:
            category = ProjectCategory.query.filter_by(name=item["category"]).one()
            validated = _dto_data(project_dto.ProjectRequest(), {
                **{key: value for key, value in item.items() if key != "category"},
                "category_id": category.id,
            })
            new_proj = Project(
                **validated,
            )
            db.session.add(new_proj)
            db.session.flush()
            project_ids.append(new_proj.id)
            print(f"  + Đã thêm dự án ID {new_proj.id}: {new_proj.name}")
        else:
            project_ids.append(existing.id)
            print(f"  . Đã có dự án ID {existing.id}: {existing.name}")
    db.session.commit()

    # ========================================================
    # BƯỚC 4: CHƯƠNG TRÌNH HỢP TÁC & ĐÀO TẠO
    # ========================================================
    print("\n[4/7] Đang seed Chương trình hợp tác & Đào tạo...")
    trainings_data = [
        {
            "id": "VK-01",
            "name": "Quản trị đổi mới sáng tạo",
            "time": "2 ngày workshop thực hành",
            "certificate": "Chứng nhận Quản trị đổi mới sáng tạo",
            "props": {
                "target_audience": "Lãnh đạo và quản lý doanh nghiệp",
                "description": "Ứng dụng phương pháp đổi mới vào quản trị và phát triển sản phẩm.",
                "highlights": [
                    "Xây dựng văn hóa đổi mới",
                    "Thiết kế và đánh giá sáng kiến",
                ],
                "locations": ["Hà Nội", "TP. Hồ Chí Minh"],
            },
        },
        {
            "id": "VK-02",
            "name": "Bảo tồn và phát triển làng nghề",
            "time": "3 buổi chuyên đề",
            "certificate": "Chứng nhận Phát triển làng nghề",
            "props": {
                "target_audience": "Nghệ nhân, hợp tác xã và đơn vị quản lý làng nghề",
                "description": "Kết hợp tri thức truyền thống với mô hình phát triển bền vững.",
                "highlights": [
                    "Nhận diện giá trị di sản",
                    "Phát triển sản phẩm và thị trường",
                ],
                "locations": ["Hà Nội", "Huế"],
            },
        },
        {
            "id": "VK-03",
            "name": "Sở hữu trí tuệ và tài sản sáng tạo",
            "time": "1 ngày chuyên đề",
            "certificate": "Chứng nhận Tài sản sáng tạo",
            "props": {
                "target_audience": "Doanh nghiệp, nhà sáng chế và chuyên gia",
                "description": "Nhận diện, bảo hộ và khai thác giá trị tài sản trí tuệ.",
                "highlights": [
                    "Tổng quan quyền sở hữu trí tuệ",
                    "Định giá và thương mại hóa tài sản",
                ],
                "locations": ["TP. Hồ Chí Minh"],
            },
        },
    ]
    training_ids = []
    for item in trainings_data:
        validated = _dto_data(training_dto.CreateTrainingDTO(), item)
        validated["props"] = _dto_data(
            training_dto.TrainingPropsDTO(), validated["props"]
        )
        training = Training.query.filter_by(id=validated["id"]).first()
        if training is None:
            training = Training(**validated)
            db.session.add(training)
            print(f"  + Đã thêm chương trình {training.id}: {training.name}")
        else:
            print(f"  . Đã có chương trình {training.id}: {training.name}")
        training_ids.append(training.id)
    db.session.commit()

    # ========================================================
    # BƯỚC 5: HEADER NAVIGATION / PAGES
    # ========================================================
    seed_nav_pages()
    seed_forum_page()

    # Cập nhật các section cấu hình của từng trang.
    seed_contact_page()
    seed_introduce()
    seed_events_page()
    seed_event_dates()
    seed_founder_page()
    seed_project_page()
    seed_training_page()
    seed_record_page()

    # ========================================================
    # BƯỚC 6: PROPS TRANG CHỦ
    # ========================================================
    print("\n[6/7] Đang cấu hình & seed nội dung Trang Chủ (Page Home)...")

    hero_section_payload = {
        "badge": "VIỆN KỶ LỤC VIỆT NAM — VIETKINGS",
        "title_main": "TRUNG TÂM CÔNG NGHIỆP SÁNG TẠO",
        "subtitle": "NƠI KẾT TINH TRÍ TUỆ, XÁC LẬP KỶ LỤC VÀ TÔN VINH GIÁ TRỊ VIỆT",
        "quote": '"Chứng thực giá trị — Kiến tạo tài sản — Trao truyền ý chí"',
        "buttons": [
            {"text": "TÌM HIỂU VỀ CHÚNG TÔI", "link": "/about"},
            {"text": "KHÁM PHÁ KỶ LỤC & DỰ ÁN", "link": "/projects"},
        ],
        "statistics": [
            {"value": "500+", "label": "KỶ LỤC GIA & TỔ CHỨC"},
            {"value": "120+", "label": "CÔNG TRÌNH SÁNG TẠO"},
            {"value": "63", "label": "TỈNH THÀNH KẾT NỐI"},
            {"value": "20+", "label": "NĂM DI SẢN TÔN VINH"},
        ],
    }
    HeroSectionRequestDTO().load(hero_section_payload)

    about_section_payload = {
        "tag": "SỨ MỆNH & TẦM NHÌN QUỐC GIA",
        "title_main": "VỀ TRUNG TÂM CÔNG NGHIỆP SÁNG TẠO",
        "featured_image": {
            "url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
            "caption_title": "Viện Kỷ lục Việt Nam (VietKings)",
            "caption_text": "Thành trì kết nối những trí tuệ ưu tú, gìn giữ tinh hoa văn hóa và đổi mới sáng tạo.",
        },
        "core_values": [
            {
                "icon": "bank",
                "title": "Tôn chỉ Hoạt động",
                "description": "Trung tâm Công nghiệp Sáng tạo được thành lập với mục tiêu trở thành hạt nhân nghiên cứu, bảo tồn, kích hoạt các tiềm năng trí tuệ vô tận của con người Việt Nam. Chúng tôi đóng vai trò cầu nối thể chế và thị trường, biến các ý tưởng và phát minh độc bản thành tài sản sở hữu trí tuệ có giá trị thương mại bền vững.",
            },
            {
                "icon": "shield-check",
                "title": "Xác Lập Chuẩn Mực",
                "description": "Chứng thực công trình, phát minh, giải pháp đạt tiêu chí kỷ lục và sáng tạo tầm vóc.",
            },
            {
                "icon": "globe",
                "title": "Vươn Tầm Quốc Tế",
                "description": "Đưa các kỷ lục gia và sản phẩm tinh hoa dân tộc tiếp cận các thị trường toàn cầu.",
            },
        ],
        "action_button": {"text": "XEM CHI TIẾT GIỚI THIỆU", "link": "/about"},
    }
    AboutSectionRequestDTO().load(about_section_payload)

    nav_sections_payload = [
        {
            "id": 1,
            "tag": "DÒNG THỜI GIAN HOẠT ĐỘNG",
            "title_main": "SỰ KIỆN NỔI BẬT & HOẠT ĐỘNG MỚI",
            "action_button": {"text": "XEM TẤT CẢ SỰ KIỆN", "link": "/events"},
            "children_id": event_ids,
        },
        {
            "id": 2,
            "tag": "HÀNH TRÌNH THỰC TIỄN",
            "title_main": "DỰ ÁN TIÊU BIỂU & CHUYỆN NHÀ SÁNG NGHIỆP",
            "action_button": {"text": "XEM TẤT CẢ DỰ ÁN", "link": "/projects"},
            "children_id": project_ids,
        },
        {
            "id": 3,
            "tag": "BỒI DƯỠNG & LAN TỎA",
            "title_main": "CHƯƠNG TRÌNH HỢP TÁC & ĐÀO TẠO",
            "action_button": {"text": "XEM TẤT CẢ CHƯƠNG TRÌNH", "link": "/trainings"},
            "children_id": training_ids,
        },
    ]
    for nav in nav_sections_payload:
        NavSectionRequestDTO().load(nav)

    support_banner_payload = {
        "text": "Cần tư vấn trực tiếp từ Chuyên viên Viện Kỷ lục?\nĐường dây nóng tiếp nhận hồ sơ hoạt động 24/7 sẵn sàng đồng hành cùng quý vị.",
        "button": {"text": "KẾT NỐI NGAY", "link": "/contact"},
    }
    SupportBannerRequestDTO().load(support_banner_payload)

    home_props = {
        "hero_section": hero_section_payload,
        "about_section": about_section_payload,
        "nav_sections": nav_sections_payload,
        "support_banner": support_banner_payload,
        "show_in_header": True,
        "header_order": 1,
    }

    home_page = Page.query.filter_by(slug="home").first()
    if not home_page:
        home_page = Page(id=1, name="Trang chủ", slug="home", props=home_props)
        db.session.add(home_page)
        print("  -> Đã tạo mới Trang chủ (slug='home')!")
    else:
        home_page.name = "Trang chủ"
        merged_home_props = dict(home_page.props or {})
        merged_home_props.update(home_props)
        merged_home_props["show_in_header"] = True
        merged_home_props["header_order"] = 1
        home_page.props = merged_home_props
        flag_modified(home_page, "props")
        print("  -> Đã cập nhật Trang chủ (slug='home')!")

    db.session.commit()
    print("\n🎉 Seed toàn bộ dữ liệu thành công!")


RECORDS_SEED_DATA = [
    {
        "id": "1",
        "rank": "HẠNG MỤC TỐI CAO",
        "title": "Đề Cử Ngọn Hải Đăng Sáng Nghiệp",
        "subtitle": "Biểu tượng ngọn hải đăng bằng đồng mạ vàng",
        "category": "Doanh nhân & Nhà sáng lập",
        "cycle": "Chu kỳ: Thường niên (Tháng 12)",
        "icon": "flare",
        "criteria": [
            "Doanh nghiệp sở hữu tối thiểu 01 giải pháp hoặc sản phẩm có tính đột phá độc bản trên thị trường.",
            "Tạo lập từ 100 việc làm bền vững hoặc đóng góp tối thiểu 10% doanh thu thường niên cho hoạt động cộng đồng.",
            "Được Hội đồng Viện Kỷ lục Quốc gia xác nhận chỉ số ảnh hưởng tích cực trong hệ sinh thái khởi nghiệp.",
        ],
        "action": {
            "nomination": "Đề Cử / Nộp Hồ Sơ",
            "download": "QuyChe_HaiDangSangNghiep_2025.pdf",
        },
    },
    {
        "id": "2",
        "rank": "HUY CHƯƠNG VÀNG DI SẢN",
        "title": "Huy Hiệu Tinh Hoa Nghề Truyền Thống",
        "subtitle": "Đúc kim hoàn truyền thống chạm nổi",
        "category": "Nghệ nhân & Làng nghề Di sản",
        "cycle": "Chu kỳ: Định kỳ 2 năm một lần",
        "icon": "handyman",
        "criteria": [
            "Thời gian gắn bó và cống hiến liên tục tối thiểu 20 năm cho nghề thủ công di sản.",
            "Đào tạo, truyền thụ thành công ngón nghề cho tối thiểu 3 thế hệ học trò hoặc 50 lao động địa phương.",
            "Có tác phẩm đạt kỷ lục kích thước, độ tinh xảo hoặc giải thưởng tinh hoa nghề thuật cấp tỉnh/quốc gia.",
        ],
        "action": {
            "nomination": "Đề Cử / Nộp Hồ Sơ",
            "download": "QuyChe_TinhHoaNgheTruyenThong.pdf",
        },
    },
    {
        "id": "3",
        "rank": "CHỨNG NHẬN KỶ LỤC",
        "title": "Bằng Chứng Nhận Kỷ Lục Sáng Tạo Quốc Gia",
        "subtitle": "Bằng da đính ấn tín vàng Hoàng Gia",
        "category": "Nhà Khoa học, Viện nghiên cứu, Sáng chế",
        "cycle": "Chu kỳ: Thường xuyên theo đợt thẩm định",
        "icon": "history_edu",
        "criteria": [
            "Có bằng độc quyền sáng chế hoặc giải pháp hữu ích đã được Cục Sở hữu Trí tuệ cấp văn bằng bảo hộ.",
            "Đã thương mại hóa thực tế hoặc chuyển giao công nghệ cho tối thiểu 03 đơn vị sử dụng thành công.",
            "Mang thông số vượt trội định lượng được so với các giải pháp hiện hành trong khu vực.",
        ],
        "action": {
            "nomination": "Đề Cử / Nộp Hồ Sơ",
            "download": "QuyChe_KyLucSangTaoQuocGia.pdf",
        },
    },
    {
        "id": "4",
        "rank": "HẠNG MỤC ĐỀ CỬ CÔNG NGHIỆP VĂN HÓA",
        "title": "Đề Cử Đổi Mới Sáng Tạo Di Sản Việt",
        "subtitle": "Cúp Pha lê Đế Gỗ Quý Khảm Đồng",
        "category": "Doanh nghiệp Di sản, Du lịch Văn hóa & Nghệ thuật",
        "cycle": "Chu kỳ: Thường niên (Tháng 10)",
        "icon": "account_balance",
        "criteria": [
            "Sản phẩm lấy chất liệu văn hóa di sản vật thể hoặc phi vật thể của Việt Nam làm nguồn cảm hứng cốt lõi.",
            "Tích hợp công nghệ hiện đại, thúc đẩy thương hiệu quốc gia trên thị trường quốc tế.",
            "Có đánh giá tác động tích cực tới bảo tồn di sản của cơ quan quản lý văn hóa địa phương.",
        ],
        "action": {
            "nomination": "Đề Cử / Nộp Hồ Sơ",
            "download": "QuyChe_SangTaoDiSanViet.pdf",
        },
    },
    {
        "id": "5",
        "rank": "CÚP TÔN VINH ĐỈNH CAO",
        "title": "Cúp Vinh Danh Nghệ Nhân Bàn Tay Vàng Kỷ Lục",
        "subtitle": "Cúp bàn tay vàng đúc đồng nguyên khối",
        "category": "Nghệ nhân Chế tác & Điêu khắc Điển hình",
        "cycle": "Chu kỳ: Thường niên tại Đại hội Kỷ lục",
        "icon": "trophy",
        "criteria": [
            "Là tác giả trực tiếp của tối thiểu 01 tác phẩm xác lập Kỷ lục Quốc gia hoặc Châu Á.",
            "Có công trình phục chế hoặc chế tác phục vụ công trình văn hóa tầm vóc quốc gia.",
            "Được sự tín nhiệm tuyệt đối (100% phiếu thuận) từ Hội đồng Nghệ nhân Viện Kỷ lục.",
        ],
        "action": {
            "nomination": "Đề Cử / Nộp Hồ Sơ",
            "download": "QuyChe_BanTayVangKyLuc.pdf",
        },
    },
]


def seed_records():
    """Seed dữ liệu cho bảng Record."""
    print("\nĐang seed danh sách Record vào bảng record...")
    for item in RECORDS_SEED_DATA:
        validated = _dto_data(
            record_dto.RecordResquestDto(),
            {field: value for field, value in item.items() if field != "id"},
        )
        validated.pop("id", None)
        rec = Record.query.filter_by(id=item["id"]).first()
        if not rec:
            rec = Record(
                id=item["id"],
                **validated,
            )
            db.session.add(rec)
            print(f"  + Đã thêm record ID {item['id']}: {item['title']}")
        else:
            for field, value in validated.items():
                setattr(rec, field, value)
            print(f"  . Đã cập nhật record ID {item['id']}: {item['title']}")
    db.session.commit()
    print("  -> Seed bảng Record thành công!")


def seed_record_page():
    """Seed hoặc cập nhật trang records (slug='records') với dữ liệu JSON mẫu và bảng Record."""
    record_props = {
        "header": {
            "id": 1,
            "title": "HỆ THỐNG ĐỀ CỬ KỶ LỤC & TÔN VINH DANH HIỆU",
            "subtitle": "CỔNG THÔNG TIN ĐỀ CỬ KỶ LỤC QUỐC GIA",
            "icon": "military_tech",
            "slogan": "Tôn vinh trí tuệ — Ghi nhận cống hiến — Xác lập giá trị trường tồn",
            "metrics": [
                {"label": "HẠNG MỤC ĐỀ CỬ", "value": "05"},
                {"label": "HẠNG MỤC ĐỀ CỬ", "value": "100%"},
            ],
        },
        "governance": {
            "id": 2,
            "title": "QUY CHẾ PHÁP LÝ & CHUẨN MỰC",
            "subtitle": "Quy Chế & Hội Đồng Thẩm Định Khoa Học",
            "description": "Mọi hồ sơ xác lập và đề cử kỷ lục được Trung tâm Công nghiệp Sáng tạo trực thuộc Viện Kỷ lục Việt Nam (VIETKINGS) khởi xướng và thẩm định đều tuân thủ nguyên tắc khách quan, độc lập và chuẩn mực quốc tế liên minh với Liên minh Kỷ lục Thế giới (WorldKings).",
            "cards": [
                {
                    "id": 1,
                    "icon": "verified_user",
                    "title": "Minh Bạch",
                    "description": "Mọi hồ sơ xác lập và đề cử kỷ lục được Trung tâm Công nghiệp Sáng tạo trực thuộc Viện Kỷ lục Việt Nam (VIETKINGS) khởi xướng và thẩm định đều tuân thủ nguyên tắc khách quan, độc lập và chuẩn mực quốc tế liên minh với Liên minh Kỷ lục Thế giới (WorldKings).",
                },
                {
                    "id": 2,
                    "icon": "public",
                    "title": "Chuẩn Quốc Tế",
                    "description": "Mọi hồ sơ xác lập và đề cử kỷ lục được Trung tâm Công nghiệp Sáng tạo trực thuộc Viện Kỷ lục Việt Nam (VIETKINGS) khởi xướng và thẩm định đều tuân thủ nguyên tắc khách quan, độc lập và chuẩn mực quốc tế liên minh với Liên minh Kỷ lục Thế giới (WorldKings).",
                },
                {
                    "id": 3,
                    "icon": "balance",
                    "title": "Di Sản & Giá Trị",
                    "description": "Mọi hồ sơ xác lập và đề cử kỷ lục được Trung tâm Công nghiệp Sáng tạo trực thuộc Viện Kỷ lục Việt Nam (VIETKINGS) khởi xướng và thẩm định đều tuân thủ nguyên tắc khách quan, độc lập và chuẩn mực quốc tế liên minh với Liên minh Kỷ lục Thế giới (WorldKings).",
                },
            ],
            "cta": [
                {
                    "id": 1,
                    "icon": "gavel",
                    "title": "Hội Đồng Khoa Học Độc Lập",
                    "cycle": "Nhiệm kỳ 2024 - 2029 | Quyết định số 18/QĐ-VIETKINGS",
                    "number_decision": "18/QĐ-VIETKINGS",
                    "roles": [
                        {
                            "role": "Chủ tịch Hội đồng",
                            "value": "TS. Thang Văn Phúc - Nguyên Thứ trưởng Bộ Nội vụ, Chủ tịch T.Ư Hội Kỷ lục gia VN.",
                        },
                        {
                            "role": "Tổng thư ký",
                            "value": "Ban Thường trực Viện Kỷ lục Việt Nam & Viện Trưởng Viện Sáng tạo.",
                        },
                        {
                            "role": "Chuyên gia phản biện",
                            "value": "15 Giáo sư, Viện sĩ, Nghệ nhân Nhân dân danh dự.",
                        },
                    ],
                    "btn_action": "TRA CỨU DANH MỤC ĐỀ CỬ",
                }
            ],
        },
        "records": RECORDS_SEED_DATA,
        "honor_rolls": [
            {
                "id": 1,
                "title": "BẢNG VÀNG DANH DỰ",
                "subtitle": "Cá Nhân & Tập Thể Được Tôn Vinh Gần Đây",
                "description": "Ghi nhận những tấm gương cống hiến vượt bậc đã được trao chứng nhận và cúp vàng tại các kỳ hội ngộ Kỷ lục gia toàn quốc.",
                "award_nomination_name": {
                    "id": 1,
                    "label": "Đề Cử Được Vinh Danh:",
                    "value": "Bàn Tay Vàng Kỷ Lục 2024",
                },
                "cards": [
                    {
                        "year": "Năm 2024",
                        "title": "Nghệ nhân Trần Duy Long",
                        "description": "Làng nghề Gốm Bát Tràng, Hà Nội",
                        "category": "nghe-nhan",
                        "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
                    },
                    {
                        "year": "Năm 2024",
                        "title": "Bà Nguyễn Hồng Trang",
                        "description": "Chủ tịch HĐQT Tập đoàn Dược Liệu Tự Nhiên",
                        "category": "doanh-nhan",
                        "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
                    },
                    {
                        "year": "Năm 2023",
                        "title": "Công ty CP Di Sản Số Đông Dương",
                        "description": "Dự án Số hóa 3D Đại Nội Huế",
                        "category": "doanh-nhan",
                        "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
                    },
                    {
                        "year": "Năm 2023",
                        "title": "Nghệ nhân Đỗ Quang Hùng",
                        "description": "Lụa Vạn Phúc - Hà Đông",
                        "category": "nghe-nhan",
                        "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
                    },
                ],
            }
        ],
        "process": {
            "title": "QUY TRÌNH 4 BƯỚC THẨM ĐỊNH & XÁC LẬP",
            "subtitle": "QUY TRÌNH CHUẨN HÓA",
            "description": "Đảm bảo tính pháp lý, độc lập tuyệt đối và đánh giá giá trị sáng tạo theo quy chế Viện Kỷ lục Việt Nam.",
            "cards": [
                {
                    "id": 1,
                    "icon": "description",
                    "title": "Nộp Hồ Sơ Sơ Khảo",
                    "description": "Tổ chức hoặc cá nhân gửi bộ hồ sơ đề cử theo biểu mẫu ban hành, đính kèm văn bằng sở hữu trí tuệ, báo cáo tài chính kiểm toán và tư liệu minh chứng.",
                    "color": "primary",
                    "info": [
                        {
                            "label": "Thời gian",
                            "value": "Tiếp nhận liên tục theo đợt công bố.",
                        }
                    ],
                },
                {
                    "id": 2,
                    "icon": "psychology",
                    "title": "HĐ Khoa Học Thẩm Định",
                    "description": "Hội đồng Khoa học gồm các Giáo sư, Nhà nghiên cứu họp phiên chuyên đề đánh giá tính xác thực, đóng góp xã hội và giá trị độc bản của đề cử.",
                    "color": "primary",
                    "info": [{"label": "Thời gian", "value": "15 – 20 ngày làm việc."}],
                },
                {
                    "id": 3,
                    "icon": "travel_explore",
                    "title": "Khảo Sát Thực Địa",
                    "description": "Đoàn Thư ký và Giám định viên trực tiếp xuống cơ sở, xưởng sản xuất, viện nghiên cứu để kiểm tra quy trình thực tế và phỏng vấn nhân chứng.",
                    "color": "primary",
                    "info": [
                        {
                            "label": "Biên bản",
                            "value": "Lập biên bản giám định thực tế.",
                        }
                    ],
                },
                {
                    "id": 4,
                    "icon": "military_tech",
                    "title": "Công Bố & Xác Lập Kỷ Lục",
                    "description": "Ban hành Nghị quyết Vinh danh, cấp Bằng chứng nhận, Huy chương vàng và truyền thông chính thống tại Đại hội Kỷ lục Gia Toàn Quốc.",
                    "color": "secondary",
                    "info": [
                        {
                            "label": "Địa điểm",
                            "value": "Khách sạn Rex / Dinh Độc Lập / Hà Nội.",
                        }
                    ],
                },
            ],
        },
        "show_in_header": True,
        "header_order": 4,
    }
    page = Page.query.filter_by(slug="records").first()
    if page is None:
        page = Page(id=4, name="Kỷ lục", slug="records", props=record_props)
        db.session.add(page)
    else:
        page.props = {**(page.props or {}), **record_props}
        flag_modified(page, "props")
    db.session.commit()
    print("  -> Đã seed page records.")

    # Seed các dòng record vào bảng record
    seed_records()


# Gọi hàm seed mới


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Khởi tạo dữ liệu mẫu.")
    seed_modes = parser.add_mutually_exclusive_group()
    seed_modes.add_argument(
        "--introduce-only",
        action="store_true",
        help="Chỉ bổ sung nội dung trang Giới thiệu.",
    )
    seed_modes.add_argument(
        "--nav-only",
        action="store_true",
        help="Chỉ tạo/cập nhật các trang điều hướng và dữ liệu giải thưởng.",
    )
    seed_modes.add_argument(
        "--events-only",
        action="store_true",
        help="Chỉ bổ sung nội dung trang Sự kiện và ngày sự kiện.",
    )
    seed_modes.add_argument(
        "--project-page-only",
        action="store_true",
        help="Chỉ bổ sung/cập nhật trang Projects.",
    )
    seed_modes.add_argument(
        "--contact-only",
        action="store_true",
        help="Chỉ bổ sung nội dung trang Contact.",
    )
    seed_modes.add_argument(
        "--training-page-only",
        action="store_true",
        help="Chỉ bổ sung/cập nhật trang Training.",
    )
    seed_modes.add_argument(
        "--forum-page-only",
        action="store_true",
        help="Chỉ bổ sung nội dung còn thiếu của trang Diễn đàn.",
    )
    args = parser.parse_args()

    app = create_app()
    with app.app_context():
        db.create_all()
        if args.introduce_only:
            seed_introduce()
        elif args.nav_only:
            seed_nav_pages()
            seed_forum_page()
        elif args.events_only:
            seed_events_page()
            seed_event_dates()
        elif args.project_page_only:
            seed_project_page()
        elif args.training_page_only:
            seed_training_page()
        elif args.forum_page_only:
            seed_forum_page()
        elif args.contact_only:
            seed_contact_page()
        else:
            seed_database()
