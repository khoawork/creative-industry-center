from models import Project, ProjectCategory
from extensions import db


def get_project_category_by_name(name: str) -> Project:
    return Project.query.filter_by(name=name).first()


def get_project_category_by_id(category_id: int) -> Project:
    return Project.query.get(category_id)


def create_project_category(category_data: Project) -> Project:
    category = ProjectCategory(
        name=category_data.name,
        description=category_data.description,
    )
    db.session.add(category)
    db.session.commit()
    return category


def get_all_project_categories() -> list[Project]:
    return Project.query.all()


def update_project_category(category_id: int, category_data: Project) -> Project:
    category = Project.query.get(category_id)
    if not category:
        return None

    category.name = category_data.name
    category.description = category_data.description

    db.session.commit()
    return category


def update_project_image(project_id: int, image_url: str) -> Project:
    project = Project.query.get(project_id)
    if not project:
        return None

    project.image = image_url

    db.session.commit()
    return project


def get_project_by_name(name: str) -> Project:
    return Project.query.filter_by(name=name).first()


def get_projects() -> list[Project]:
    return Project.query.all()


def get_project_by_id(project_id: int) -> Project:
    return Project.query.get(project_id)


def create_project(project_data: Project) -> Project:
    project = Project(
        name=project_data.name,
        title=project_data.title,
        description=project_data.description,
        research_info=[
            {
                "label": item.label,
                "value": item.value,
            }
            for item in project_data.research_info
        ],
        project_info={
            key: value for key, value in vars(project_data.project_info).items()
        },
        slogan=project_data.slogan,
        image=project_data.image,
        category_id=project_data.category_id,
    )

    db.session.add(project)
    db.session.commit()

    return project


def update_project(project_id: int, project_data: Project) -> Project:
    project = Project.query.get(project_id)
    if not project:
        return None

    project.name = project_data.name
    project.description = project_data.description
    project.start_date = project_data.start_date
    project.end_date = project_data.end_date

    db.session.commit()
    return project


def delete_project(project_id: int) -> bool:
    project = Project.query.get(project_id)
    if project:
        db.session.delete(project)
        db.session.commit()
        return True
    return False