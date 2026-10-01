from flask import current_app


def paginate_query(query, page=1, per_page=None):
    pagination = query.paginate(
        page=page,
        per_page=per_page if per_page is not None else current_app.config["DEFAULT_PAGE_SIZE"],
        max_per_page=current_app.config["MAX_PAGE_SIZE"],
        error_out=False,
    )
    return pagination.items, {
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total": pagination.total,
        "total_pages": pagination.pages,
    }
