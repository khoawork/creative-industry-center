import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  Search,
  Save,
  Check,
  RefreshCw,
  GraduationCap,
  Eye,
  EyeOff,
  Award,
} from 'lucide-react';
import { TrainingAPI } from '../../../api/trainingApi.js';

export default function TrainingSelector({ initialSelectedIds = [], onSave, isSaving }) {
  const [allTrainings, setAllTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(
    Array.isArray(initialSelectedIds) ? [...initialSelectedIds] : []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Nạp danh sách tất cả khóa học từ cơ sở dữ liệu
  const fetchTrainings = () => {
    setLoading(true);
    TrainingAPI.getTrainings({ per_page: 100 })
      .then((res) => {
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        setAllTrainings(list);
        if ((!initialSelectedIds || initialSelectedIds.length === 0) && list.length > 0) {
          setSelectedIds(list.map((t) => t.id));
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách khóa đào tạo:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    if (Array.isArray(initialSelectedIds) && initialSelectedIds.length > 0) {
      setSelectedIds([...initialSelectedIds]);
    }
  }, [initialSelectedIds]);

  // Lọc theo tìm kiếm từ khóa
  const filteredTrainings = useMemo(() => {
    return allTrainings.filter((tr) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      const name = (tr.name || '').toLowerCase();
      const code = (tr.id || '').toLowerCase();
      const cert = (tr.certificate || '').toLowerCase();
      const desc = (tr.props?.description || '').toLowerCase();
      return name.includes(q) || code.includes(q) || cert.includes(q) || desc.includes(q);
    });
  }, [allTrainings, searchTerm]);

  // Toggle chọn 1 khóa học
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Chọn tất cả
  const handleSelectAll = () => {
    const allIds = allTrainings.map((t) => t.id);
    setSelectedIds(allIds);
  };

  // Bỏ chọn tất cả
  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  // Lưu danh sách khóa học hiển thị
  const handleSave = async () => {
    setSaveSuccess(false);
    await onSave(selectedIds);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Khối giới thiệu & điều khiển bộ chọn */}
      <div className="p-6 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-(--admin-border) pb-4">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="text-(--admin-accent)" size={20} />
              <h3 className="text-base font-bold text-(--admin-title)">
                Chọn lọc Khóa Đào tạo Hiển thị ngoài Website
              </h3>
            </div>
            <p className="text-xs text-(--admin-heading) mt-1">
              Dữ liệu được nạp trực tiếp từ bảng cơ sở dữ liệu khóa đào tạo. Tích chọn các khóa học bạn muốn giới thiệu trên trang công khai.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Eye size={13} />
              Đã chọn: {selectedIds.length} / {allTrainings.length} khóa
            </span>

            <button
              type="button"
              onClick={fetchTrainings}
              className="p-2 text-gray-400 hover:text-(--admin-title) border border-(--admin-border) rounded-lg hover:bg-(--admin-background) transition cursor-pointer"
              title="Làm mới danh sách từ database"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Thanh tìm kiếm & Nút thao tác nhanh */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo mã khóa học, tên chuyên đề, chứng chỉ..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs text-(--admin-title) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs font-medium text-(--admin-title) hover:bg-(--admin-surface) transition cursor-pointer"
            >
              <CheckSquare size={14} className="text-emerald-500" />
              Chọn tất cả
            </button>

            <button
              type="button"
              onClick={handleDeselectAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs font-medium text-(--admin-title) hover:bg-(--admin-surface) transition cursor-pointer"
            >
              <Square size={14} className="text-gray-400" />
              Bỏ chọn tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách các thẻ khóa học */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-(--admin-border) bg-(--admin-surface)">
          <div className="flex items-center gap-2 text-xs text-(--admin-heading)">
            <RefreshCw className="animate-spin text-(--admin-accent)" size={16} />
            <span>Đang nạp dữ liệu khóa đào tạo từ database...</span>
          </div>
        </div>
      ) : filteredTrainings.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-(--admin-border) bg-(--admin-surface)">
          <p className="text-xs text-gray-500">
            Không tìm thấy khóa đào tạo nào phù hợp với bộ lọc hiện tại.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrainings.map((tr) => {
            const isSelected = selectedIds.includes(tr.id);
            const desc = tr.props?.description || 'Chương trình đào tạo chuyên sâu...';
            const highlight = tr.props?.info_highlight || '';

            return (
              <div
                key={tr.id}
                onClick={() => handleToggleSelect(tr.id)}
                className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'border-(--admin-accent) bg-(--admin-surface) shadow-sm ring-1 ring-(--admin-accent)/20'
                    : 'border-(--admin-border) bg-(--admin-background) opacity-70 hover:opacity-100 hover:border-gray-400'
                }`}
              >
                <div>
                  {/* Header thẻ: Checkbox, Mã khóa học & Badge trạng thái */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="shrink-0 text-(--admin-accent)">
                        {isSelected ? (
                          <CheckSquare size={18} className="text-(--admin-accent)" />
                        ) : (
                          <Square size={18} className="text-gray-400" />
                        )}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-500/10 text-(--admin-title)">
                        {tr.id}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-gray-500/10 text-gray-400'
                      }`}
                    >
                      {isSelected ? <Eye size={11} /> : <EyeOff size={11} />}
                      {isSelected ? 'Hiển thị' : 'Đang ẩn'}
                    </span>
                  </div>

                  {/* Tên khóa học */}
                  <h4 className="text-sm font-bold text-(--admin-title) leading-snug mb-2 line-clamp-2">
                    {tr.name}
                  </h4>

                  {/* Mô tả tóm tắt */}
                  <p className="text-xs text-(--admin-heading) leading-relaxed line-clamp-3 mb-3">
                    {desc}
                  </p>
                </div>

                {/* Footer thẻ: Chứng chỉ & Thời lượng */}
                <div className="pt-3 border-t border-(--admin-border)/60 space-y-1.5 text-[11px]">
                  {tr.certificate && (
                    <div className="flex items-center gap-1.5 text-amber-600 font-medium truncate">
                      <Award size={13} className="shrink-0" />
                      <span className="truncate">{tr.certificate}</span>
                    </div>
                  )}

                  {highlight && (
                    <div className="text-gray-400 truncate">
                      {highlight}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Thanh lưu trạng thái cố định phía dưới */}
      <div className="sticky bottom-4 p-4 rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-lg flex items-center justify-between gap-4">
        <div className="text-xs text-(--admin-heading)">
          Đã chọn{' '}
          <span className="font-bold text-(--admin-title)">
            {selectedIds.length}
          </span>{' '}
          khóa đào tạo để hiển thị trên trang chủ &amp; trang Hợp tác &amp; Đào tạo.
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <Check size={16} /> Đã lưu thành công!
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-(--admin-accent) text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition shadow-sm cursor-pointer"
          >
            <Save size={16} />
            {isSaving ? 'Đang lưu...' : 'Lưu danh sách hiển thị'}
          </button>
        </div>
      </div>
    </div>
  );
}
