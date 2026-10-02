from flask import Blueprint, request
from flasgger import swag_from
from marshmallow import ValidationError

from dto import founder_dto
from services.pages import founder_services as founder_service
from utils.json import success_response, error_response

founder_page_api = Blueprint(
    "founder_page_api",
    __name__,
    url_prefix="/founder-page",
)

SLUG = "founder"


# =========================================================
# SWAGGER SCHEMAS
# =========================================================

FOUNDER_HERO_SCHEMA = {
    "type": "object",
    "required": [
        "title",
        "description",
        "name",
        "number_of_founders",
        "subtitle",
        "subdescription",
    ],
    "properties": {
        "title": {
            "type": "string",
            "example": "Người đứng sau thương hiệu",
        },
        "description": {
            "type": "string",
            "example": (
                "Khám phá câu chuyện và hành trình " "của những người sáng lập."
            ),
        },
        "name": {
            "type": "string",
            "example": "Đội ngũ sáng lập",
        },
        "number_of_founders": {
            "type": "integer",
            "example": 2,
        },
        "subtitle": {
            "type": "string",
            "example": "Những người đứng sau thương hiệu",
        },
        "subdescription": {
            "type": "string",
            "example": "Hai nhà sáng lập cùng chung tầm nhìn.",
        },
    },
}


FOUNDER_INFO_SCHEMA = {
    "type": "object",
    "required": [
        "label",
        "value",
    ],
    "properties": {
        "label": {
            "type": "string",
            "example": "Chức danh",
        },
        "value": {
            "type": "string",
            "example": "Founder & CEO",
        },
    },
}


FOUNDER_PROFILE_SCHEMA = {
    "type": "object",
    "required": [
        "filter",
        "title",
        "description",
        "slogan",
        "sub_slogan",
    ],
    "properties": {
        "filter": {
            "type": "string",
            "enum": [
                "bio",
                "projects",
                "achievements",
            ],
            "example": "bio",
        },
        "title": {
            "type": "string",
            "example": "Tiểu sử & Triết lý",
        },
        "description": {
            "type": "string",
            "example": (
                "Tôi tin rằng công nghệ cần được xây dựng "
                "dựa trên những giá trị thực tế."
            ),
        },
        "slogan": {
            "type": "string",
            "example": "Build with purpose.",
        },
        "sub_slogan": {
            "type": "string",
            "example": "Kiến tạo hôm nay, hướng đến tương lai.",
        },
    },
}


FOUNDER_SECTION_SCHEMA = {
    "type": "object",
    "required": [
        "major",
        "name",
        "description",
        "founder_info",
        "is_verified",
        "image",
        "founder_profile",
    ],
    "properties": {
        "major": {
            "type": "string",
            "example": "Founder & CEO",
        },
        "name": {
            "type": "string",
            "example": "Nguyễn Văn A",
        },
        "description": {
            "type": "string",
            "example": ("Với hơn 10 năm kinh nghiệm " "trong lĩnh vực công nghệ."),
        },
        "founder_info": {
            "type": "array",
            "items": FOUNDER_INFO_SCHEMA,
        },
        "is_verified": {
            "type": "boolean",
            "example": True,
        },
        "image": {
            "type": "string",
            "example": "/images/founder/founder-1.jpg",
        },
        "founder_profile": FOUNDER_PROFILE_SCHEMA,
    },
}


FOUNDER_CERTIFICATE_SCHEMA = {
    "type": "object",
    "required": [
        "name",
    ],
    "properties": {
        "name": {
            "type": "string",
            "example": "ISO 9001",
        },
    },
}


FOUNDER_CTA_SCHEMA = {
    "type": "object",
    "required": [
        "subtitle",
        "title",
        "description",
        "btn_cta",
        "sub_btn_cta",
        "form_url",
        "certificate",
    ],
    "properties": {
        "subtitle": {
            "type": "string",
            "example": "Cùng chúng tôi tạo nên giá trị",
        },
        "title": {
            "type": "string",
            "example": "Bắt đầu hành trình mới",
        },
        "description": {
            "type": "string",
            "example": (
                "Hãy kết nối với chúng tôi để cùng " "khám phá những cơ hội hợp tác."
            ),
        },
        "btn_cta": {
            "type": "string",
            "example": "Liên hệ ngay",
        },
        "sub_btn_cta": {
            "type": "string",
            "example": "Tìm hiểu thêm về chúng tôi",
        },
        "form_url": {
            "type": "string",
            "example": "/contact",
        },
        "certificate": {
            "type": "array",
            "items": FOUNDER_CERTIFICATE_SCHEMA,
        },
    },
}


# =========================================================
# GET FOUNDER PAGE
# =========================================================


