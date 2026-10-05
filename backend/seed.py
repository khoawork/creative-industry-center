import datetime
import argparse

from sqlalchemy.orm.attributes import flag_modified
from extensions import db
from models import (
    Award,
    Event,
    EventCategory,
    Page,
    Project,
    ProjectCategory,
    Training,
    User,
)
from dto.home_dto import (
    AboutSectionRequestDTO,
    HeroSectionRequestDTO,
    NavSectionRequestDTO,
    SupportBannerRequestDTO,
)
from repositories.id_counter_repository import generate_id
from models.EventModel import EventStatus
from models.UserModel import RoleEnum
from dto import introduce_dto, event_dto
from app import create_app


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


def seed_events_page(page_id=3):
    """Bổ sung props trang Events, giữ nguyên các giá trị đã lưu."""
    page = db.session.get(Page, page_id)
    if page is None or page.slug != "events":
        raise ValueError(f"Không tìm thấy trang Sự kiện (id={page_id}).")
    if not isinstance(page.props, dict):
        raise ValueError("Props trang Sự kiện không hợp lệ.")

    hero = event_dto.EventPageHeroDTO().load(EVENTS_HERO_EVENT)
    filters = event_dto.EventPageFilterDTO().load(EVENTS_FILTER_EVENT)
    displayed_events = event_dto.EventPageDisplayDTO().load({
        "event_ids": [event.id for event in Event.query.order_by(Event.id.asc()).all()]
    })
    newsletter = event_dto.EventPageNewsletterDTO().load(NEWSLETTER_EVENT)
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


