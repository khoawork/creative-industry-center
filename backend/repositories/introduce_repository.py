from sqlalchemy.orm.attributes import flag_modified

from dto.introduce_dto import (
    ActionsSectionResponse,
    CoreValuesSectionResponse,
    HeroSectionResponse,
    MissionSectionResponse,
    OverviewSectionResponse,
    VisionSectionResponse,
)
from extensions import db
from utils.error import InternalServerError


def _save_section(page, section_key, section_data):
    """Lưu một section trên Page đã được service kiểm tra."""
    if not isinstance(page.props, dict):
        raise InternalServerError(message="Dữ liệu props của trang Giới thiệu không hợp lệ.")

    current_props = dict(page.props)
    current_props[section_key] = section_data

    try:
        page.props = current_props
        flag_modified(page, "props")
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise

    return section_data


def update_hero(page, data):
    hero_data = HeroSectionResponse().dump(data)
    return _save_section(page, "hero_section", hero_data)


def update_overview(page, data):
    overview_data = OverviewSectionResponse().dump(data)
    return _save_section(page, "overview_section", overview_data)


def update_vision(page, data):
    vision_data = VisionSectionResponse().dump(data)
    return _save_section(page, "vision_section", vision_data)


def update_mission(page, data):
    mission_data = MissionSectionResponse().dump(data)
    return _save_section(page, "mission_section", mission_data)


def update_core_values(page, data):
    core_values_data = CoreValuesSectionResponse().dump(data)
    return _save_section(page, "core_values_section", core_values_data)


def update_actions(page, data):
    actions_data = ActionsSectionResponse().dump(data)
    return _save_section(page, "actions_section", actions_data)
