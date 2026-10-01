from flask import Blueprint, request
from dto import event_dto
from utils.json import error_response, success_response
from services import event_services
from marshmallow import ValidationError

event_api = Blueprint("event_api", __name__, url_prefix="/events")


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
        return success_response(
            data=response, message="Events retrieved successfully", status_code=200
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
                data=response, message="Event retrieved successfully", status_code=200
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
        data = request.get_json()
        data = event_dto.EventRequest().load(data)
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
        data = request.get_json()
        data = event_dto.EventRequest().load(data)
        response = event_services.update_event(event_id, data)
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
