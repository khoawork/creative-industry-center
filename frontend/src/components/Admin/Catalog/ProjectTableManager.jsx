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
    code: "",
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
      code: "",
      name: "",
      title: "",
      slogan: "",
      description: "",
      image: "",
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
      code: project.code || "",
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
        code: formData.code.trim(),
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
        (p.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    <div className="space-y-4">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-4 py-3 shadow-lg">
          {toast.type === "error" ? (
            <AlertTriangle className="size-5 text-rose-500 shrink-0" />
          ) : (
            <Check className="size-5 text-emerald-500 shrink-0" />
          )}
          <span className="text-sm font-medium text-(--admin-title)">
            {toast.message}
          </span>
        </div>
      )}
      {/* Toolbar chuẩn hóa theo EventManager */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-(--admin-border) bg-(--admin-surface) p-3 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--admin-ink)/60 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm dự án theo mã, tên, tiêu đề, khẩu hiệu…"
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) placeholder:text-(--admin-ink)/40 focus:outline-2 focus:outline-(--admin-accent)"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--admin-ink)/60 hover:text-(--admin-title)"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Lọc danh mục"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-xs sm:text-sm text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent)"
          >
            <option value="ALL">Tất cả danh mục ({projects.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={refreshing || loading}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Làm mới
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-(--admin-accent) px-4 py-2 text-xs font-bold text-(--admin-black) shadow-xs hover:opacity-90 transition"
          >
            <Plus size={14} />
            Thêm Dự Án
          </button>
        </div>
      </div>
      {/* Table Content */}
      <div className="overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b border-(--admin-border) bg-(--admin-background) text-sm font-semibold uppercase tracking-wider text-(--admin-ink)/70">
              <tr>
                <th className="w-16 whitespace-nowrap px-5 py-4 text-center">
                  STT
                </th>
                <th className="w-32 px-5 py-4">Hình ảnh</th>
                <th className="min-w-[260px] px-5 py-4">Tên & Tiêu đề</th>
                <th className="min-w-[160px] px-5 py-4">Danh mục</th>
                <th className="min-w-[220px] px-5 py-4">Khẩu hiệu (Slogan)</th>
                <th className="min-w-[280px] px-5 py-4">Thông số nghiên cứu</th>
                <th className="w-44 whitespace-nowrap px-5 py-4 pr-6 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-(--admin-border)">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-(--admin-ink)/60"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="size-7 animate-spin text-(--admin-heading)" />
                      <span className="text-base font-medium">
                        Đang tải danh sách dự án…
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-(--admin-ink)/60"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <FolderKanban
                        className="size-12 text-(--admin-ink)/30"
                        strokeWidth={1.5}
                      />
                      <p className="text-base font-semibold text-(--admin-title)">
                        Không tìm thấy dự án nào
                      </p>
                      <p className="text-sm text-(--admin-ink)/60">
                        Thử đổi từ khóa tìm kiếm hoặc nhấn Thêm dự án mới.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, idx) => (
                  <tr
                    key={project.id || idx}
                    className="transition-colors hover:bg-(--admin-background)/50"
                  >
                    {/* STT */}
                    <td className="px-5 py-5 text-center align-top font-mono text-sm text-(--admin-ink)/60">
                      {idx + 1}
                    </td>

                    {/* Hình ảnh */}
                    <td className="px-5 py-5 align-top">
                      <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-(--admin-border) bg-(--admin-background)">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.name || "Hình ảnh dự án"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <ImageIcon className="size-8 text-(--admin-ink)/40" />
                        )}
                      </div>
                    </td>

                    {/* Tên và tiêu đề */}
                    <td className="max-w-[340px] px-5 py-5 align-top">
                      <div className="flex flex-wrap items-center gap-2">
                        {project.code && (
                          <span className="shrink-0 rounded-md border border-(--admin-accent)/20 bg-(--admin-accent)/10 px-2 py-1 font-mono text-xs font-bold text-(--admin-accent)">
                            {project.code}
                          </span>
                        )}

                        <span
                          className="line-clamp-2 text-base font-semibold text-(--admin-title)"
                          title={project.name}
                        >
                          {project.name}
                        </span>
                      </div>

                      {project.title && (
                        <p
                          className="mt-2 line-clamp-3 text-sm leading-6 text-(--admin-ink)/70"
                          title={project.title}
                        >
                          {project.title}
                        </p>
                      )}
                    </td>

                    {/* Danh mục */}
                    <td className="px-5 py-5 align-top">
                      <span className="inline-flex items-center gap-2 rounded-md border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-sm font-medium text-(--admin-ink)/80">
                        <Tag
                          size={16}
                          className="shrink-0 text-(--admin-accent)"
                        />
                        {project.category?.name || "Chung"}
                      </span>
                    </td>

                    {/* Slogan */}
                    <td className="max-w-[300px] px-5 py-5 align-top">
                      {project.slogan ? (
                        <p
                          className="line-clamp-4 text-sm italic leading-6 text-(--admin-ink)/80"
                          title={project.slogan}
                        >
                          “{project.slogan}”
                        </p>
                      ) : (
                        <span className="text-sm italic text-(--admin-ink)/45">
                          Chưa có khẩu hiệu
                        </span>
                      )}
                    </td>

                    {/* Thông số nghiên cứu */}
                    <td className="max-w-[360px] px-5 py-5 align-top">
                      {Array.isArray(project.research_info) &&
                      project.research_info.length > 0 ? (
                        <div className="flex flex-col items-start gap-2">
                          {project.research_info
                            .slice(0, 3)
                            .map((item, rIdx) => (
                              <div
                                key={rIdx}
                                className="max-w-full rounded-md border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-sm leading-5 text-(--admin-ink)/80"
                                title={`${item.label}: ${item.value}`}
                              >
                                <span className="font-semibold text-(--admin-title)">
                                  {item.label}:
                                </span>{" "}
                                {item.value}
                              </div>
                            ))}

                          {project.research_info.length > 3 && (
                            <span className="rounded-md border border-(--admin-border) bg-(--admin-surface) px-2.5 py-1 text-xs font-semibold text-(--admin-accent)">
                              +{project.research_info.length - 3} thông số khác
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm italic text-(--admin-ink)/45">
                          Chưa có thông số
                        </span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="px-5 py-5 pr-6 text-right align-top">
                      <div className="inline-flex flex-col items-stretch gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(project)}
                          title="Chỉnh sửa dự án"
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-(--admin-border) bg-(--admin-surface) px-3 py-2.5 text-sm font-semibold text-(--admin-title) transition-colors hover:bg-(--admin-background) hover:text-(--admin-accent)"
                        >
                          <Pencil size={16} />
                          Sửa
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingItem(project)}
                          title="Xóa dự án"
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-rose-500/20 bg-rose-500/5 px-3 py-2.5 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-500/10"
                        >
                          <Trash2 size={16} />
                          Xóa
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
      {/* Modal Thêm / Chỉnh Sửa Dự Án */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-(--admin-black)/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl border border-(--admin-border) bg-(--admin-surface) rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-(--admin-border) px-6 py-4">
              <h3 className="text-base font-bold text-(--admin-title)">
                {editingItem ? "Chỉnh sửa Dự án" : "Thêm mới Dự án"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer text-(--admin-ink)/60 hover:text-(--admin-title) transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col min-h-0 flex-1"
            >
              <div className="min-h-0 space-y-4 overflow-y-auto overscroll-contain p-6">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold uppercase text-(--admin-heading) tracking-wider mb-1.5">
                      Mã dự án (Code)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: PRJ-01, DA-02..."
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      className="w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3.5 py-2 text-sm text-(--admin-ink) font-mono placeholder:text-(--admin-ink)/40 focus:outline-2 focus:outline-(--admin-accent) transition"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold uppercase text-(--admin-heading) tracking-wider mb-1.5">
                      Tên dự án (Tên ngắn){" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Không gian Văn hóa Sáng tạo..."
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full rounded-lg border bg-(--admin-background) px-3.5 py-2 text-sm text-(--admin-ink) placeholder:text-(--admin-ink)/40 focus:outline-2 focus:outline-(--admin-accent) transition ${
                        errors.name
                          ? "border-rose-500 focus:outline-rose-500"
                          : "border-(--admin-border)"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-500 mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold uppercase text-(--admin-heading) tracking-wider">
                        Danh mục <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory((value) => !value)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-(--admin-title) hover:underline cursor-pointer"
                      >
                        <Plus size={12} /> Thêm mới
                      </button>
                    </div>
                    <select
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg border bg-(--admin-background) px-3.5 py-2 text-sm text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent) transition cursor-pointer ${
                        errors.category_id
                          ? "border-rose-500 focus:outline-rose-500"
                          : "border-(--admin-border)"
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
                      <p className="text-xs text-rose-500 mt-1">
                        {errors.category_id}
                      </p>
                    )}
                    {isAddingCategory && (
                      <div className="mt-2 flex gap-2">
                        <input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="min-w-0 flex-1 px-3 py-1.5 text-xs rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent)"
                          placeholder="Tên danh mục mới…"
                        />
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={
                            isCreatingCategory || !newCategoryName.trim()
                          }
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-(--admin-accent) text-(--admin-black) disabled:opacity-50 cursor-pointer shadow-xs"
                        >
                          {isCreatingCategory ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : (
                            <Check size={12} />
                          )}
                          Lưu
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-(--admin-heading) tracking-wider mb-1.5">
                    Tiêu đề đầy đủ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Phát triển Trung tâm Công nghiệp Sáng tạo & Tôn vinh Kỷ lục"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={`w-full rounded-lg border bg-(--admin-background) px-3.5 py-2 text-sm text-(--admin-ink) placeholder:text-(--admin-ink)/40 focus:outline-2 focus:outline-(--admin-accent) transition ${
                      errors.title
                        ? "border-rose-500 focus:outline-rose-500"
                        : "border-(--admin-border)"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-xs text-rose-500 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-(--admin-heading) tracking-wider mb-1.5">
                    Khẩu hiệu / Slogan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Nơi hội tụ các giá trị tinh hoa và tài năng kỷ lục"
                    value={formData.slogan}
                    onChange={(e) =>
                      setFormData({ ...formData, slogan: e.target.value })
                    }
                    className={`w-full rounded-lg border bg-(--admin-background) px-3.5 py-2 text-sm text-(--admin-ink) placeholder:text-(--admin-ink)/40 focus:outline-2 focus:outline-(--admin-accent) transition ${
                      errors.slogan
                        ? "border-rose-500 focus:outline-rose-500"
                        : "border-(--admin-border)"
                    }`}
                  />
                  {errors.slogan && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.slogan}
                    </p>
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
                  <label className="block text-xs font-semibold uppercase text-(--admin-heading) tracking-wider mb-1.5">
                    Mô tả chi tiết dự án{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Giới thiệu mục tiêu, đối tác đồng hành và giá trị cốt lõi của dự án..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={`w-full rounded-lg border bg-(--admin-background) px-3.5 py-2 text-sm text-(--admin-ink) placeholder:text-(--admin-ink)/40 focus:outline-2 focus:outline-(--admin-accent) transition ${
                      errors.description
                        ? "border-rose-500 focus:outline-rose-500"
                        : "border-(--admin-border)"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Research Info items */}
                <div className="pt-2 border-t border-(--admin-border)">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold uppercase text-(--admin-heading) tracking-wider">
                      Thông số & Dữ liệu nghiên cứu (Research Info)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddResearchRow}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-(--admin-title) hover:underline cursor-pointer"
                    >
                      <Plus size={12} /> Thêm chỉ số
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
                          className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent)"
                        />
                        <input
                          type="text"
                          placeholder="Giá trị (VD: 500+ doanh nghiệp)"
                          value={r.value}
                          onChange={(e) =>
                            handleResearchChange(rIdx, "value", e.target.value)
                          }
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent)"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveResearchRow(rIdx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex shrink-0 items-center justify-end gap-2 border-t border-(--admin-border) bg-(--admin-surface) p-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-lg border border-(--admin-border) bg-(--admin-surface) px-4 py-2 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-(--admin-accent) px-4 py-2 text-xs font-bold text-(--admin-black) shadow-xs hover:opacity-90 disabled:opacity-50 transition"
                >
                  {isSaving ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  <span>
                    {isSaving
                      ? "Đang lưu…"
                      : editingItem
                        ? "Lưu thay đổi"
                        : "Tạo dự án"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal Xác Nhận Xóa */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-(--admin-black)/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md border border-(--admin-border) bg-(--admin-surface) rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-(--admin-title)">
                  Xác nhận xóa dự án
                </h3>
                <p className="text-xs text-(--admin-ink)/60">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>

            <p className="text-sm text-(--admin-ink) leading-relaxed">
              Bạn có chắc chắn muốn xóa dự án{" "}
              <strong className="text-rose-500">"{deletingItem.name}"</strong>?
              Toàn bộ dữ liệu liên quan sẽ bị xóa khỏi hệ thống.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="cursor-pointer rounded-lg border border-(--admin-border) bg-(--admin-surface) px-4 py-2 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 transition"
              >
                {isDeleting ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
                <span>{isDeleting ? "Đang xóa…" : "Xóa vĩnh viễn"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
