import { useEffect, useRef, useState } from 'react';
import { Trash2, Edit3, Plus, ArrowLeft, RefreshCw, Tag, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { EventAPI, requireEventData, eventError } from '../../../api/eventApi.js';
import { adminButton, adminPanel, adminPrimaryButton } from '../../../config/Admin/adminEvents.js';
import { AdminCard, AdminButton, AdminToast } from '../Common/index.js';

export default function EventCategories({ onChanged, onBackToEvents }) {
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleting, setDeleting] = useState(null);
  const busy = useRef(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    Promise.all([
      EventAPI.getCategories({ signal: controller.signal }),
      EventAPI.getEvents({ signal: controller.signal }),
    ])
      .then(([catRes, eventRes]) => {
        if (!controller.signal.aborted) {
          setCategories(requireEventData(catRes, true));
          setEvents(requireEventData(eventRes, true));
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(eventError(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const getEventCount = (categoryId) => {
    return events.filter(
      (e) => String(e.category_id) === String(categoryId) || String(e.category?.id) === String(categoryId)
    ).length;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || busy.current) return;
    busy.current = true;
    setSaving(true);
    setError('');

    try {
      const response = await EventAPI.createCategory({ name: trimmed });
      const created = requireEventData(response);
      if (!created.id) throw new Error('Phản hồi chuyên mục không hợp lệ.');
      setCategories((current) => [...current, created]);
      setName('');
      showToast(`Đã thêm chuyên mục "${trimmed}".`);
      onChanged?.();
    } catch (err) {
      const errMsg = eventError(err);
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const trimmed = editName.trim();
    if (!trimmed || busy.current || !editing) return;
    busy.current = true;
    setSaving(true);
    setError('');

    try {
      const response = await EventAPI.updateCategory(editing, { name: trimmed });
      const updated = requireEventData(response);
      setCategories((current) =>
        current.map((item) => (item.id === editing ? updated : item))
      );
      setEditing(null);
      setEditName('');
      showToast(`Đã cập nhật chuyên mục thành "${trimmed}".`);
      onChanged?.();
    } catch (err) {
      const errMsg = eventError(err);
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (busy.current || deleting === null) return;
    busy.current = true;
    setSaving(true);
    setError('');

    try {
      const response = await EventAPI.deleteCategory(deleting);
      if (response?.success !== true && response?.code !== 200) {
        throw new Error(response?.message || 'Chưa xóa được chuyên mục. Vui lòng thử lại.');
      }
      const targetCategory = categories.find((c) => c.id === deleting);
      setCategories((current) => current.filter((item) => item.id !== deleting));
      setDeleting(null);
      showToast(`Đã xóa chuyên mục "${targetCategory?.name || deleting}".`);
      onChanged?.();
    } catch (err) {
      const errMsg = eventError(err);
      setError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* Card Tiêu đề & Quản lý */}
      <AdminCard
        title="Quản lý Chuyên mục Sự kiện"
        subtitle="Tạo và sắp xếp các nhóm chuyên mục để phân loại sự kiện."
        actions={
          <div className="flex items-center gap-2">
            {onBackToEvents && (
              <button
                type="button"
                onClick={onBackToEvents}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-1.5 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition"
              >
                <ArrowLeft size={14} />
                <span>Quay lại Danh sách Sự kiện</span>
              </button>
            )}
            <button
              type="button"
              disabled={loading || saving}
              onClick={() => {
                setError('');
                setAttempt((v) => v + 1);
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-1.5 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Làm mới</span>
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {error && (
            <div
              role="alert"
              className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Khối danh sách chuyên mục */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-(--admin-heading)">
                Chuyên mục sự kiện ({categories.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex min-h-[140px] items-center justify-center gap-2 text-sm text-gray-500">
                <RefreshCw size={18} className="animate-spin text-(--admin-heading)" />
                <span>Đang tải danh sách chuyên mục…</span>
              </div>
            ) : categories.length === 0 ? (
              <p className="rounded-xl border border-dashed border-(--admin-border) p-6 text-center text-sm text-gray-400">
                Chưa có chuyên mục nào. Hãy nhập tên bên dưới để tạo mới.
              </p>
            ) : (
              <div className="space-y-2.5">
                {categories.map((category) => {
                  const isEditingThis = editing === category.id;
                  const isDeletingThis = deleting === category.id;
                  const eventCount = getEventCount(category.id);

                  if (isEditingThis) {
                    return (
                      <form
                        key={category.id}
                        onSubmit={handleSaveEdit}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl border-2 border-(--admin-accent) bg-(--admin-surface) p-3 shadow-xs"
                      >
                        <input
                          type="text"
                          required
                          maxLength={255}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          disabled={saving}
                          autoFocus
                          placeholder="Nhập tên chuyên mục..."
                          className="flex-1 rounded-lg border border-(--admin-border) bg-(--admin-background) px-3.5 py-2 text-sm font-semibold uppercase text-(--admin-ink) outline-none focus:border-(--admin-accent)"
                        />
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="submit"
                            disabled={saving || !editName.trim() || editName.trim() === category.name}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-(--admin-accent) px-3.5 py-2 text-xs font-bold text-(--admin-black) shadow-xs hover:opacity-90 disabled:opacity-50"
                          >
                            <span>Lưu</span>
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() => {
                              setEditing(null);
                              setEditName('');
                            }}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                          >
                            Hủy
                          </button>
                        </div>
                      </form>
                    );
                  }

                  return (
                    <div
                      key={category.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-3 transition hover:border-(--admin-accent)/70 hover:shadow-2xs"
                    >
                      {/* Tên chuyên mục dạng ô nhập như trong ảnh */}
                      <div className="flex flex-1 items-center gap-3 min-w-0">
                        <span className="flex-1 rounded-lg border border-(--admin-border) bg-(--admin-background) px-3.5 py-2 text-sm font-bold uppercase tracking-wide text-(--admin-title) truncate select-all">
                          {category.name}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium font-mono ${
                            eventCount > 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                          title={`Có ${eventCount} sự kiện thuộc chuyên mục này`}
                        >
                          {eventCount} sự kiện
                        </span>
                      </div>

                      {/* Nút Sửa & Xóa */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => {
                            setEditing(category.id);
                            setEditName(category.name);
                            setDeleting(null);
                            setError('');
                          }}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-1.5 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition"
                        >
                          <Edit3 size={13} />
                          <span>Sửa</span>
                        </button>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => {
                            setDeleting(category.id);
                            setEditing(null);
                            setError('');
                          }}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-transparent hover:border-rose-200 hover:bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition"
                          title={`Xóa chuyên mục ${category.name}`}
                        >
                          <Trash2 size={14} />
                          <span>Xóa</span>
                        </button>
                      </div>

                      {/* Xác nhận xóa */}
                      {isDeletingThis && (
                        <div className="w-full mt-2 pt-2 border-t border-(--admin-border) flex flex-wrap items-center justify-between gap-3 text-xs bg-rose-50/60 p-3 rounded-lg border border-rose-200 animate-in fade-in duration-150">
                          <div>
                            <p className="font-bold text-rose-900">
                              Xác nhận xóa chuyên mục "{category.name}"?
                            </p>
                            {eventCount > 0 && (
                              <p className="text-rose-700 text-[11px] mt-0.5">
                                Cảnh báo: Chuyên mục này đang có {eventCount} sự kiện liên kết. Bạn cần chuyển sự kiện sang chuyên mục khác trước khi xóa.
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={saving || eventCount > 0}
                              onClick={handleRemove}
                              className="inline-flex cursor-pointer items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                            >
                              {saving ? 'Đang xóa…' : 'Xác nhận xóa'}
                            </button>
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => setDeleting(null)}
                              className="inline-flex cursor-pointer items-center px-3 py-1.5 rounded-lg border border-gray-300 bg-white font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form thêm chuyên mục mới như trong ảnh */}
          <div className="pt-2 border-t border-(--admin-border)">
            <label className="block text-xs font-bold uppercase tracking-wider text-(--admin-heading) mb-2">
              Tên chuyên mục mới
            </label>
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                required
                maxLength={255}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                placeholder="Nhập tên chuyên mục sự kiện mới..."
                className="flex-1 rounded-lg border border-(--admin-border) bg-(--admin-background) px-3.5 py-2.5 text-sm text-(--admin-ink) placeholder-gray-400 outline-none focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/20"
              />
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#995960] hover:bg-[#83464d] text-white px-5 py-2.5 text-xs font-bold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Plus size={15} />
                <span>Thêm chuyên mục</span>
              </button>
            </form>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
