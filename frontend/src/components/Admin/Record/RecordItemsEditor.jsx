import React, { useState } from "react";
import {
  Trophy,
  Search,
  Check,
  CheckSquare,
  Square,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";

export default function RecordItemsEditor({
  records = [],
  selectedRecordIds = [],
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
      {/* Top Banner / Toolbar */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--admin-border)] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Trophy size={20} />
            </span>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-title)]">
                Lựa Chọn Hạng Mục Kỷ Lục Hiển Thị
              </h3>
              <p className="text-xs text-gray-500">
                Chọn các danh hiệu đề cử được hiển thị công khai trên website. Để thêm/sửa/xóa kỷ lục, vui lòng thao tác tại mục Catalog Kỷ lục.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/admin/records"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] hover:bg-[var(--admin-border)]/40 transition cursor-pointer"
            >
              <ExternalLink size={14} /> Quản lý tại Catalog
            </a>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-500">
              Đã chọn: {selectedSet.size} / {records.length}
            </div>
          </div>
        </div>

        {/* Search, Filter & Quick Select */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm danh mục theo tiêu đề, thứ hạng..."
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] pl-10 pr-4 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
              />
            </div>

            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] focus:outline-none"
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
            <button
              type="button"
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] hover:bg-[var(--admin-border)]/40 transition cursor-pointer"
            >
              <CheckSquare size={14} /> Chọn tất cả
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] hover:bg-[var(--admin-border)]/40 transition cursor-pointer"
            >
              <Square size={14} /> Bỏ chọn tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Record Cards Grid with Selection Checkbox */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.length === 0 ? (
          <div className="col-span-full text-center py-12 rounded-2xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] text-gray-400 text-sm">
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
                className={`relative rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer select-none group ${
                  isSelected
                    ? "border-[var(--admin-accent)] bg-[var(--admin-accent)]/5 ring-2 ring-[var(--admin-accent)]/20 shadow-md"
                    : "border-[var(--admin-border)] bg-[var(--admin-surface)] opacity-70 hover:opacity-100 hover:border-gray-500"
                }`}
              >
                <div>
                  {/* Top row: Rank badge + Checkbox */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {item.rank || "HẠNG MỤC KỶ LỤC"}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[var(--admin-accent)] text-white shadow-sm"
                          : "border-2 border-gray-400 bg-transparent text-transparent group-hover:border-[var(--admin-accent)]"
                      }`}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-[var(--admin-title)] line-clamp-2 mb-1">
                    {item.title || "Chưa có tiêu đề"}
                  </h4>
                  {item.subtitle && (
                    <p className="text-xs text-gray-400 italic mb-2 line-clamp-1">
                      {item.subtitle}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 text-xs mb-3">
                    {item.category && (
                      <span className="px-2 py-0.5 rounded bg-[var(--admin-background)] border border-[var(--admin-border)] text-gray-400 text-[11px]">
                        {item.category}
                      </span>
                    )}
                    {item.cycle && (
                      <span className="px-2 py-0.5 rounded bg-[var(--admin-background)] border border-[var(--admin-border)] text-gray-400 text-[11px]">
                        {item.cycle}
                      </span>
                    )}
                  </div>

                  {item.criteria && item.criteria.length > 0 && (
                    <div className="space-y-1 mb-3 pt-2 border-t border-[var(--admin-border)]">
                      <span className="text-[11px] font-bold uppercase text-[var(--admin-heading)] block">
                        Tiêu chí xét duyệt ({item.criteria.length}):
                      </span>
                      <ul className="text-xs text-gray-400 space-y-1 line-clamp-2">
                        {item.criteria.slice(0, 2).map((c, i) => (
                          <li key={i} className="truncate text-[11px]">
                            • {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[var(--admin-border)] flex items-center justify-between text-[11px] text-gray-400">
                  <span className="truncate">Nộp: {item.action?.nomination || "Đề cử"}</span>
                  <span
                    className={`font-semibold ${
                      isSelected ? "text-emerald-400" : "text-gray-500"
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
