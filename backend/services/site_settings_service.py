from typing import Any, Dict
from dto.site_settings_dto import FooterDTO
from repositories import site_settings_repository
from services.image_storage_service import upload_image


def get_site_settings():
    """Lấy thông tin cài đặt website & footer."""
    return site_settings_repository.get_site_settings()


def update_site_settings(data: Any):
    """Cập nhật logo, tên công ty, tagline và footer JSON."""
    logo = getattr(data, "logo", None)
    company_name = getattr(data, "company_name", None)
    company_tagline = getattr(data, "company_tagline", None)
    footer_obj = getattr(data, "footer", None)

    # Chuyển đổi footer object/SimpleNamespace thành dictionary thuần
    if footer_obj is not None:
        footer_dict = FooterDTO().dump(footer_obj)
    else:
        footer_dict = None

    return site_settings_repository.update_site_settings(
        logo=logo,
        company_name=company_name,
        company_tagline=company_tagline,
        footer=footer_dict
    )


def upload_site_logo(file):
    """Tải lên ảnh logo và trả về đường dẫn URL."""
    return upload_image(file, folder="site", max_url_length=500)

