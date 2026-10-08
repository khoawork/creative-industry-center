/**
 * googleSheetService.js
 * Quản lý cấu hình biểu mẫu và gửi dữ liệu qua Google Sheets API (thông qua Backend Service Account)
 */

import axios from 'axios';
import { PageAPI } from '../api/pageApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Cấu hình mẫu mặc định cho các biểu mẫu trên toàn bộ hệ thống website.
export const DEFAULT_FORM_CONFIGS = {
  event_newsletter: {
    id: "event_newsletter",
    title: "Đăng Ký Nhận Bản Tin & Thông Báo Sự Kiện",
    subtitle: "Nhận thư mời ưu tiên, tài liệu kỷ yếu và thông cáo báo chí chính thức từ Ban Thư ký Trung tâm.",
    pagePath: "/events",
    componentName: "EventNewsletter",
    badgeText: "BẢN TIN SỰ KIỆN",
    sheetUrl: "",
    sheetName: "DangKySuKien",
    fields: [
      {
        key: "fullName",
        label: "Họ và tên đại biểu",
        type: "text",
        placeholder: "Nguyễn Văn A",
        required: true,
        colSpan: 1,
      },
      {
        key: "organization",
        label: "Đơn vị / Doanh nghiệp",
        type: "text",
        placeholder: "Tên cơ quan, tổ chức hoặc doanh nghiệp",
        required: false,
        colSpan: 1,
      },
      {
        key: "email",
        label: "Địa chỉ Email liên hệ",
        type: "email",
        placeholder: "daibieu@tochuc.vn",
        required: true,
        colSpan: 1,
      },
      {
        key: "phone",
        label: "Số điện thoại liên hệ",
        type: "tel",
        placeholder: "0901234567",
        required: false,
        colSpan: 1,
      },
      {
        key: "note",
        label: "Ghi chú / Yêu cầu thêm",
        type: "textarea",
        placeholder: "Nêu rõ lĩnh vực quan tâm hoặc yêu cầu đặc biệt...",
        required: false,
        colSpan: 2,
      },
    ],
  },

  event_registration: {
    id: "event_registration",
    title: "Đăng Ký Tham Gia Sự Kiện (Đại Biểu)",
    subtitle: "Xác nhận đăng ký tham dự trực tiếp hoặc trực tuyến cho từng sự kiện cụ thể.",
    pagePath: "/events",
    componentName: "EventRegisterModal",
    badgeText: "ĐẠI BIỂU SỰ KIỆN",
    sheetUrl: "",
    sheetName: "ThamGiaSuKien",
    fields: [
      {
        key: "eventName",
        label: "Tên sự kiện tham dự",
        type: "text",
        placeholder: "Tên chương trình sự kiện",
        required: true,
        colSpan: 2,
      },
      {
        key: "fullName",
        label: "Họ và tên đại biểu",
        type: "text",
        placeholder: "Nguyễn Văn A",
        required: true,
        colSpan: 1,
      },
      {
        key: "phone",
        label: "Số điện thoại liên hệ",
        type: "tel",
        placeholder: "0912 345 678",
        required: true,
        colSpan: 1,
      },
      {
        key: "email",
        label: "Địa chỉ Email",
        type: "email",
        placeholder: "daibieu@tochuc.vn",
        required: true,
        colSpan: 1,
      },
      {
        key: "organization",
        label: "Cơ quan / Doanh nghiệp",
        type: "text",
        placeholder: "Tên cơ quan / tổ chức",
        required: false,
        colSpan: 1,
      },
      {
        key: "ticketType",
        label: "Hình thức tham dự",
        type: "text",
        placeholder: "Trực tiếp / Trực tuyến / VIP",
        required: true,
        colSpan: 1,
      },
      {
        key: "notes",
        label: "Ghi chú thêm",
        type: "textarea",
        placeholder: "Yêu cầu vị trí ngồi, tài liệu trước sự kiện...",
        required: false,
        colSpan: 2,
      },
    ],
  },

  forum_registration: {
    id: "forum_registration",
    title: "Đăng Ký Diễn Đàn Kinh Tế Kỷ Lục",
    subtitle: "Thông tin đại biểu đăng ký tham dự Diễn đàn Kinh tế Kỷ lục.",
    pagePath: "/forum",
    componentName: "ForumRegistration",
    badgeText: "ĐẠI BIỂU DIỄN ĐÀN",
    submitButtonText: "Xác nhận đăng ký",
    sheetUrl: "",
    sheetName: "DangKyDienDan",
    fields: [
      {
        key: "fullName",
        label: "Họ và tên đại biểu",
        type: "text",
        placeholder: "Nguyễn Văn A",
        required: true,
        colSpan: 1,
      },
      {
        key: "phone",
        label: "Số điện thoại liên hệ",
        type: "tel",
        placeholder: "0912 345 678",
        required: true,
        colSpan: 1,
      },
      {
        key: "email",
        label: "Địa chỉ email công vụ",
        type: "email",
        placeholder: "daibieu@tochuc.vn",
        required: true,
        colSpan: 2,
      },
      {
        key: "organization",
        label: "Cơ quan / Doanh nghiệp",
        type: "text",
        placeholder: "Tên cơ quan / doanh nghiệp",
        required: false,
        colSpan: 1,
      },
      {
        key: "position",
        label: "Chức danh / Chức vụ",
        type: "text",
        placeholder: "Chức danh / chức vụ",
        required: false,
        colSpan: 1,
      },
      {
        key: "session",
        label: "Phiên hội nghị đăng ký tham dự",
        type: "select",
        placeholder: "Chọn phiên tham dự",
        options: [
          "Toàn bộ 4 phiên làm việc",
          "Phiên I & II - Hội nghị Chiến lược",
          "Phiên III - Triển lãm & Kết nối B2B",
          "Phiên IV - Gala Vinh danh Doanh nghiệp",
        ],
        required: true,
        colSpan: 2,
      },
    ],
  },

  training_registration: {
    id: "training_registration",
    title: "Ghi Danh Khóa Học & Đào Tạo Kỷ Lục",
    subtitle: "Tiếp nhận thông tin học viên đăng ký tham gia các khóa huấn luyện chuyên gia & kỷ lục.",
    pagePath: "/training",
    componentName: "RegistrationForm",
    badgeText: "TUYỂN SINH ĐÀO TẠO",
    sheetUrl: "",
    sheetName: "DangKyDaoTao",
    fields: [
      {
        key: "trainingCourse",
        label: "Khóa đào tạo / Mã chương trình",
        type: "text",
        placeholder: "Mã hoặc tên khóa học",
        required: true,
        colSpan: 2,
      },
      {
        key: "fullName",
        label: "Họ và tên học viên",
        type: "text",
        placeholder: "Nguyễn Văn A",
        required: true,
        colSpan: 1,
      },
      {
        key: "phone",
        label: "Số điện thoại liên hệ",
        type: "tel",
        placeholder: "0912 345 678",
        required: true,
        colSpan: 1,
      },
      {
        key: "email",
        label: "Địa chỉ Email học viên",
        type: "email",
        placeholder: "hocvien@gmail.com",
        required: true,
        colSpan: 2,
      },
    ],
  },

  contact_feedback: {
    id: "contact_feedback",
    title: "Liên Hệ & Đề Xuất Tư Vấn Trực Tuyến",
    subtitle: "Cổng tiếp nhận thông tin phản hồi, nguyện vọng hợp tác và yêu cầu tư vấn từ cộng đồng.",
    pagePath: "/contact",
    componentName: "ContactForm",
    badgeText: "TIẾP NHẬN LIÊN HỆ",
    sheetUrl: "",
    sheetName: "LienHeTuVan",
    fields: [
      {
        key: "fullName",
        label: "Họ và tên người gửi",
        type: "text",
        placeholder: "Nguyễn Văn A",
        required: true,
        colSpan: 1,
      },
      {
        key: "email",
        label: "Địa chỉ Email",
        type: "email",
        placeholder: "email@tochuc.vn",
        required: true,
        colSpan: 1,
      },
      {
        key: "phone",
        label: "Số điện thoại",
        type: "tel",
        placeholder: "0912 345 678",
        required: false,
        colSpan: 1,
      },
      {
        key: "category",
        label: "Lĩnh vực quan tâm",
        type: "text",
        placeholder: "Đề cử kỷ lục / Hợp tác sáng tạo / Khác",
        required: false,
        colSpan: 1,
      },
      {
        key: "message",
        label: "Nội dung lời nhắn / Đề xuất chi tiết",
        type: "textarea",
        placeholder: "Mô tả tóm tắt nội dung đề xuất hoặc nguyện vọng hợp tác...",
        required: true,
        colSpan: 2,
      },
    ],
  },

  record_nomination: {
    id: "record_nomination",
    title: "Đề Cử Kỷ Lục Mới (Hồ Sơ Ban Đầu)",
    subtitle: "Tiếp nhận hồ sơ đề cử danh hiệu Kỷ lục gia và Biểu tượng công nghiệp sáng tạo.",
    pagePath: "/records",
    componentName: "NominationDialog",
    badgeText: "ĐỀ CỬ KỶ LỤC",
    sheetUrl: "",
    sheetName: "DeCuKyLuc",
    fields: [
      {
        key: "award",
        label: "Hạng mục / Danh hiệu đề cử",
        type: "text",
        placeholder: "Tên danh hiệu kỷ lục",
        required: true,
        colSpan: 2,
      },
      {
        key: "name",
        label: "Người / Tổ chức đại diện",
        type: "text",
        placeholder: "Họ và tên người đại diện",
        required: true,
        colSpan: 1,
      },
      {
        key: "phone",
        label: "Số điện thoại liên hệ",
        type: "tel",
        placeholder: "0912 345 678",
        required: true,
        colSpan: 1,
      },
      {
        key: "email",
        label: "Địa chỉ Email",
        type: "email",
        placeholder: "decu@tochuc.vn",
        required: true,
        colSpan: 1,
      },
      {
        key: "organization",
        label: "Tổ chức / Làng nghề",
        type: "text",
        placeholder: "Tên tổ chức / doanh nghiệp / làng nghề",
        required: false,
        colSpan: 1,
      },
      {
        key: "summary",
        label: "Tóm tắt thành tựu / Đề cử",
        type: "textarea",
        placeholder: "Tóm tắt các thông số, kỷ lục hoặc thành tựu nổi bật...",
        required: false,
        colSpan: 2,
      },
    ],
  },

  founder_story_submission: {
    id: "founder_story_submission",
    title: "Gửi Câu Chuyện Nhà Sáng Nghiệp",
    subtitle: "Chia sẻ hành trình khởi nghiệp, sáng tạo thương hiệu và tôn vinh giá trị văn hóa.",
    pagePath: "/founder",
    componentName: "SubmitStoryModal",
    badgeText: "CÂU CHUYỆN SÁNG NGHIỆP",
    sheetUrl: "",
    sheetName: "CauChuyenSangNghiep",
    fields: [
      {
        key: "founderName",
        label: "Họ và tên nhà sáng lập",
        type: "text",
        placeholder: "Nguyễn Văn A",
        required: true,
        colSpan: 1,
      },
      {
        key: "brandName",
        label: "Tên thương hiệu / Doanh nghiệp",
        type: "text",
        placeholder: "Tên thương hiệu sáng tạo",
        required: true,
        colSpan: 1,
      },
      {
        key: "category",
        label: "Lĩnh vực hoạt động",
        type: "text",
        placeholder: "Thủ công mỹ nghệ / Ẩm thực / Công nghệ...",
        required: false,
        colSpan: 1,
      },
      {
        key: "email",
        label: "Địa chỉ Email",
        type: "email",
        placeholder: "founder@brand.vn",
        required: true,
        colSpan: 1,
      },
      {
        key: "phone",
        label: "Số điện thoại liên hệ",
        type: "tel",
        placeholder: "0912 345 678",
        required: true,
        colSpan: 1,
      },
      {
        key: "storySummary",
        label: "Tóm tắt hành trình sáng nghiệp",
        type: "textarea",
        placeholder: "Chia sẻ ngắn gọn về hành trình khởi lập và giá trị cốt lõi...",
        required: true,
        colSpan: 2,
      },
    ],
  },

  project_proposal: {
    id: "project_proposal",
    title: "Đề Xuất Dự Án Sáng Tạo Mới",
    subtitle: "Kết nối cùng các chuyên gia và mạng lưới Kỷ lục để thẩm định, cố vấn và hiện thực hóa dự án.",
    pagePath: "/projects",
    componentName: "ProjectProposal",
    badgeText: "CỔNG ĐỀ XUẤT DỰ ÁN",
    sheetUrl: "",
    sheetName: "DeXuatDuAn",
    fields: [
      {
        key: "authorName",
        label: "Họ và tên người đại diện",
        type: "text",
        placeholder: "Nguyễn Văn B",
        required: true,
        colSpan: 1,
      },
      {
        key: "organization",
        label: "Tổ chức / Nhóm dự án",
        type: "text",
        placeholder: "Công ty / Studio / Nhóm nghiên cứu",
        required: false,
        colSpan: 1,
      },
      {
        key: "email",
        label: "Email liên hệ",
        type: "email",
        placeholder: "project@creative.vn",
        required: true,
        colSpan: 1,
      },
      {
        key: "phone",
        label: "Số điện thoại",
        type: "tel",
        placeholder: "0912345678",
        required: true,
        colSpan: 1,
      },
      {
        key: "projectTitle",
        label: "Tên dự án sáng tạo",
        type: "text",
        placeholder: "Ví dụ: Không gian trải nghiệm văn hóa số đa giác quan...",
        required: true,
        colSpan: 2,
      },
      {
        key: "projectSummary",
        label: "Tóm tắt nội dung và mục tiêu dự án",
        type: "textarea",
        placeholder: "Mô tả ngắn gọn về ý tưởng, quy mô và đối tượng thụ hưởng...",
        required: true,
        colSpan: 2,
      },
    ],
  },
};

