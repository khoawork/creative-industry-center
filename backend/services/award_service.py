from repositories import award_repository
from utils.error import NotFoundError, ValidationError


def get_awards(search=None, title=None, year=None, page=1, per_page=None):
    return award_repository.get_awards(
        search=search, title=title, year=year, page=page, per_page=per_page
    )


def get_award(award_id: str):
    award = award_repository.get_award(award_id)
    if award is None:
        raise NotFoundError("Không tìm thấy giải thưởng.")
    return award


def create_award(dto):
    return award_repository.create_award(**vars(dto))


def update_award(award_id: str, dto, partial=False):
    award = get_award(award_id)
    changes = vars(dto)
    if not changes:
        raise ValidationError("Cần ít nhất một trường để cập nhật.")
    if partial and changes.get("props") is not None:
        changes["props"] = {**(award.props or {}), **changes["props"]}
    return award_repository.update_award(award, changes)


def delete_award(award_id: str):
    award_repository.delete_award(get_award(award_id))
