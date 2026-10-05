import React, { useState, useEffect, useMemo } from "react";
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { ProjectAPI } from "../../../api/projectApi.js";
import ImageUploadField from "./ImageUploadField.jsx";

export default function ProjectTableManager() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal thêm / sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    slogan: "",
    description: "",
    image: "",
    category_id: "",
    research_info: [{ label: "Quy mô", value: "Toàn quốc" }],
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Modal xóa
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [projRes, catRes] = await Promise.allSettled([
        ProjectAPI.getProjects(),
        ProjectAPI.getCategories(),
      ]);

      if (projRes.status === "fulfilled") {
        const pData = projRes.value;
        const items = Array.isArray(pData?.data)
          ? pData.data
          : Array.isArray(pData)
            ? pData
            : [];
        setProjects(items);
      } else {
        console.error("Lỗi khi tải projects:", projRes.reason);
      }

      if (catRes.status === "fulfilled") {
        const cData = catRes.value;
        const cats = Array.isArray(cData?.data)
          ? cData.data
          : Array.isArray(cData)
            ? cData
            : [];
        setCategories(cats);
      } else {
        console.error("Lỗi khi tải categories:", catRes.reason);
      }

      if (isManual) showToast("Đã làm mới danh sách Dự án!");
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dự án:", error);
      showToast("Không thể kết nối API Dự án.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setSelectedImageFile(null);
    setIsAddingCategory(false);
    setNewCategoryName("");
    setFormData({
      name: "",
      title: "",
      slogan: "",
      description: "",
      image: "/images/projects/default.jpg",
      category_id: categories.length > 0 ? String(categories[0].id) : "",
      research_info: [
        { label: "Quy mô", value: "Doanh nghiệp Việt" },
        { label: "Lĩnh vực", value: "Công nghiệp sáng tạo" },
      ],
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingItem(project);
    setSelectedImageFile(null);
    setIsAddingCategory(false);
    setNewCategoryName("");
    let parsedResearch = [];
    if (
      Array.isArray(project.research_info) &&
      project.research_info.length > 0
    ) {
      parsedResearch = project.research_info.map((r) => ({
        label: r.label || "",
        value: r.value || "",
      }));
    } else {
      parsedResearch = [{ label: "Thông tin", value: "Chi tiết" }];
    }

    setFormData({
      name: project.name || "",
      title: project.title || "",
      slogan: project.slogan || "",
      description: project.description || "",
      image: project.image || "",
      category_id: project.category?.id
        ? String(project.category.id)
        : String(project.category_id || (categories[0]?.id ?? "1")),
      research_info: parsedResearch,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    setIsCreatingCategory(true);
    try {
      const response = await ProjectAPI.createCategory({
        name,
        description: "",
      });
      const category = response?.data || response;
      setCategories((current) =>
        [...current, category].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setFormData((current) => ({
        ...current,
        category_id: String(category.id),
      }));
      setNewCategoryName("");
      setIsAddingCategory(false);
      showToast(`Đã thêm danh mục "${category.name}"!`);
    } catch (error) {
      const message =
        error.response?.data?.message || "Không thể thêm danh mục.";
      showToast(message, "error");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleResearchChange = (index, field, val) => {
    const updated = [...formData.research_info];
    updated[index][field] = val;
    setFormData({ ...formData, research_info: updated });
  };

  const handleAddResearchRow = () => {
    setFormData({
      ...formData,
      research_info: [...formData.research_info, { label: "", value: "" }],
    });
  };

  const handleRemoveResearchRow = (index) => {
    if (formData.research_info.length <= 1) {
      setFormData({
        ...formData,
        research_info: [{ label: "", value: "" }],
      });
      return;
    }
    const updated = formData.research_info.filter((_, i) => i !== index);
    setFormData({ ...formData, research_info: updated });
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim())
      errs.name = "Vui lòng nhập tên dự án (mã/tên rút gọn)";
    if (!formData.title.trim()) errs.title = "Vui lòng nhập tiêu đề dự án";
    if (!formData.slogan.trim())
      errs.slogan = "Vui lòng nhập thông điệp / khẩu hiệu";
    if (!formData.description.trim())
      errs.description = "Vui lòng nhập mô tả dự án";
    if (!formData.image.trim() && !selectedImageFile)
      errs.image = "Vui lòng cung cấp hình ảnh";
    if (!formData.category_id)
      errs.category_id = "Vui lòng chọn danh mục dự án";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        slogan: formData.slogan.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        category_id: parseInt(formData.category_id, 10),
        research_info: formData.research_info
          .filter((item) => item.label.trim() && item.value.trim())
          .map((item) => ({
            label: item.label.trim(),
            value: item.value.trim(),
          })),
        project_info: {},
      };

      if (payload.research_info.length === 0) {
        payload.research_info = [{ label: "Dự án", value: "Chính thức" }];
      }

      if (editingItem) {
        await ProjectAPI.updateProject(
          editingItem.id,
          payload,
          selectedImageFile,
        );
        showToast(`Đã cập nhật dự án "${payload.name}"!`);
      } else {
        await ProjectAPI.createProject(payload, selectedImageFile);
        showToast(`Đã thêm mới dự án "${payload.name}"!`);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Lỗi khi lưu dự án:", err);
      const resData = err.response?.data;
      const detail =
        resData?.error?.details ||
        resData?.details ||
        resData?.message ||
        err.message;
      showToast(
        `Lưu thất bại: ${typeof detail === "object" ? JSON.stringify(detail) : detail}`,
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await ProjectAPI.deleteProject(deletingItem.id);
      showToast(`Đã xóa dự án "${deletingItem.name}" thành công!`);
      setDeletingItem(null);
      fetchData();
    } catch (err) {
      console.error("Lỗi khi xóa dự án:", err);
      const detail = err.response?.data?.message || err.message;
      showToast(`Xóa thất bại: ${detail}`, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.slogan || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (p.category?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCat =
        categoryFilter === "ALL" ||
        String(p.category?.id || p.category_id) === String(categoryFilter);

      return matchesSearch && matchesCat;
    });
  }, [projects, searchQuery, categoryFilter]);

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 animate-slide-up ${
            toast.type === "error"
              ? "bg-rose-950/90 border-rose-500/50 text-rose-200"
              : "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
          }`}
        >
          {toast.type === "error" ? (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--admin-surface)] p-5 rounded-2xl border border-[var(--admin-border)] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--admin-text)] flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <FolderKanban className="w-5 h-5" />
            </span>
            Quản lý Danh mục Dự án
          </h2>
          <p className="text-xs sm:text-sm text-[var(--admin-text-muted)] mt-1">
            Tổng cộng:{" "}
            <strong className="text-[var(--admin-text)]">
              {projects.length}
            </strong>{" "}
            dự án được công bố
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing || loading}
            title="Làm mới dữ liệu"
            className="p-2.5 rounded-xl border border-[var(--admin-border)] hover:bg-white/5 text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition shadow-lg shadow-violet-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm dự án mới</span>
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--admin-text-muted)] whitespace-nowrap">
          Danh mục:
        </span>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs py-2 px-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] focus:outline-none focus:border-violet-500"
        >
          <option value="ALL">Tất cả phân loại</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <span className="text-xs text-[var(--admin-text-muted)] whitespace-nowrap ml-2">
          Năm:
        </span>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="text-xs py-2 px-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)] focus:outline-none focus:border-violet-500"
        >
          <option value="ALL">Tất cả năm</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Table view */}
      <div className="border border-[var(--admin-border)] rounded-2xl bg-[var(--admin-surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-[var(--admin-border)] text-xs uppercase tracking-wider text-[var(--admin-text-muted)]">
              <tr>
                <th className="py-3.5 px-4 font-semibold w-16 text-center">
                  STT
                </th>
                <th className="py-3.5 px-4 font-semibold w-24">Hình ảnh</th>
                <th className="py-3.5 px-4 font-semibold">Tên & Tiêu đề</th>
                <th className="py-3.5 px-4 font-semibold">Danh mục</th>
                <th className="py-3.5 px-4 font-semibold">
                  Khẩu hiệu (Slogan)
                </th>
                <th className="py-3.5 px-4 font-semibold">
                  Nghiên cứu / Chỉ số
                </th>
                <th className="py-3.5 px-4 font-semibold text-right pr-6 w-28">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-[var(--admin-text-muted)]"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-6 h-6 animate-spin text-violet-500" />
                      <span>Đang tải danh sách dự án...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-[var(--admin-text-muted)]"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FolderKanban className="w-8 h-8 opacity-40 text-violet-400" />
                      <p className="font-medium text-base">
                        Không tìm thấy dự án nào
                      </p>
                      <p className="text-xs">
                        Thử đổi từ khóa tìm kiếm hoặc nhấn Thêm dự án mới.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, idx) => (
                  <tr
                    key={project.id || idx}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-[var(--admin-text-muted)]">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-14 h-11 rounded-lg bg-black/20 border border-[var(--admin-border)] overflow-hidden shrink-0 flex items-center justify-center">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-[var(--admin-text-muted)] opacity-40" />
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-[var(--admin-text)] line-clamp-1">
                        {project.name}
                      </div>
                      <div className="text-xs text-[var(--admin-text-muted)] line-clamp-1 mt-0.5">
                        {project.title}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20">
                        <Tag className="w-3 h-3" />
                        {project.category?.name || "Chung"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-[var(--admin-text)] italic line-clamp-2">
                        "{project.slogan}"
                      </p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(project.research_info) &&
                        project.research_info.length > 0 ? (
                          project.research_info
                            .slice(0, 2)
                            .map((item, rIdx) => (
                              <span
                                key={rIdx}
                                className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-[var(--admin-border)] text-[var(--admin-text-muted)]"
                              >
                                <strong>{item.label}:</strong> {item.value}
                              </span>
                            ))
                        ) : (
                          <span className="text-xs text-[var(--admin-text-muted)] italic">
                            Chưa có thông số
                          </span>
                        )}
                        {Array.isArray(project.research_info) &&
                          project.research_info.length > 2 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[var(--admin-text-muted)]">
                              +{project.research_info.length - 2}
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(project)}
                          title="Chỉnh sửa dự án"
                          className="p-1.5 rounded-lg border border-[var(--admin-border)] hover:bg-violet-500/10 hover:border-violet-500/30 text-[var(--admin-text-muted)] hover:text-violet-300 transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(project)}
                          title="Xóa dự án"
                          className="p-1.5 rounded-lg border border-[var(--admin-border)] hover:bg-rose-500/10 hover:border-rose-500/30 text-[var(--admin-text-muted)] hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm / Chỉnh Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-border)] bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  <FolderKanban className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-lg text-[var(--admin-text)]">
                  {editingItem ? "Cập nhật Dự án" : "Thêm Dự án mới"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-white/5 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-text)] uppercase tracking-wider mb-1.5">
                    Tên dự án (Mã / Tên ngắn){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Không gian Văn hóa Sáng tạo..."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-black/20 text-[var(--admin-text)] focus:outline-none transition ${
                      errors.name
                        ? "border-rose-500"
                        : "border-[var(--admin-border)] focus:border-violet-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-400 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[var(--admin-text)] uppercase tracking-wider">
                      Danh mục dự án <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory((value) => !value)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-violet-400 hover:text-violet-300"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm danh mục
                    </button>
                  </div>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-black/20 text-[var(--admin-text)] focus:outline-none transition ${
                      errors.category_id
                        ? "border-rose-500"
                        : "border-[var(--admin-border)] focus:border-violet-500"
                    }`}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-xs text-rose-400 mt-1">
                      {errors.category_id}
                    </p>
                  )}
                  {isAddingCategory && (
                    <div className="mt-2 flex gap-2">
                      <input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="min-w-0 flex-1 px-3 py-2 text-sm rounded-xl border border-[var(--admin-border)] bg-black/20 text-[var(--admin-text)]"
                        placeholder="Tên danh mục mới"
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={isCreatingCategory || !newCategoryName.trim()}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-violet-600 text-white disabled:opacity-50"
                      >
                        {isCreatingCategory ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Lưu
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--admin-text)] uppercase tracking-wider mb-1.5">
                  Tiêu đề đầy đủ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Phát triển Trung tâm Công nghiệp Sáng tạo & Tôn vinh Kỷ lục"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-black/20 text-[var(--admin-text)] focus:outline-none transition ${
                    errors.title
                      ? "border-rose-500"
                      : "border-[var(--admin-border)] focus:border-violet-500"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-rose-400 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--admin-text)] uppercase tracking-wider mb-1.5">
                  Khẩu hiệu / Slogan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Nơi hội tụ các giá trị tinh hoa và tài năng kỷ lục"
                  value={formData.slogan}
                  onChange={(e) =>
                    setFormData({ ...formData, slogan: e.target.value })
                  }
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-black/20 text-[var(--admin-text)] focus:outline-none transition ${
                    errors.slogan
                      ? "border-rose-500"
                      : "border-[var(--admin-border)] focus:border-violet-500"
                  }`}
                />
                {errors.slogan && (
                  <p className="text-xs text-rose-400 mt-1">{errors.slogan}</p>
                )}
              </div>

              <ImageUploadField
                label="Hình ảnh Dự án"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                selectedFile={selectedImageFile}
                onFileChange={setSelectedImageFile}
                required
                error={errors.image}
                placeholder="VD: https://... hoặc chọn ảnh từ máy tính"
              />

              <div>
                <label className="block text-xs font-semibold text-[var(--admin-text)] uppercase tracking-wider mb-1.5">
                  Mô tả chi tiết dự án <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Giới thiệu mục tiêu, đối tác đồng hành và giá trị cốt lõi của dự án..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-black/20 text-[var(--admin-text)] focus:outline-none transition ${
                    errors.description
                      ? "border-rose-500"
                      : "border-[var(--admin-border)] focus:border-violet-500"
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-rose-400 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Research Info items */}
              <div className="pt-2 border-t border-[var(--admin-border)]">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-[var(--admin-text)] uppercase tracking-wider">
                    Thông số & Dữ liệu nghiên cứu (Research Info)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddResearchRow}
                    className="text-xs flex items-center gap-1 text-violet-400 hover:text-violet-300 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm chỉ số
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.research_info.map((r, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Tiêu chí (VD: Quy mô)"
                        value={r.label}
                        onChange={(e) =>
                          handleResearchChange(rIdx, "label", e.target.value)
                        }
                        className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-[var(--admin-border)] bg-black/20 text-[var(--admin-text)] focus:outline-none focus:border-violet-500"
                      />
                      <input
                        type="text"
                        placeholder="Giá trị (VD: 500+ doanh nghiệp)"
                        value={r.value}
                        onChange={(e) =>
                          handleResearchChange(rIdx, "value", e.target.value)
                        }
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[var(--admin-border)] bg-black/20 text-[var(--admin-text)] focus:outline-none focus:border-violet-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveResearchRow(rIdx)}
                        className="p-1.5 rounded-lg text-[var(--admin-text-muted)] hover:text-rose-400 hover:bg-rose-500/10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-xl border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-white/5 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 text-sm rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition shadow-lg shadow-violet-600/20 disabled:opacity-50"
                >
                  {isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingItem ? "Lưu cập nhật" : "Thêm mới"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--admin-surface)] border border-[var(--admin-border)] w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[var(--admin-text)]">
                  Xác nhận xóa dự án
                </h3>
                <p className="text-xs text-[var(--admin-text-muted)]">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--admin-text)] leading-relaxed">
              Bạn có chắc chắn muốn xóa dự án{" "}
              <strong className="text-rose-400">"{deletingItem.name}"</strong>?
              Toàn bộ dữ liệu liên quan sẽ bị xóa khỏi hệ thống.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 text-sm rounded-xl border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-white/5 transition"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="flex items-center gap-2 px-5 py-2 text-sm rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium transition shadow-lg shadow-rose-600/20 disabled:opacity-50"
              >
                {isDeleting && <RefreshCw className="w-4 h-4 animate-spin" />}
                <span>Xóa vĩnh viễn</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
