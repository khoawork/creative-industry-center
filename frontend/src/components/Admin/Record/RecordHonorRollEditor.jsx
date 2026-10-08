import React, { useState } from "react";
import { Plus, Trash2, Award, Users, Filter, Image as ImageIcon } from "lucide-react";
import { AdminCard, AdminButton, AdminBadge } from "../Common/index.js";

const inputClass =
  "w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3.5 py-2.5 text-sm text-(--admin-title) placeholder:text-(--admin-body)/40 outline-none transition focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/10";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-(--admin-heading) mb-1.5";

const DEFAULT_CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "doanh-nhan", label: "Doanh nghiệp" },
  { id: "nghe-nhan", label: "Nghệ nhân" },
];

export default function RecordHonorRollEditor({ data = {}, onChange }) {
  const honorRoll = Array.isArray(data)
    ? data[0] || {}
    : data || {};

  const categories = honorRoll.categories || DEFAULT_CATEGORIES;
  const [newCatId, setNewCatId] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");

  const handleFieldChange = (field, value) => {
    const updated = { ...honorRoll, [field]: value };
    onChange(Array.isArray(data) ? [updated] : updated);
  };

  const handleAwardNameChange = (key, value) => {
    const awardNomination = {
      label: "Đề Cử Được Vinh Danh:",
      value: "",
      ...(honorRoll.award_nomination_name || {}),
      [key]: value,
    };
    handleFieldChange("award_nomination_name", awardNomination);
  };

  // Quản lý danh mục (Categories)
  const handleAddCategory = () => {
    if (!newCatId.trim() || !newCatLabel.trim()) {
      alert("Vui lòng nhập mã danh mục và tên danh mục.");
      return;
    }
    const cleanId = newCatId.trim().toLowerCase().replace(/\s+/g, "-");
    const updatedCats = [...categories, { id: cleanId, label: newCatLabel.trim() }];
    handleFieldChange("categories", updatedCats);
    setNewCatId("");
    setNewCatLabel("");
  };

  const handleRemoveCategory = (catId) => {
    if (categories.length <= 1) {
      alert("Phải giữ lại ít nhất 1 danh mục.");
      return;
    }
    const updatedCats = categories.filter((c) => c.id !== catId);
    handleFieldChange("categories", updatedCats);
  };

  // Quản lý thẻ gương mặt vinh danh
  const handleAddCard = () => {
    const defaultCat = categories.find((c) => c.id !== "all")?.id || "nghe-nhan";
    const updatedCards = [
      ...(honorRoll.cards || []),
      {
        id: Date.now(),
        year: "Năm 2024",
        title: "",
        description: "",
        category: defaultCat,
        badge: "Kỷ lục gia Nhân dân",
        image: "",
        award_title: "Bàn Tay Vàng Kỷ Lục 2024",
      },
    ];
    handleFieldChange("cards", updatedCards);
  };

  const handleCardChange = (index, key, value) => {
    const updatedCards = [...(honorRoll.cards || [])];
    updatedCards[index] = { ...updatedCards[index], [key]: value };
    handleFieldChange("cards", updatedCards);
  };

  const handleRemoveCard = (index) => {
    const updatedCards = (honorRoll.cards || []).filter((_, i) => i !== index);
    handleFieldChange("cards", updatedCards);
  };

  return (
    <div className="space-y-6">
      {/* 1. Thông tin chung Bảng vàng */}
      <AdminCard
        title="Cấu hình Bảng vàng danh dự"
        subtitle="Tiêu đề, mô tả và nhãn danh hiệu chung của phần Bảng vàng"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Nhãn phụ (Title badge)</label>
            <input
              type="text"
              value={honorRoll.title || ""}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="VD: BẢNG VÀNG DANH DỰ"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tiêu đề chính (Subtitle)</label>
            <input
              type="text"
              value={honorRoll.subtitle || ""}
              onChange={(e) => handleFieldChange("subtitle", e.target.value)}
              placeholder="VD: Cá Nhân & Tập Thể Được Tôn Vinh Gần Đây"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Mô tả phần Bảng vàng</label>
            <textarea
              rows={2}
              value={honorRoll.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Ghi nhận những tấm gương cống hiến vượt bậc đã được trao chứng nhận và cúp vàng..."
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2 p-4 rounded-xl bg-(--admin-background) border border-(--admin-border) space-y-3">
            <span className="text-xs font-bold uppercase text-(--admin-heading) block">
              Nhãn danh hiệu đề cử mặc định
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-(--admin-body) mb-1 block">
                  Nhãn hiển thị (Label)
                </label>
                <input
                  type="text"
                  value={honorRoll.award_nomination_name?.label || ""}
                  onChange={(e) => handleAwardNameChange("label", e.target.value)}
                  placeholder="VD: Đề Cử Được Vinh Danh:"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-(--admin-body) mb-1 block">
                  Tên danh hiệu chung (Value)
                </label>
                <input
                  type="text"
                  value={honorRoll.award_nomination_name?.value || ""}
                  onChange={(e) => handleAwardNameChange("value", e.target.value)}
                  placeholder="VD: Bàn Tay Vàng Kỷ Lục 2024"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* 2. Quản lý Danh mục phân loại (Categories) */}
      <AdminCard
        title="Quản lý các danh mục phân loại (Categories)"
        subtitle="Bộ lọc danh mục hiển thị trên giao diện công khai (Tất cả, Doanh nghiệp, Nghệ nhân,...)"
      >
        <div className="space-y-4">
          {/* Categories Badges list */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs font-semibold text-(--admin-title)"
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

          {/* Add category form */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-3 border-t border-(--admin-border)">
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

      {/* 3. Danh sách Gương mặt vinh danh kèm Hình ảnh */}
      <AdminCard
        title={`Danh sách Gương mặt vinh danh (${honorRoll.cards?.length || 0})`}
        subtitle="Thẻ chân dung kèm hình ảnh, danh hiệu, niên khóa và giải thưởng"
        actions={
          <AdminButton
            type="button"
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleAddCard}
          >
            Thêm gương mặt
          </AdminButton>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(honorRoll.cards || []).length === 0 ? (
            <p className="col-span-2 text-center py-10 text-xs text-(--admin-body)/60 italic">
              Chưa có gương mặt nào trong bảng vàng. Bấm "Thêm gương mặt" để tạo mới.
            </p>
          ) : (
            (honorRoll.cards || []).map((card, idx) => (
              <div
                key={card.id || idx}
                className="p-5 rounded-2xl bg-(--admin-background) border border-(--admin-border) space-y-4 hover:border-(--admin-accent)/40 transition duration-150"
              >
                {/* Header card */}
                <div className="flex items-center justify-between pb-2 border-b border-(--admin-border)">
                  <span className="text-xs font-bold text-(--admin-heading)">
                    Gương mặt #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                    title="Xóa gương mặt"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Hình ảnh (Image URL & Preview) */}
                <div>
                  <label className="text-[11px] font-semibold text-(--admin-body) mb-1.5 flex items-center gap-1.5">
                    <ImageIcon size={13} /> URL Hình ảnh / Chân dung
                  </label>
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-20 rounded-lg border border-(--admin-border) bg-(--admin-surface) overflow-hidden shrink-0 flex items-center justify-center text-(--admin-body)/50">
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={card.title || "Chân dung"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <ImageIcon size={22} className="opacity-40" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="text"
                        value={card.image || ""}
                        onChange={(e) => handleCardChange(idx, "image", e.target.value)}
                        placeholder="VD: https://... hoặc /images/awards/story.jpg"
                        className={inputClass}
                      />
                      <span className="text-[10px] text-(--admin-body)/60 block">
                        Dán đường dẫn ảnh chân dung hoặc liên kết hình ảnh trực tuyến.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-(--admin-body) mb-1 block">
                      Họ tên cá nhân / tập thể *
                    </label>
                    <input
                      type="text"
                      value={card.title || ""}
                      onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                      placeholder="VD: Nghệ nhân Trần Duy Long"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-(--admin-body) mb-1 block">
                      Huy hiệu / Danh hiệu (Badge)
                    </label>
                    <input
                      type="text"
                      value={card.badge || ""}
                      onChange={(e) => handleCardChange(idx, "badge", e.target.value)}
                      placeholder="VD: Kỷ lục gia Nhân dân"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-(--admin-body) mb-1 block">
                      Năm vinh danh
                    </label>
                    <input
                      type="text"
                      value={card.year || ""}
                      onChange={(e) => handleCardChange(idx, "year", e.target.value)}
                      placeholder="VD: Năm 2024"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-(--admin-body) mb-1 block">
                      Danh mục phân loại
                    </label>
                    <select
                      value={card.category || "nghe-nhan"}
                      onChange={(e) => handleCardChange(idx, "category", e.target.value)}
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
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-(--admin-body) mb-1 block">
                    Đơn vị / Cơ sở / Địa chỉ (Description)
                  </label>
                  <input
                    type="text"
                    value={card.description || ""}
                    onChange={(e) => handleCardChange(idx, "description", e.target.value)}
                    placeholder="VD: Làng nghề Gốm Bát Tràng, Hà Nội"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-(--admin-body) mb-1 block">
                    Đề cử được vinh danh (Award Title)
                  </label>
                  <input
                    type="text"
                    value={card.award_title || ""}
                    onChange={(e) => handleCardChange(idx, "award_title", e.target.value)}
                    placeholder="VD: Bàn Tay Vàng Kỷ Lục 2024"
                    className={inputClass}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </AdminCard>
    </div>
  );
}
