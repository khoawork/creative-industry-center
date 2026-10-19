import React, { useState, useEffect, useMemo } from "react";
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  FileDown,
  Layers,
  Sparkles,
  ExternalLink,
  Upload,
} from "lucide-react";
import { RecordAPI } from "../../../api/recordsApi.js";
import { UploadAPI } from "../../../api/uploadApi.js";
import { IconDropdown } from "../../icons/index.js";
import RecordHolderIcon from "../../RecordHolder/RecordHolderIcon.jsx";

export default function RecordTableManager() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Modal Thêm / Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const fileInputRef = React.useRef(null);
  const docInputRef = React.useRef(null);
  const [formData, setFormData] = useState({
    id: "",
    rank: "",
    title: "",
    subtitle: "",
    category: "",
    image: "",
    icon: "flare",
    criteria: [""],
    action: {
      nomination: "Đề Cử / Nộp Hồ Sơ",
      download: "QuyChe_DeCuKyLuc.pdf",
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  // Modal Xóa
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRecords = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await RecordAPI.getRecords();
      const items = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : [];
      setRecords(items);
      if (isManual) showToast("Đã làm mới danh sách kỷ lục!");
    } catch (error) {
      console.error("Lỗi khi tải kỷ lục:", error);
      showToast("Không thể kết nối API Kỷ lục.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Danh sách categories động
  const categoriesList = useMemo(() => {
    const cats = new Set();
    records.forEach((r) => {
      if (r.category) cats.add(r.category);
    });
    return Array.from(cats);
  }, [records]);

  // Lọc dữ liệu
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesCategory =
        categoryFilter === "ALL" || rec.category === categoryFilter;
      if (!matchesCategory) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (rec.title && rec.title.toLowerCase().includes(q)) ||
        (rec.rank && rec.rank.toLowerCase().includes(q)) ||
        (rec.category && rec.category.toLowerCase().includes(q)) ||
        (rec.subtitle && rec.subtitle.toLowerCase().includes(q))
      );
    });
  }, [records, searchQuery, categoryFilter]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: "",
      rank: "",
      title: "",
      subtitle: "",
      category: "",
      image: "",
      icon: "flare",
      criteria: [""],
      action: {
        nomination: "Đề Cử / Nộp Hồ Sơ",
        download: "QuyChe_DeCuKyLuc.pdf",
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      id: item.id || "",
      rank: item.rank || "",
      title: item.title || "",
      subtitle: item.subtitle || "",
      category: item.category || "",
      image: item.image || "",
      icon: item.icon || "flare",
      criteria:
        Array.isArray(item.criteria) && item.criteria.length
          ? [...item.criteria]
          : [""],
      action: item.action
        ? { ...item.action }
        : {
            nomination: "Đề Cử / Nộp Hồ Sơ",
            download: "QuyChe_DeCuKyLuc.pdf",
          },
    });
    setIsModalOpen(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await UploadAPI.uploadImage(file, "records");
      if (url) {
        setFormData((prev) => ({ ...prev, image: url }));
        showToast("Tải ảnh lên thành công!");
      }
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      showToast("Lỗi khi tải ảnh lên.", "error");
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDocFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      showToast("Chỉ hỗ trợ tệp tài liệu định dạng PDF.", "error");
      return;
    }
    try {
      setUploadingDoc(true);
      const url = await UploadAPI.uploadDocument(file, "records/documents");
      if (url) {
        setFormData((prev) => ({
          ...prev,
          action: {
            ...(prev.action || {}),
            download: url,
          },
        }));
        showToast("Tải tệp PDF lên thành công!");
      }
    } catch (err) {
      console.error("Lỗi upload PDF:", err);
      showToast(err.response?.data?.message || "Lỗi khi tải tệp PDF lên.", "error");
    } finally {
      setUploadingDoc(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleAddCriteria = () => {
    setFormData((prev) => ({
      ...prev,
      criteria: [...prev.criteria, ""],
    }));
  };

  const handleCriteriaChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.criteria];
      updated[index] = value;
      return { ...prev, criteria: updated };
    });
  };

  const handleRemoveCriteria = (index) => {
    setFormData((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("Vui lòng nhập tên đề cử kỷ lục.", "error");
      return;
    }

    setIsSaving(true);
    const cleanCriteria = formData.criteria.filter((c) => c && c.trim() !== "");

    const payload = {
      ...formData,
      criteria: cleanCriteria.length
        ? cleanCriteria
        : ["Tiêu chí đạt chuẩn Viện Kỷ lục"],
    };

    try {
      if (editingItem) {
        await RecordAPI.updateRecord(editingItem.id, payload);
        showToast(`Đã cập nhật kỷ lục "${payload.title}"!`);
      } else {
        // Tạo ID mới nếu chưa có
        if (!payload.id) {
          payload.id = String(Date.now());
        }
        await RecordAPI.createRecord(payload);
        showToast(`Đã thêm kỷ lục "${payload.title}"!`);
      }
      setIsModalOpen(false);
      await fetchRecords();
    } catch (error) {
      console.error("Lỗi khi lưu kỷ lục:", error);
      const msg =
        error.response?.data?.message || "Có lỗi xảy ra khi lưu kỷ lục.";
      showToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    try {
      await RecordAPI.deleteRecord(deletingItem.id);
      showToast(`Đã xóa kỷ lục "${deletingItem.title}"!`);
      setDeletingItem(null);
      await fetchRecords();
    } catch (error) {
      console.error("Lỗi khi xóa kỷ lục:", error);
      const msg =
        error.response?.data?.message || "Có lỗi xảy ra khi xóa kỷ lục.";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 shadow-lg animate-bounce">
          {toast.type === "error" ? (
            <AlertTriangle className="size-5 text-red-500 shrink-0" />
          ) : (
            <Check className="size-5 text-emerald-500 shrink-0" />
          )}
          <span className="text-sm font-medium text-[var(--admin-title)]">
            {toast.message}
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, thứ hạng, nhóm đối tượng..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] focus:outline-2 focus:outline-[var(--admin-accent)]"
            />
          </div>

          {categoriesList.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] focus:outline-none"
            >
              <option value="ALL">Tất cả nhóm ({records.length})</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchRecords(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-heading)] hover:bg-[var(--admin-background)] transition cursor-pointer"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Làm mới
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-(--admin-accent) text-(--admin-black) hover:opacity-90 transition cursor-pointer shadow-xs"
          >
            <Plus size={14} />
            Thêm Kỷ Lục
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="border border-[var(--admin-border)] bg-[var(--admin-surface)] rounded-xl shadow-[var(--admin-panel-shadow)] overflow-hidden">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <RefreshCw className="size-8 animate-spin text-[var(--admin-heading)]" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <Trophy
              className="mx-auto size-12 text-gray-300"
              strokeWidth={1.5}
            />
            <p className="mt-2 text-sm font-semibold">
              Chưa có kỷ lục nào phù hợp
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-(--admin-border)">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-(--admin-border) bg-(--admin-background) text-sm font-semibold uppercase tracking-wider text-(--admin-muted)">
                  <th className="w-28 whitespace-nowrap px-5 py-4">
                    Hình ảnh
                  </th>
                  <th className="min-w-[240px] px-5 py-4">Tiêu đề đề cử</th>
                  <th className="min-w-[160px] px-5 py-4">Nhóm đối tượng</th>
                  <th className="min-w-[240px] px-5 py-4">Tiêu chí</th>
                  <th className="whitespace-nowrap px-5 py-4 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-(--admin-border)">
                {filteredRecords.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-(--admin-background)/60"
                  >
                    {/* Hình ảnh */}
                    <td className="px-5 py-5 align-top">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-14 w-20 rounded-lg object-cover border border-(--admin-border) shadow-xs"
                        />
                      ) : (
                        <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-dashed border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-muted)">
                          <RecordHolderIcon name={item.icon || "flare"} size={22} className="text-amber-500/60" />
                        </div>
                      )}
                    </td>

                    {/* Tiêu đề */}
                    <td className="px-5 py-5 align-top">
                      <div
                        className="line-clamp-2 text-base font-semibold text-(--admin-title)"
                        title={item.title}
                      >
                        {item.title || "Chưa có tiêu đề"}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-(--admin-muted)">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-(--admin-background) border border-(--admin-border) text-xs font-medium text-(--admin-heading)">
                          <RecordHolderIcon name={item.icon || "flare"} size={14} className="text-amber-500" />
                          <span>{item.icon || "flare"}</span>
                        </span>
                        <span className="text-(--admin-border)">•</span>
                        <span>Nộp: {item.action?.nomination || "Đề cử"}</span>
                        {item.action?.download && (
                          <>
                            <span className="text-(--admin-border)">•</span>
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-500 dark:text-emerald-400 font-medium">
                              <FileDown size={12} />
                              File PDF
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Nhóm đối tượng */}
                    <td className="px-5 py-5 align-top">
                      <span className="inline-flex rounded-md border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-sm font-medium text-(--admin-ink)">
                        {item.category || "Chung"}
                      </span>
                    </td>

                    {/* Tiêu chí */}
                    <td className="max-w-[360px] px-5 py-5 align-top">
                      {item.criteria && item.criteria.length > 0 ? (
                        <div>
                          <p
                            className="line-clamp-3 text-sm leading-6 text-(--admin-muted)"
                            title={item.criteria.join("\n")}
                          >
                            {item.criteria[0]}
                          </p>

                          {item.criteria.length > 1 && (
                            <span className="mt-1 inline-block text-xs font-medium text-(--admin-accent)">
                              +{item.criteria.length - 1} tiêu chí khác
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm italic text-(--admin-muted)">
                          Chưa có tiêu chí
                        </span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="px-5 py-5 text-right align-top">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-sm font-semibold text-(--admin-title) transition-colors hover:bg-(--admin-background) hover:text-(--admin-accent)"
                        >
                          <Pencil size={16} />
                          Sửa
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingItem(item)}
                          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-500/10"
                        >
                          <Trash2 size={16} />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-none overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] rounded-2xl shadow-2xl md:w-[50vw] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
              <h3 className="text-base font-bold text-[var(--admin-title)]">
                {editingItem ? "Chỉnh sửa Kỷ Lục" : "Thêm Mới Kỷ Lục"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hình ảnh đại diện (Phủ bì) */}
                <div className="md:col-span-2 space-y-2 p-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-background)]">
                  <label className="block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Hình ảnh đại diện (Phủ bì thẻ kỷ lục)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {formData.image ? (
                      <div className="relative h-28 w-44 rounded-lg overflow-hidden border border-[var(--admin-border)] bg-[var(--admin-surface)] shrink-0">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                          className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition cursor-pointer"
                          title="Xóa ảnh"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-28 w-44 items-center justify-center rounded-lg border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] text-xs text-[var(--admin-muted)] shrink-0">
                        Chưa có hình ảnh
                      </div>
                    )}

                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        placeholder="Dán đường dẫn URL ảnh (https://...)"
                        className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={uploadingImage}
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-[var(--admin-surface)] border border-[var(--admin-border)] hover:bg-[var(--admin-background)] text-[var(--admin-ink)] transition cursor-pointer"
                        >
                          {uploadingImage ? (
                            <RefreshCw className="size-3.5 animate-spin" />
                          ) : (
                            <Upload className="size-3.5" />
                          )}
                          <span>{uploadingImage ? "Đang tải ảnh..." : "Tải ảnh từ thiết bị"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Thứ hạng / Danh hiệu (Rank)
                  </label>
                  <input
                    type="text"
                    value={formData.rank}
                    onChange={(e) =>
                      setFormData({ ...formData, rank: e.target.value })
                    }
                    placeholder="VD: HẠNG MỤC TỐI CAO, HUY CHƯƠNG VÀNG..."
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </div>

                <div>
                  <IconDropdown
                    label="Icon biểu tượng"
                    value={formData.icon || "trophy"}
                    onChange={(val) =>
                      setFormData({ ...formData, icon: val })
                    }
                    placeholder="Chọn biểu tượng danh hiệu..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Tên hạng mục đề cử (Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="VD: Kỷ Lục Đỉnh Cao Sáng Nghiệp Việt Nam"
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Phụ đề / Hiện vật vinh danh (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    placeholder="VD: Biểu tượng ngọn hải đăng bằng đồng mạ vàng"
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Nhóm đối tượng (Category)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="VD: Doanh nhân & Nhà sáng lập"
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </div>
              </div>

              {/* Action buttons config */}
              <div className="p-4 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)] space-y-3">
                <span className="text-xs font-bold uppercase text-[var(--admin-heading)] block">
                  Cấu hình nút hành động & Hồ sơ tiêu chí (Actions & Documents)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 mb-1 block">
                      Tên nút Nộp hồ sơ
                    </label>
                    <input
                      type="text"
                      value={formData.action?.nomination || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          action: {
                            ...formData.action,
                            nomination: e.target.value,
                          },
                        })
                      }
                      placeholder="VD: Đề Cử / Nộp Hồ Sơ"
                      className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-gray-400">
                        Hồ sơ tiêu chí đề cử (File PDF)
                      </label>
                      <button
                        type="button"
                        onClick={() => docInputRef.current?.click()}
                        disabled={uploadingDoc}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold text-[var(--admin-accent)] hover:underline cursor-pointer ${
                          uploadingDoc ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {uploadingDoc ? (
                          <>
                            <RefreshCw size={11} className="animate-spin" />
                            Đang tải...
                          </>
                        ) : (
                          <>
                            <Upload size={11} />
                            Tải file PDF lên
                          </>
                        )}
                      </button>
                      <input
                        ref={docInputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleDocFileChange}
                        disabled={uploadingDoc}
                        className="hidden"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.action?.download || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            action: {
                              ...formData.action,
                              download: e.target.value,
                            },
                          })
                        }
                        placeholder="VD: https://... hoặc tải file PDF từ máy"
                        className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)] pr-8"
                      />
                      {formData.action?.download && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              action: {
                                ...formData.action,
                                download: "",
                              },
                            })
                          }
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                          title="Xóa đường dẫn PDF"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    {formData.action?.download && (
                      <div className="mt-1.5 flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded border border-emerald-500/20">
                        <span className="truncate max-w-[240px] flex items-center gap-1 font-medium">
                          <FileDown size={13} className="shrink-0" />
                          {formData.action.download.split("/").pop()}
                        </span>
                        {formData.action.download.startsWith("http") && (
                          <a
                            href={formData.action.download}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[11px] underline hover:text-emerald-300 ml-2"
                          >
                            Xem <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Criteria List */}
              <div className="p-4 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[var(--admin-heading)]">
                    Tiêu chí xét duyệt cốt lõi (Criteria)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCriteria}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-[var(--admin-accent)]/10 text-[var(--admin-heading)] hover:bg-[var(--admin-accent)]/20 transition cursor-pointer"
                  >
                    <Plus size={13} /> Thêm tiêu chí
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.criteria.map((crit, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold">
                        {cIdx + 1}.
                      </span>
                      <input
                        type="text"
                        value={crit}
                        onChange={(e) =>
                          handleCriteriaChange(cIdx, e.target.value)
                        }
                        placeholder={`Nội dung tiêu chí ${cIdx + 1}...`}
                        className="w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-sm text-(--admin-ink) outline-none focus:border-(--admin-accent) flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCriteria(cIdx)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                        title="Xóa tiêu chí"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-(--admin-border)">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-(--admin-border) hover:bg-(--admin-background) transition cursor-pointer text-(--admin-heading)"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg bg-(--admin-accent) text-(--admin-black) hover:opacity-90 transition cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <Check size={14} />
                  {isSaving
                    ? "Đang lưu..."
                    : editingItem
                      ? "Lưu thay đổi"
                      : "Tạo kỷ lục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xóa */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm border border-[var(--admin-border)] bg-[var(--admin-surface)] rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-[var(--admin-title)] mb-2">
              Xác nhận xóa kỷ lục
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Bạn có chắc chắn muốn xóa kỷ lục{" "}
              <strong className="text-[var(--admin-title)]">
                "{deletingItem.title}"
              </strong>{" "}
              ? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--admin-border)] hover:bg-[var(--admin-background)] transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Đang xóa..." : "Xóa kỷ lục"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
