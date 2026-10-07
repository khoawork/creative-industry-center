import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  Search,
  Filter,
  Save,
  Check,
  RefreshCw,
  FolderKanban,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ProjectAPI } from '../../../api/projectApi.js';

export default function ProjectSelector({ initialSelectedIds = [], onSave, isSaving }) {
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(
    Array.isArray(initialSelectedIds) ? initialSelectedIds.map(Number) : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Nạp danh sách tất cả dự án từ cơ sở dữ liệu
  const fetchProjects = () => {
    setLoading(true);
    ProjectAPI.getProjects()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setAllProjects(list);
        // Nếu ban đầu chưa có cấu hình selectedIds trong database, mặc định chọn tất cả
        if ((!initialSelectedIds || initialSelectedIds.length === 0) && list.length > 0) {
          setSelectedIds(list.map((p) => Number(p.id)));
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách dự án:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Cập nhật lại khi initialSelectedIds thay đổi
  useEffect(() => {
    if (Array.isArray(initialSelectedIds) && initialSelectedIds.length > 0) {
      setSelectedIds(initialSelectedIds.map(Number));
    }
  }, [initialSelectedIds]);

  // Danh sách các danh mục độc nhất
  const categories = useMemo(() => {
    const set = new Set();
    allProjects.forEach((p) => {
      const catName = p.category?.name || p.categoryTag;
      if (catName) set.add(catName);
    });
    return Array.from(set);
  }, [allProjects]);

  // Lọc theo từ khóa tìm kiếm và danh mục
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchSearch =
        !searchTerm.trim() ||
        (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.slogan && p.slogan.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' ||
        p.category?.name === selectedCategory ||
        p.categoryTag === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [allProjects, searchTerm, selectedCategory]);

  const isSelected = (id) => selectedIds.includes(Number(id));

  const toggleProject = (id) => {
    const numId = Number(id);
    setSelectedIds((prev) =>
      prev.includes(numId) ? prev.filter((item) => item !== numId) : [...prev, numId]
    );
  };

  const handleSelectAll = () => {
    const allIds = allProjects.map((p) => Number(p.id));
    setSelectedIds(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaveSuccess(false);
    await onSave(selectedIds);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center p-6 rounded-xl border border-(--admin-border) bg-(--admin-surface)">
        <div className="flex items-center gap-3 text-sm text-(--admin-heading)">
          <RefreshCw className="animate-spin text-(--admin-accent)" size={18} />
          <span>Đang nạp danh sách dự án từ cơ sở dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Thanh công cụ quản lý lựa chọn */}
      <div className="p-6 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--admin-border) pb-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="text-(--admin-accent)" size={20} />
            <div>
              <h3 className="text-base font-bold text-(--admin-title)">
                Chọn các dự án hiển thị trên trang người dùng
              </h3>
              <p className="text-xs text-(--admin-heading) mt-0.5">
                Chỉ những dự án được tích chọn sẽ xuất hiện tại danh mục dự án nổi bật ngoài trang chủ/public.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-(--admin-accent)/10 text-(--admin-title) border border-(--admin-accent)/20">
              Đã chọn: <strong className="text-(--admin-accent)">{selectedIds.length}</strong> / {allProjects.length} dự án
            </span>
          </div>
        </div>

        {/* Bộ lọc tìm kiếm & Phân loại */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          <div className="flex flex-1 items-center gap-2">
            {/* Input Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm dự án theo tên, tiêu đề, khẩu hiệu..."
                className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs text-(--admin-title) focus:outline-none focus:border-(--admin-accent) cursor-pointer"
                >
                  <option value="all">Tất cả danh mục ({allProjects.length})</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs font-semibold text-(--admin-title) hover:bg-gray-100 transition cursor-pointer"
            >
              <CheckSquare size={14} className="text-(--admin-accent)" />
              Chọn tất cả
            </button>

            <button
              type="button"
              onClick={handleDeselectAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              <Square size={14} />
              Bỏ chọn tất cả
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--admin-accent) text-white font-semibold text-xs hover:opacity-90 disabled:opacity-50 transition shadow-sm cursor-pointer ml-2"
            >
              <Save size={14} />
              {isSaving ? 'Đang lưu...' : 'Lưu danh sách'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid danh sách các dự án để chọn */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-(--admin-border) bg-(--admin-surface)">
          <p className="text-sm text-gray-500">
            Không tìm thấy dự án nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const checked = isSelected(project.id);
            const imageSrc =
              project.image ||
              project.project_info?.image;
            const categoryName = project.category?.name || project.categoryTag || 'Dự án';

            return (
              <div
                key={project.id}
                onClick={() => toggleProject(project.id)}
                className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all cursor-pointer select-none ${
                  checked
                    ? 'border-(--admin-accent) bg-(--admin-surface) shadow-sm ring-2 ring-(--admin-accent)/20'
                    : 'border-(--admin-border) bg-(--admin-background) opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  {/* Header card: Checkbox + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`size-5 rounded flex items-center justify-center transition-colors ${
                          checked
                            ? 'bg-(--admin-accent) text-white'
                            : 'border border-gray-400 bg-white'
                        }`}
                      >
                        {checked ? <Check size={14} /> : null}
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-400">
                        #{project.id}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        checked
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {checked ? <Eye size={12} /> : <EyeOff size={12} />}
                      {checked ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </div>

                  {/* Ảnh Thumbnail */}
                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-gray-100">
                    <img
                      src={imageSrc}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                      {categoryName}
                    </span>
                  </div>

                  {/* Thông tin tên & tiêu đề */}
                  <h4 className="text-sm font-bold text-(--admin-title) line-clamp-1 mb-1">
                    {project.name}
                  </h4>
                  <p className="text-xs text-(--admin-heading) font-medium line-clamp-1 mb-2">
                    {project.title}
                  </p>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Footer card */}
                {project.slogan && (
                  <div className="mt-3 pt-2.5 border-t border-(--admin-border) text-[11px] text-gray-400 truncate">
                    <span className="font-semibold text-gray-600">{project.slogan}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Save Notification Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-sm">
        <div className="flex items-center gap-2">
          {saveSuccess ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <CheckCircle2 size={16} /> Đã cập nhật danh sách hiển thị thành công!
            </span>
          ) : (
            <span className="text-xs text-gray-500">
              Nhấn <strong>"Lưu danh sách hiển thị"</strong> để áp dụng thay đổi ra ngoài trang công khai.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-(--admin-accent) text-white font-semibold text-xs hover:opacity-90 disabled:opacity-50 transition shadow-sm cursor-pointer"
        >
          <Save size={15} />
          {isSaving ? 'Đang lưu...' : 'Lưu danh sách hiển thị'}
        </button>
      </div>
    </div>
  );
}
