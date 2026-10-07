import React, { useState } from "react";
import {
  Trophy,
  Search,
  Check,
  CheckSquare,
  Square,
  ExternalLink,
} from "lucide-react";
import { AdminCard, AdminButton, AdminBadge, AdminInput } from "../Common/index.js";

export default function RecordItemsEditor({
  records = [],
  selectedRecordIds = [],
  title = "",
  subtitle = "",
  onTitleChange,
  onSubtitleChange,
  onSelectionChange,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Đảm bảo selectedRecordIds là mảng chuỗi
  const selectedSet = new Set(
    (selectedRecordIds && selectedRecordIds.length > 0
      ? selectedRecordIds
      : records.map((r) => String(r.id))
    ).map(String)
  );

  const categories = Array.from(
    new Set(records.map((r) => r.category).filter(Boolean))
  );

  const filteredRecords = records.filter((r) => {
    const matchesCategory =
      categoryFilter === "ALL" || r.category === categoryFilter;
    if (!matchesCategory) return false;

    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.rank && r.rank.toLowerCase().includes(q)) ||
      (r.category && r.category.toLowerCase().includes(q)) ||
      (r.subtitle && r.subtitle.toLowerCase().includes(q))
    );
  });

  const handleToggle = (id) => {
    const strId = String(id);
    let next;
    if (selectedSet.has(strId)) {
      next = Array.from(selectedSet).filter((item) => item !== strId);
    } else {
      next = [...Array.from(selectedSet), strId];
    }
    if (onSelectionChange) {
      onSelectionChange(next);
    }
  };

  const handleSelectAll = () => {
    if (onSelectionChange) {
      onSelectionChange(records.map((r) => String(r.id)));
    }
  };

  const handleDeselectAll = () => {
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Phụ đề của Section Hạng mục Kỷ lục */}
      <AdminCard
        title="Tiêu Đề & Phụ Đề Hạng Mục Đề Cử Kỷ Lục"
        subtitle="Cấu hình tiêu đề và nhãn phụ hiển thị trên section Danh mục Đề cử Kỷ lục của trang công khai."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AdminInput
            label="Nhãn phụ (Subtitle badge)"
            value={subtitle}
            onChange={(e) => onSubtitleChange && onSubtitleChange(e?.target?.value ?? e)}
            placeholder="VD: DANH MỤC ĐỀ CỬ KỶ LỤC"
          />
          <AdminInput
            label="Tiêu đề chính (Title heading)"
            value={title}
            onChange={(e) => onTitleChange && onTitleChange(e?.target?.value ?? e)}
            placeholder="VD: DANH MỤC HẠNG MỤC ĐỀ CỬ KỶ LỤC"
          />
        </div>
      </AdminCard>

      {/* Top Banner / Toolbar */}
      <AdminCard
        title="Lựa Chọn Hạng Mục Kỷ Lục Hiển Thị"
        subtitle="Chọn các danh hiệu đề cử được hiển thị công khai trên website. Để thêm/sửa/xóa kỷ lục, vui lòng thao tác tại mục Catalog Kỷ lục."
        actions={
          <div className="flex items-center gap-2">
            <AdminBadge variant="amber">
              Đã chọn: {selectedSet.size} / {records.length}
            </AdminBadge>
            <a
              href="/admin/records"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-title) hover:bg-(--admin-border)/40 transition cursor-pointer"
            >
              <ExternalLink size={14} /> Catalog Kỷ lục
            </a>
          </div>
        }
      >
        {/* Search, Filter & Quick Select */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--admin-body)/50"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm danh mục theo tiêu đề, thứ hạng..."
                className="w-full rounded-lg border border-(--admin-border) bg-(--admin-background) pl-10 pr-4 py-2 text-sm text-(--admin-title) placeholder:text-(--admin-body)/40 outline-none focus:border-(--admin-accent)"
              />
            </div>

            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-(--admin-border) bg-(--admin-background) text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
              >
                <option value="ALL">Tất cả nhóm</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              icon={CheckSquare}
              onClick={handleSelectAll}
            >
              Chọn tất cả
            </AdminButton>
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              icon={Square}
              onClick={handleDeselectAll}
            >
              Bỏ chọn tất cả
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* Record Cards Grid with Selection Checkbox */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full text-center py-12 rounded-xl border border-dashed border-(--admin-border) bg-(--admin-surface) text-(--admin-body)/60 text-sm">
            {searchTerm
              ? "Không tìm thấy kỷ lục phù hợp."
              : "Chưa có danh mục kỷ lục nào trong hệ thống."}
          </div>
        ) : (
          filteredRecords.map((item) => {
            const isSelected = selectedSet.has(String(item.id));
            return (
              <div
                key={item.id}
                onClick={() => handleToggle(item.id)}
                className={`relative rounded-xl border p-5 flex flex-col justify-between transition duration-150 cursor-pointer select-none group ${
                  isSelected
                    ? "border-(--admin-accent) bg-(--admin-accent)/5 ring-2 ring-(--admin-accent)/10 shadow-sm"
                    : "border-(--admin-border) bg-(--admin-surface) opacity-75 hover:opacity-100 hover:border-(--admin-border-hover)"
                }`}
              >
                <div>
                  {/* Top row: Rank badge + Checkbox */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {item.rank || "HẠNG MỤC KỶ LỤC"}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                        isSelected
                          ? "bg-(--admin-accent) text-white"
                          : "border border-(--admin-border) bg-(--admin-background) text-transparent group-hover:border-(--admin-accent)"
                      }`}
                    >
                      <Check size={13} strokeWidth={3} />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-(--admin-title) line-clamp-2 mb-1">
                    {item.title || "Chưa có tiêu đề"}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-(--admin-body)/70 italic mb-2 line-clamp-1">
                      {item.subtitle}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 text-xs mb-3">
                    {item.category && (
                      <span className="px-2 py-0.5 rounded bg-(--admin-background) border border-(--admin-border) text-(--admin-body)/70 text-[11px]">
                        {item.category}
                      </span>
                    )}
                    {item.cycle && (
                      <span className="px-2 py-0.5 rounded bg-(--admin-background) border border-(--admin-border) text-(--admin-body)/70 text-[11px]">
                        {item.cycle}
                      </span>
                    )}
                  </div>

                  {item.criteria && item.criteria.length > 0 && (
                    <div className="space-y-1 mb-3 pt-2 border-t border-(--admin-border)">
                      <span className="text-[11px] font-bold uppercase text-(--admin-heading) block">
                        Tiêu chí xét duyệt ({item.criteria.length}):
                      </span>
                      <ul className="text-xs text-(--admin-body)/70 space-y-1 line-clamp-2">
                        {item.criteria.slice(0, 2).map((c, i) => (
                          <li key={i} className="truncate text-[11px]">
                            • {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-(--admin-border) flex items-center justify-between text-[11px] text-(--admin-body)/60">
                  <span className="truncate">Nộp: {item.action?.nomination || "Đề cử"}</span>
                  <span
                    className={`font-semibold ${
                      isSelected ? "text-emerald-500" : "text-(--admin-body)/40"
                    }`}
                  >
                    {isSelected ? "Đang hiển thị" : "Đang ẩn"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
