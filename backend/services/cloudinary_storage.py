from uuid import uuid4

import cloudinary.uploader
from flask import current_app

from utils.error import APIException, InternalServerError


def upload(file, folder="awards"):
    config = current_app.config

    credentials = {
        "cloud_name": config.get("CLOUDINARY_CLOUD_NAME"),
        "api_key": config.get("CLOUDINARY_API_KEY"),
        "api_secret": config.get("CLOUDINARY_API_SECRET"),
    }

    if not all(credentials.values()):
        raise InternalServerError("Chưa cấu hình đầy đủ Cloudinary.")

    try:
        result = cloudinary.uploader.upload(
            file,
            public_id=f"{folder}/{uuid4().hex}",
            resource_type="image",
            allowed_formats=["jpg", "jpeg", "png", "webp"],
            overwrite=False,
            timeout=30,
            **credentials,
        )

        return result["secure_url"]

    except Exception as error:
        current_app.logger.exception("Upload ảnh lên Cloudinary thất bại.")

        raise APIException(
            message="Không thể upload ảnh. Vui lòng thử lại.",
            status_code=502,
            error_code="IMAGE_UPLOAD_FAILED",
        ) from error