export function unwrapAwardPage(result) {
  return result?.data || result || null;
}

export function mapAwardCard(award) {
  const props = award?.props || {};
  return {
    ...award,
    title: award?.name || award?.title || "",
    category: award?.title || "",
    categoryBadge: props.category_badge || award?.title || "GIẢI THƯỞNG",
    scope: props.scope || "",
    subtitle: props.subtitle || award?.title || "",
    iconName: props.iconName || award?.icon || "Trophy",
    criteria: props.award_evaluation_criteria || [],
    dossier: props.nomination_dossier || [],
  };
}

export function mapHonorBoardItem(item) {
  return {
    ...item,
    badge: item?.title || "",
    title: item?.name || "",
    subtitle: item?.sub_name || "",
    description: item?.description || "",
    date: item?.time || "",
    code: item?.decision_number || "",
    avatar: item?.image || item?.icon || "",
    iconType: item?.icon_type || "trophy",
  };
}

export function mapAwardPage(result) {
  const page = unwrapAwardPage(result);
  const props = page?.props || {};
  const listCard = props.list_card || {};
  return {
    page,
    header: props.header || {},
    awards: (listCard.list_card || []).map(mapAwardCard),
    honorees: (props.latest_honor_board || []).map(mapHonorBoardItem),
  };
}
