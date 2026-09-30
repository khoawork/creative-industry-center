from werkzeug.exceptions import HTTPException
from utils.json import error_response


class APIException(Exception):
    def __init__(self, message="Đã có lỗi xảy ra", status_code=400, error_code=None, details=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or f"HTTP_{status_code}"
        self.details = details


class BadRequestError(APIException):
    def __init__(self, message="Yêu cầu không hợp lệ", details=None):
        super().__init__(message=message, status_code=400, error_code="BAD_REQUEST", details=details)


class UnauthorizedError(APIException):
    def __init__(self, message="Yêu cầu xác thực tài khoản", details=None):
        super().__init__(message=message, status_code=401, error_code="UNAUTHORIZED", details=details)


class ForbiddenError(APIException):
    def __init__(self, message="Bạn không có quyền truy cập tài nguyên này", details=None):
        super().__init__(message=message, status_code=403, error_code="FORBIDDEN", details=details)


class NotFoundError(APIException):
    def __init__(self, message="Không tìm thấy tài nguyên yêu cầu", details=None):
        super().__init__(message=message, status_code=404, error_code="NOT_FOUND", details=details)


class ConflictError(APIException):
    def __init__(self, message="Dữ liệu đã tồn tại hoặc có sự xung đột", details=None):
        super().__init__(message=message, status_code=409, error_code="CONFLICT", details=details)


class ValidationError(APIException):
    def __init__(self, message="Dữ liệu đầu vào không hợp lệ", details=None):
        super().__init__(message=message, status_code=422, error_code="VALIDATION_ERROR", details=details)


class InternalServerError(APIException):
    def __init__(self, message="Lỗi máy chủ nội bộ. Vui lòng thử lại sau", details=None):
        super().__init__(message=message, status_code=500, error_code="INTERNAL_SERVER_ERROR", details=details)


def register_error_handlers(app):
    try:
        from marshmallow import ValidationError as MarshmallowValidationError
        @app.errorhandler(MarshmallowValidationError)
        def handle_marshmallow_error(err):
            return error_response(
                message="Dữ liệu đầu vào không hợp lệ",
                status_code=422,
                error_code="VALIDATION_ERROR",
                details=err.messages
            )
    except ImportError:
        pass

    @app.errorhandler(APIException)
    def handle_api_exception(err):
        return error_response(
            message=err.message,
            status_code=err.status_code,
            error_code=err.error_code,
            details=err.details
        )

    @app.errorhandler(HTTPException)
    def handle_http_exception(err):
        return error_response(
            message=err.description or "Lỗi HTTP",
            status_code=err.code,
            error_code=err.name.upper().replace(" ", "_"),
            details=None
        )

    @app.errorhandler(Exception)
    def handle_generic_exception(err):
        app.logger.error(f"Unhandled Exception: {str(err)}", exc_info=True)
        
        details = str(err) if app.debug else None
        return error_response(
            message="Đã xảy ra lỗi hệ thống, vui lòng thử lại sau.",
            status_code=500,
            error_code="INTERNAL_SERVER_ERROR",
            details=details
        )
