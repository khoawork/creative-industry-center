import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  X,
  Check,
  HelpCircle,
} from "lucide-react";
import {
  iconList,
  iconMap,
  ICON_CATEGORIES,
  searchIcons,
} from "./iconRegistry.js";
import useAdminTheme from "../../hooks/Admin/useAdminTheme.js";

/**
 * Component Dropdown chọn icon từ thư viện lucide-react
 * Đồng bộ chuẩn xác theo giao diện Sáng / Tối của hệ thống quản trị
 * @param {string} value - Tên icon đang được chọn (vd: "Award", "Calendar")
 * @param {function} onChange - Callback khi chọn icon: (iconName, iconItem) => void
 * @param {string} placeholder - Văn bản hiển thị khi chưa chọn (mặc định: "Chọn biểu tượng...")
 * @param {string} label - Nhãn phía trên dropdown
 * @param {string} error - Thông báo lỗi nếu có
 * @param {string} helperText - Ghi chú hỗ trợ
 * @param {boolean} disabled - Vô hiệu hóa chọn
 * @param {boolean} allowClear - Cho phép bỏ chọn về rỗng (mặc định: true)
 * @param {string} className - Lớp CSS tùy biến cho container
 * @param {'sm' | 'md' | 'lg'} size - Kích thước dropdown (mặc định: 'md')
 */
