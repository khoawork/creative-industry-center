import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
  Check,
  X,
  AlertTriangle,
  FileDown,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { RecordAPI } from '../../../api/recordsApi.js';

export default function RecordTableManager() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal Thêm / Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    rank: '',
    title: '',
    subtitle: '',
    category: '',
    cycle: '',
    icon: 'flare',
    criteria: [''],
    action: {
      nomination: 'Đề Cử / Nộp Hồ Sơ',
      download: 'QuyChe_DeCuKyLuc.pdf',
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  // Modal Xóa
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRecords = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await RecordAPI.getRecords();
      const items = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setRecords(items);
      if (isManual) showToast('Đã làm mới danh sách kỷ lục!');
    } catch (error) {
      console.error('Lỗi khi tải kỷ lục:', error);
      showToast('Không thể kết nối API Kỷ lục.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Danh sách categories động
  const categoriesList = useMemo(() => {
    const cats = new Set();
    records.forEach((r) => {
      if (r.category) cats.add(r.category);
    });
    return Array.from(cats);
  }, [records]);

  // Lọc dữ liệu
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchesCategory =
        categoryFilter === 'ALL' || rec.category === categoryFilter;
      if (!matchesCategory) return false;

      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (rec.title && rec.title.toLowerCase().includes(q)) ||
        (rec.rank && rec.rank.toLowerCase().includes(q)) ||
        (rec.category && rec.category.toLowerCase().includes(q)) ||
        (rec.subtitle && rec.subtitle.toLowerCase().includes(q))
      );
    });
  }, [records, searchQuery, categoryFilter]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: '',
      rank: '',
      title: '',
      subtitle: '',
      category: '',
      cycle: 'Chu kỳ: Thường niên',
      icon: 'flare',
      criteria: [''],
      action: {
        nomination: 'Đề Cử / Nộp Hồ Sơ',
        download: 'QuyChe_DeCuKyLuc.pdf',
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      id: item.id || '',
      rank: item.rank || '',
      title: item.title || '',
      subtitle: item.subtitle || '',
      category: item.category || '',
      cycle: item.cycle || '',
      icon: item.icon || 'flare',
      criteria:
        Array.isArray(item.criteria) && item.criteria.length
          ? [...item.criteria]
          : [''],
      action: item.action
        ? { ...item.action }
        : {
            nomination: 'Đề Cử / Nộp Hồ Sơ',
            download: 'QuyChe_DeCuKyLuc.pdf',
          },
    });
    setIsModalOpen(true);
  };

  const handleAddCriteria = () => {
    setFormData((prev) => ({
      ...prev,
      criteria: [...prev.criteria, ''],
    }));
  };

  const handleCriteriaChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.criteria];
      updated[index] = value;
      return { ...prev, criteria: updated };
    });
  };

  const handleRemoveCriteria = (index) => {
    setFormData((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Vui lòng nhập tên đề cử kỷ lục.', 'error');
      return;
    }

    setIsSaving(true);
    const cleanCriteria = formData.criteria.filter((c) => c && c.trim() !== '');

    const payload = {
      ...formData,
      criteria: cleanCriteria.length ? cleanCriteria : ['Tiêu chí đạt chuẩn Viện Kỷ lục'],
    };

    try {
      if (editingItem) {
        await RecordAPI.updateRecord(editingItem.id, payload);
        showToast(`Đã cập nhật kỷ lục "${payload.title}"!`);
      } else {
        // Tạo ID mới nếu chưa có
        if (!payload.id) {
          payload.id = String(Date.now());
        }
        await RecordAPI.createRecord(payload);
        showToast(`Đã thêm kỷ lục "${payload.title}"!`);
      }
      setIsModalOpen(false);
      await fetchRecords();
    } catch (error) {
      console.error('Lỗi khi lưu kỷ lục:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi lưu kỷ lục.';
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);

    try {
      await RecordAPI.deleteRecord(deletingItem.id);
      showToast(`Đã xóa kỷ lục "${deletingItem.title}"!`);
      setDeletingItem(null);
      await fetchRecords();
    } catch (error) {
      console.error('Lỗi khi xóa kỷ lục:', error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi xóa kỷ lục.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 shadow-lg animate-bounce">
          {toast.type === 'error' ? (
            <AlertTriangle className="size-5 text-red-500 shrink-0" />
          ) : (
            <Check className="size-5 text-emerald-500 shrink-0" />
          )}
          <span className="text-sm font-medium text-[var(--admin-title)]">
            {toast.message}
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 rounded-xl shadow-[var(--admin-panel-shadow)]">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, thứ hạng, nhóm đối tượng..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] focus:outline-2 focus:outline-[var(--admin-accent)]"
            />
          </div>

          {categoriesList.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] focus:outline-none"
            >
              <option value="ALL">Tất cả nhóm ({records.length})</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchRecords(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-heading)] hover:bg-[var(--admin-background)] transition cursor-pointer"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Làm mới
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[var(--admin-accent)] text-white hover:opacity-90 transition cursor-pointer shadow-xs"
          >
            <Plus size={14} />
            Thêm Kỷ Lục
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="border border-[var(--admin-border)] bg-[var(--admin-surface)] rounded-xl shadow-[var(--admin-panel-shadow)] overflow-hidden">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <RefreshCw className="size-8 animate-spin text-[var(--admin-heading)]" />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <Trophy className="mx-auto size-12 text-gray-300" strokeWidth={1.5} />
            <p className="mt-2 text-sm font-semibold">Chưa có kỷ lục nào phù hợp</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-background)]/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="w-48 px-4 py-3">Thứ hạng / Danh hiệu</th>
                  <th className="px-4 py-3">Tiêu đề đề cử</th>
                  <th className="px-4 py-3">Nhóm đối tượng</th>
                  <th className="w-36 px-4 py-3">Chu kỳ xét duyệt</th>
                  <th className="px-4 py-3">Tiêu chí</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--admin-border)]">
                {filteredRecords.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--admin-background)]/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-500 uppercase">
                        {item.rank || 'CHƯA PHÂN HẠNG'}
                      </span>
                      {item.subtitle && (
                        <div className="text-[11px] text-gray-400 mt-1 line-clamp-1 italic">
                          {item.subtitle}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--admin-title)]">
                      <div className="truncate max-w-xs">{item.title}</div>
                      <div className="text-xs text-gray-400 font-normal flex items-center gap-1.5 mt-0.5">
                        <span>Icon: {item.icon || 'flare'}</span>
                        <span>•</span>
                        <span>Nộp: {item.action?.nomination || 'Đề cử'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-md border border-[var(--admin-border)] bg-[var(--admin-background)] px-2.5 py-1 text-xs font-medium text-gray-300">
                        {item.category || 'Chung'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {item.cycle || 'Thường niên'}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      {item.criteria && item.criteria.length > 0 ? (
                        <span className="text-xs text-gray-400 line-clamp-2">
                          {item.criteria[0]}
                          {item.criteria.length > 1 && ` (+${item.criteria.length - 1} tiêu chí)`}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Chưa có tiêu chí</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-heading)] hover:bg-[var(--admin-background)] transition cursor-pointer"
                        >
                          <Pencil size={13} className="inline mr-1" />
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(item)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                        >
                          <Trash2 size={13} className="inline mr-1" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
              <h3 className="text-base font-bold text-[var(--admin-title)]">
                {editingItem ? 'Chỉnh sửa Kỷ Lục' : 'Thêm Mới Kỷ Lục'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Thứ hạng / Danh hiệu (Rank) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                    placeholder="VD: HẠNG MỤC TỐI CAO, HUY CHƯƠNG VÀNG..."
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Icon biểu tượng
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="VD: flare, trophy, handyman, military_tech"
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Tên hạng mục đề cử (Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Kỷ Lục Đỉnh Cao Sáng Nghiệp Việt Nam"
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Phụ đề / Hiện vật vinh danh (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="VD: Biểu tượng ngọn hải đăng bằng đồng mạ vàng"
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Nhóm đối tượng (Category)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="VD: Doanh nhân & Nhà sáng lập"
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase text-[var(--admin-heading)]">
                    Chu kỳ trao tặng (Cycle)
                  </label>
                  <input
                    type="text"
                    value={formData.cycle}
                    onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
                    placeholder="VD: Chu kỳ: Thường niên (Tháng 12)"
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                  />
                </div>
              </div>

              {/* Action buttons config */}
              <div className="p-4 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)] space-y-3">
                <span className="text-xs font-bold uppercase text-[var(--admin-heading)] block">
                  Cấu hình nút hành động (Actions)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 mb-1 block">
                      Tên nút Nộp hồ sơ
                    </label>
                    <input
                      type="text"
                      value={formData.action?.nomination || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          action: {
                            ...formData.action,
                            nomination: e.target.value,
                          },
                        })
                      }
                      placeholder="VD: Đề Cử / Nộp Hồ Sơ"
                      className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 mb-1 block">
                      Tệp quy chế tải về (Download file)
                    </label>
                    <input
                      type="text"
                      value={formData.action?.download || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          action: {
                            ...formData.action,
                            download: e.target.value,
                          },
                        })
                      }
                      placeholder="VD: QuyChe_HaiDangSangNghiep_2025.pdf"
                      className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)]"
                    />
                  </div>
                </div>
              </div>

              {/* Criteria List */}
              <div className="p-4 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[var(--admin-heading)]">
                    Tiêu chí xét duyệt cốt lõi (Criteria)
                  </span>
                  <button
                    type="button"
                    onClick={handleAddCriteria}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-[var(--admin-accent)]/10 text-[var(--admin-heading)] hover:bg-[var(--admin-accent)]/20 transition cursor-pointer"
                  >
                    <Plus size={13} /> Thêm tiêu chí
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.criteria.map((crit, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-bold">{cIdx + 1}.</span>
                      <input
                        type="text"
                        value={crit}
                        onChange={(e) => handleCriteriaChange(cIdx, e.target.value)}
                        placeholder={`Nội dung tiêu chí ${cIdx + 1}...`}
                        className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)] flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCriteria(cIdx)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                        title="Xóa tiêu chí"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--admin-border)] hover:bg-[var(--admin-background)] transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg bg-[var(--admin-accent)] text-white hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                >
                  <Check size={14} />
                  {isSaving ? 'Đang lưu...' : editingItem ? 'Lưu thay đổi' : 'Tạo kỷ lục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xóa */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm border border-[var(--admin-border)] bg-[var(--admin-surface)] rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-[var(--admin-title)] mb-2">
              Xác nhận xóa kỷ lục
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Bạn có chắc chắn muốn xóa kỷ lục{' '}
              <strong className="text-[var(--admin-title)]">
                "{deletingItem.title}"
              </strong>{' '}
              ? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--admin-border)] hover:bg-[var(--admin-background)] transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa kỷ lục'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
