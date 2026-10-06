import json
from flask import Blueprint, request
from dto import event_dto
from utils.json import error_response, success_response
from services import event_services
from services.image_storage_service import upload_image
from marshmallow import ValidationError

event_api = Blueprint("event_api", __name__, url_prefix="/events")


def _apply_event_image_uploads(json_data):
    image_file = request.files.get("image") or request.files.get("featured_image")
    if image_file:
        json_data["image"] = upload_image(image_file, folder="events")

    speakers = json_data.get("speakers")
    if not isinstance(speakers, list):
        return

    prefix = "speaker_image_"
    for field_name, speaker_file in request.files.items():
        if not field_name.startswith(prefix) or not speaker_file:
            continue
        try:
            index = int(field_name[len(prefix):])
        except ValueError:
            continue
        if 0 <= index < len(speakers) and isinstance(speakers[index], dict):
            speakers[index]["image"] = upload_image(speaker_file, folder="events/speakers")


@event_api.route("/<int:page_id>", methods=["GET"])
def get_events_page(page_id):
    page = event_services.get_events_page(page_id)
    return success_response(data={
        "id": page.id, "name": page.name, "slug": page.slug, "props": page.props,
    })


@event_api.route("/page/hero/<int:page_id>", methods=["PUT"])
def update_page_hero(page_id):
    data = event_dto.EventPageHeroDTO().load(request.get_json())
    data = event_services.update_hero_section(data, page_id)
    return success_response(data=data, message="Đã lưu nội dung đầu trang Sự kiện.")


@event_api.route("/page/filter/<int:page_id>", methods=["PUT"])
def update_page_filter(page_id):
    data = event_dto.EventPageFilterDTO().load(request.get_json())
    data = event_services.update_filter_section(data, page_id)
    return success_response(data=data, message="Đã lưu bộ lọc Sự kiện.")


@event_api.route("/page/displayed-events/<int:page_id>", methods=["PUT"])
def update_page_displayed_events(page_id):
    data = event_dto.EventPageDisplayDTO().load(request.get_json())
    data = event_services.update_displayed_events(data, page_id)
    return success_response(data=data, message="Đã lưu các sự kiện hiển thị.")


@event_api.route("/page/newsletter/<int:page_id>", methods=["PUT"])
def update_page_newsletter(page_id):
    data = event_dto.EventPageNewsletterDTO().load(request.get_json())
    data = event_services.update_newsletter_section(data, page_id)
    return success_response(data=data, message="Đã lưu nội dung trang Sự kiện.")


@event_api.route("/categories", methods=["GET"])
def get_event_categories():
  try:
    categories = event_services.get_event_categories()
    data = [
      {
        "id": category.id,
        "name": category.name,
        "description": getattr(category, "description", None),
      }
      for category in categories
    ]
    return success_response(
      data=data, message="Event categories retrieved successfully", status_code=200
    )
  except Exception as e:
    return error_response(
      message="Failed to retrieve event categories", details=str(e), status_code=500
    )


@event_api.route("/categories", methods=["POST"])
def create_event_category():
  try:
    category_data = event_dto.EventCategoryRequestDTO().load(
      request.get_json() or {}
    )
    category = event_services.create_event_category(category_data)
    result = event_dto.EventCategoryResponse().dump(category)
    return success_response(
      data=result, message="Event category created successfully", status_code=201
    )
  except ValidationError as e:
    return error_response(
      message="Validation error", details=e.messages, status_code=400
    )
  except ValueError as e:
    return error_response(
      message=str(e), details=None, status_code=409
    )
  except Exception as e:
    return error_response(
      message="Failed to create event category", details=str(e), status_code=500
    )


@event_api.route("/categories/<int:category_id>", methods=["PUT"])
def update_event_category(category_id):
    try:
        data = event_dto.EventCategoryRequestDTO().load(request.get_json())
        category = event_services.update_event_category(category_id, data)
        return success_response(
            data=event_dto.EventCategoryResponse().dump(category),
            message="Đã cập nhật chuyên mục.",
        )
    except ValidationError as e:
        return error_response(message="Tên chuyên mục phải có từ 1 đến 255 ký tự.", details=e.messages, status_code=400)
    except ValueError as e:
        return error_response(message=str(e), status_code=409)


@event_api.route("/categories/<int:category_id>", methods=["DELETE"])
def delete_event_category(category_id):
    try:
        event_services.delete_event_category(category_id)
        return success_response(message="Đã xóa chuyên mục.")
    except ValueError as e:
        return error_response(message=str(e), status_code=409)