export default function IconDropdown({
  value,
  onChange,
  placeholder = "Chọn biểu tượng...",
  label,
  error,
  helperText,
  disabled = false,
  allowClear = true,
  className = "",
  size = "md",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Xác định theme sáng / tối thực tế từ context và DOM
  const { theme } = useAdminTheme();
  const [isDark, setIsDark] = useState(theme === "dark");

  useEffect(() => {
    const updateThemeState = () => {
      const closestTheme = containerRef.current?.closest("[data-theme]")?.getAttribute("data-theme");
      const rootTheme = document.documentElement.getAttribute("data-theme");
      const activeIsDark = closestTheme === "dark" || (!closestTheme && (rootTheme === "dark" || theme === "dark"));
      setIsDark(activeIsDark);
    };

    updateThemeState();

    const targetNode = containerRef.current?.closest("[data-theme]") || document.documentElement;
    const observer = new MutationObserver(updateThemeState);
    observer.observe(targetNode, { attributes: true, attributeFilter: ["data-theme", "class"] });

    return () => observer.disconnect();
  }, [theme]);

  // Đóng dropdown khi bấm ra ngoài hoặc nhấn Esc
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus ô tìm kiếm khi mở popup
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
      setActiveCategory("all");
    }
  }, [isOpen]);

  // Lọc icon theo tìm kiếm & danh mục
  const filteredIcons = useMemo(() => {
    return searchIcons(searchQuery, activeCategory);
  }, [searchQuery, activeCategory]);

  // Icon hiện tại đang được chọn
  const selectedItem = value ? iconMap[value] : null;
  const SelectedIconComponent = selectedItem?.icon || null;

  const handleSelect = (item) => {
    if (onChange) {
      onChange(item.name, item);
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange("", null);
    }
  };

  // Kích thước chuẩn
  const sizeClasses = {
    sm: "py-1.5 px-2.5 text-xs",
    md: "py-2.5 px-3.5 text-sm",
    lg: "py-3 px-4 text-base",
  }[size] || "py-2.5 px-3.5 text-sm";

  const iconSize = size === "sm" ? 16 : size === "lg" ? 22 : 18;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Nhãn input */}
      {label && (
        <label className={`block text-xs font-semibold mb-1.5 ${isDark ? "text-(--admin-heading)" : "text-gray-700"}`}>
          {label}
        </label>
      )}

      {/* Nút bấm kích hoạt Dropdown */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2.5 rounded-xl border transition-all duration-150 text-left shadow-2xs cursor-pointer ${sizeClasses} ${
          isDark
            ? "bg-(--admin-surface) text-(--admin-ink) border-(--admin-border) hover:border-(--admin-accent)/70"
            : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
        } ${
          disabled
            ? isDark
              ? "opacity-60 cursor-not-allowed bg-[#181815] border-[#39321f]"
              : "opacity-60 cursor-not-allowed bg-gray-100 border-gray-300"
            : isOpen
            ? isDark
              ? "border-(--admin-accent) ring-2 ring-(--admin-accent)/20"
              : "border-[#710008] ring-2 ring-[#710008]/15"
            : error
            ? "border-red-500 ring-1 ring-red-500/20"
            : ""
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {SelectedIconComponent ? (
            <div className={`p-1.5 rounded-lg shrink-0 flex items-center justify-center ${
              isDark
                ? "bg-(--admin-accent)/15 text-(--admin-accent)"
                : "bg-[#710008]/10 text-[#710008]"
            }`}>
              <SelectedIconComponent size={iconSize} strokeWidth={2} />
            </div>
          ) : (
            <div className={`p-1.5 rounded-lg shrink-0 flex items-center justify-center ${
              isDark ? "bg-(--admin-background) text-gray-500" : "bg-gray-100 text-gray-400"
            }`}>
              <HelpCircle size={iconSize} strokeWidth={1.8} />
            </div>
          )}

          <div className="truncate min-w-0 flex items-baseline gap-2">
            {selectedItem ? (
              <>
                <span className={`font-semibold truncate ${isDark ? "text-(--admin-title)" : "text-gray-900"}`}>
                  {selectedItem.label}
                </span>
                <span className={`text-xs font-mono hidden sm:inline truncate ${isDark ? "text-gray-400" : "text-gray-400"}`}>
                  ({selectedItem.name})
                </span>
              </>
            ) : (
              <span className={`italic ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {placeholder}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-gray-400">
          {allowClear && selectedItem && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
              title="Xóa lựa chọn"
              className={`p-1 rounded-md transition-colors ${
                isDark
                  ? "hover:text-red-400 hover:bg-red-950/40"
                  : "hover:text-red-500 hover:bg-red-50"
              }`}
            >
              <X size={15} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isOpen
                ? isDark
                  ? "rotate-180 text-(--admin-accent)"
                  : "rotate-180 text-[#710008]"
                : "text-gray-400"
            }`}
          />
        </div>
      </button>

      {/* Menu xổ xuống (Dropdown Popover) */}
      {isOpen && (
        <div className={`absolute left-0 right-0 z-50 mt-1.5 p-3 rounded-2xl border transition-colors animate-in fade-in zoom-in-95 duration-150 min-w-[320px] ${
          isDark
            ? "bg-(--admin-surface) border-(--admin-border) text-(--admin-ink) shadow-2xl shadow-black/80"
            : "bg-white border-gray-200 text-gray-800 shadow-xl shadow-black/10"
        }`}>
          {/* Thanh tìm kiếm */}
          <div className="relative mb-2.5">
            <Search
              size={16}
              className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm biểu tượng (vd: award, cúp, lịch, mail)..."
              className={`w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border transition outline-none ${
                isDark
                  ? "border-(--admin-border) bg-(--admin-background) text-(--admin-ink) placeholder-gray-500 focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/20"
                  : "border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-[#710008] focus:bg-white focus:ring-2 focus:ring-[#710008]/15"
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
                  isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Bộ lọc danh mục (Tabs) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-none text-[11px]">
            {ICON_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? isDark
                        ? "bg-(--admin-accent) text-black font-bold shadow-2xs"
                        : "bg-[#710008] text-white shadow-2xs font-semibold"
                      : isDark
                      ? "bg-(--admin-background) text-gray-300 hover:bg-(--admin-border)/40 hover:text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Lưới danh sách icon */}
          <div className={`max-h-60 overflow-y-auto p-1.5 rounded-xl border ${
            isDark
              ? "border-(--admin-border) bg-(--admin-background)/60 [scrollbar-color:rgba(255,255,255,0.2)_transparent]"
              : "border-gray-100 bg-gray-50/70 [scrollbar-color:rgba(0,0,0,0.15)_transparent]"
          }`}>
            {filteredIcons.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-1">
                {filteredIcons.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = value === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleSelect(item)}
                      title={`${item.label} (${item.name})`}
                      className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? "bg-[#710008] text-white border-(--admin-accent) shadow-sm scale-102 ring-1 ring-(--admin-accent)"
                            : "bg-[#710008] text-white border-[#710008] shadow-sm scale-102"
                          : isDark
                          ? "bg-(--admin-surface) border-(--admin-border) text-gray-300 hover:border-(--admin-accent) hover:bg-(--admin-accent)/10 hover:text-(--admin-accent) hover:shadow-2xs"
                          : "bg-white border-gray-200 text-gray-700 hover:border-[#710008] hover:bg-[#710008]/5 hover:text-[#710008] hover:shadow-2xs"
                      }`}
                    >
                      <IconComp size={22} strokeWidth={1.8} className="mb-1" />
                      <span className="text-[10px] leading-tight line-clamp-1 w-full truncate font-medium">
                        {item.label}
                      </span>

                      {isSelected && (
                        <div className={`absolute -top-1 -right-1 size-3.5 rounded-full flex items-center justify-center shadow-xs ${
                          isDark ? "bg-(--admin-accent) text-black" : "bg-amber-400 text-[#710008]"
                        }`}>
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs space-y-2">
                <HelpCircle size={28} className="mx-auto opacity-40" />
                <p>Không tìm thấy biểu tượng phù hợp với "{searchQuery}"</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className={`text-xs font-semibold underline cursor-pointer ${
                    isDark ? "text-(--admin-accent)" : "text-[#710008]"
                  }`}
                >
                  Xóa bộ lọc &amp; xem tất cả
                </button>
              </div>
            )}
          </div>

          {/* Footer thông tin */}
          <div className={`flex items-center justify-between text-[11px] pt-2 px-1 border-t mt-2 ${
            isDark ? "border-(--admin-border) text-gray-400" : "border-gray-100 text-gray-400"
          }`}>
            <span>
              Hiển thị {filteredIcons.length} / {iconList.length} biểu tượng
            </span>
            <span className="text-[10px]">
              Thư viện: Lucide Icons
            </span>
          </div>
        </div>
      )}

      {/* Thông báo lỗi / Ghi chú */}
      {error ? (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className={`mt-1.5 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
