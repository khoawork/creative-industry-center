import { AwardAPI } from "../api/awardApi.js";
import { EventAPI } from "../api/eventApi.js";
import { HomeAPI } from "../api/homeApi.js";
import { ProjectAPI } from "../api/projectApi.js";
import { TrainingAPI } from "../api/trainingApi.js";

/**
 * Giá trị khởi tạo rỗng; dữ liệu được tải trực tiếp từ backend.
 */
export const DEFAULT_TABLE_DATA = {
  events: [],
  projects: [],
  trainings: [],
  awards: [],
};

export async function fetchNavSections(pageId) {
  const response = await HomeAPI.getAllNavs(pageId);
  return Array.isArray(response?.data) ? response.data : [];
}

export function detectTableForNav(nav) {
  if (!nav) return "events";
  const link = (nav.action_button?.link || "").toLowerCase();
  const text =
    `${nav.tag || ""} ${nav.title_main || ""} ${nav.action_button?.text || ""}`.toLowerCase();

  if (
    link.includes("project") ||
    text.includes("dự án") ||
    text.includes("chuyện")
  )
    return "projects";
  if (
    link.includes("train") ||
    text.includes("đào tạo") ||
    text.includes("hợp tác") ||
    text.includes("khóa")
  )
    return "trainings";
  if (
    link.includes("award") ||
    text.includes("giải thưởng") ||
    text.includes("vinh danh") ||
    text.includes("kỷ lục")
  )
    return "awards";
  if (
    link.includes("event") ||
    text.includes("sự kiện") ||
    text.includes("hoạt động")
  )
    return "events";

  return "events";
}

export async function fetchTableItems(tableKey) {
  try {
    let response;
    let items;

    if (tableKey === "events") {
      response = await EventAPI.getEvents();
      items = getResponseItems(response).map((event) => ({
        id: event.id,
        name: event.name,
        subtitle: event.description || "",
        category: event.category?.name || event.category || "",
        date: event.date || event.time || "",
        location: event.location || "",
        image: event.image || "",
        status: event.status || "",
      }));
    } else if (tableKey === "projects") {
      response = await ProjectAPI.getProjects();
      console.log("Fetched projects:", response.data);
      items = getResponseItems(response).map((project) => ({
        id: project.id,
        name: project.name,
        subtitle: project.description || "",
        title: project.title || "",
        category: project.category?.name || project.category || "",
        slogan: project.slogan || "",
        image: project.image || "",
      }));
    } else if (tableKey === "trainings") {
      response = await TrainingAPI.getTrainings({ per_page: 100 });
      items = getResponseItems(response).map((training) => ({
        id: training.id,
        name: training.name,
        subtitle: training.props?.description || "",
        category: training.props?.target_audience || "",
        certificate: training.certificate || "",
        duration: (training.props?.highlights || []).join(", "),
        time: training.time || "",
      }));
    } else if (tableKey === "awards") {
      response = await AwardAPI.getAwards({ per_page: 100 });
      items = getResponseItems(response).map((award) => ({
        id: award.id,
        name: award.name,
        subtitle: award.description || "",
        category: award.title || "",
        tag: award.decision_number || "",
        decision: award.decision_number || "",
        image: award.image || "",
      }));
    } else {
      items = [];
    }

    DEFAULT_TABLE_DATA[tableKey] = items;
    return items;
  } catch {
    DEFAULT_TABLE_DATA[tableKey] = [];
    return [];
  }
}

function getResponseItems(response) {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response)) return response;
  return [];
}

/**
 * Tìm thông tin của một item qua ID trong tất cả các bảng
 */
export function findItemById(id, preferTableKey = null) {
  if (preferTableKey && DEFAULT_TABLE_DATA[preferTableKey]) {
    const found = DEFAULT_TABLE_DATA[preferTableKey].find(
      (it) => String(it.id) === String(id),
    );
    if (found) return { ...found, tableKey: preferTableKey };
  }

  for (const [key, items] of Object.entries(DEFAULT_TABLE_DATA)) {
    const found = items.find((it) => String(it.id) === String(id));
    if (found) return { ...found, tableKey: key };
  }

  return {
    id,
    name: `Mục ID #${id}`,
    subtitle: "",
    category: "TÙY CHỌN",
    tableKey: preferTableKey || "custom",
  };
}
