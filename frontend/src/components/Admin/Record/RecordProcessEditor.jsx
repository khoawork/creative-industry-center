import React from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { AdminCard, AdminButton, AdminInput } from "../Common";

const COLOR_OPTIONS = [
  { value: "amber", label: "Vàng kim (Amber)", badge: "border-amber-500/30 text-amber-500 bg-amber-500/10" },
  { value: "sky", label: "Xanh da trời (Sky)", badge: "border-sky-500/30 text-sky-500 bg-sky-500/10" },
  { value: "indigo", label: "Xanh chàm (Indigo)", badge: "border-indigo-500/30 text-indigo-500 bg-indigo-500/10" },
  { value: "emerald", label: "Xanh lục (Emerald)", badge: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" },
  { value: "rose", label: "Đỏ hồng (Rose)", badge: "border-rose-500/30 text-rose-500 bg-rose-500/10" },
  { value: "purple", label: "Tím (Purple)", badge: "border-purple-500/30 text-purple-500 bg-purple-500/10" },
];

export default function RecordProcessEditor({ data = {}, onChange }) {
  const process = {
    title: "",
    subtitle: "",
    description: "",
    cards: [],
    ...data,
  };

  const cards = Array.isArray(process.cards) ? process.cards : [];

  const handleFieldChange = (field, value) => {
    onChange({ ...process, [field]: value });
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    onChange({ ...process, cards: updatedCards });
  };

  const handleAddCard = () => {
    const nextStepNum = cards.length + 1;
    const newCard = {
      id: Date.now(),
      icon: "FileText",
      title: `Bước ${String(nextStepNum).padStart(2, "0")}: Tên bước mới`,
      description: "Mô tả chi tiết nội dung và các yêu cầu thẩm định trong bước này.",
      color: COLOR_OPTIONS[(nextStepNum - 1) % COLOR_OPTIONS.length].value,
      info: [],
    };
    onChange({ ...process, cards: [...cards, newCard] });
  };

  const handleDeleteCard = (index) => {
    if (cards.length <= 1) {
      alert("Quy trình cần tối thiểu 1 bước.");
      return;
    }
    const updatedCards = cards.filter((_, idx) => idx !== index);
    onChange({ ...process, cards: updatedCards });
  };

  const handleMoveCard = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= cards.length) return;
    const updatedCards = [...cards];
    const temp = updatedCards[index];
    updatedCards[index] = updatedCards[targetIdx];
    updatedCards[targetIdx] = temp;
    onChange({ ...process, cards: updatedCards });
  };

  return (
    <div className="space-y-6">
      {/* Cấu hình chung cho phần Quy trình */}
      <AdminCard
        title="Tiêu đề & Giới thiệu Quy trình Thẩm định"
        subtitle="Cấu hình thông tin header và phần mô tả tóm tắt của quy trình xác lập kỷ lục."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AdminInput
            label="Nhãn phụ (Title badge)"
            value={process.title || ""}
            onChange={(e) => handleFieldChange("title", e?.target?.value ?? e)}
            placeholder="VD: QUY TRÌNH CHUẨN HÓA"
          />

          <AdminInput
            label="Tiêu đề chính (Subtitle heading)"
            value={process.subtitle || ""}
            onChange={(e) => handleFieldChange("subtitle", e?.target?.value ?? e)}
            placeholder="VD: QUY TRÌNH 4 BƯỚC THẨM ĐỊNH & XÁC LẬP ĐỀ CỬ KỶ LỤC"
          />

          <div className="md:col-span-2">
            <AdminInput
              label="Mô tả tóm tắt quy trình"
              multiline
              rows={3}
              value={process.description || ""}
              onChange={(e) => handleFieldChange("description", e?.target?.value ?? e)}
              placeholder="Đảm bảo tính pháp lý, độc lập tuyệt đối và đánh giá giá trị sáng tạo theo quy chế Viện Kỷ lục Việt Nam..."
            />
          </div>
        </div>
      </AdminCard>

      {/* Quản lý danh sách các bước quy trình (Cards) */}
      <AdminCard
        title={`Danh sách các bước quy trình (${cards.length} bước)`}
        subtitle="Quản lý từng bước thẩm định, có thể thêm bước mới, sửa nội dung, đổi màu sắc và sắp xếp thứ tự."
        actions={
          <AdminButton
            type="button"
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleAddCard}
          >
            Thêm bước quy trình
          </AdminButton>
        }
      >
        {cards.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-(--admin-border) text-(--admin-ink)/60">
            <p className="text-sm">Hiện chưa có bước quy trình nào.</p>
            <div className="mt-3 flex justify-center">
              <AdminButton
                type="button"
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleAddCard}
              >
                Tạo bước đầu tiên
              </AdminButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {cards.map((card, idx) => {
              const selectedColor = COLOR_OPTIONS.find((c) => c.value === card.color) || COLOR_OPTIONS[0];

              return (
                <div
                  key={card.id || idx}
                  className="p-5 rounded-xl border border-(--admin-border) bg-(--admin-background) space-y-4 transition"
                >
                  {/* Card Header & Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--admin-border) pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${selectedColor.badge}`}>
                        Bước {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-bold text-(--admin-title) truncate max-w-xs sm:max-w-md">
                        {card.title || "Chưa đặt tiêu đề"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveCard(idx, -1)}
                        className="p-1.5 rounded-lg text-(--admin-ink)/60 hover:text-(--admin-ink) hover:bg-(--admin-surface) disabled:opacity-30 cursor-pointer transition"
                        title="Di chuyển lên"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === cards.length - 1}
                        onClick={() => handleMoveCard(idx, 1)}
                        className="p-1.5 rounded-lg text-(--admin-ink)/60 hover:text-(--admin-ink) hover:bg-(--admin-surface) disabled:opacity-30 cursor-pointer transition"
                        title="Di chuyển xuống"
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(idx)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer transition ml-1"
                        title="Xóa bước này"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Card Edit Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8">
                      <AdminInput
                        label="Tiêu đề bước"
                        value={card.title || ""}
                        onChange={(e) => handleCardChange(idx, "title", e?.target?.value ?? e)}
                        placeholder="VD: Bước 01: Nộp Hồ Sơ Sơ Khảo"
                        required
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs font-bold text-(--admin-ink) uppercase tracking-wider mb-1.5">
                        Tông màu hiển thị
                      </label>
                      <select
                        value={card.color || "amber"}
                        onChange={(e) => handleCardChange(idx, "color", e?.target?.value ?? e)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-(--admin-border) bg-(--admin-surface) text-(--admin-ink) focus:outline-hidden focus:border-(--admin-accent)"
                      >
                        {COLOR_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-12">
                      <AdminInput
                        label="Mô tả nội dung bước"
                        multiline
                        rows={2}
                        value={card.description || ""}
                        onChange={(e) => handleCardChange(idx, "description", e?.target?.value ?? e)}
                        placeholder="Mô tả những công việc, hồ sơ và thẩm quyền xử lý trong bước này..."
                        required
                      />
                    </div>

                    {/* Danh sách thông tin bổ sung (info - RecordSectionProcessInfoDto: label, value) */}
                    <div className="sm:col-span-12 pt-2 border-t border-(--admin-border)/60 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-(--admin-heading) uppercase tracking-wider">
                            Thông tin phụ đính kèm (Info Tags)
                          </span>
                          <p className="text-[11px] text-(--admin-ink)/60">
                            Hiển thị ở chân thẻ quy trình (VD: Thời gian: 05-07 ngày, Biên bản: Mẫu BB-01...)
                          </p>
                        </div>
                        <AdminButton
                          type="button"
                          variant="secondary"
                          size="sm"
                          icon={Plus}
                          onClick={() => {
                            const currentInfo = Array.isArray(card.info) ? card.info : [];
                            handleCardChange(idx, "info", [
                              ...currentInfo,
                              { label: "Thời gian", value: "3 - 5 ngày làm việc" },
                            ]);
                          }}
                        >
                          Thêm thông tin
                        </AdminButton>
                      </div>

                      {Array.isArray(card.info) && card.info.length > 0 ? (
                        <div className="space-y-2.5">
                          {card.info.map((inf, infoIdx) => (
                            <div
                              key={infoIdx}
                              className="flex items-center gap-2.5 p-2 rounded-lg bg-(--admin-surface) border border-(--admin-border)"
                            >
                              <div className="w-1/3">
                                <AdminInput
                                  label={`Nhãn ${infoIdx + 1}`}
                                  value={inf.label || ""}
                                  placeholder="VD: Thời gian"
                                  onChange={(e) => {
                                    const nextInfo = [...card.info];
                                    nextInfo[infoIdx] = { ...nextInfo[infoIdx], label: e.target.value };
                                    handleCardChange(idx, "info", nextInfo);
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <AdminInput
                                  label="Nội dung"
                                  value={inf.value || ""}
                                  placeholder="VD: 5-7 ngày làm việc"
                                  onChange={(e) => {
                                    const nextInfo = [...card.info];
                                    nextInfo[infoIdx] = { ...nextInfo[infoIdx], value: e.target.value };
                                    handleCardChange(idx, "info", nextInfo);
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                title="Xóa thông tin này"
                                onClick={() => {
                                  const nextInfo = card.info.filter((_, i) => i !== infoIdx);
                                  handleCardChange(idx, "info", nextInfo);
                                }}
                                className="p-2 mt-5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer transition shrink-0"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs italic text-(--admin-ink)/50">
                          Chưa có thông tin phụ nào. Bấm &quot;Thêm thông tin&quot; để bổ sung thời gian, thẩm quyền, biên bản...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
