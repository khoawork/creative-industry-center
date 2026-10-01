from app import create_app, db
from models import Page


def seed_founder_page():
    founder_seed_data = {
        "name": "Founder",
        "slug": "founder",
        "props": {
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

    # Tạo mới hoặc cập nhật dữ liệu Founder hiện có.
    existing_page = Page.query.filter_by(slug=founder_seed_data["slug"]).first()

    if existing_page:
        existing_page.name = founder_seed_data["name"]
        existing_page.props = founder_seed_data["props"]
        db.session.commit()
        print("Founder page updated successfully!")
        return

    page = Page(
        name=founder_seed_data["name"],
        slug=founder_seed_data["slug"],
        props=founder_seed_data["props"],
    )

    db.session.add(page)
    db.session.commit()

    print("Seed founder page successfully!")


if __name__ == "__main__":
    app = create_app()

    with app.app_context():
        seed_founder_page()
