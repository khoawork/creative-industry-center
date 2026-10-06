from flask import Blueprint, jsonify, request

from dto.introduce_dto import (
    ActionsSectionRequestDTO, ActionsSectionResponse,
    CoreValuesSectionRequestDTO, CoreValuesSectionResponse,
    HeroSectionRequestDTO, HeroSectionResponse,
    IntroduceResponse,
    MissionSectionRequestDTO, MissionSectionResponse,
    OverviewSectionRequestDTO, OverviewSectionResponse,
    VisionSectionRequestDTO, VisionSectionResponse,
)
from services import introduce_service


introduce_api = Blueprint("introduce_api", __name__, url_prefix="/introduce")


@introduce_api.route("", methods=["GET"])
@introduce_api.route("/", methods=["GET"])
@introduce_api.route("/<int:page_id>", methods=["GET"])
def get(page_id=None):
    if page_id is None:
        page_id = request.args.get("idPage", type=int) or request.args.get("page_id", type=int)
    response = introduce_service.get_introduce(page_id)
    result = IntroduceResponse().dump(response)
    return jsonify(success=True, data=result), 200


@introduce_api.route("/hero/<int:page_id>", methods=["POST", "PUT"])
def update_hero(page_id):
    data = HeroSectionRequestDTO().load(request.get_json())
    response = introduce_service.update_hero_section(data, page_id)
    result = HeroSectionResponse().dump(response)
    return jsonify(success=True, data=result), 200


@introduce_api.route("/overview/<int:page_id>", methods=["POST", "PUT"])
def update_overview(page_id):
    data = OverviewSectionRequestDTO().load(request.get_json())
    response = introduce_service.update_overview_section(data, page_id)
    result = OverviewSectionResponse().dump(response)
    return jsonify(success=True, data=result), 200


@introduce_api.route("/vision/<int:page_id>", methods=["POST", "PUT"])
def update_vision(page_id):
    data = VisionSectionRequestDTO().load(request.get_json())
    response = introduce_service.update_vision_section(data, page_id)
    result = VisionSectionResponse().dump(response)
    return jsonify(success=True, data=result), 200


@introduce_api.route("/mission/<int:page_id>", methods=["POST", "PUT"])
def update_mission(page_id):
    data = MissionSectionRequestDTO().load(request.get_json())
    response = introduce_service.update_mission_section(data, page_id)
    result = MissionSectionResponse().dump(response)
    return jsonify(success=True, data=result), 200


@introduce_api.route("/core-values/<int:page_id>", methods=["POST", "PUT"])
def update_core_values(page_id):
    data = CoreValuesSectionRequestDTO().load(request.get_json())
    response = introduce_service.update_core_values_section(data, page_id)
    result = CoreValuesSectionResponse().dump(response)
    return jsonify(success=True, data=result), 200


@introduce_api.route("/actions/<int:page_id>", methods=["POST", "PUT"])
def update_actions(page_id):
    data = ActionsSectionRequestDTO().load(request.get_json())
    response = introduce_service.update_actions_section(data, page_id)
    result = ActionsSectionResponse().dump(response)
    return jsonify(success=True, data=result), 200