import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Check,
  X,
  Plus,
  Layers,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
} from 'lucide-react';
import {
  DEFAULT_TABLE_DATA,
  fetchTableItems,
  findItemById,
  detectTableForNav,
} from '../../../services/contentTablesService.js';

export default function ChildrenIdTableSelector({
  selectedIds = [],
  onChange,
  initialTableKey = null,
  navContext = null,
}) {
  const detectedTableKey = useMemo(() => {
    return detectTableForNav(navContext) || initialTableKey || 'events';
  }, [navContext, initialTableKey]);

  const [tableItemsMap, setTableItemsMap] = useState(DEFAULT_TABLE_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [manualIdInput, setManualIdInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchTableItems(detectedTableKey).then((items) => {
      if (isMounted) {
        setTableItemsMap((prev) => ({
          ...prev,
          [detectedTableKey]: items,
        }));
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [detectedTableKey]);

  const currentItems = tableItemsMap[detectedTableKey] || [];

  // Lọc tìm kiếm
  const filteredItems = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return currentItems;
    return currentItems.filter((item) => {
      const matchName = (item.name || '').toLowerCase().includes(q);
      const matchSub = (item.subtitle || '').toLowerCase().includes(q);
      const matchCat = (item.category || '').toLowerCase().includes(q);
      const matchId = String(item.id).includes(q);
      return matchName || matchSub || matchCat || matchId;
    });
  }, [currentItems, searchTerm]);

  // Toggle chọn / bỏ chọn 1 mục
  const handleToggleItem = (itemId) => {
    const itemIdKey = String(itemId);
    if (selectedIds.some((id) => String(id) === itemIdKey)) {
      onChange(selectedIds.filter((id) => String(id) !== itemIdKey));
    } else {
      onChange([...selectedIds, itemId]);
    }
  };

  // Chọn tất cả các mục đang hiển thị
  const handleSelectAllVisible = () => {
    const merged = new Map(
      [...selectedIds, ...filteredItems.map((item) => item.id)].map((id) => [String(id), id])
    );
    onChange(Array.from(merged.values()));
  };

  // Bỏ chọn tất cả các mục trong bảng này
  const handleDeselectAll = () => {
    const currentTableIds = new Set(currentItems.map((item) => String(item.id)));
    onChange(selectedIds.filter((id) => !currentTableIds.has(String(id))));
  };

  // Gỡ 1 ID
  const handleRemoveId = (idToRemove) => {
    onChange(selectedIds.filter((id) => String(id) !== String(idToRemove)));
  };

  // Nhập ID thủ công
  const handleAddManualId = (e) => {
    if (e) e.preventDefault();
    const value = manualIdInput.trim();
    if (!value) return;
    const itemId = /^\d+$/.test(value) ? Number(value) : value;
    if (!selectedIds.some((id) => String(id) === String(itemId))) {
      onChange([...selectedIds, itemId]);
    }
    setManualIdInput('');
  };

  return (
    <div className="space-y-4 rounded-xl border border-(--admin-border) bg-(--admin-background) p-4">
      {/* 1. Tiêu đề khối & số lượng đã chọn */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-(--admin-border)">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-(--admin-heading)" />
            <span className="text-xs font-bold text-(--admin-title) uppercase tracking-wider">
              Danh sách nội dung hiển thị trong chuyên mục *
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Tích chọn trực tiếp các mục bên dưới để gán hiển thị lên trang chủ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-(--admin-accent)/20 text-(--admin-heading) text-xs font-bold">
            <span>Đã chọn:</span>
            <span className="text-amber-800">{selectedIds.length} mục</span>
          </span>
        </div>
      </div>

      {/* 2. Thanh nhãn các mục đã chọn */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Các mục đang hiển thị ({selectedIds.length}):
          </span>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[11px] text-red-500 hover:text-red-700 hover:underline cursor-pointer"
            >
              Bỏ chọn tất cả
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 min-h-10 p-2.5 rounded-lg bg-(--admin-surface) border border-(--admin-border) items-center">
          {selectedIds.length === 0 ? (
            <div className="text-xs text-gray-400 italic py-1 px-1">
              Chưa có mục nào được chọn. Hãy tích chọn các ô bên dưới.
            </div>
          ) : (
            selectedIds.map((id) => {
              const info = findItemById(id, detectedTableKey);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-(--admin-accent)/25 text-(--admin-ink) border border-(--admin-accent)/50 text-xs font-medium transition hover:shadow-xs"
                >
                  <span className="font-mono font-bold text-(--admin-heading)">#{id}</span>
                  <span className="max-w-[220px] truncate font-semibold" title={info.name}>
                    {info.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveId(id)}
                    className="p-0.5 hover:bg-red-100 hover:text-red-600 rounded text-gray-500 transition cursor-pointer"
                    title={`Bỏ chọn ID #${id}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Thanh tìm kiếm và Thao tác nhanh */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
        {/* Tìm kiếm */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm nội dung theo tên, thể loại, ID..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-lg outline-none text-(--admin-ink) placeholder-gray-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Nút chọn nhanh */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectAllVisible}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-(--admin-surface) hover:bg-emerald-50 border border-(--admin-border) hover:border-emerald-300 text-emerald-700 transition cursor-pointer flex items-center gap-1.5"
            title="Tích chọn tất cả các mục"
          >
            <CheckSquare size={13} />
            <span>Chọn tất cả ({filteredItems.length})</span>
          </button>

          <button
            type="button"
            onClick={handleDeselectAll}
            disabled={selectedIds.length === 0}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
              selectedIds.length > 0
                ? 'bg-(--admin-surface) hover:bg-gray-100 border-(--admin-border) text-gray-700'
                : 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400'
            }`}
            title="Bỏ chọn các mục"
          >
            <Square size={13} />
            <span>Bỏ chọn</span>
          </button>
        </div>
      </div>

      {/* 4. Danh sách các thẻ mục kèm Checkbox */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="text-center py-8 px-4 text-gray-500 text-xs">
            Đang tải dữ liệu từ database...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-lg border border-dashed border-(--admin-border) bg-(--admin-surface)/40 text-gray-500 text-xs">
            {searchTerm ? (
              <span>Không tìm thấy mục nào khớp với "{searchTerm}".</span>
            ) : (
              <span>Chưa có dữ liệu cho chuyên mục này.</span>
            )}
          </div>
        ) : (
          filteredItems.map((item) => {
            const isChecked = selectedIds.some((id) => String(id) === String(item.id));

            return (
              <div
                key={item.id}
                onClick={() => handleToggleItem(item.id)}
                className={`flex items-start gap-3 p-3 rounded-lg border transition cursor-pointer select-none ${
                  isChecked
                    ? 'border-amber-400 bg-amber-50/60 shadow-xs'
                    : 'border-(--admin-border) bg-(--admin-surface) hover:border-gray-300'
                }`}
              >
                {/* Checkbox */}
                <div className="pt-0.5">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition ${
                      isChecked
                        ? 'bg-(--admin-heading) text-white'
                        : 'border border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </div>
                </div>

                {/* Ảnh thumbnail (nếu có) */}
                {item.image && (
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-black/10">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Chi tiết nội dung */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.2 rounded bg-(--admin-background) text-(--admin-heading) border border-(--admin-border)">
                      #{item.id}
                    </span>

                    {item.category && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-gray-100 text-gray-600">
                        {item.category}
                      </span>
                    )}

                    {item.date && (
                      <span className="text-[10px] text-gray-500">
                        📅 {item.date}
                      </span>
                    )}

                    {item.location && (
                      <span className="text-[10px] text-gray-500 truncate max-w-[200px]">
                        📍 {item.location}
                      </span>
                    )}

                    {item.slogan && (
                      <span className="text-[10px] text-amber-700 font-medium">
                        ✨ {item.slogan}
                      </span>
                    )}

                    {item.certificate && (
                      <span className="text-[10px] text-emerald-700 font-medium">
                        🎓 {item.certificate}
                      </span>
                    )}

                    {item.decision && (
                      <span className="text-[10px] text-rose-700 font-mono">
                        📜 {item.decision}
                      </span>
                    )}
                  </div>

                  <h4
                    className={`text-xs font-bold leading-snug ${
                      isChecked ? 'text-(--admin-heading)' : 'text-(--admin-title)'
                    }`}
                  >
                    {item.name}
                  </h4>

                  {item.subtitle && (
                    <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* Trạng thái tích chọn */}
                <div className="shrink-0 pt-0.5">
                  {isChecked ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <Check size={10} /> Hiển thị
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5">
                      Ẩn
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Tùy chọn nhập ID thủ công (thu gọn) */}
      <div className="pt-2 border-t border-(--admin-border)">
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-gray-500 hover:text-(--admin-heading) font-semibold flex items-center gap-1 cursor-pointer"
        >
          {showManualInput ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          <span>Nhập ID số thủ công (Tùy chọn nâng cao)</span>
        </button>

        {showManualInput && (
          <div className="mt-2.5 p-3 rounded-lg bg-(--admin-surface) border border-(--admin-border) space-y-2">
            <p className="text-[11px] text-gray-500">
              Nhập mã ID số của bản ghi tùy chỉnh khác ngoài danh sách:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={manualIdInput}
                onChange={(e) => setManualIdInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddManualId();
                  }
                }}
                placeholder="Nhập ID số (VD: 10, 25, 999...)"
                className="flex-1 px-3 py-1.5 text-xs bg-(--admin-background) border border-(--admin-border) rounded-lg outline-none text-(--admin-ink) font-mono"
              />
              <button
                type="button"
                onClick={handleAddManualId}
                disabled={!manualIdInput.trim()}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-(--admin-heading) text-white disabled:opacity-40 transition cursor-pointer flex items-center gap-1"
              >
                <Plus size={14} /> Thêm ID
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