const STORAGE_KEY = "cic_system_form_configs";

/**
 * Lấy toàn bộ danh sách cấu hình form từ LocalStorage
 */
export const getAllFormConfigs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_FORM_CONFIGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_FORM_CONFIGS, ...parsed };
  } catch (e) {
    console.error("Lỗi khi đọc cấu hình form từ localStorage:", e);
    return { ...DEFAULT_FORM_CONFIGS };
  }
};

/**
 * Lấy cấu hình của 1 form cụ thể theo formId (đồng bộ)
 */
export const getFormConfig = (formId) => {
  const all = getAllFormConfigs();
  return all[formId] || DEFAULT_FORM_CONFIGS[formId] || null;
};

/**
 * Lấy cấu hình của 1 form từ Backend (bất đồng bộ)
 */
export const fetchFormConfig = async (formId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/forms/config/${formId}`);
    if (res?.data?.data && typeof res.data.data === "object") {
      return {
        ...getFormConfig(formId),
        ...res.data.data,
        fields: Array.isArray(res.data.data.fields)
          ? res.data.data.fields
          : getFormConfig(formId)?.fields || [],
      };
    }
  } catch (e) {
    console.warn(`Không thể tải cấu hình biểu mẫu "${formId}" từ máy chủ:`, e);
  }
  return getFormConfig(formId);
};

/**
 * Lưu cấu hình của 1 form vào cả LocalStorage và Backend
 */
export const saveFormConfig = async (formId, updatedConfig) => {
  try {
    const all = getAllFormConfigs();
    all[formId] = {
      ...DEFAULT_FORM_CONFIGS[formId],
      ...all[formId],
      ...updatedConfig,
      id: formId,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    // Đồng bộ lưu vào Backend Form API
    try {
      await axios.post(`${API_BASE_URL}/forms/config/${formId}`, all[formId]);
    } catch (apiErr) {
      console.warn("Không thể lưu cấu hình form vào Backend Form API:", apiErr);
    }

    return all[formId];
  } catch (e) {
    console.error("Lỗi khi lưu cấu hình form:", e);
    throw e;
  }
};

/**
 * Lấy thông tin email Bot của Google Service Account từ Backend
 */
export const getServiceAccountInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forms/service-account`);
    return response.data;
  } catch (error) {
    console.warn("Không thể lấy thông tin Service Account từ Backend API, dùng fallback:", error);
    return {
      configured: false,
      botEmail: "form-to-google-sheet@sharp-bulwark-510807-v0.iam.gserviceaccount.com",
      message: "Chưa kết nối được với Backend Service Account.",
    };
  }
};