@event_api.route("/", methods=["GET"])
def get_events():
    """
    Get all events.

    ---
    tags:
      - Event
    responses:
      200:
        description: Events retrieved successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
            data:
              type: array
              items:
                $ref: '#/definitions/Event'
      500:
        description: Failed to retrieve events
    """
    try:
      response = event_services.get_all_events()
      events = [
        {
          "id": event.id,
          "name": event.name,
          "description": event.description,
          "speakers": event.speaker or [],
          "location": event.location,
          "event_date": event.event_date.isoformat() if event.event_date else None,
          "image": event.image,
          "status": getattr(event.status, "value", event.status),
          "btn_action": event.btn_action,
          "form_url": event.form_url,
          "category": (
            {
              "id": event.category.id,
              "name": event.category.name,
              "description": getattr(event.category, "description", None),
            }
            if event.category
            else None
          ),
        }
        for event in response
      ]
      return success_response(
        data=events, message="Events retrieved successfully", status_code=200
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to retrieve events", details=str(e), status_code=500
        )


@event_api.route("/events/<int:event_id>", methods=["GET"])
def get_event(event_id):
    """
    Get an event by ID.

    ---
    tags:
      - Event
    parameters:
      - in: path
        name: event_id
        type: integer

        required: true
        description: ID of the event to retrieve
    responses:
      200:
        description: Event retrieved successfully
        schema:
            $ref: '#/definitions/Event'
        404:
        description: Event not found
      500:
        description: Failed to retrieve event
    """
    try:
        response = event_services.get_event_by_id(event_id)
        if response:
            return success_response(
                data=event_dto.EventResponse().dump(response), message="Event retrieved successfully", status_code=200
            )
        else:
            return error_response(
                message="Event not found", details=None, status_code=404
            )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to retrieve event", details=str(e), status_code=500
        )


@event_api.route("/", methods=["POST"])
def create_event():
    """
    Create a new event.

    ---
    tags:
      - Event
    parameters:
      - in: body
        name: event
        description: Event object that needs to be added
        required: true
        schema:
          $ref: '#/definitions/EventRequest'
    responses:
      201:
        description: Event created successfully
        schema:
          $ref: '#/definitions/EventResponse'
      400:
        description: Invalid input
      500:
        description: Failed to create event
    """
    try:
        if request.mimetype == "multipart/form-data":
            json_data = json.loads(request.form.get("data") or "{}")
            _apply_event_image_uploads(json_data)
        else:
            json_data = request.get_json() or {}

        data = event_dto.EventRequest().load(json_data)
        response = event_services.create_event(data)
        result = event_dto.EventResponse().dump(response)
        return success_response(
            data=result, message="Event created successfully", status_code=201
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to create event", details=str(e), status_code=500
        )


@event_api.route("/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    """
    Update an existing event.

    ---
    tags:
      - Event
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
        description: ID of the event to update
      - in: body
        name: event
        description: Event object that needs to be updated
        required: true
        schema:
          $ref: '#/definitions/EventRequest'
    responses:
      200:
        description: Event updated successfully
        schema:
          $ref: '#/definitions/EventResponse'
      400:
        description: Invalid input
      404:
        description: Event not found
      500:
        description: Failed to update event
    """
    try:
        if request.mimetype == "multipart/form-data":
            json_data = json.loads(request.form.get("data") or "{}")
            _apply_event_image_uploads(json_data)
        else:
            json_data = request.get_json() or {}

        data = event_dto.EventRequest().load(json_data)
        response = event_services.update_event(event_id, data)
        if response is None:
            return error_response(message="Không tìm thấy sự kiện.", status_code=404)
        result = event_dto.EventResponse().dump(response)
        return success_response(
            data=result, message="Event updated successfully", status_code=200
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to update event", details=str(e), status_code=500
        )


@event_api.route("/<int:event_id>/status", methods=["PATCH"])
def update_event_status(event_id):
    """
    Update the status of an existing event.

    ---
    tags:
      - Event
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
        description: ID of the event to update
      - in: body
        name: status
        description: New status for the event
        required: true
        schema:
          type: object
          required:
            - status
          properties:
            status:
              type: string
              description: New status for the event
    responses:
      200:
        description: Event status updated successfully
        schema:
          $ref: '#/definitions/EventResponse'
      400:
        description: Invalid input
      404:
        description: Event not found
      500:
        description: Failed to update event status
    """
    try:
        data = request.get_json()
        status = data.get("status")
        response = event_services.update_event_status(event_id, status)
        result = event_dto.EventResponse().dump(response)
        return success_response(
            data=result, message="Event status updated successfully", status_code=200
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to update event status", details=str(e), status_code=500
        )


@event_api.route("/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    """
    Delete an existing event.

    ---
    tags:
      - Event
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
        description: ID of the event to delete
    responses:
      200:
        description: Event deleted successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
            data:
              type: object
              nullable: true
      400:
        description: Invalid input
      404:
        description: Event not found
      500:
        description: Failed to delete event
    """
    try:
        result = event_services.delete_event(event_id)
        if result:
            return success_response(
                data=None, message="Event deleted successfully", status_code=200
            )
        else:
            return error_response(
                message="Event not found", details=None, status_code=404
            )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to delete event", details=str(e), status_code=500
        )
