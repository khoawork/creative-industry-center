from repositories import award_repository
from repositories.pages import award_repository as page_repository

SLUG = "awards"
DEFAULT_PROPS = {
    "header": {
        "title": "Hệ thống giải thưởng sáng tạo",
        "sub_title": "BẢNG VINH DANH THƯỜNG NIÊN",
        "description": "Hệ thống giải thưởng tôn vinh những đóng góp nổi bật trong bảo tồn di sản, đổi mới sáng tạo và xác lập giá trị Việt Nam.",
    },
    "list_card": {"count": 0, "title": "Danh mục giải thưởng thường niên", "list_card": [], "award_ids": []},
    "latest_honor_board": [],
}


def _page_props(page):
    raw_props = dict(page.props or {}) if page else {}
    props = {**DEFAULT_PROPS, **raw_props}
    list_card = dict(props.get("list_card") or {})
    header = dict(props.get("header") or {})
    props["header"] = {**DEFAULT_PROPS["header"], **header}
    props["list_card"] = {
        "count": list_card.get("count", 0),
        "title": list_card.get("title") or DEFAULT_PROPS["list_card"]["title"],
        "award_ids": list(list_card.get("award_ids") or []),
    }
    props["latest_honor_board"] = list(props.get("latest_honor_board") or DEFAULT_PROPS["latest_honor_board"])
    return props


def get_page(create=False):
    page = page_repository.get_page_by_slug("awards") or page_repository.get_page_by_slug("award")
    if page is None:
        from models.PageModel import Page
        page = Page.query.filter_by(id=6).first()
    if page is None and create:
        page = page_repository.create_page("Giải thưởng", "awards", DEFAULT_PROPS)
    return page


def get_page_data():
    page = get_page()
    props = _page_props(page)
    awards, meta = award_repository.get_awards(page=1, per_page=None)
    award_ids = props.get("list_card", {}).get("award_ids") or []
    has_selection = bool(
        page and "award_ids" in (page.props or {}).get("list_card", {}) and award_ids
    )
    if has_selection:
        selected_ids = {str(award_id) for award_id in award_ids}
        awards = [award for award in awards if str(award.id) in selected_ids]
    props["list_card"] = {
        **props.get("list_card", {}),
        "count": len(awards),
        "award_ids": award_ids if has_selection else [str(a.id) for a in awards],
    }
    return page, props, awards


def update_award_selection(award_ids):
    page = get_page(create=True)
    props = _page_props(page)
    props["list_card"]["award_ids"] = [str(award_id) for award_id in award_ids]
    page.props = props
    return page_repository.save_page(page)


def update_header(data):
    page = get_page(create=True)
    props = _page_props(page)
    props["header"] = {**props["header"], **data}
    page.props = props
    return page_repository.save_page(page)


def get_honor_board():
    page = get_page()
    return _page_props(page)["latest_honor_board"] if page else []


def create_honor_board(data):
    page = get_page(create=True)
    props = _page_props(page)
    items = props["latest_honor_board"]
    item = {**data, "id": f"honor_board_{len(items) + 1}"}
    props["latest_honor_board"] = [*items, item]
    page.props = props
    page_repository.save_page(page)
    return item


def update_honor_board(item_id, data):
    page = get_page(create=False)
    if page is None:
        raise ValueError("Honor board not found")
    props = _page_props(page)
    items = props["latest_honor_board"]
    current = next((item for item in items if item.get("id") == item_id), None)
    if current is None:
        raise ValueError(f"Honor board '{item_id}' not found")
    updated = {**current, **data, "id": item_id}
    props["latest_honor_board"] = [
        updated if item.get("id") == item_id else item for item in items
    ]
    page.props = props
    page_repository.save_page(page)
    return updated


def delete_honor_board(item_id):
    page = get_page(create=False)
    if page is None:
        raise ValueError("Honor board not found")
    props = _page_props(page)
    items = props["latest_honor_board"]
    if not any(item.get("id") == item_id for item in items):
        raise ValueError(f"Honor board '{item_id}' not found")
    remaining = [item for item in items if item.get("id") != item_id]
    props["latest_honor_board"] = [
        {**item, "id": f"honor_board_{index}"}
        for index, item in enumerate(remaining, start=1)
    ]
    page.props = props
    page_repository.save_page(page)
