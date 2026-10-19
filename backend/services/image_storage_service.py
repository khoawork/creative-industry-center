from io import BytesIO
from uuid import uuid4
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


def upload_image(file, folder="awards", max_url_length=255):
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

    if len(image_url) > max_url_length:
        raise InternalServerError(
            "URL ảnh vượt quá giới hạn lưu trữ."
        )

    return image_url


def upload_document(file, folder="documents", max_url_length=500):
    if file is None or not file.filename:
        raise ValidationError("Vui lòng chọn tài liệu PDF.")

    max_size = current_app.config.get("MAX_DOC_SIZE", 25 * 1024 * 1024)

    file.stream.seek(0)
    content = file.stream.read(max_size + 1)

    if not content:
        raise ValidationError("File tài liệu rỗng.")

    if len(content) > max_size:
        raise ValidationError("Tài liệu vượt quá dung lượng cho phép (tối đa 25MB).")

    filename = file.filename.strip().lower()
    if not filename.endswith(".pdf") and not content.startswith(b"%PDF"):
        raise ValidationError("Chỉ hỗ trợ tệp tài liệu PDF.")

    with BytesIO(content) as stream:
        stream.name = f"doc_{uuid4().hex}.pdf"
        doc_url = cloudinary_storage.upload(
            stream,
            folder=folder,
            resource_type="raw",
            public_id=f"{folder}/{uuid4().hex}.pdf",
        )

    if len(doc_url) > max_url_length:
        raise InternalServerError(
            "URL tài liệu vượt quá giới hạn lưu trữ."
        )

    return doc_url


VIDEO_EXTENSIONS = {"mp4", "webm", "mov", "avi", "mkv", "ogg"}


def upload_video(file, folder="forum/hero", max_url_length=500):
    if file is None or not file.filename:
        raise ValidationError("Vui lòng chọn video.")

    max_size = current_app.config.get("MAX_VIDEO_SIZE", 100 * 1024 * 1024)

    file.stream.seek(0)
    content = file.stream.read(max_size + 1)

    if not content:
        raise ValidationError("File video rỗng.")

    if len(content) > max_size:
        raise ValidationError("Video vượt quá dung lượng cho phép (tối đa 100MB).")

    filename = file.filename.strip().lower()
    ext = filename.rsplit(".", 1)[-1] if "." in filename else ""
    if ext not in VIDEO_EXTENSIONS:
        raise ValidationError(
            f"Định dạng video không được hỗ trợ. Vui lòng chọn tệp: {', '.join(sorted(VIDEO_EXTENSIONS))}."
        )

    with BytesIO(content) as stream:
        stream.name = f"video_{uuid4().hex}.{ext}"
        video_url = cloudinary_storage.upload(
            stream,
            folder=folder,
            resource_type="video",
            public_id=f"{folder}/{uuid4().hex}",
        )

    if len(video_url) > max_url_length:
        raise InternalServerError(
            "URL video vượt quá giới hạn lưu trữ."
        )

    return video_url


def upload_image_or_file(file, folder="catalog", max_url_length=500):
    if file is None or not file.filename:
        raise ValidationError("Vui lòng chọn tệp tải lên.")

    filename = file.filename.strip().lower()
    ext = filename.rsplit(".", 1)[-1] if "." in filename else ""

    if ext in VIDEO_EXTENSIONS:
        return upload_video(file, folder=folder, max_url_length=max_url_length)
    if ext == "pdf":
        return upload_document(file, folder=folder, max_url_length=max_url_length)
    return upload_image(file, folder=folder, max_url_length=max_url_length)