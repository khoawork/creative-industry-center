from sqlalchemy.orm.attributes import flag_modified
from extensions import db
from models.SiteModel import SiteSettings

DEFAULT_FOOTER_CONFIG = {
    "short_name": "TTCNST",
    "institute": "VIỆN KỲ LỤC VIỆT NAM",
    "description": "Cơ quan nghiên cứu, tôn vinh và thúc đẩy các giá trị sáng tạo quốc gia, khơi nguồn tinh hoa trí tuệ Việt vươn tầm thế giới.",
    "groups": [
        {
            "title": "VỀ VIỆN & DỰ ÁN",
            "links": [
                {"label": "Giới thiệu Tổ chức", "href": "/about"},
                {"label": "Dự án nổi bật", "href": "/projects"},
                {"label": "Chuyện nhà sáng nghiệp", "href": "/stories"},
                {"label": "Hệ thống Kỷ lục", "href": "/records"}
            ]
        },
        {
            "title": "SỰ KIỆN & HOẠT ĐỘNG",
            "links": [
                {"label": "Sự kiện tiêu biểu", "href": "/events"},
                {"label": "Hạng mục Giải thưởng", "href": "/awards"},
                {"label": "Hợp tác & Đào tạo", "href": "/trainings"}
            ]
        }
    ],
    "contact": {
        "title": "THÔNG TIN LIÊN HỆ",
        "address": "Trung tâm Công nghiệp Sáng tạo, Viện Kỷ lục Việt Nam, TP. Hồ Chí Minh & Hà Nội",
        "phone": "(+84) 28 3847 7777",
        "phone_href": "tel:+842838477777",
        "emails": ["bbt@kyluc.vn", "contact@vietkings.org"]
    },
    "copyright": "© 2026 Bản quyền thuộc Trung tâm Công nghiệp Sáng tạo - VIỆN KỲ LỤC VIỆT NAM. Bảo lưu mọi quyền."
}

DEFAULT_SITE_SETTINGS = {
    "logo": "/assets/shared/logo/creative-industry-center-logo.png",
    "company_name": "Trung tâm Công nghiệp Sáng tạo",
    "company_tagline": "VIỆN KỲ LỤC VIỆT NAM - VIETKINGS",
    "footer": DEFAULT_FOOTER_CONFIG
}


def get_site_settings() -> SiteSettings:
    """Lấy bản ghi cài đặt trang từ DB, nếu chưa có thì khởi tạo mặc định."""
    settings = SiteSettings.query.first()
    if settings is None:
        try:
            settings = SiteSettings(
                logo=DEFAULT_SITE_SETTINGS["logo"],
                company_name=DEFAULT_SITE_SETTINGS["company_name"],
                company_tagline=DEFAULT_SITE_SETTINGS["company_tagline"],
                footer=DEFAULT_SITE_SETTINGS["footer"],
            )
            db.session.add(settings)
            db.session.commit()
        except Exception:
            db.session.rollback()
            raise
    return settings


def update_site_settings(logo: str, company_name: str, company_tagline: str, footer: dict) -> SiteSettings:
    """Cập nhật cài đặt logo, tên công ty, tagline và footer JSON."""
    settings = get_site_settings()
    try:
        if logo is not None:
            settings.logo = logo
        if company_name is not None:
            settings.company_name = company_name
        if company_tagline is not None:
            settings.company_tagline = company_tagline
        if footer is not None:
            settings.footer = footer
            flag_modified(settings, "footer")

        db.session.commit()
        return settings
    except Exception:
        db.session.rollback()
        raise