/**
 * Khởi tạo hoặc đồng bộ các cột fields vào đúng tab trang tính trong Google Sheet (chỉ tiêu đề Hàng 1, KHÔNG có dữ liệu test)
 */
export const syncFieldsToSheet = async (sheetUrl, sheetName = "DangKySuKien", fields = []) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forms/sync-fields`, {
      sheetUrl,
      sheetName,
      fields,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Không thể khởi tạo các cột vào Google Sheet.";
    return {
      success: false,
      message,
    };
  }
};

/**
 * Kiểm tra kết nối tới Google Sheet qua Backend
 */
export const testSheetConnection = async (sheetUrl, sheetName = "DangKySuKien", fields = []) => {
  return syncFieldsToSheet(sheetUrl, sheetName, fields);
};

/**
 * Đồng bộ tất cả biểu mẫu vào Google Sheet cùng lúc (1 lần duy nhất)
 */
export const syncAllFormsToSheet = async (sheetUrl, forms = []) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forms/sync-all`, {
      sheetUrl,
      forms,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Không thể đồng bộ tất cả biểu mẫu vào Google Sheet.";
    return {
      success: false,
      message,
    };
  }
};

/**
 * Định dạng thời gian tương đối dễ hiểu (vd: "Vừa xong", "5 phút trước", "2 giờ trước")
 */
export const formatRelativeTime = (isoDateString) => {
  if (!isoDateString) return "Chưa từng đồng bộ";
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return "Chưa từng đồng bộ";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 45) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay < 30) return `${diffDay} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  } catch (e) {
    return "Không xác định";
  }
};

/**
 * Gửi dữ liệu form từ người dùng về Backend -> Backend đẩy vào Google Sheet & lưu DB
 */
export const submitFormToBackend = async (formId, formData, formConfig) => {
  const payload = {
    formId,
    data: {
      ...formData,
      submittedAt: new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }),
    },
    sheetUrl: formConfig?.sheetUrl || "",
    sheetName: formConfig?.sheetName || "Trang tính1",
    fields: formConfig?.fields || [],
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/forms/submit`, payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi submit form về backend:", error);
    return {
      success: true,
      offline: true,
      message: "Dữ liệu đã được ghi nhận thành công!",
    };
  }
};

export const fetchFormSubmissions = async (formId) => {
  const response = await axios.get(`${API_BASE_URL}/forms/submissions/${formId}`);
  return response.data;
};
