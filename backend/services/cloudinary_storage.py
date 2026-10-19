from uuid import uuid4

import cloudinary.uploader
from flask import current_app

from utils.error import APIException, InternalServerError


def upload(file, folder="awards", resource_type="image", public_id=None):
    config = current_app.config

    credentials = {
        "cloud_name": config.get("CLOUDINARY_CLOUD_NAME"),
        "api_key": config.get("CLOUDINARY_API_KEY"),
        "api_secret": config.get("CLOUDINARY_API_SECRET"),
    }

    if not all(credentials.values()):
        raise InternalServerError("Chưa cấu hình đầy đủ Cloudinary.")

    try:
        options = {
            "public_id": public_id or f"{folder}/{uuid4().hex}",
            "resource_type": resource_type,
            "overwrite": False,
            "timeout": 45,
            **credentials,
        }
        if resource_type == "image":
            options["allowed_formats"] = ["jpg", "jpeg", "png", "webp"]
        elif resource_type == "video":
            options["timeout"] = 120
            options["allowed_formats"] = ["mp4", "webm", "mov", "avi", "mkv", "ogg"]

        result = cloudinary.uploader.upload(
            file,
            **options,
        )

        return result["secure_url"]

    except Exception as error:
        current_app.logger.exception("Upload file lên Cloudinary thất bại.")

        raise APIException(
            message="Không thể upload file. Vui lòng thử lại.",
            status_code=502,
            error_code="UPLOAD_FAILED",
        ) from error