import React, { useState } from "react";
import {
  Check,
  Pencil,
  Plus,
  Trash2,
  Trophy,
  X,
  Image as ImageIcon,
  RefreshCw,
  Award,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { UploadAPI } from "../../../api/uploadApi.js";
import { AdminCard, AdminButton, AdminToast, AdminLoadingModal, AdminConfirmModal } from "../Common/index.js";

const inputClass =
  "min-h-10 w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-sm text-(--admin-ink) outline-none transition focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/30";
const labelClass =
  "mb-1 block text-xs font-semibold uppercase text-(--admin-heading)";

const DEFAULT_CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "doanh-nhan", label: "Doanh nghiệp" },
  { id: "nghe-nhan", label: "Nghệ nhân" },
];

const emptyCard = {
  id: "",
  title: "",
  badge: "Kỷ lục gia Nhân dân",
  year: "Năm 2024",
  category: "nghe-nhan",
  description: "",
  award_title: "Bàn Tay Vàng Kỷ Lục 2024",
  icon: "trophy",
  image: "",
  is_visible: true,
};

export default function RecordHonorRollEditor({ data = {}, onChange, onSaveAll }) {
  const honorRoll = Array.isArray(data) ? data[0] || {} : data || {};
  const categories = honorRoll.categories || DEFAULT_CATEGORIES;
  const cards = Array.isArray(honorRoll.cards) ? honorRoll.cards : [];

  // Form State
  const [cardForm, setCardForm] = useState(emptyCard);
  const [editingIndex, setEditingIndex] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [newCatId, setNewCatId] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("ALL"); // ALL | VISIBLE | HIDDEN

  // Feedback State
  const [toast, setToast] = useState(null);
  const [loadingModal, setLoadingModal] = useState({
    show: false,
    title: "Đang xử lý dữ liệu...",
    subtitle: "Vui lòng chờ trong giây lát",
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Xóa hồ sơ",
    type: "danger",
    onConfirm: null,
  });

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const updateHonorRoll = async (fields, autoSave = false, successMsg = "") => {
    const updated = { ...honorRoll, ...fields };
    onChange(Array.isArray(data) ? [updated] : updated);

    if (autoSave && onSaveAll) {
      try {
        await onSaveAll();
        if (successMsg) showToast(successMsg, "success");
      } catch (err) {
        showToast("Lỗi khi lưu dữ liệu lên máy chủ: " + (err.message || err), "error");
      }
    } else if (successMsg) {
      showToast(successMsg, "success");
    }
  };

  const handleFieldChange = (field, value) => {
    updateHonorRoll({ [field]: value });
  };

  // Quản lý categories
  const handleAddCategory = () => {
    if (!newCatId.trim() || !newCatLabel.trim()) return;
    const cleanId = newCatId.trim().toLowerCase().replace(/\s+/g, "-");
    const updatedCats = [...categories, { id: cleanId, label: newCatLabel.trim() }];
    updateHonorRoll({ categories: updatedCats });
    setNewCatId("");
    setNewCatLabel("");
    showToast(`Đã thêm danh mục "${newCatLabel.trim()}"`, "success");
  };

  const handleRemoveCategory = (catId) => {
    if (categories.length <= 1) {
      showToast("Cần giữ lại ít nhất 1 danh mục", "info");
      return;
    }
    updateHonorRoll({ categories: categories.filter((c) => c.id !== catId) });
    showToast("Đã xóa danh mục", "info");
  };

  // Bắt đầu sửa thẻ
  const handleStartEdit = (card, index) => {
    setEditingIndex(index);
    setImageFile(null);
    setCardForm({
      ...emptyCard,
      ...card,
      is_visible: card.is_visible !== false,
    });
  };

  // Hủy sửa thẻ
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setImageFile(null);
    setCardForm(emptyCard);
  };

  // Bật/tắt nhanh trạng thái ẩn/hiện của 1 thẻ
  const handleToggleCardVisibility = async (index, e) => {
    e.stopPropagation();
    const updatedCards = [...cards];
    const currentVis = updatedCards[index].is_visible !== false;
    const nextVis = !currentVis;

    updatedCards[index] = {
      ...updatedCards[index],
      is_visible: nextVis,
    };

    setLoadingModal({
      show: true,
      title: nextVis ? "Đang bật hiển thị..." : "Đang ẩn hồ sơ...",
      subtitle: "Đang cập nhật trạng thái hiển thị trên website",
    });

    try {
      await updateHonorRoll(
        { cards: updatedCards },
        true,
        nextVis ? "Đã bật hiển thị hồ sơ này trên website!" : "Đã ẩn hồ sơ này khỏi website!"
      );
      if (editingIndex === index) {
        setCardForm((prev) => ({ ...prev, is_visible: nextVis }));
      }
    } finally {
      setLoadingModal({ show: false, title: "", subtitle: "" });
    }
  };

  // Lưu thẻ (Thêm mới hoặc Cập nhật)
  const handleSaveCard = async (e) => {
    e.preventDefault();
    if (!cardForm.title?.trim()) {
      showToast("Vui lòng nhập họ tên cá nhân hoặc tập thể.", "error");
      return;
    }

    const isEdit = editingIndex !== null;
    setLoadingModal({
      show: true,
      title: isEdit ? "Đang lưu thay đổi hồ sơ..." : "Đang thêm hồ sơ vinh danh...",
      subtitle: imageFile ? "Đang tải ảnh lên máy chủ và lưu hồ sơ..." : "Vui lòng chờ trong giây lát",
    });

    let finalImageUrl = cardForm.image || "";

    // Nếu người dùng chọn file upload
    if (imageFile) {
      try {
        setImageUploading(true);
        const uploaded = await UploadAPI.uploadImage(imageFile, "record-honors");
        if (uploaded) finalImageUrl = uploaded;
      } catch (err) {
        console.warn("Lỗi upload ảnh:", err);
        showToast("Lỗi khi tải ảnh lên, đã giữ URL ảnh ban đầu", "error");
      } finally {
        setImageUploading(false);
      }
    }

    const payload = {
      ...cardForm,
      id: cardForm.id || Date.now(),
      image: finalImageUrl,
      is_visible: cardForm.is_visible !== false,
    };

    let updatedCards;
    if (isEdit) {
      updatedCards = [...cards];
      updatedCards[editingIndex] = payload;
    } else {
      updatedCards = [...cards, payload];
    }

    try {
      await updateHonorRoll(
        { cards: updatedCards },
        true,
        isEdit ? `Đã cập nhật hồ sơ "${payload.title}" thành công!` : `Đã thêm hồ sơ "${payload.title}" vào bảng vàng!`
      );
      handleCancelEdit();
    } finally {
      setLoadingModal({ show: false, title: "", subtitle: "" });
    }
  };

  // Xóa thẻ qua Modal xác nhận
  const handleRemoveCard = (index, e) => {
    e.stopPropagation();
    const itemTitle = cards[index]?.title || "hồ sơ này";
    setConfirmModal({
      isOpen: true,
      title: "Xác nhận xóa hồ sơ vinh danh",
      message: `Bạn có chắc chắn muốn xóa hồ sơ "${itemTitle}" khỏi Bảng vàng không?\nDữ liệu sẽ được cập nhật trực tiếp lên máy chủ.`,
      confirmText: "Xóa vĩnh viễn",
      type: "danger",
      onConfirm: () => performRemoveCard(index, itemTitle),
    });
  };

  const performRemoveCard = async (index, itemTitle) => {
    closeConfirmModal();
    setLoadingModal({
      show: true,
      title: "Đang xóa hồ sơ vinh danh...",
      subtitle: "Đang cập nhật danh sách bảng vàng trên máy chủ",
    });

    const updatedCards = cards.filter((_, i) => i !== index);

    try {
      await updateHonorRoll(
        { cards: updatedCards },
        true,
        `Đã xóa "${itemTitle}" khỏi Bảng vàng thành công!`
      );
      if (editingIndex === index) handleCancelEdit();
    } finally {
      setLoadingModal({ show: false, title: "", subtitle: "" });
    }
  };

  // Lọc danh sách thẻ theo trạng thái ẩn/hiện
  const displayCards = cards.map((card, idx) => ({ ...card, originalIdx: idx })).filter((c) => {
    const isVis = c.is_visible !== false;
    if (filterVisibility === "VISIBLE") return isVis;
    if (filterVisibility === "HIDDEN") return !isVis;
    return true;
  });

  const visibleCount = cards.filter((c) => c.is_visible !== false).length;

  return (
    <div className="space-y-6">
      {/* Toast thông báo góc màn hình */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* Modal Loading chính giữa màn hình */}
      <AdminLoadingModal
        show={loadingModal.show}
        title={loadingModal.title}
        subtitle={loadingModal.subtitle}
      />

      {/* Modal Xác nhận thay thế window.confirm */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        loading={loadingModal.show}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
      />

      {/* 1. Cấu hình Header & Tiêu đề Bảng vàng */}
      <AdminCard
        title="Cấu hình Tiêu đề Bảng vàng danh dự"
        subtitle="Tiêu đề chính, tiêu đề phụ và nội dung giới thiệu chung của phần Bảng vàng"
        actions={
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={honorRoll.is_visible !== false}
                onChange={(e) => handleFieldChange("is_visible", e.target.checked)}
                className="size-4 rounded accent-(--admin-accent)"
              />
              <span className="text-xs font-semibold text-(--admin-title)">
                Hiển thị phần Bảng vàng
              </span>
            </label>
            {onSaveAll && (
              <AdminButton
                type="button"
                variant="primary"
                size="sm"
                icon={Save}
                onClick={async () => {
                  setLoadingModal({
                    show: true,
                    title: "Đang lưu cấu hình Bảng vàng...",
                    subtitle: "Đang đồng bộ dữ liệu với máy chủ",
                  });
                  try {
                    await onSaveAll();
                    showToast("Đã lưu thông tin Bảng vàng thành công!", "success");
                  } finally {
                    setLoadingModal({ show: false, title: "", subtitle: "" });
                  }
                }}
              >
                Lưu Bảng vàng
              </AdminButton>
            )}
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            <span className={labelClass}>Nhãn phụ (Title badge)</span>
            <input
              type="text"
              value={honorRoll.title || ""}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="VD: BẢNG VÀNG DANH DỰ"
              className={inputClass}
            />
          </label>

          <label>
            <span className={labelClass}>Tiêu đề chính (Subtitle)</span>
            <input
              type="text"
              value={honorRoll.subtitle || ""}
              onChange={(e) => handleFieldChange("subtitle", e.target.value)}
              placeholder="VD: Cá Nhân & Tập Thể Được Tôn Vinh Gần Đây"
              className={inputClass}
            />
          </label>

          <label className="md:col-span-2">
            <span className={labelClass}>Mô tả Bảng vàng</span>
            <textarea
              rows={2}
              value={honorRoll.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Ghi nhận những tấm gương cống hiến vượt bậc đã được trao chứng nhận và cúp vàng..."
              className={inputClass}
            />
          </label>
        </div>
      </AdminCard>

      {/* 2. Quản lý Danh mục phân loại (Categories) */}
      <AdminCard
        title="Danh mục phân loại (Categories)"
        subtitle="Các tab bộ lọc hiển thị công khai trên website"
      >
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs font-semibold text-(--admin-title)"
              >
                <span>{cat.label}</span>
                <span className="text-[10px] text-(--admin-body)/60 font-mono">({cat.id})</span>
                {cat.id !== "all" && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat.id)}
                    className="text-(--admin-body)/50 hover:text-red-500 transition cursor-pointer"
                    title="Xóa danh mục"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-(--admin-border)">
            <input
              type="text"
              value={newCatId}
              onChange={(e) => setNewCatId(e.target.value)}
              placeholder="Mã danh mục (slug, VD: nha-khoa-hoc)"
              className={`${inputClass} sm:w-1/3`}
            />
            <input
              type="text"
              value={newCatLabel}
              onChange={(e) => setNewCatLabel(e.target.value)}
              placeholder="Tên hiển thị (VD: Nhà Khoa học)"
              className={`${inputClass} flex-1`}
            />
            <AdminButton
              type="button"
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleAddCategory}
            >
              Thêm danh mục
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* 3. Bảng vàng tôn vinh — Layout 2 Cột chuẩn như Trang Giải thưởng */}
      <AdminCard
        title={`Bảng vàng tôn vinh (${cards.length} hồ sơ)`}
        subtitle="Quản lý từng cá nhân và tập thể được tôn vinh với tính năng Thêm, Sửa, Xóa và Ẩn/Hiện"
        actions={
          <div className="flex items-center gap-2 text-xs">
            <span className="text-(--admin-body)/70 font-medium">
              Đang hiển thị: <strong className="text-emerald-500">{visibleCount}</strong> / {cards.length}
            </span>
          </div>
        }
      >
        <div className="grid items-stretch gap-6 lg:grid-cols-[2fr_3fr]">
          {/* CỘT TRÁI: Danh sách hồ sơ tôn vinh */}
          <div className="flex flex-col h-full space-y-3">
            {/* Thanh lọc trạng thái Ẩn / Hiện */}
            <div className="flex items-center justify-between pb-2 border-b border-(--admin-border) text-xs">
              <span className="font-semibold text-(--admin-heading) uppercase text-[11px]">
                Danh sách hồ sơ ({displayCards.length})
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterVisibility("ALL")}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                    filterVisibility === "ALL"
                      ? "bg-(--admin-accent) text-white"
                      : "text-(--admin-body)/60 hover:text-(--admin-title)"
                  }`}
                >
                  Tất cả ({cards.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterVisibility("VISIBLE")}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                    filterVisibility === "VISIBLE"
                      ? "bg-emerald-600 text-white"
                      : "text-(--admin-body)/60 hover:text-(--admin-title)"
                  }`}
                >
                  Hiện ({visibleCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterVisibility("HIDDEN")}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                    filterVisibility === "HIDDEN"
                      ? "bg-rose-600 text-white"
                      : "text-(--admin-body)/60 hover:text-(--admin-title)"
                  }`}
                >
                  Ẩn ({cards.length - visibleCount})
                </button>
              </div>
            </div>

            {/* Danh sách thẻ */}
            <div className={`space-y-3 ${cards.length > 4 ? "max-h-[620px] overflow-y-auto pr-1" : ""}`}>
              {displayCards.length === 0 ? (
                <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-(--admin-border) p-6 text-center text-xs text-(--admin-body)/60 italic">
                  {cards.length === 0
                    ? "Chưa có hồ sơ nào trong bảng vàng. Điền thông tin bên phải để thêm mới."
                    : "Không có hồ sơ nào phù hợp với bộ lọc ẩn/hiện."}
                </div>
              ) : (
                displayCards.map((card) => {
                  const idx = card.originalIdx;
                  const isVisible = card.is_visible !== false;

                  return (
                    <div
                      key={card.id || idx}
                      className={`group flex gap-3.5 rounded-xl border p-3.5 transition ${
                        !isVisible ? "opacity-60 bg-(--admin-background)/60" : "bg-(--admin-surface)"
                      } ${
                        editingIndex === idx
                          ? "border-(--admin-accent) bg-(--admin-accent)/5 shadow-sm ring-1 ring-(--admin-accent)/30"
                          : "border-(--admin-border) hover:border-(--admin-accent)/50 hover:shadow-sm"
                      }`}
                    >
                      {/* Thumbnail Avatar / Ảnh chân dung */}
                      <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-background) relative">
                        {card.image ? (
                          <img
                            src={card.image}
                            alt={card.title}
                            className="size-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-gray-400">
                            <ImageIcon size={24} className="opacity-40" />
                          </div>
                        )}
                        {!isVisible && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white" title="Đang ẩn">
                            <EyeOff size={16} />
                          </div>
                        )}
                      </div>

                      {/* Nội dung hồ sơ */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-500">
                            {card.badge || "Vinh danh"}
                          </span>
                          <span className="text-[11px] font-semibold text-(--admin-body)/70">
                            {card.year}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleToggleCardVisibility(idx, e)}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                              isVisible
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                            }`}
                            title={isVisible ? "Bấm để ẩn hồ sơ này khỏi trang công khai" : "Bấm để hiển thị hồ sơ này"}
                          >
                            {isVisible ? <Eye size={11} /> : <EyeOff size={11} />}
                            <span>{isVisible ? "Hiển thị" : "Đang ẩn"}</span>
                          </button>
                        </div>

                        <p className="mt-1 truncate text-sm font-bold text-(--admin-title)">
                          {card.title}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {card.description || "Chưa có đơn vị"}
                        </p>

                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-(--admin-accent)">
                          <Trophy size={13} className="shrink-0" />
                          <span className="truncate font-semibold">{card.award_title || "Kỷ lục"}</span>
                        </div>
                      </div>

                      {/* Thao tác Ẩn/Hiện, Sửa, Xóa */}
                      <div className="flex shrink-0 flex-col justify-between items-end">
                        <div className="flex flex-col gap-1 opacity-70 transition group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => handleToggleCardVisibility(idx, e)}
                            className={`rounded-md p-1.5 transition cursor-pointer ${
                              isVisible
                                ? "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title={isVisible ? "Đang hiện (bấm để ẩn)" : "Đang ẩn (bấm để hiện)"}
                          >
                            {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(card, idx)}
                            className="rounded-md p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-(--admin-heading) cursor-pointer"
                            title="Sửa hồ sơ"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleRemoveCard(idx, e)}
                            className="rounded-md p-1.5 text-red-600 transition hover:bg-red-50 cursor-pointer"
                            title="Xóa hồ sơ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* CỘT PHẢI: Form Thêm / Sửa hồ sơ tôn vinh */}
          <form
            onSubmit={handleSaveCard}
            className="flex flex-col overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-surface)"
          >
            {/* Header Form */}
            <div className="border-b border-(--admin-border) px-5 py-4 bg-(--admin-background)/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-(--admin-heading)">
                    {editingIndex !== null ? `Sửa hồ sơ #${editingIndex + 1}` : "Thêm hồ sơ vinh danh mới"}
                  </h3>
                  <p className="mt-0.5 text-xs text-(--admin-body)/60">
                    Cấu hình thông tin danh hiệu, hình ảnh, giải thưởng riêng và chọn ẩn/hiện
                  </p>
                </div>

                {editingIndex !== null && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-(--admin-border) hover:text-(--admin-heading) cursor-pointer"
                    title="Hủy sửa"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Body Form */}
            <div className="flex-1 space-y-4 p-5">
              {/* Trạng thái Ẩn / Hiện */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-(--admin-border) bg-(--admin-background)">
                <div className="flex items-center gap-2">
                  {cardForm.is_visible !== false ? (
                    <Eye size={16} className="text-emerald-500" />
                  ) : (
                    <EyeOff size={16} className="text-rose-500" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-(--admin-title) block">
                      Trạng thái hiển thị công khai
                    </span>
                    <span className="text-[11px] text-(--admin-body)/60">
                      {cardForm.is_visible !== false
                        ? "Hồ sơ này sẽ xuất hiện trên trang Kỷ lục"
                        : "Hồ sơ này đang tạm ẩn trên website"}
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardForm.is_visible !== false}
                    onChange={(e) => setCardForm({ ...cardForm, is_visible: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Ảnh đại diện / Chân dung */}
              <div className="space-y-1.5">
                <span className={labelClass}>Hình ảnh / Chân dung</span>
                <div className="flex items-center gap-4 rounded-xl border border-dashed border-(--admin-border) p-3 transition hover:border-(--admin-accent)/50">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-(--admin-border) bg-(--admin-background)">
                    {imageUploading ? (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
                        <RefreshCw className="size-5 animate-spin text-white" />
                      </div>
                    ) : cardForm.image ? (
                      <img
                        src={cardForm.image}
                        alt="Preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-[10px] text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          setCardForm({
                            ...cardForm,
                            image: URL.createObjectURL(file),
                          });
                        }
                      }}
                      className="block w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-(--admin-accent)/10 file:text-(--admin-accent) hover:file:bg-(--admin-accent)/20 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="Hoặc dán URL ảnh trực tiếp (https://...)"
                      value={cardForm.image || ""}
                      onChange={(e) => setCardForm({ ...cardForm, image: e.target.value })}
                      className="w-full text-xs rounded-md border border-(--admin-border) bg-(--admin-background) px-2.5 py-1.5 outline-none focus:border-(--admin-accent)"
                    />
                  </div>
                </div>
              </div>

              {/* Tên cá nhân & Danh hiệu (Badge) */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className={labelClass}>Họ tên cá nhân / tập thể *</span>
                  <input
                    required
                    placeholder="VD: Nghệ nhân Trần Duy Long"
                    value={cardForm.title || ""}
                    onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1">
                  <span className={labelClass}>Danh hiệu / Huy hiệu (Badge)</span>
                  <input
                    placeholder="VD: Kỷ lục gia Nhân dân"
                    value={cardForm.badge || ""}
                    onChange={(e) => setCardForm({ ...cardForm, badge: e.target.value })}
                    className={inputClass}
                  />
                </label>
              </div>

              {/* Năm vinh danh & Danh mục */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className={labelClass}>Năm vinh danh (Year)</span>
                  <input
                    placeholder="VD: Năm 2024"
                    value={cardForm.year || ""}
                    onChange={(e) => setCardForm({ ...cardForm, year: e.target.value })}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1">
                  <span className={labelClass}>Danh mục phân loại</span>
                  <select
                    value={cardForm.category || "nghe-nhan"}
                    onChange={(e) => setCardForm({ ...cardForm, category: e.target.value })}
                    className={inputClass}
                  >
                    {categories
                      .filter((c) => c.id !== "all")
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label} ({c.id})
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              {/* Đơn vị / Cơ sở */}
              <label className="block space-y-1">
                <span className={labelClass}>Đơn vị / Cơ sở / Địa chỉ</span>
                <input
                  placeholder="VD: Làng nghề Gốm Bát Tràng, Hà Nội"
                  value={cardForm.description || ""}
                  onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                  className={inputClass}
                />
              </label>

              {/* Đề cử vinh danh & Icon */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2 border-t border-(--admin-border)">
                <label className="sm:col-span-2 space-y-1">
                  <span className={labelClass}>Giải thưởng / Đề cử vinh danh riêng</span>
                  <input
                    placeholder="VD: Bàn Tay Vàng Kỷ Lục 2024"
                    value={cardForm.award_title || ""}
                    onChange={(e) => setCardForm({ ...cardForm, award_title: e.target.value })}
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1">
                  <span className={labelClass}>Biểu tượng icon</span>
                  <select
                    value={cardForm.icon || "trophy"}
                    onChange={(e) => setCardForm({ ...cardForm, icon: e.target.value })}
                    className={inputClass}
                  >
                    <option value="trophy">trophy (Cúp vàng)</option>
                    <option value="flare">flare (Ngọn hải đăng)</option>
                    <option value="account_balance">account_balance (Di sản)</option>
                    <option value="handyman">handyman (Tinh hoa nghề)</option>
                    <option value="military_tech">military_tech (Huy chương)</option>
                    <option value="award">award (Giải thưởng)</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Footer Form */}
            <div className="flex items-center justify-end gap-2 border-t border-(--admin-border) px-5 py-3 bg-(--admin-background)">
              {editingIndex !== null && (
                <AdminButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  Hủy
                </AdminButton>
              )}

              <AdminButton
                type="submit"
                variant="primary"
                size="sm"
                icon={editingIndex !== null ? Check : Plus}
              >
                {editingIndex !== null ? "Lưu thay đổi" : "Thêm hồ sơ"}
              </AdminButton>
            </div>
          </form>
        </div>
      </AdminCard>
    </div>
  );
}
