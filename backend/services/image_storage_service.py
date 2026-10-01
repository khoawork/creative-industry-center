from io import BytesIO
import warnings

from flask import current_app
from PIL import Image, UnidentifiedImageError

from services import cloudinary_storage
from utils.error import InternalServerError, ValidationError


ALLOWED_IMAGE_FORMATS = {
    "JPEG": "jpg",
    "PNG": "png",
    "WEBP": "webp",
}


def upload_image(file, folder="awards"):
    if file is None or not file.filename:
        raise ValidationError("Vui lòng chọn ảnh.")

    max_size = current_app.config["MAX_IMAGE_SIZE"]

    file.stream.seek(0)
    content = file.stream.read(max_size + 1)

    if not content:
        raise ValidationError("File ảnh rỗng.")

    if len(content) > max_size:
        raise ValidationError("Ảnh vượt quá dung lượng cho phép.")

    try:
        with warnings.catch_warnings():
            warnings.simplefilter(
                "error",
                Image.DecompressionBombWarning,
            )

            with Image.open(BytesIO(content)) as image:
                extension = ALLOWED_IMAGE_FORMATS.get(image.format)

                if extension is None:
                    raise ValidationError(
                        "Chỉ hỗ trợ ảnh JPEG, PNG hoặc WEBP."
                    )

                image.verify()

    except (
        UnidentifiedImageError,
        OSError,
        SyntaxError,
        ValueError,
        Image.DecompressionBombError,
        Image.DecompressionBombWarning,
    ) as error:
        raise ValidationError(
            "File ảnh không hợp lệ hoặc kích thước ảnh quá lớn."
        ) from error

    with BytesIO(content) as stream:
        stream.name = f"image.{extension}"
        image_url = cloudinary_storage.upload(stream, folder=folder)

    if len(image_url) > 255:
        raise InternalServerError(
            "URL ảnh vượt quá giới hạn lưu trữ của Award."
        )

    return image_url