import datetime
from app import create_app
from extensions import db
from models import (
    Page,
    Event,
    EventCategory,
    EventStatus,
    Project,
    Training,
    Award,
    User,
    RoleEnum
)
from dto.home_dto import (
    HeroSectionRequestDTO,
    AboutSectionRequestDTO,
    NavSectionRequestDTO,
    SupportBannerRequestDTO
)


def seed_database():
    """Hàm seed toàn bộ dữ liệu mẫu theo giao diện thiết kế vào Database."""
    print("=" * 60)
    print(" BẮT ĐẦU SEED DỮ LIỆU VÀO DATABASE CHO CREATIVE INDUSTRY")
    print("=" * 60)

    # 1. Đảm bảo bảng đã được tạo
    db.create_all()

    # ========================================================
    # BƯỚC 1: SEED NGƯỜI DÙNG QUẢN TRỊ (USER)
    # ========================================================
    print("\n[1/6] Đang kiểm tra & seed tài khoản Người dùng (User)...")
    if not User.query.filter_by(username="admin").first():
        admin_user = User(
            username="admin",
            email="admin@vietkings.org",
            password="pbkdf2:sha256:default_hashed_password",
            full_name="Quản trị viên Viện Kỷ lục",
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
            role=RoleEnum.ADMIN
        )
        db.session.add(admin_user)
        db.session.commit()
        print("  -> Đã tạo tài khoản admin: admin@vietkings.org")
    else:
        print("  -> Tài khoản admin đã tồn tại.")

    # ========================================================
    # BƯỚC 2: SEED DANH MỤC & SỰ KIỆN NỔI BẬT (EVENT) - Hình 3
    # ========================================================
    print("\n[2/6] Đang seed Sự kiện nổi bật (Hình 3)...")
    categories = [
        "ĐẠI HỘI THƯỜNG NIÊN",
        "TRIỂN LÃM ĐỘC BẢN",
        "TỌA ĐÀM KINH TẾ"
    ]
    for cat_name in categories:
        if not EventCategory.query.filter_by(name=cat_name).first():
            db.session.add(EventCategory(name=cat_name))
    db.session.commit()

    events_data = [
        {
            "id": 1,
            "name": "Hội ngộ Kỷ lục gia Việt Nam lần thứ 54: Tôn vinh Sáng tạo Quốc gia",
            "description": "Quy tụ hơn 300 kỷ lục gia và các nhà sáng chế trên toàn quốc nhằm đúc kết thành tựu đổi mới trong công nghệ và văn hóa di sản.",
            "speaker": [
                {"name": "TS. Lê Doãn Hợp", "title": "Chủ tịch Hội đồng Xác lập Kỷ lục Việt Nam"}
            ],
            "location": "Trung tâm Hội nghị Quốc gia, Hà Nội",
            "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
            "status": EventStatus.UPCOMING,
            "btn_action": "ĐỌC BÁO CÁO SỰ KIỆN",
            "form_url": "/events/hoi-ngo-ky-luc-gia-54"
        },
        {
            "id": 2,
            "name": "Không Gian Trưng Bày Tinh Hoa Thủ Công Mỹ Nghệ Đạt Kỷ Lục",
            "description": "Khám phá những kiệt tác sơn mài, khảm xà cừ và gốm sứ đạt đỉnh cao nghệ thuật của các nghệ nhân nhân dân kỳ cựu.",
            "speaker": [
                {"name": "Nghệ nhân Nhân dân Trần Độ", "title": "Bậc thầy Gốm sứ Bát Tràng"}
            ],
            "location": "Bảo tàng Hà Nội, Phạm Hùng, Nam Từ Liêm",
            "image": "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
            "status": EventStatus.UPCOMING,
            "btn_action": "ĐỌC BÁO CÁO SỰ KIỆN",
            "form_url": "/events/khong-gian-tinh-hoa-thu-cong"
        },
        {
            "id": 3,
            "name": 'Tọa đàm: "Tài sản Vô hình & Định giá Thương hiệu Kỷ lục"',
            "description": "Chia sẻ từ các chuyên gia kinh tế đầu ngành về phương pháp định giá thương quyền sở hữu trí tuệ và mở rộng dòng vốn đầu tư.",
            "speaker": [
                {"name": "TS. Võ Trí Thành", "title": "Viện trưởng Viện Nghiên cứu Chiến lược Thương hiệu"}
            ],
            "location": "Khách sạn Rex, Quận 1, TP. Hồ Chí Minh",
            "image": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
            "status": EventStatus.UPCOMING,
            "btn_action": "ĐỌC BÁO CÁO SỰ KIỆN",
            "form_url": "/events/toa-dam-tai-san-vo-hinh"
        }
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
                image=item["image"],
                status=item["status"],
                btn_action=item["btn_action"],
                form_url=item["form_url"]
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
    # BƯỚC 3: SEED DỰ ÁN TIÊU BIỂU & CHUYỆN SÁNG NGHIỆP (PROJECT) - Hình 4
    # ========================================================
    print("\n[3/6] Đang seed Dự án & Chuyện nhà sáng nghiệp (Hình 4)...")
    projects_data = [
        {
            "name": "Bảo Tàng Không Gian Kỷ Lục Sáng Tạo Việt Nam (Giai Đoạn 1)",
            "title": "DỰ ÁN TRỌNG ĐIỂM QUỐC GIA",
            "slogan": "KHỞI CÔNG 2025 – QUY MÔ 12 HECTA",
            "description": "Khu phức hợp lưu trữ, bảo tồn và ứng dụng công nghệ thực tế ảo tương tác nhằm tái hiện hành trình xác lập các kỳ tích quốc gia. Công trình tạo điểm đến văn hóa giáo dục tự hào cho thế hệ trẻ.",
            "research_info": {
                "scale": "12 Hecta",
                "start_year": "2025",
                "technology": "VR/AR Interactive 3D",
                "focus": "Lưu trữ, giáo dục & bảo tồn văn hóa"
            },
            "project_info": {
                "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
                "btn_action": "TÌM HIỂU TIẾN ĐỘ DỰ ÁN",
                "link": "/projects/bao-tang-khong-gian-ky-luc"
            }
        },
        {
            "name": "Chuyện Nhà Sáng Nghiệp: Nghệ Nhân Vũ Văn Hùng & Hành Trình 40 Năm Giữ Lửa Gốm Dân Tộc",
            "title": "GƯƠNG MẶT KỶ LỤC GIA TIÊU BIỂU",
            "slogan": "KỶ LỤC GIA VĂN HÓA DÂN GIAN",
            "description": "Từ xưởng gốm thủ công thô mộc đến việc xác lập kỷ lục chiếc bình gốm độc bản khắc họa 54 dân tộc anh em. Câu chuyện về lòng kiên định vượt qua ba lần suy thoái để xây dựng cơ đồ bền vững.",
            "research_info": {
                "career_span": "40 năm gìn giữ nghề",
                "achievement": "Xác lập kỷ lục bình gốm 54 dân tộc",
                "field": "Gốm mỹ nghệ truyền thống"
            },
            "project_info": {
                "image": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
                "btn_action": "ĐỌC TOÀN BỘ CÂU CHUYỆN SÁNG NGHIỆP",
                "link": "/stories/nghe-nhan-vu-van-hung"
            }
        }
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
                project_info=item["project_info"]
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
    # BƯỚC 4: SEED CHƯƠNG TRÌNH HỢP TÁC & ĐÀO TẠO (TRAINING) - Hình 5
    # ========================================================
    print("\n[4/6] Đang seed Chương trình hợp tác & Đào tạo (Hình 5)...")
    trainings_data = [
        {
            "name": "Đào Tạo Quản Trị Tài Sản Trí Tuệ & Thương Quyền Kỷ Lục",
            "time": datetime.date(2025, 6, 1),
            "certificate": "Chứng chỉ Quản trị Tài sản Trí tuệ - VietKings",
            "props": {
                "icon": "graduation-cap",
                "description": "Khóa học chuyên sâu dành cho chủ doanh nghiệp, giúp biến giá trị vô hình thành công cụ tăng trưởng doanh thu vượt bậc.",
                "info_highlight": "Thời lượng: 6 tuần • Trực tiếp & Trực tuyến",
                "btn_action": "ĐĂNG KÝ THAM VẤN",
                "link": "/trainings/quan-tri-tai-san-tri-tue"
            }
        },
        {
            "name": "Ươm Tạo Doanh Nghiệp Công Nghiệp Văn Hóa Sáng Tạo",
            "time": datetime.date(2025, 7, 1),
            "certificate": "Chứng nhận Ươm tạo Doanh nghiệp Sáng tạo",
            "props": {
                "icon": "lightbulb",
                "description": "Chương trình cố vấn 1–1 cùng các Kỷ lục gia và chuyên gia công nghệ, hoàn thiện mô hình sản phẩm từ phôi thai đến thị trường.",
                "info_highlight": "Chỉ tiêu: 20 dự án mỗi khóa",
                "btn_action": "ĐĂNG KÝ THAM VẤN",
                "link": "/trainings/uom-tao-doanh-nghiep-sang-tao"
            }
        },
        {
            "name": "Liên Minh Hợp Tác Viện – Doanh Nghiệp – Địa Phương",
            "time": datetime.date(2025, 8, 1),
            "certificate": "Chứng thư Liên minh Hợp tác Chiến lược",
            "props": {
                "icon": "handshake",
                "description": "Ký kết hợp tác chiến lược nhằm xây dựng hồ sơ kỷ lục chỉ dẫn địa lý, quảng bá văn hóa ẩm thực và thắng cảnh du lịch tỉnh thành.",
                "info_highlight": "Hỗ trợ pháp lý & Xúc tiến truyền thông",
                "btn_action": "LIÊN HỆ HỢP TÁC",
                "link": "/cooperation"
            }
        }
    ]

    training_ids = []
    for item in trainings_data:
        existing = Training.query.filter_by(name=item["name"]).first()
        if not existing:
            new_train = Training(
                name=item["name"],
                time=item["time"],
                certificate=item["certificate"],
                props=item["props"]
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
    # BƯỚC 5: SEED CÁC HEADER ITEMS / TRANG (PAGE) - Hình 1
    # ========================================================
    print("\n[5/6] Đang seed Header navigation items (Hình 1)...")
    header_pages = [
        {"name": "Trang chủ", "slug": "home"},
        {"name": "Giới thiệu", "slug": "about"},
        {"name": "Sự kiện", "slug": "events"},
        {"name": "Giải thưởng", "slug": "awards"},
        {"name": "Dự án nổi bật", "slug": "projects"},
        {"name": "Chuyện nhà sáng nghiệp", "slug": "stories"},
        {"name": "Kỷ lục", "slug": "records"},
        {"name": "Hợp tác & Đào tạo", "slug": "trainings"},
        {"name": "Liên hệ", "slug": "contact"},
    ]

    for p in header_pages:
        if p["slug"] != "home":  # Trang chủ sẽ được tạo chi tiết với toàn bộ props ở bước 6
            existing = Page.query.filter_by(slug=p["slug"]).first()
            if not existing:
                new_page = Page(name=p["name"], slug=p["slug"], props={})
                db.session.add(new_page)
                print(f"  + Đã tạo item header: {p['name']} (/pages/slug/{p['slug']})")
    db.session.commit()

    # ========================================================
    # BƯỚC 6: SEED TOÀN BỘ CẤU TRÚC PROPS TRANG CHỦ (PAGE HOME)
    # Tuân thủ chặt chẽ theo các DTO trong dto/home_dto.py
    # ========================================================
    print("\n[6/6] Đang cấu hình & seed toàn bộ nội dung Trang Chủ (Page Home)...")

    # 1. Hero Section DTO Payload
    hero_section_payload = {
        "badge": "VIỆN KỶ LỤC VIỆT NAM — VIETKINGS",
        "title_main": "TRUNG TÂM CÔNG NGHIỆP SÁNG TẠO",
        "subtitle": "NƠI KẾT TINH TRÍ TUỆ, XÁC LẬP KỶ LỤC VÀ TÔN VINH GIÁ TRỊ VIỆT",
        "quote": '"Chứng thực giá trị — Kiến tạo tài sản — Trao truyền ý chí"',
        "buttons": [
            {
                "text": "TÌM HIỂU VỀ CHÚNG TÔI",
                "link": "/about"
            },
            {
                "text": "KHÁM PHÁ KỶ LỤC & DỰ ÁN",
                "link": "/projects"
            }
        ],
        "statistics": [
            {
                "value": "500+",
                "label": "KỶ LỤC GIA & TỔ CHỨC"
            },
            {
                "value": "120+",
                "label": "CÔNG TRÌNH SÁNG TẠO"
            },
            {
                "value": "63",
                "label": "TỈNH THÀNH KẾT NỐI"
            },
            {
                "value": "20+",
                "label": "NĂM DI SẢN TÔN VINH"
            }
        ]
    }
    # Validate bằng Marshmallow DTO
    HeroSectionRequestDTO().load(hero_section_payload)

    # 2. About Section DTO Payload
    about_section_payload = {
        "tag": "SỨ MỆNH & TẦM NHÌN QUỐC GIA",
        "title_main": "VỀ TRUNG TÂM CÔNG NGHIỆP SÁNG TẠO",
        "featured_image": {
            "url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
            "caption_title": "Viện Kỷ lục Việt Nam (VietKings)",
            "caption_text": "Thành trì kết nối những trí tuệ ưu tú, gìn giữ tinh hoa văn hóa và đổi mới sáng tạo."
        },
        "core_values": [
            {
                "icon": "bank",
                "title": "Tôn chỉ Hoạt động",
                "description": "Trung tâm Công nghiệp Sáng tạo được thành lập với mục tiêu trở thành hạt nhân nghiên cứu, bảo tồn, kích hoạt các tiềm năng trí tuệ vô tận của con người Việt Nam. Chúng tôi đóng vai trò cầu nối thể chế và thị trường, biến các ý tưởng và phát minh độc bản thành tài sản sở hữu trí tuệ có giá trị thương mại bền vững."
            },
            {
                "icon": "shield-check",
                "title": "Xác Lập Chuẩn Mực",
                "description": "Chứng thực công trình, phát minh, giải pháp đạt tiêu chí kỷ lục và sáng tạo tầm vóc."
            },
            {
                "icon": "globe",
                "title": "Vươn Tầm Quốc Tế",
                "description": "Đưa các kỷ lục gia và sản phẩm tinh hoa dân tộc tiếp cận các thị trường toàn cầu."
            }
        ],
        "action_button": {
            "text": "XEM CHI TIẾT GIỚI THIỆU",
            "link": "/about"
        }
    }
    AboutSectionRequestDTO().load(about_section_payload)

    # 3. Nav Sections DTO Payload (3 sections: Sự kiện, Dự án & Chuyện sáng nghiệp, Hợp tác & Đào tạo)
    nav_sections_payload = [
        {
            "id": 1,
            "tag": "DÒNG THỜI GIAN HOẠT ĐỘNG",
            "title_main": "SỰ KIỆN NỔI BẬT & HOẠT ĐỘNG MỚI",
            "action_button": {
                "text": "XEM TẤT CẢ SỰ KIỆN",
                "link": "/events"
            },
            "children_id": event_ids
        },
        {
            "id": 2,
            "tag": "HÀNH TRÌNH THỰC TIỄN",
            "title_main": "DỰ ÁN TIÊU BIỂU & CHUYỆN NHÀ SÁNG NGHIỆP",
            "action_button": {
                "text": "XEM TẤT CẢ DỰ ÁN",
                "link": "/projects"
            },
            "children_id": project_ids
        },
        {
            "id": 3,
            "tag": "BỒI DƯỠNG & LAN TỎA",
            "title_main": "CHƯƠNG TRÌNH HỢP TÁC & ĐÀO TẠO",
            "action_button": {
                "text": "XEM TẤT CẢ CHƯƠNG TRÌNH",
                "link": "/trainings"
            },
            "children_id": training_ids
        }
    ]
    for nav in nav_sections_payload:
        NavSectionRequestDTO().load(nav)

    # 4. Support Banner DTO Payload
    support_banner_payload = {
        "text": "Cần tư vấn trực tiếp từ Chuyên viên Viện Kỷ lục?\nĐường dây nóng tiếp nhận hồ sơ hoạt động 24/7 sẵn sàng đồng hành cùng quý vị.",
        "button": {
            "text": "KẾT NỐI NGAY",
            "link": "/contact"
        }
    }
    SupportBannerRequestDTO().load(support_banner_payload)

    # Tổng hợp toàn bộ props cho trang Home
    home_props = {
        "hero_section": hero_section_payload,
        "about_section": about_section_payload,
        "nav_sections": nav_sections_payload,
        "nav_section": nav_sections_payload[0],  # Nav mặc định/mới nhất
        "support_banner": support_banner_payload
    }

    home_page = Page.query.filter_by(slug="home").first()
    if not home_page:
        home_page = Page(
            name="Trang chủ",
            slug="home",
            props=home_props
        )
        db.session.add(home_page)
        print("  -> Đã tạo mới Trang chủ (slug='home') với đầy đủ dữ liệu 5 hình ảnh!")
    else:
        home_page.name = "Trang chủ"
        home_page.props = home_props
        print("  -> Đã cập nhật props cho Trang chủ (slug='home') với dữ liệu chuẩn mới nhất!")

    # 5. Seed thêm Award mẫu
    if not Award.query.first():
        award = Award(
            name="Kỷ lục Quốc gia",
            title="Tôn vinh Công trình Sáng tạo Độc bản",
            description="Chứng nhận sáng kiến, giải pháp và công trình mang giá trị văn hóa và khoa học xuất sắc.",
            decision_number="QĐ-VK-2025/01"
        )
        db.session.add(award)

    db.session.commit()
    print("\n" + "=" * 60)
    print(" SEED DỮ LIỆU THÀNH CÔNG RỰC RỠ!")
    print(f" - Trang chủ: ID={home_page.id}, slug={home_page.slug}")
    print(f" - Số lượng sự kiện liên kết: {len(event_ids)}")
    print(f" - Số lượng dự án liên kết: {len(project_ids)}")
    print(f" - Số lượng khóa đào tạo liên kết: {len(training_ids)}")
    print("=" * 60)


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_database()
