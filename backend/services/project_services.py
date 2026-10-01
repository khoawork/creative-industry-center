from repositories import project_repository as project_repo
from dto import project_dto
from models import Project, ProjectCategory


def is_unique_name(name: str, project_id: int = None, category_id: int = None) -> bool:
    if category_id is not None:
        existing_category = project_repo.get_project_category_by_name(name)
        if existing_category and existing_category.id != category_id:
            return False
        return True

    existing_project = project_repo.get_project_by_name(name)
    if existing_project and (not project_id or existing_project.id != project_id):
        return False

    return True


def create_project_category(
    category_data: project_dto.ProjectCategoryRequest,
) -> project_dto.ProjectCategoryResponse:
    if not category_data:
        raise ValueError("Project category data is required")

    is_unique = is_unique_name(name=category_data.name, category_id=-1)
    if not is_unique:
        raise ValueError("Project category name must be unique")

    category = project_repo.create_project_category(category_data)

    return category


def get_categories() -> list[ProjectCategory]:
    return project_repo.get_all_project_categories()


def update_project_category(
    category_id: int, category_data: project_dto.ProjectCategoryRequest
) -> project_dto.ProjectCategoryResponse:
    if not category_data:
        raise ValueError("Project category data is required")

    is_unique = is_unique_name(name=category_data.name, category_id=category_id)
    if not is_unique:
        raise ValueError("Project category name must be unique")

    category = project_repo.update_project_category(category_id, category_data)

    return category


def get_projects() -> list[Project]:
    
    return project_repo.get_projects()


def get_project_by_id(project_id: int) -> Project:
    return project_repo.get_project_by_id(project_id)


def create_project(project_data: Project) -> Project:

    if not project_data:
        raise ValueError("Project data is required")

    is_unique = is_unique_name(name=project_data.name)
    if not is_unique:
        raise ValueError("Project name must be unique")

    project = project_repo.create_project(project_data)

    return project


def update_project(project_id: int, project_data: Project) -> Project:

    if not project_data:
        raise ValueError("Project data is required")

    is_unique = is_unique_name(name=project_data.name, project_id=project_id)
    if not is_unique:
        raise ValueError("Project name must be unique")

    return project_repo.update_project(project_id, project_data)


def update_project_image(project_id: int, image_url: str) -> Project:

    if not image_url:
        raise ValueError("Image URL is required")

    return project_repo.update_project_image(project_id, image_url)


def delete_project(project_id: int) -> bool:
    return project_repo.delete_project(project_id)