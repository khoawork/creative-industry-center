from flask import Blueprint, request
from marshmallow import ValidationError

from dto import training_dto
from services import training_services
from utils.json import error_response, success_response

training_api = Blueprint("training_api", __name__, url_prefix="/trainings")


@training_api.route("/", methods=["GET"])
def get_trainings():
    """
    Get all trainings.

    ---
    tags:
      - Training
    responses:
      200:
        description: Trainings retrieved successfully
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
                $ref: '#/definitions/Training'
      500:
        description: Failed to retrieve trainings
    """
    try:
        response = training_services.get_all_trainings()
        return success_response(
            data=response,
            message="Trainings retrieved successfully",
            status_code=200,
        )

    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to retrieve trainings", details=str(e), status_code=500
        )


@training_api.route("/", methods=["POST"])
def create_training():
    """
    Create a new training.

    ---
    tags:
      - Training
    parameters:
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/TrainingRequest'
    responses:
      201:
        description: Training created successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
            data:
              $ref: '#/definitions/Training'
      400:
        description: Validation error
      500:
        description: Failed to create training
    """
    try:
        data = request.get_json()
        data = training_dto.TrainingRequest().load(data)
        response = training_services.create_training(data)
        result = training_dto.TrainingReponse().dump(response)
        return success_response(
            data=result, message="Training created successfully", status_code=201
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to create training", details=str(e), status_code=500
        )


@training_api.route("/<int:training_id>", methods=["PUT"])
def update_training(training_id):
    """
    Update a training.

    ---
    tags:
      - Training
    parameters:
      - in: path
        name: training_id
        type: integer
        required: true
        description: Training ID
      - in: body
        name: body
        required: true
        schema:
          $ref: '#/definitions/TrainingRequest'
    responses:
      200:
        description: Training updated successfully
      400:
        description: Validation error
      404:
        description: Training not found
      500:
        description: Failed to update training
    """
    try:
        data = request.get_json()
        data = training_dto.TrainingRequest().load(data)
        response = training_services.update_training(training_id, data)
        if response is None:
            return error_response(
                message="Training not found",
                details=f"Training ID {training_id} does not exist",
                status_code=404,
            )
        return success_response(data=response, message="Training updated successfully")

    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to update training", details=str(e), status_code=500
        )


@training_api.route("/<int:training_id>", methods=["DELETE"])
def delete_training(training_id):
    """
    Delete a training.

    ---
    tags:
      - Training
    parameters:
      - in: path
        name: training_id
        type: integer
        required: true
        description: Training ID
    responses:
      200:
        description: Training deleted successfully
      404:
        description: Training not found
      500:
        description: Failed to delete training
    """
    try:
        success = training_services.delete_training(training_id)
        if not success:
            return error_response(
                message="Training not found",
                details=f"Training ID {training_id} does not exist",
                status_code=404,
            )
        return success_response(message="Training deleted successfully")

    except Exception as e:
        return error_response(
            message="Failed to delete training", details=str(e), status_code=500
        )
