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
import { AdminCard, AdminButton, AdminBadge, AdminStickySaveBar } from '../Common/index.js';

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
      <AdminCard
        title="Chọn lọc Khóa Đào tạo Hiển thị ngoài Website"
        subtitle="Dữ liệu nạp trực tiếp từ cơ sở dữ liệu khóa đào tạo. Tích chọn các khóa học bạn muốn giới thiệu trên trang công khai."
        actions={
          <div className="flex items-center gap-2">
            <AdminBadge variant="emerald">
              Đã chọn: {selectedIds.length} / {allTrainings.length} khóa
            </AdminBadge>
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchTrainings}
            >
              Làm mới
            </AdminButton>
            <AdminButton
              type="button"
              variant="primary"
              size="sm"
              icon={saveSuccess ? Check : Save}
              loading={isSaving}
              onClick={handleSave}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu danh sách hiển thị'}
            </AdminButton>
          </div>
        }
      >
        {/* Thanh tìm kiếm & Nút thao tác nhanh */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--admin-body)/50"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo mã khóa học, tên chuyên đề, chứng chỉ..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs text-(--admin-title) placeholder:text-(--admin-body)/40 focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
          <p className="text-xs text-(--admin-body)/60">
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
                    : 'border-(--admin-border) bg-(--admin-background) opacity-70 hover:opacity-100 hover:border-(--admin-border-hover)'
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
                          <Square size={18} className="text-(--admin-body)/40" />
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
                          : 'bg-gray-500/10 text-(--admin-body)/50'
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
                  <p className="text-xs text-(--admin-body)/70 leading-relaxed line-clamp-3 mb-3">
                    {desc}
                  </p>
                </div>

                {/* Footer thẻ: Chứng chỉ & Thời lượng */}
                <div className="pt-3 border-t border-(--admin-border) space-y-1.5 text-[11px]">
                  {tr.certificate && (
                    <div className="flex items-center gap-1.5 text-amber-600 font-medium truncate">
                      <Award size={13} className="shrink-0" />
                      <span className="truncate">{tr.certificate}</span>
                    </div>
                  )}

                  {highlight && (
                    <div className="text-(--admin-body)/60 truncate">
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
      <AdminStickySaveBar
        type="button"
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        successMessage="Đã lưu thành công!"
        hintMessage={`Đã chọn ${selectedIds.length} khóa đào tạo để hiển thị trên trang chủ & trang Hợp tác & Đào tạo.`}
        buttonText="Lưu danh sách hiển thị"
        onSave={handleSave}
      />
    </div>
  );
}
