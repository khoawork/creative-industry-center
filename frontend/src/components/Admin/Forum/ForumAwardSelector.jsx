import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  Search,
  Save,
  Check,
  RefreshCw,
  Trophy,
  Calendar,
} from 'lucide-react';
import { AwardAPI } from '../../../api/awardApi.js';
import { AdminCard, AdminButton, AdminBadge } from '../Common/index.js';

export default function ForumAwardSelector({ initialData, onSave, isSaving }) {
  const [allAwards, setAllAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(
    Array.isArray(initialData?.award_ids) ? [...initialData.award_ids] : []
  );
  const [sectionInfo, setSectionInfo] = useState({
    tag: initialData?.tag ?? '',
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Nạp toàn bộ giải thưởng từ cơ sở dữ liệu (bảng award)
  const fetchAwards = () => {
    setLoading(true);
    AwardAPI.getAwards({ per_page: 100 })
      .then((res) => {
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
        setAllAwards(list);
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách giải thưởng từ DB:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  useEffect(() => {
    if (initialData) {
      if (Array.isArray(initialData.award_ids)) {
        setSelectedIds([...initialData.award_ids]);
      }
      setSectionInfo({
        tag: initialData.tag ?? '',
        title: initialData.title ?? '',
        description: initialData.description ?? '',
      });
    }
  }, [initialData]);

  // Lọc theo từ khóa tìm kiếm
  const filteredAwards = useMemo(() => {
    return allAwards.filter((aw) => {
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      const name = (aw.name || aw.title || '').toLowerCase();
      const desc = (aw.description || aw.criteria || '').toLowerCase();
      const yr = String(aw.year || '').toLowerCase();
      const id = String(aw.id || '').toLowerCase();
      return name.includes(q) || desc.includes(q) || yr.includes(q) || id.includes(q);
    });
  }, [allAwards, searchTerm]);

  // Toggle chọn 1 giải thưởng
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const exists = prev.some((item) => String(item) === String(id));
      if (exists) {
        return prev.filter((item) => String(item) !== String(id));
      } else {
        return [...prev, id];
      }
    });
  };

  // Chọn tất cả
  const handleSelectAll = () => {
    setSelectedIds(allAwards.map((a) => a.id));
  };

  // Bỏ chọn tất cả
  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  // Lưu thông tin khối giải thưởng & danh sách giải thưởng được chọn
  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSaveSuccess(false);
    await onSave({
      tag: sectionInfo.tag,
      title: sectionInfo.title,
      description: sectionInfo.description,
      award_ids: selectedIds,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Tiêu đề khối giải thưởng */}
      <AdminCard
        title="Tiêu Đề & Giới Thiệu Khối Giải Thưởng"
        subtitle="Cấu hình tiêu đề và mô tả của khối giải thưởng trên trang Diễn đàn."
        actions={
          <AdminButton
            type="button"
            variant="primary"
            icon={saveSuccess ? Check : Save}
            loading={isSaving}
            onClick={handleSave}
          >
            {saveSuccess ? 'Đã lưu Giải Thưởng!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </AdminButton>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Nhãn phân loại (Tag)
              </label>
              <input
                type="text"
                value={sectionInfo.tag}
                onChange={(e) => setSectionInfo({ ...sectionInfo, tag: e.target.value })}
                placeholder="Tôn Vinh Tinh Hoa & Thành Tựu"
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Tiêu đề chính
              </label>
              <input
                type="text"
                value={sectionInfo.title}
                onChange={(e) => setSectionInfo({ ...sectionInfo, title: e.target.value })}
                placeholder="Hệ Thống Giải Thưởng Vinh Danh 2026"
                required
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Đoạn văn mô tả tóm tắt
            </label>
            <textarea
              rows={3}
              value={sectionInfo.description}
              onChange={(e) =>
                setSectionInfo({ ...sectionInfo, description: e.target.value })
              }
              placeholder="Biểu tượng danh giá chứng nhận..."
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>
        </div>
      </AdminCard>

      {/* 2. Bộ chọn giải thưởng từ cơ sở dữ liệu */}
      <AdminCard
        title="Chọn Lọc Giải Thưởng Từ Cơ Sở Dữ Liệu (Bảng award)"
        subtitle="Tích chọn các giải thưởng bạn muốn giới thiệu trong khối giải thưởng của Diễn đàn. Nếu không chọn giải thưởng nào, hệ thống sẽ sử dụng 3 hạng mục mặc định."
        actions={
          <div className="flex items-center gap-2">
            <AdminBadge variant="emerald">
              Đã chọn: {selectedIds.length} / {allAwards.length} giải thưởng
            </AdminBadge>
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={fetchAwards}
              loading={loading}
            >
              Làm mới
            </AdminButton>
          </div>
        }
      >
        {/* Thanh tìm kiếm & Phím tắt chọn nhanh */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 mb-5">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-(--admin-body)/50"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên giải thưởng, năm, tiêu chí xét chọn..."
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

        {/* Danh sách thẻ giải thưởng */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Đang tải danh sách giải thưởng từ cơ sở dữ liệu...
          </div>
        ) : filteredAwards.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 italic">
            Không tìm thấy giải thưởng nào phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAwards.map((aw) => {
              const isSelected = selectedIds.some((id) => String(id) === String(aw.id));
              const awardName = aw.name || aw.title || '';
              const awardDesc = aw.description || aw.criteria || aw.props?.description || '';
              const awardYear = aw.year || '';
              const awardImage = aw.image || aw.props?.image;

              return (
                <div
                  key={aw.id}
                  onClick={() => handleToggleSelect(aw.id)}
                  className={`cursor-pointer rounded-xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Header: Checkbox + Year */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckSquare size={18} className="text-amber-600 shrink-0" />
                        ) : (
                          <Square size={18} className="text-slate-400 shrink-0" />
                        )}
                        <span className="text-[11px] font-bold text-slate-500">
                          ID: {aw.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md">
                        <Calendar size={12} />
                        <span>Năm {awardYear}</span>
                      </div>
                    </div>

                    {/* Image & Title */}
                    <div className="flex items-start gap-3 mb-2">
                      {awardImage ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                          <img
                            src={awardImage}
                            alt={awardName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          <Trophy size={20} />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-xs sm:text-sm font-bold uppercase leading-snug line-clamp-2 ${
                            isSelected ? 'text-amber-900' : 'text-slate-800'
                          }`}
                        >
                          {awardName}
                        </h4>
                      </div>
                    </div>

                    {/* Description preview */}
                    {awardDesc && (
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mt-1">
                        {awardDesc}
                      </p>
                    )}
                  </div>

                  {/* Footer status */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold ${
                        isSelected ? 'text-amber-700' : 'text-slate-400'
                      }`}
                    >
                      {isSelected ? '✓ Đang hiển thị' : 'Chưa chọn'}
                    </span>
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
