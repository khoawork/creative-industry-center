from extensions import db
from types import SimpleNamespace
from repositories.pages import founder_repository as founder_repo


def to_dict(data):
    if isinstance(data, SimpleNamespace):
        return {key: to_dict(value) for key, value in vars(data).items()}

    if isinstance(data, dict):
        return {key: to_dict(value) for key, value in data.items()}

    if isinstance(data, list):
        return [to_dict(item) for item in data]

    return data


def create_id(props, key):
    items = props.get(key, [])

    if not isinstance(items, list):
        raise ValueError(f"props['{key}'] must be a list")

    next_id = len(items) + 1

    return f"{key}_{next_id}"


def reindex_ids(items, key):
    prefix = f"{key}_"

    for index, item in enumerate(items, start=1):
        item["id"] = f"{prefix}{index}"

    return items


def get_page_by_slug(slug):
    page = founder_repo.get_page_by_slug(slug)

    if not page:
        raise ValueError(f"Page with slug '{slug}' not found")

    return page


def create_hero_section(slug, founder_hero_data):
    page = get_page_by_slug(slug)

    founder_hero_data = to_dict(founder_hero_data)

    props = page.props or {}

    founder_hero_data["id"] = "hero_1"

    page.props = {
        **props,
        "hero_section": founder_hero_data,
    }

    founder_repo.save_page(page)

    return founder_hero_data


def update_hero_section(slug, founder_hero_data):
    page = get_page_by_slug(slug)

    founder_hero_data = to_dict(founder_hero_data)

    props = page.props or {}

    current_hero = props.get("hero_section")

    if not current_hero:
        raise ValueError("Hero section not found")

    updated_hero = {
        **current_hero,
        **founder_hero_data,
    }

    page.props = {
        **props,
        "hero_section": updated_hero,
    }

    founder_repo.save_page(page)

    return updated_hero


def normalize_founder_section(section_data, existing_section=None, section_index=0):
    section_data = to_dict(section_data)
    existing_section = existing_section or {}
    existing_info = existing_section.get("founder_info", [])
    founder_info = []

    for index, info in enumerate(section_data.get("founder_info", [])):
        previous_info = existing_info[index] if index < len(existing_info) else {}
        founder_info.append(
            {
                **previous_info,
                **to_dict(info),
                "id": info.get(
                    "id",
                    previous_info.get(
                        "id", f"founder_info_{section_index + index + 1}"
                    ),
                ),
            }
        )

    profile = {
        **existing_section.get("founder_profile", {}),
        **section_data.get("founder_profile", {}),
    }
    profile["id"] = profile.get("id", f"profile_{section_index + 1}")

    return {
        **section_data,
        "founder_info": founder_info,
        "founder_profile": profile,
    }


def create_founder_section(slug, founder_section_data):
    page = get_page_by_slug(slug)

    props = page.props or {}
    sections = props.get("section", [])

    if not isinstance(sections, list):
        raise ValueError("props['section'] must be a list")

    founder_section_data = normalize_founder_section(
        founder_section_data,
        section_index=len(sections),
    )
    founder_section_data["id"] = create_id(props, "section")

    page.props = {
        **props,
        "section": [*sections, founder_section_data],
    }

    founder_repo.save_page(page)

    return founder_section_data


def update_founder_section(slug, section_id, founder_section_data):
    page = get_page_by_slug(slug)

    props = page.props or {}

    sections = props.get("section", [])

    if not isinstance(sections, list):
        raise ValueError("props['section'] must be a list")

    target = next(
        (item for item in sections if item.get("id") == section_id),
        None,
    )

    if not target:
        raise ValueError(f"Founder section '{section_id}' not found")

    section_index = sections.index(target)
    updated_section = normalize_founder_section(
        {
            **target,
            **to_dict(founder_section_data),
            "id": section_id,
        },
        existing_section=target,
        section_index=section_index,
    )

    updated_sections = [
        updated_section if item.get("id") == section_id else item for item in sections
    ]

    page.props = {
        **props,
        "section": updated_sections,
    }

    founder_repo.save_page(page)

    return updated_section


def delete_founder_section(slug, section_id):
    page = get_page_by_slug(slug)

    props = page.props or {}
    sections = props.get("section", [])

    if not isinstance(sections, list):
        raise ValueError("props['section'] must be a list")

    # Kiểm tra tồn tại
    if not any(item.get("id") == section_id for item in sections):
        raise ValueError(f"Founder section '{section_id}' not found")

    # Xóa
    updated_sections = [item for item in sections if item.get("id") != section_id]

    # Đánh lại ID
    updated_sections = reindex_ids(updated_sections, "section")

    page.props = {**props, "section": updated_sections}

    founder_repo.save_page(page)

    return updated_sections


