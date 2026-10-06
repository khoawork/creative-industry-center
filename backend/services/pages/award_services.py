from repositories import award_repository
from repositories.pages import award_repository as page_repository

SLUG = "award"
DEFAULT_PROPS = {
    "header": {},
    "list_card": {"count": 0, "title": "", "list_card": []},
    "latest_honor_board": [],
}


def _page_props(page):
    props = dict(page.props or {})
    list_card = dict(props.get("list_card") or {})
    props["header"] = dict(props.get("header") or {})
    props["list_card"] = {
        "count": list_card.get("count", 0),
        "title": list_card.get("title", ""),
        "award_ids": list(list_card.get("award_ids") or []),
    }
    props["latest_honor_board"] = list(props.get("latest_honor_board") or [])
    return props


def get_page(create=False):
    page = page_repository.get_page_by_slug(SLUG)
    if page is None and create:
        page = page_repository.create_page("Giải thưởng", SLUG, DEFAULT_PROPS)
    return page


def get_page_data():
    page = get_page()
    props = _page_props(page) if page else dict(DEFAULT_PROPS)
    awards, meta = award_repository.get_awards(page=1, per_page=None)
    award_ids = props["list_card"]["award_ids"]
    has_selection = bool(
        page and "award_ids" in (page.props or {}).get("list_card", {})
    )
    if has_selection:
        selected_ids = {str(award_id) for award_id in award_ids}
        awards = [award for award in awards if str(award.id) in selected_ids]
    props["list_card"] = {
        **props["list_card"],
        "count": len(awards),
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