@founder_page_api.route("", methods=["GET"])
@founder_page_api.route("/", methods=["GET"])
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Get founder page",
        "description": "Retrieve the complete founder page.",
        "responses": {
            200: {
                "description": "Founder page retrieved successfully",
            },
            404: {
                "description": "Founder page not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def get_founder_page():
    try:
        page = founder_service.get_page_by_slug(SLUG)

        result = founder_dto.FounderResponsePageDto().dump(page)

        return success_response(
            data=result,
            message="Founder page retrieved successfully",
        )

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


# =========================================================
# HERO
# =========================================================


@founder_page_api.route("/hero", methods=["POST"])
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Create hero section",
        "description": "Create the hero section of the founder page.",
        "consumes": ["application/json"],
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": FOUNDER_HERO_SCHEMA,
            }
        ],
        "responses": {
            200: {
                "description": ("Founder hero section created successfully"),
            },
            400: {
                "description": "Validation error",
            },
            404: {
                "description": "Page not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def create_hero():
    try:
        data = founder_dto.FounderHeroSectionDto().load(request.get_json())
        result = founder_service.create_hero_section(
            SLUG,
            data,
        )

        result = founder_dto.FounderHeroSectionResponseDto().dump(result)

        return success_response(
            data=result,
            message="Founder hero section created successfully",
        )

    except ValidationError as e:
        return error_response(e.messages, 400)

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


@founder_page_api.route("/hero", methods=["PATCH"])
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Update hero section",
        "description": "Update the hero section of the founder page.",
        "consumes": ["application/json"],
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": FOUNDER_HERO_SCHEMA,
            }
        ],
        "responses": {
            200: {
                "description": ("Founder hero section updated successfully"),
            },
            400: {
                "description": "Validation error",
            },
            404: {
                "description": "Hero section not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def update_hero():
    try:
        data = founder_dto.FounderHeroSectionDto().load(request.get_json())

        result = founder_service.update_hero_section(
            SLUG,
            data,
        )

        print(result)
        result = founder_dto.FounderHeroSectionResponseDto().dump(result)

        return success_response(
            data=result,
            message="Founder hero section updated successfully",
        )

    except ValidationError as e:
        return error_response(e.messages, 400)

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


# =========================================================
# FOUNDER SECTIONS
# =========================================================


@founder_page_api.route("/sections", methods=["POST"])
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Create founder section",
        "description": "Create a new founder section.",
        "consumes": ["application/json"],
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": FOUNDER_SECTION_SCHEMA,
            }
        ],
        "responses": {
            200: {
                "description": "Founder section created successfully",
            },
            400: {
                "description": "Validation error",
            },
            404: {
                "description": "Page not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def create_founder_section():
    try:
        data = founder_dto.FounderSectionDto().load(request.get_json())

        result = founder_service.create_founder_section(
            SLUG,
            data,
        )

        result = founder_dto.FounderSectionResponseDto().dump(result)

        return success_response(
            data=result,
            message="Founder section created successfully",
        )

    except ValidationError as e:
        return error_response(e.messages, 400)

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


@founder_page_api.route(
    "/sections/<string:section_id>",
    methods=["PATCH"],
)
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Update founder section",
        "description": "Update an existing founder section.",
        "consumes": ["application/json"],
        "parameters": [
            {
                "name": "section_id",
                "in": "path",
                "required": True,
                "type": "string",
                "example": "section_1",
            },
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": FOUNDER_SECTION_SCHEMA,
            },
        ],
        "responses": {
            200: {
                "description": "Founder section updated successfully",
            },
            400: {
                "description": "Validation error",
            },
            404: {
                "description": "Founder section not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def update_founder_section(section_id):
    try:
        data = founder_dto.FounderSectionDto().load(request.get_json())

        result = founder_service.update_founder_section(
            SLUG,
            section_id,
            data,
        )

        result = founder_dto.FounderSectionResponseDto().dump(result)

        return success_response(
            data=result,
            message="Founder section updated successfully",
        )

    except ValidationError as e:
        return error_response(e.messages, 400)

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


@founder_page_api.route(
    "/sections/<string:section_id>",
    methods=["DELETE"],
)
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Delete founder section",
        "description": (
            "Delete a founder section and reindex " "remaining section IDs."
        ),
        "parameters": [
            {
                "name": "section_id",
                "in": "path",
                "required": True,
                "type": "string",
                "example": "section_1",
            },
        ],
        "responses": {
            200: {
                "description": "Founder section deleted successfully",
            },
            404: {
                "description": "Founder section not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def delete_founder_section(section_id):
    try:
        result = founder_service.delete_founder_section(
            SLUG,
            section_id,
        )

        return success_response(
            data=result,
            message="Founder section deleted successfully",
        )

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


# =========================================================
# CTA
# =========================================================


@founder_page_api.route("/cta", methods=["GET"])
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Get founder CTA",
        "description": "Retrieve the founder CTA section.",
        "responses": {
            200: {
                "description": "Founder CTA retrieved successfully",
            },
            404: {
                "description": "CTA section not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def get_founder_cta():
    try:
        result = founder_service.get_founder_cta(SLUG)

        return success_response(
            data=result,
            message="Founder CTA retrieved successfully",
        )

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


@founder_page_api.route("/cta", methods=["POST"])
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Create founder CTA",
        "description": "Create the founder CTA section.",
        "consumes": ["application/json"],
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": FOUNDER_CTA_SCHEMA,
            }
        ],
        "responses": {
            200: {
                "description": "Founder CTA created successfully",
            },
            400: {
                "description": "Validation error",
            },
            404: {
                "description": "Page not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def create_founder_cta():
    try:
        data = founder_dto.FounderCTADto().load(request.get_json())

        result = founder_service.create_founder_cta(
            SLUG,
            data,
        )

        result = founder_dto.FounderCTAResponseDto().dump(result)

        return success_response(
            data=result,
            message="Founder CTA created successfully",
        )

    except ValidationError as e:
        return error_response(e.messages, 400)

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


@founder_page_api.route("/cta", methods=["PATCH"])
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Update founder CTA",
        "description": "Update the founder CTA section.",
        "consumes": ["application/json"],
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": FOUNDER_CTA_SCHEMA,
            }
        ],
        "responses": {
            200: {
                "description": "Founder CTA updated successfully",
            },
            400: {
                "description": "Validation error",
            },
            404: {
                "description": "CTA section not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def update_founder_cta():
    try:
        data = founder_dto.FounderCTADto().load(request.get_json())

        result = founder_service.update_founder_cta(
            SLUG,
            data,
        )

        result = founder_dto.FounderCTAResponseDto().dump(result)

        return success_response(
            data=result,
            message="Founder CTA updated successfully",
        )

    except ValidationError as e:
        return error_response(e.messages, 400)

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


# =========================================================
# CERTIFICATES
# =========================================================


@founder_page_api.route(
    "/cta/certificates",
    methods=["GET"],
)
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Get founder certificates",
        "description": ("Retrieve all certificates " "from the founder CTA section."),
        "responses": {
            200: {
                "description": ("Founder certificates retrieved successfully"),
            },
            404: {
                "description": "CTA section not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def get_founder_certificates():
    try:
        result = founder_service.get_founder_certificates(SLUG)

        return success_response(
            data=result,
            message="Founder certificates retrieved successfully",
        )

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


@founder_page_api.route(
    "/cta/certificates",
    methods=["POST"],
)
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Create founder certificate",
        "description": "Create a certificate for the founder CTA.",
        "consumes": ["application/json"],
        "parameters": [
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": FOUNDER_CERTIFICATE_SCHEMA,
            }
        ],
        "responses": {
            200: {
                "description": ("Founder certificate created successfully"),
            },
            400: {
                "description": "Validation error",
            },
            404: {
                "description": "CTA section not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def create_founder_certificate():
    try:
        data = founder_dto.FounderCertificateDto().load(request.get_json())

        result = founder_service.create_founder_certificate(
            SLUG,
            data,
        )

        result = founder_dto.FounderCertificateResponseDto().dump(result)

        return success_response(
            data=result,
            message="Founder certificate created successfully",
        )

    except ValidationError as e:
        return error_response(e.messages, 400)

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


@founder_page_api.route(
    "/cta/certificates/<string:certificate_id>",
    methods=["PATCH"],
)
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Update founder certificate",
        "description": "Update an existing founder certificate.",
        "consumes": ["application/json"],
        "parameters": [
            {
                "name": "certificate_id",
                "in": "path",
                "required": True,
                "type": "string",
                "example": "certificate_1",
            },
            {
                "in": "body",
                "name": "body",
                "required": True,
                "schema": FOUNDER_CERTIFICATE_SCHEMA,
            },
        ],
        "responses": {
            200: {
                "description": ("Founder certificate updated successfully"),
            },
            400: {
                "description": "Validation error",
            },
            404: {
                "description": "Certificate not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def update_founder_certificate(certificate_id):
    try:
        data = founder_dto.FounderCertificateDto().load(request.get_json())

        result = founder_service.update_founder_certificate(
            SLUG,
            certificate_id,
            data,
        )

        result = founder_dto.FounderCertificateResponseDto().dump(result)

        return success_response(
            data=result,
            message="Founder certificate updated successfully",
        )

    except ValidationError as e:
        return error_response(e.messages, 400)

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)


@founder_page_api.route(
    "/cta/certificates/<string:certificate_id>",
    methods=["DELETE"],
)
@swag_from(
    {
        "tags": ["Founder Page"],
        "summary": "Delete founder certificate",
        "description": (
            "Delete a certificate and reindex " "remaining certificate IDs."
        ),
        "parameters": [
            {
                "name": "certificate_id",
                "in": "path",
                "required": True,
                "type": "string",
                "example": "certificate_1",
            },
        ],
        "responses": {
            200: {
                "description": ("Founder certificate deleted successfully"),
            },
            404: {
                "description": "Certificate not found",
            },
            500: {
                "description": "Internal server error",
            },
        },
    }
)
def delete_founder_certificate(certificate_id):
    try:
        result = founder_service.delete_founder_certificate(
            SLUG,
            certificate_id,
        )

        return success_response(
            data=result,
            message="Founder certificate deleted successfully",
        )

    except ValueError as e:
        return error_response(str(e), 404)

    except Exception as e:
        return error_response(str(e), 500)
