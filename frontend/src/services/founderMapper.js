export function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const DEFAULT_TAB = {
  title: "Chưa cập nhật",
  content: "Nội dung cho bộ lọc này chưa được cập nhật.",
  quote: "",
  quoteAuthor: "",
  isAvailable: false,
};

function toTabContent(title, content, quote, quoteAuthor) {
  return {
    title: title || DEFAULT_TAB.title,
    content: content || DEFAULT_TAB.content,
    quote: quote || "",
    quoteAuthor: quoteAuthor || "",
    isAvailable: Boolean(content && content.trim()),
  };
}

function normalizeProfileFilter(filter) {
  if (filter === "project") return "projects";
  if (filter === "achievement") return "achievements";
  return ["bio", "projects", "achievements"].includes(filter) ? filter : "bio";
}

export function unwrapFounderResponse(result) {
  return result?.data ?? result;
}

export function mapFounderSectionToStory(section) {
  const profile = section?.founder_profile || {};
  const profileFilter = normalizeProfileFilter(profile.filter);
  const founderInfo = Array.isArray(section?.founder_info)
    ? section.founder_info
    : [];
  const displayCategory = section?.major || "Founder";
  const verifiedLabel = section?.is_verified ? "Đã xác minh" : "Hồ sơ Founder";
  const desc = profile.description || section?.description || "";
  const storyName = section?.name || "Founder chưa đặt tên";
  const slug = slugify(storyName) || String(section?.id || "");

  const profileContent = toTabContent(
    profile.title || storyName,
    desc,
    profile.slogan,
    profile.sub_slogan || storyName,
  );
  const unavailableContent = { ...DEFAULT_TAB };

  return {
    id: section?.id,
    slug,
    category: displayCategory,
    badgeText: verifiedLabel,
    categoryLabel: displayCategory,
    name: storyName,
    title: section?.major || "Founder",
    image: section?.image || "",
    description: section?.description || profile.description || "",
    profileDescription: profile.description || section?.description || "",
    storyTitle: profile.title || storyName || "",
    quote: profile.slogan || "",
    quoteAuthor: profile.sub_slogan || storyName || "",
    profileFilter,
    meta: founderInfo,
    tabs: {
      about: profileFilter === "bio" ? profileContent : (profileContent.isAvailable ? profileContent : unavailableContent),
      journey:
        profileFilter === "projects" ? profileContent : unavailableContent,
      achievements:
        profileFilter === "achievements" ? profileContent : unavailableContent,
    },
  };
}

export function mapFounderPageToStories(page) {
  const sections = page?.props?.section;
  return Array.isArray(sections) ? sections.map(mapFounderSectionToStory) : [];
}

export function mapFounderPageToHero(page) {
  return page?.props?.hero_section || null;
}

export function mapFounderPageToCta(page) {
  return page?.props?.cta_section || null;
}

export function getFounderCategories(stories) {
  const categories = stories
    .map((story) => ({ id: story.category, label: story.categoryLabel }))
    .filter((category) => category.id);
  const uniqueCategories = categories.filter(
    (category, index, all) =>
      all.findIndex((item) => item.id === category.id) === index,
  );

  return [{ id: "all", label: "Tất cả lĩnh vực" }, ...uniqueCategories];
}
