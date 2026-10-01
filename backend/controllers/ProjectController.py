from flask import Blueprint, request
from dto import project_dto
from utils.json import error_response, success_response
from services import project_services
from marshmallow import ValidationError

project_api = Blueprint("project_api", __name__, url_prefix="/projects")


@project_api.route("/", methods=["GET"])
def get_projects():
    """
    Get all projects.

    ---
    tags:
      - Project
    responses:
      200:
        description: Projects retrieved successfully
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
                $ref: '#/definitions/Project'
      500:
        description: Failed to retrieve projects
    """
    try:
        response = project_services.get_projects()
        response = project_dto.ProjectResponse(many=True).dump(response)
        return success_response(
            data=response, message="Projects retrieved successfully", status_code=200
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to retrieve projects", details=str(e), status_code=500
        )


@project_api.route("/<int:project_id>", methods=["GET"])
def get_project_by_id(project_id: int):
    """
    Get a project by ID.

    ---
    tags:
      - Project
    parameters:
      - in: path
        name: project_id
        required: true
        type: integer
    responses:

        200:
            description: Project retrieved successfully
            schema:
              type: object
              properties:
                success:
                  type: boolean
                message:
                  type: string
                data:
                  $ref: '#/definitions/Project'
        404:
            description: Project not found
    """
    try:
        response = project_services.get_project_by_id(project_id)
        if not response:
            return error_response(message="Project not found", status_code=404)
        return success_response(
            data=response, message="Project retrieved successfully", status_code=200
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to retrieve project", details=str(e), status_code=500
        )


@project_api.route("/", methods=["POST"])
def create_project():
    """
    Create a new project.

    ---
    tags:
      - Project
    parameters:
      - in: body
        name: project
        required: true
        schema:
          $ref: '#/definitions/Project'
    responses:
      201:
        description: Project created successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
            data:
              $ref: '#/definitions/Project'
      400:
        description: Invalid project data
      500:
        description: Failed to create project
    """
    try:
        data = request.get_json()
        data = project_dto.ProjectRequest().load(data)
        response = project_services.create_project(data)
        result = project_dto.ProjectResponse().dump(response)
        return success_response(
            data=result, message="Project created successfully", status_code=201
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to create project", details=str(e), status_code=500
        )


@project_api.route("/<int:project_id>", methods=["PUT"])
def update_project(project_id: int):
    """
    Update an existing project.

    ---
    tags:
      - Project
    parameters:
      - in: path
        name: project_id
        required: true
        type: integer
      - in: body
        name: project
        required: true
        schema:
          $ref: '#/definitions/Project'
    responses:
      200:
        description: Project updated successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
            data:
              $ref: '#/definitions/Project'
        400:
            description: Invalid project data
        404:
            description: Project not found
    """
    try:
        data = request.get_json()
        data = project_dto.ProjectRequest().load(data)
        response = project_services.update_project(project_id, data)
        if not response:
            return error_response(message="Project not found", status_code=404)
        result = project_dto.ProjectResponse().dump(response)
        return success_response(
            data=result, message="Project updated successfully", status_code=200
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to update project", details=str(e), status_code=500
        )


@project_api.route("/<int:project_id>/image", methods=["PATCH"])
def update_project_image(project_id: int):
    """
    Update the image of an existing project.

    ---
    tags:
      - Project
    parameters:
      - in: path
        name: project_id
        required: true
        type: integer
      - in: body
        name: image
        required: true
        schema:
          type: object
          required:
            - image_url
          properties:
            image_url:
              type: string
              description: New image URL for the project
    responses:
        200:
            description: Project image updated successfully
            schema:
            type: object
            properties:
                success:
                type: boolean
                message:
                type: string
                data:
                $ref: '#/definitions/Project'
        400:
            description: Invalid input
        404:
            description: Project not found
        500:
            description: Failed to update project image
    """
    try:
        data = request.get_json()
        image_url = data.get("image_url")
        response = project_services.update_project_image(project_id, image_url)
        if not response:
            return error_response(message="Project not found", status_code=404)
        result = project_dto.ProjectResponse().dump(response)
        return success_response(
            data=result, message="Project image updated successfully", status_code=200
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to update project image", details=str(e), status_code=500
        )


@project_api.route("/<int:project_id>/", methods=["DELETE"])
def delete_project(project_id: int):
    """
    Delete an existing project.

    ---
    tags:
      - Project
    parameters:
      - in: path
        name: project_id
        required: true
        type: integer
    responses:
        200:
            description: Project deleted successfully
            schema:
            type: object
            properties:
                success:
                type: boolean
                message:
                type: string
        404:
            description: Project not found
        500:
            description: Failed to delete project
    """
    try:
        success = project_services.delete_project(project_id)
        if not success:
            return error_response(message="Project not found", status_code=404)
        return success_response(message="Project deleted successfully", status_code=200)
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to delete project", details=str(e), status_code=500
        )


category_project_api = Blueprint(
    "category_api", __name__, url_prefix="/categories_project"
)


@category_project_api.route("/", methods=["POST"])
def create_project_category():
    """
    Create a new project category.

    ---
    tags:
      - Project Category
    parameters:
      - in: body
        name: category
        required: true
        schema:
          $ref: '#/definitions/ProjectCategory'
    responses:
        201:
            description: Project category created successfully
            schema:
            type: object
            properties:
                success:
                type: boolean
                message:
                type: string
                data:
                $ref: '#/definitions/ProjectCategory'
        400:
            description: Invalid project category data
        500:
            description: Failed to create project category
    """
    try:
        data = request.get_json()
        data = project_dto.ProjectCategoryRequest().load(data)
        response = project_services.create_project_category(data)
        result = project_dto.ProjectCategoryResponse().dump(response)
        return success_response(
            data=result,
            message="Project category created successfully",
            status_code=201,
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to create project category", details=str(e), status_code=500
        )


@category_project_api.route("/", methods=["GET"])
def get_project_categories():
    """
    Get all project categories.

    ---
    tags:
      - Project Category
    responses:
        200:
            description: Project categories retrieved successfully
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
                    $ref: '#/definitions/ProjectCategory'
        500:
            description: Failed to retrieve project categories
    """
    try:
        response = project_services.get_categories()
        response = project_dto.ProjectCategoryResponse(many=True).dump(response)
        return success_response(
            data=response,
            message="Project categories retrieved successfully",
            status_code=200,
        )
    except ValidationError as e:
        return error_response(
            message="Validation error", details=e.messages, status_code=400
        )
    except Exception as e:
        return error_response(
            message="Failed to retrieve project categories",
            details=str(e),
            status_code=500,
        )