def get_founder_cta(slug):
    page = get_page_by_slug(slug)

    return (page.props or {}).get("cta_section", {})


def create_founder_cta(slug, founder_cta_data):
    page = get_page_by_slug(slug)

    founder_cta_data = to_dict(founder_cta_data)

    props = page.props or {}

    if "cta_section" in props:
        raise ValueError("CTA section already exists")

    founder_cta_data["id"] = "cta_1"
    founder_cta_data["form_url"] = founder_cta_data.get("form_url", "/contact")
    founder_cta_data["certificate"] = [
        {
            **to_dict(certificate),
            "id": certificate.get("id", f"certificate_{index}"),
        }
        for index, certificate in enumerate(
            founder_cta_data.get("certificate", []),
            start=1,
        )
    ]

    page.props = {
        **props,
        "cta_section": founder_cta_data,
    }

    founder_repo.save_page(page)

    return founder_cta_data


def update_founder_cta(slug, founder_cta_data):
    page = get_page_by_slug(slug)

    founder_cta_data = to_dict(founder_cta_data)

    props = page.props or {}

    current_cta = props.get("cta_section")

    if not current_cta:
        raise ValueError("CTA section not found")

    updated_cta = {
        **current_cta,
        **founder_cta_data,
        "id": current_cta.get("id", "cta_1"),
        "form_url": founder_cta_data.get(
            "form_url",
            current_cta.get("form_url", "/contact"),
        ),
    }

    page.props = {
        **props,
        "cta_section": updated_cta,
    }

    founder_repo.save_page(page)

    return updated_cta


def get_founder_certificates(slug):
    page = get_page_by_slug(slug)

    props = page.props or {}

    cta_section = props.get("cta_section", {})

    return cta_section.get("certificate", [])


def create_founder_certificate(slug, certificate_data):
    page = get_page_by_slug(slug)

    certificate_data = to_dict(certificate_data)

    props = page.props or {}

    cta_section = props.get("cta_section")

    if not cta_section:
        raise ValueError("CTA section not found")

    certificates = cta_section.get("certificate", [])

    if not isinstance(certificates, list):
        raise ValueError("cta_section['certificate'] must be a list")

    certificate_data["id"] = create_id(cta_section, "certificate")

    updated_certificates = [
        *certificates,
        certificate_data,
    ]

    updated_cta = {
        **cta_section,
        "certificate": updated_certificates,
    }

    page.props = {
        **props,
        "cta_section": updated_cta,
    }

    founder_repo.save_page(page)

    return certificate_data


def update_founder_certificate(
    slug,
    certificate_id,
    certificate_data,
):
    page = get_page_by_slug(slug)

    certificate_data = to_dict(certificate_data)

    props = page.props or {}

    cta_section = props.get("cta_section")

    if not cta_section:
        raise ValueError("CTA section not found")

    certificates = cta_section.get("certificate", [])

    target = next(
        (item for item in certificates if item.get("id") == certificate_id),
        None,
    )

    if not target:
        raise ValueError(f"Certificate '{certificate_id}' not found")

    updated_certificate = {
        **target,
        **certificate_data,
        "id": certificate_id,
    }

    updated_certificates = [
        updated_certificate if item.get("id") == certificate_id else item
        for item in certificates
    ]

    updated_cta = {
        **cta_section,
        "certificate": updated_certificates,
    }

    page.props = {
        **props,
        "cta_section": updated_cta,
    }

    founder_repo.save_page(page)

    return updated_certificate


def delete_founder_certificate(slug, certificate_id):
    page = get_page_by_slug(slug)

    props = page.props or {}
    cta_section = props.get("cta_section")

    if not cta_section:
        raise ValueError("CTA section not found")

    certificates = cta_section.get("certificate", [])

    if not isinstance(certificates, list):
        raise ValueError("cta_section['certificate'] must be a list")

    # Kiểm tra tồn tại
    if not any(item.get("id") == certificate_id for item in certificates):
        raise ValueError(f"Certificate '{certificate_id}' not found")

    # Xóa
    updated_certificates = [
        item for item in certificates if item.get("id") != certificate_id
    ]

    # Đánh lại ID
    updated_certificates = reindex_ids(updated_certificates, "certificate")

    updated_cta = {**cta_section, "certificate": updated_certificates}

    page.props = {**props, "cta_section": updated_cta}

    founder_repo.save_page(page)

    return updated_certificates
