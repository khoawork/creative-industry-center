import re
import urllib.parse
import urllib.request
from flask import Blueprint, request

from dto.contact_dto import ContactPagePropsDTO, ContactPageResponse
from services import contact_service
from utils.json import error_response, success_response


contact_api = Blueprint("contact_api", __name__, url_prefix="/contact")


@contact_api.route("/resolve-map", methods=["GET"])
def resolve_map():
    url = request.args.get("url", "").strip()
    if not url:
        return error_response(message="Vui lòng cung cấp URL cần phân giải", status_code=400)

    # 1. Nếu người dùng dán toàn bộ thẻ iframe:
    iframe_match = re.search(r'<iframe[^>]+src=["\']([^"\']+)["\']', url, re.IGNORECASE)
    if iframe_match:
        url = iframe_match.group(1).strip()

    final_url = url
    # 2. Nếu là liên kết rút gọn Google Maps (maps.app.goo.gl hoặc goo.gl/maps), theo dõi redirect
    if "maps.app.goo.gl" in url or "goo.gl/maps" in url:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=8) as response:
                final_url = response.geturl()
        except Exception:
            pass

    # 3. Trích xuất địa chỉ từ đường dẫn Google Maps đã mở rộng
    address = ""
    place_match = re.search(r'/place/([^/@?]+)', final_url)
    if place_match:
        address = urllib.parse.unquote_plus(place_match.group(1)).replace("+", " ")

    # 4. Trích xuất tọa độ nếu có
    coords_match = re.search(r'@([0-9.-]+),([0-9.-]+)', final_url)
    lat = coords_match.group(1) if coords_match else None
    lng = coords_match.group(2) if coords_match else None

    # 5. Tạo link nhúng chuẩn tương thích 100% với iframe
    if "google.com/maps/embed" in url or "google.com/maps/embed" in final_url:
        embed_url = url if "google.com/maps/embed" in url else final_url
        directions_url = f"https://www.google.com/maps/dir/?api=1&destination={urllib.parse.quote(address or 'Trụ sở')}"
    elif lat and lng:
        embed_url = f"https://maps.google.com/maps?q={lat},{lng}&hl=vi&z=16&output=embed"
        directions_url = f"https://www.google.com/maps/dir/?api=1&destination={lat},{lng}"
    elif address:
        embed_url = f"https://maps.google.com/maps?q={urllib.parse.quote(address)}&hl=vi&z=16&output=embed"
        directions_url = f"https://www.google.com/maps/dir/?api=1&destination={urllib.parse.quote(address)}"
    else:
        embed_url = f"https://maps.google.com/maps?q={urllib.parse.quote(url)}&hl=vi&z=16&output=embed"
        directions_url = url

    return success_response(
        data={
            "embedUrl": embed_url,
            "address": address,
            "directionsUrl": directions_url,
            "resolvedUrl": final_url,
        },
        message="Phân giải liên kết bản đồ thành công.",
    )


@contact_api.route("", methods=["GET"])
@contact_api.route("/", methods=["GET"])
@contact_api.route("/<int:page_id>", methods=["GET"])
def get_contact(page_id=None):
    page = contact_service.get_contact_page(page_id)
    return success_response(
        data=ContactPageResponse().dump(page),
        message="Lấy dữ liệu trang Liên hệ thành công.",
    )


@contact_api.route("", methods=["PUT"])
@contact_api.route("/", methods=["PUT"])
@contact_api.route("/<int:page_id>", methods=["PUT"])
def update_contact(page_id=None):
    payload = request.get_json() or {}
    props = payload.get("props", payload)
    validated_props = ContactPagePropsDTO().load(props)
    page = contact_service.update_contact_props(validated_props, page_id)
    return success_response(
        data=ContactPageResponse().dump(page),
        message="Đã lưu nội dung trang Liên hệ.",
    )
