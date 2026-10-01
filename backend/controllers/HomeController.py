import json

from flask import Blueprint, request
from services import home_service
from services.image_storage_service import upload_image
from dto.home_dto import (
    HomeResponse,
    HeroSectionRequestDTO, HeroSectionResponse,
    AboutSectionRequestDTO, AboutSectionResponse,
    NavSectionRequestDTO, NavSectionResponse,
    SupportBannerRequestDTO, SupportBannerResponse,
)
from utils.json import success_response

home_api = Blueprint('home_api', __name__, url_prefix='/home')


# ==========================================
# 1. TOÀN BỘ TRANG HOME (FULL PAGE)
# ==========================================

@home_api.route('/<int:idPage>', methods=['GET'])
def get(idPage=None):
    """Lấy dữ liệu toàn bộ trang Home"""
    response = home_service.get_home(idPage)
    result = HomeResponse().dump(response)
    return success_response(
        data=result,
        message="Lấy dữ liệu trang Home thành công",
        status_code=200
    )


@home_api.route('/<int:idPage>', methods=['PUT'])
def update_page(idPage=None):
    """Cập nhật thông tin toàn bộ trang Home"""
    json_data = request.get_json() or {}
    response = home_service.update_home(idPage, json_data)
    result = HomeResponse().dump(response)
    return success_response(
        data=result,
        message="Cập nhật trang Home thành công",
        status_code=200
    )


# ==========================================
# 2. HERO SECTION
# ==========================================

@home_api.route('/hero/<int:idPage>', methods=['POST', 'PUT'])
def update_hero(idPage=None):
    json_data = request.get_json() or {}
    if idPage is None:
        idPage = request.args.get('idPage', type=int) or json_data.get("id") or json_data.get("idPage")

    data = HeroSectionRequestDTO().load(json_data)
    response = home_service.update_hero_section(data, idPage)
    result = HeroSectionResponse().dump(response)
    return success_response(
        data=result,
        message="Cập nhật Hero Section thành công",
        status_code=200
    )


# ==========================================
# 3. ABOUT SECTION
# ==========================================

@home_api.route('/about/<int:idPage>', methods=['POST', 'PUT'])
def update_about(idPage=None):
    if request.mimetype == "multipart/form-data":
        json_data = json.loads(request.form.get("data") or "{}")
        image_file = request.files.get("featured_image")
        if image_file:
            featured_image = json_data.setdefault("featured_image", {})
            featured_image["url"] = upload_image(image_file, folder="home/about")
    else:
        json_data = request.get_json() or {}

    if idPage is None:
        idPage = request.args.get('idPage', type=int) or json_data.get("id") or json_data.get("idPage")

    data = AboutSectionRequestDTO().load(json_data)
    response = home_service.update_about_section(data, idPage)
    result = AboutSectionResponse().dump(response)
    return success_response(
        data=result,
        message="Cập nhật About Section thành công",
        status_code=200
    )


# ==========================================
# 4. NAV SECTION (TẠO MỚI & THÊM ID NAV CON)
# ==========================================

@home_api.route('/<int:idPage>/nav', methods=['POST'])
def create_nav(idPage=None):
    json_data = request.get_json() or {}
    if idPage is None:
        idPage = request.args.get('idPage', type=int) or json_data.get("idPage") or json_data.get("id")

    data = NavSectionRequestDTO().load(json_data)
    response = home_service.create_nav(data, idPage)
    result = NavSectionResponse().dump(response)
    return success_response(
        data=result,
        message="Tạo Nav thành công",
        status_code=201
    )



@home_api.route('/<int:idPage>/nav/<int:nav_id>/children', methods=['POST'], endpoint='add_nav_children')
def add_children_to_nav(nav_id, idPage=None):
    """
    Thêm ID nav con vào nav đã chọn.
    Chấp nhận payload:
      - {"child_id": 5}
      - {"children_id": [5, 6]}
      - {"children_ids": [5, 6]}
      - [5, 6]
    """
    if idPage is None:
        idPage = request.args.get('idPage', type=int) or (request.get_json() or {}).get("idPage")
    json_data = request.get_json() or {}
    children_ids = json_data
    response = home_service.add_children_to_nav(children_ids, nav_id, idPage)
    result = NavSectionResponse().dump(response)
    return success_response(
        data=result,
        message="Thêm ID nav con thành công",
        status_code=200
    )

@home_api.route('/<int:idPage>/nav/<int:nav_id>/children', methods=['DELETE'], endpoint='delete_nav_children')
def delete_children_to_nav(nav_id, idPage=None):
    """
    Xóa ID nav con khỏi nav đã chọn.
    Chấp nhận payload:
      - {"child_id": 5}
      - {"children_id": [5, 6]}
      - {"children_ids": [5, 6]}
      - [5, 6]
    """
    if idPage is None:
        idPage = request.args.get('idPage', type=int) or (request.get_json() or {}).get("idPage")
    json_data = request.get_json() or {}
    children_ids = json_data
    response = home_service.delete_children_to_nav(children_ids, nav_id, idPage)
    result = NavSectionResponse().dump(response)
    return success_response(
        data=result,
        message="Xóa ID nav con thành công",
        status_code=200
    )

@home_api.route('/<int:idPage>/nav/<int:nav_id>', methods=['GET'])
def get_nav(nav_id, idPage=None):
    if idPage is None:
        idPage = request.args.get('idPage', type=int)
    response = home_service.get_nav(nav_id, idPage)
    result = NavSectionResponse().dump(response)
    return success_response(
        data=result,
        message="Lấy dữ liệu Nav thành công",
        status_code=200
    )


@home_api.route('/<int:idPage>/nav/all', methods=['GET'])
def get_all_navs(idPage=None):
    if idPage is None:
        idPage = request.args.get('idPage', type=int)
    response = home_service.get_all_navs(idPage)
    result = NavSectionResponse(many=True).dump(response)
    return success_response(
        data=result,
        message="Lấy danh sách Nav thành công",
        status_code=200
    )


@home_api.route('/<int:idPage>/nav/<int:nav_id>', methods=['PUT'])
def update_nav(nav_id=None, idPage=None):
    json_data = request.get_json() or {}
    if idPage is None:
        idPage = request.args.get('idPage', type=int) or json_data.get("idPage") or json_data.get("id")

    data = NavSectionRequestDTO().load(json_data)
    response = home_service.update_nav(data, nav_id, idPage)
    result = NavSectionResponse().dump(response)
    return success_response(
        data=result,
        message="Cập nhật Nav thành công",
        status_code=200
    )


@home_api.route('/<int:idPage>/nav/<int:nav_id>', methods=['DELETE'])
def delete_nav(nav_id, idPage=None):
    if idPage is None:
        idPage = request.args.get('idPage', type=int) or (request.get_json() or {}).get("idPage")
    home_service.delete_nav(nav_id, idPage)
    return success_response(
        data=None,
        message="Xóa Nav thành công",
        status_code=200
    )


# ==========================================
# 5. SUPPORT BANNER SECTION
# ==========================================

@home_api.route('/support-banner/<int:idPage>', methods=['POST', 'PUT'])
def update_support_banner(idPage=None):
    json_data = request.get_json() or {}
    if idPage is None:
        idPage = request.args.get('idPage', type=int) or json_data.get("id") or json_data.get("idPage")

    data = SupportBannerRequestDTO().load(json_data)
    response = home_service.update_support_banner_section(data, idPage)
    result = SupportBannerResponse().dump(response)
    return success_response(
        data=result,
        message="Cập nhật Support Banner thành công",
        status_code=200
    )