# Seed images are served from frontend/public/images/about/.
INTRODUCE_SECTIONS = {
    "hero_section": {
        "breadcrumbs": [{"text": "Trang chủ", "link": "/"}, {"text": "Giới thiệu", "link": None}],
        "title_main": "Trung tâm Công nghiệp Sáng tạo",
        "quote": "Kết nối tri thức, khơi nguồn sáng tạo, lan tỏa giá trị Việt.",
        "quote_author": "",
    },
    "overview_section": {
        "tag": "Tổng quan", "title_main": "Không gian kết nối và sáng tạo",
        "paragraphs": ["Trung tâm Công nghiệp Sáng tạo kết nối cộng đồng sáng tạo, doanh nghiệp và chuyên gia để cùng phát triển các giá trị văn hóa, tri thức và đổi mới."],
        "featured_image": {
            "url": "/images/about/overview.jpg",
            "alt": "Hội trường VietKings với khu vực trưng bày biểu trưng danh dự",
            "tag": "Kết nối", "caption_title": "Nơi hội tụ những giá trị sáng tạo",
        },
        "statistics": [],
    },
    "vision_section": {
        "tag": "Tầm nhìn", "title_main": "Lan tỏa giá trị sáng tạo Việt",
        "paragraphs": ["Xây dựng cộng đồng hợp tác bền vững, đưa tri thức và bản sắc Việt đến gần hơn với đời sống."],
        "featured_image": {
            "url": "/images/about/vision.jpg", "alt": "Các diễn giả trao đổi tại diễn đàn kinh tế sáng tạo",
            "caption_title": "Cùng định hướng tương lai",
        },
        "items": [{"icon": "globe", "title": "Kết nối rộng mở", "description": "Thúc đẩy trao đổi tri thức và hợp tác giữa các cộng đồng sáng tạo."}],
    },
    "mission_section": {
        "tag": "Sứ mệnh", "title_main": "Đồng hành cùng cộng đồng sáng tạo",
        "featured_image": {
            "url": "/images/about/mission.jpg", "alt": "Lễ công bố và vinh danh kỷ lục Việt Nam",
            "caption_title": "Tôn vinh những đóng góp cho cộng đồng",
        },
        "items": [{"icon": "lightbulb", "title": "Khơi nguồn ý tưởng", "description": "Tạo điều kiện để ý tưởng được chia sẻ, phát triển và ứng dụng."}],
    },
    "core_values_section": {
        "tag": "Giá trị cốt lõi", "title_main": "Tri thức, sáng tạo và hợp tác",
        "description": "Lấy con người và giá trị cộng đồng làm nền tảng cho các hoạt động.",
        "items": [{"icon": "handshake", "title": "Hợp tác", "description": "Cùng chia sẻ nguồn lực và phát triển những giá trị lâu dài."}],
    },
    "actions_section": {"buttons": [
        {"text": "Liên hệ hợp tác", "link": "/contact", "icon": "handshake"},
        {"text": "Khám phá chương trình", "link": "/training", "icon": "graduation_cap"},
    ]},
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
            raise ValueError("Page introduce có props sai kiểu; cần sửa dữ liệu trước khi seed.")
        props = dict(page.props) if page is not None else {}
        missing = [key for key in schemas if key not in props]
        
        additions = {}
        for key in missing:
            schema = schemas[key]()
            additions[key] = schema.dump(schema.load(INTRODUCE_SECTIONS[key]))
            
        if page is None:
            page = Page(id=2, name="Giới thiệu", slug="introduce", props={**additions, "show_in_header": True, "header_order": 2})
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
                        {"id": "founder_info_1", "label": "Chức danh", "value": "Founder & CEO"},
                        {"id": "founder_info_2", "label": "Kinh nghiệm", "value": "10+ năm"},
                        {"id": "founder_info_3", "label": "Lĩnh vực", "value": "Technology & Business"},
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
                        {"id": "founder_info_4", "label": "Chức danh", "value": "Co-Founder & CTO"},
                        {"id": "founder_info_5", "label": "Kinh nghiệm", "value": "8+ năm"},
                        {"id": "founder_info_6", "label": "Lĩnh vực", "value": "Software Engineering"},
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
    """Cập nhật và sắp xếp lại 10 trang điều hướng trong database đúng thứ tự id từ 1 đến 10."""
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

    # Thu thập dữ liệu props hiện tại theo slug
    existing_pages = Page.query.all()
    props_by_slug = {}
    for p in existing_pages:
        slug = p.slug
        if slug == "about":
            slug = "introduce"
        elif slug == "stories":
            slug = "founder"
        current_dict = dict(p.props or {})
        if slug not in props_by_slug or len(current_dict) > len(props_by_slug[slug]):
            props_by_slug[slug] = current_dict

    # Xóa sạch bảng page và reset autoincrement để đảm bảo id từ 1 đến 10
    db.session.query(Page).delete()
    try:
        db.session.execute(db.text("DELETE FROM sqlite_sequence WHERE name='page'"))
    except Exception:
        pass
    db.session.commit()

    for item in nav_specs:
        target_id = item["id"]
        slug = item["slug"]
        name = item["name"]

        props = props_by_slug.get(slug, {})
        props["show_in_header"] = True
        props["header_order"] = target_id

        page = Page(
            id=target_id,
            name=name,
            slug=slug,
            props=props,
        )
        db.session.add(page)
        print(f"  + [{target_id}] {name} (slug: {slug}) -> header_order: {target_id}")

    db.session.commit()
    print("  -> Cập nhật 10 trang điều hướng thành công với id từ 1 đến 10!")


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
    if not User.query.filter_by(username="admin").first():
        admin_user = User(
            username="admin",
            email="admin@vietkings.org",
            password="pbkdf2:sha256:default_hashed_password",
            full_name="Quản trị viên Viện Kỷ lục",
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
            role=RoleEnum.ADMIN,
        )
        db.session.add(admin_user)
        db.session.commit()
        print("  -> Đã tạo tài khoản admin: admin@vietkings.org")
    else:
        print("  -> Tài khoản admin đã tồn tại.")

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
            "speaker": [{"name": "TS. Lê Doãn Hợp", "title": "Chủ tịch Hội đồng Xác lập Kỷ lục Việt Nam"}],
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
            "speaker": [{"name": "Nghệ nhân Nhân dân Trần Độ", "title": "Bậc thầy Gốm sứ Bát Tràng"}],
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
            "speaker": [{"name": "TS. Võ Trí Thành", "title": "Viện trưởng Viện Nghiên cứu Chiến lược Thương hiệu"}],
            "location": "Khách sạn Rex, Quận 1, TP. Hồ Chí Minh",
            "image": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
            "status": EventStatus.UPCOMING,
            "btn_action": "ĐỌC BÁO CÁO SỰ KIỆN",
            "form_url": "/events/toa-dam-tai-san-vo-hinh",
        },
    ]

    event_ids = []
    for item in events_data:
        existing = Event.query.filter_by(name=item["name"]).first()
        if not existing:
            new_event = Event(
                name=item["name"],
                description=item["description"],
                speaker=item["speaker"],
                location=item["location"],
                event_date=item["event_date"],
                image=item["image"],
                status=item["status"],
                btn_action=item["btn_action"],
                form_url=item["form_url"],
                category_id=EventCategory.query.filter_by(name=item["category"]).one().id,
            )
            db.session.add(new_event)
            db.session.flush()
            event_ids.append(new_event.id)
            print(f"  + Đã thêm sự kiện ID {new_event.id}: {new_event.name}")
        else:
            if existing.event_date is None:
                existing.event_date = item["event_date"]
            event_ids.append(existing.id)
            print(f"  . Đã có sự kiện ID {existing.id}: {existing.name}")
    db.session.commit()

    # ========================================================
    # BƯỚC 3: DỰ ÁN TIÊU BIỂU & CHUYỆN SÁNG NGHIỆP
    # ========================================================
    print("\n[3/7] Đang seed Dự án & Chuyện nhà sáng nghiệp...")
    project_categories = ["DỰ ÁN TIÊU BIỂU", "CHUYỆN NHÀ SÁNG NGHIỆP"]
    for category_name in project_categories:
        if not ProjectCategory.query.filter_by(name=category_name).first():
            db.session.add(ProjectCategory(name=category_name))
    db.session.commit()

    projects_data = [
        {
            "name": "Bảo Tàng Không Gian Kỷ Lục Sáng Tạo Việt Nam (Giai Đoạn 1)",
            "category": "DỰ ÁN TIÊU BIỂU",
            "title": "DỰ ÁN TRỌNG ĐIỂM QUỐC GIA",
            "slogan": "KHỞI CÔNG 2025 – QUY MÔ 12 HECTA",
            "description": "Khu phức hợp lưu trữ, bảo tồn và ứng dụng công nghệ thực tế ảo tương tác nhằm tái hiện hành trình xác lập các kỳ tích quốc gia. Công trình tạo điểm đến văn hóa giáo dục tự hào cho thế hệ trẻ.",
            "research_info": {"scale": "12 Hecta", "start_year": "2025", "technology": "VR/AR Interactive 3D", "focus": "Lưu trữ, giáo dục & bảo tồn văn hóa"},
            "project_info": {"image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80", "btn_action": "TÌM HIỂU TIẾN ĐỘ DỰ ÁN", "link": "/projects/bao-tang-khong-gian-ky-luc"},
        },
        {
            "name": "Chuyện Nhà Sáng Nghiệp: Nghệ Nhân Vũ Văn Hùng & Hành Trình 40 Năm Giữ Lửa Gốm Dân Tộc",
            "category": "CHUYỆN NHÀ SÁNG NGHIỆP",
            "title": "GƯƠNG MẶT KỶ LỤC GIA TIÊU BIỂU",
            "slogan": "KỶ LỤC GIA VĂN HÓA DÂN GIAN",
            "description": "Từ xưởng gốm thủ công thô mộc đến việc xác lập kỷ lục chiếc bình gốm độc bản khắc họa 54 dân tộc anh em. Câu chuyện về lòng kiên định vượt qua ba lần suy thoái để xây dựng cơ đồ bền vững.",
            "research_info": {"career_span": "40 năm gìn giữ nghề", "achievement": "Xác lập kỷ lục bình gốm 54 dân tộc", "field": "Gốm mỹ nghệ truyền thống"},
            "project_info": {"image": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80", "btn_action": "ĐỌC TOÀN BỘ CÂU CHUYỆN SÁNG NGHIỆP", "link": "/stories/nghe-nhan-vu-van-hung"},
        },
    ]

    project_ids = []
    for item in projects_data:
        existing = Project.query.filter_by(name=item["name"]).first()
        if not existing:
            new_proj = Project(
                name=item["name"],
                title=item["title"],
                slogan=item["slogan"],
                description=item["description"],
                research_info=item["research_info"],
                project_info=item["project_info"],
                category_id=ProjectCategory.query.filter_by(name=item["category"]).one().id,
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
            "name": "Đào Tạo Quản Trị Tài Sản Trí Tuệ & Thương Quyền Kỷ Lục",
            "time": datetime.date(2025, 6, 1),
            "certificate": "Chứng chỉ Quản trị Tài sản Trí tuệ - VietKings",
            "props": {"icon": "graduation-cap", "description": "Khóa học chuyên sâu dành cho chủ doanh nghiệp, giúp biến giá trị vô hình thành công cụ tăng trưởng doanh thu vượt bậc.", "info_highlight": "Thời lượng: 6 tuần • Trực tiếp & Trực tuyến", "btn_action": "ĐĂNG KÝ THAM VẤN", "link": "/trainings/quan-tri-tai-san-tri-tue"},
        },
        {
            "name": "Ươm Tạo Doanh Nghiệp Công Nghiệp Văn Hóa Sáng Tạo",
            "time": datetime.date(2025, 7, 1),
            "certificate": "Chứng nhận Ươm tạo Doanh nghiệp Sáng tạo",
            "props": {"icon": "lightbulb", "description": "Chương trình cố vấn 1–1 cùng các Kỷ lục gia và chuyên gia công nghệ, hoàn thiện mô hình sản phẩm từ phôi thai đến thị trường.", "info_highlight": "Chỉ tiêu: 20 dự án mỗi khóa", "btn_action": "ĐĂNG KÝ THAM VẤN", "link": "/trainings/uom-tao-doanh-nghiep-sang-tao"},
        },
        {
            "name": "Liên Minh Hợp Tác Viện – Doanh Nghiệp – Địa Phương",
            "time": datetime.date(2025, 8, 1),
            "certificate": "Chứng thư Liên minh Hợp tác Chiến lược",
            "props": {"icon": "handshake", "description": "Ký kết hợp tác chiến lược nhằm xây dựng hồ sơ kỷ lục chỉ dẫn địa lý, quảng bá văn hóa ẩm thực và thắng cảnh du lịch tỉnh thành.", "info_highlight": "Hỗ trợ pháp lý & Xúc tiến truyền thông", "btn_action": "LIÊN HỆ HỢP TÁC", "link": "/cooperation"},
        },
    ]

    training_ids = []
    for item in trainings_data:
        existing = Training.query.filter_by(name=item["name"]).first()
        if not existing:
            new_train = Training(
                id=generate_id("VK"),
                name=item["name"],
                time=normalize_date(item["time"]),
                certificate=item["certificate"],
                props=item["props"],
            )
            db.session.add(new_train)
            db.session.flush()
            training_ids.append(new_train.id)
            print(f"  + Đã thêm khóa đào tạo ID {new_train.id}: {new_train.name}")
        else:
            training_ids.append(existing.id)
            print(f"  . Đã có khóa đào tạo ID {existing.id}: {existing.name}")
    db.session.commit()

    # ========================================================
    # BƯỚC 5: HEADER NAVIGATION / PAGES (Thứ tự bắt đầu từ Trang chủ id=1..10)
    # ========================================================
    seed_nav_pages()

    # Cập nhật chi tiết các sections cho Giới thiệu & Founder
    seed_introduce()
    seed_events_page()
    seed_founder_page()

    # ========================================================
    # BƯỚC 6: PROPS TRANG CHỦ
    # ========================================================
    print("\n[6/7] Đang cấu hình & seed nội dung Trang Chủ (Page Home)...")

    hero_section_payload = {
        "badge": "VIỆN KỶ LỤC VIỆT NAM — VIETKINGS",
        "title_main": "TRUNG TÂM CÔNG NGHIỆP SÁNG TẠO",
        "subtitle": "NƠI KẾT TINH TRÍ TUỆ, XÁC LẬP KỶ LỤC VÀ TÔN VINH GIÁ TRỊ VIỆT",
        "quote": '"Chứng thực giá trị — Kiến tạo tài sản — Trao truyền ý chí"',
        "buttons": [{"text": "TÌM HIỂU VỀ CHÚNG TÔI", "link": "/about"}, {"text": "KHÁM PHÁ KỶ LỤC & DỰ ÁN", "link": "/projects"}],
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
        "featured_image": {"url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80", "caption_title": "Viện Kỷ lục Việt Nam (VietKings)", "caption_text": "Thành trì kết nối những trí tuệ ưu tú, gìn giữ tinh hoa văn hóa và đổi mới sáng tạo."},
        "core_values": [
            {"icon": "bank", "title": "Tôn chỉ Hoạt động", "description": "Trung tâm Công nghiệp Sáng tạo được thành lập với mục tiêu trở thành hạt nhân nghiên cứu, bảo tồn, kích hoạt các tiềm năng trí tuệ vô tận của con người Việt Nam. Chúng tôi đóng vai trò cầu nối thể chế và thị trường, biến các ý tưởng và phát minh độc bản thành tài sản sở hữu trí tuệ có giá trị thương mại bền vững."},
            {"icon": "shield-check", "title": "Xác Lập Chuẩn Mực", "description": "Chứng thực công trình, phát minh, giải pháp đạt tiêu chí kỷ lục và sáng tạo tầm vóc."},
            {"icon": "globe", "title": "Vươn Tầm Quốc Tế", "description": "Đưa các kỷ lục gia và sản phẩm tinh hoa dân tộc tiếp cận các thị trường toàn cầu."},
        ],
        "action_button": {"text": "XEM CHI TIẾT GIỚI THIỆU", "link": "/about"},
    }
    AboutSectionRequestDTO().load(about_section_payload)

    nav_sections_payload = [
        {"id": 1, "tag": "DÒNG THỜI GIAN HOẠT ĐỘNG", "title_main": "SỰ KIỆN NỔI BẬT & HOẠT ĐỘNG MỚI", "action_button": {"text": "XEM TẤT CẢ SỰ KIỆN", "link": "/events"}, "children_id": event_ids},
        {"id": 2, "tag": "HÀNH TRÌNH THỰC TIỄN", "title_main": "DỰ ÁN TIÊU BIỂU & CHUYỆN NHÀ SÁNG NGHIỆP", "action_button": {"text": "XEM TẤT CẢ DỰ ÁN", "link": "/projects"}, "children_id": project_ids},
        {"id": 3, "tag": "BỒI DƯỠNG & LAN TỎA", "title_main": "CHƯƠNG TRÌNH HỢP TÁC & ĐÀO TẠO", "action_button": {"text": "XEM TẤT CẢ CHƯƠNG TRÌNH", "link": "/trainings"}, "children_id": training_ids},
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

    # ========================================================
    # BƯỚC 7: GIẢI THƯỞNG
    # ========================================================
    print("\n[7/7] Đang kiểm tra Giải thưởng...")
    if not Award.query.first():
        award = Award(
            id=generate_id("VK-AWD"),
            name="Kỷ lục Quốc gia",
            title="Tôn vinh Công trình Sáng tạo Độc bản",
            description="Chứng nhận sáng kiến, giải pháp và công trình mang giá trị văn hóa và khoa học xuất sắc.",
            decision_number="QĐ-VK-2025/01",
        )
        db.session.add(award)

    db.session.commit()
    print("\n🎉 Seed toàn bộ dữ liệu thành công!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Khởi tạo dữ liệu mẫu.")
    parser.add_argument("--introduce-only", action="store_true",
                        help="Chỉ bổ sung Giới thiệu; giữ nguyên Home và nội dung đã sửa.")
    parser.add_argument("--nav-only", action="store_true",
                        help="Chỉ cập nhật thứ tự và props các trang điều hướng (nav).")
    parser.add_argument("--events-only", action="store_true",
                        help="Chỉ bổ sung các trường đầu trang, bộ lọc và bản tin Events chưa có.")
    args = parser.parse_args()
    
    app = create_app()
    with app.app_context():
        if args.events_only:
            seed_events_page()
            seed_event_dates()
            print("Đã bổ sung nội dung trang Sự kiện; giữ nguyên nội dung đã lưu.")
        elif args.introduce_only:
            seed_introduce()
        elif args.nav_only:
            seed_nav_pages()
        else:
            seed_database()
