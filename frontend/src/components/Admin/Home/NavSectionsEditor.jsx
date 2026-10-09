import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  Check,
  X,
  Layers,
  Sparkles,
  Calendar,
  FolderKanban,
  GraduationCap,
  Trophy,
} from 'lucide-react';
import ChildrenIdTableSelector from './ChildrenIdTableSelector.jsx';
import {
  detectTableForNav,
  findItemById,
  fetchTableItems,
} from '../../../services/contentTablesService.js';
import { AdminConfirmModal } from '../Common/index.js';

export default function NavSectionsEditor({
  navSections: navSectionsProp,
  initialData,
  onSaveSection,
  onSave,
  onDeleteSection,
  onDelete,
  pageId,
  isSaving,
}) {
  const navSections = Array.isArray(navSectionsProp)
    ? navSectionsProp
    : Array.isArray(initialData)
    ? initialData
    : [];
  const handleSaveCallback = onSaveSection || onSave;
  const handleDeleteCallback = onDeleteSection || onDelete;

  const [, setContentDataVersion] = useState(0);
  const [editingId, setEditingId] = useState(null); // null, 'new', or number
  const [activeForm, setActiveForm] = useState({
    id: null,
    tag: '',
    title_main: '',
    action_button: { text: '', link: '' },
    children_id: [],
  });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Xóa chuyên mục',
    type: 'danger',
    onConfirm: null,
  });

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all(['events', 'projects', 'trainings', 'awards'].map(fetchTableItems)).then(() => {
      if (isMounted) setContentDataVersion((version) => version + 1);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const startEdit = (nav) => {
    setEditingId(nav.id);
    setActiveForm({
      id: nav.id,
      tag: nav.tag || '',
      title_main: nav.title_main || '',
      action_button: {
        text: nav.action_button?.text || '',
        link: nav.action_button?.link || '',
      },
      children_id: Array.isArray(nav.children_id) ? [...nav.children_id] : [],
    });
    setErrors({});
  };

  const startCreate = (presetKey = 'events') => {
    const template = navSections.find((section) => detectTableForNav(section) === presetKey);
    setEditingId('new');
    setActiveForm({
      id: null,
      tag: template?.tag || '',
      title_main: template?.title_main || '',
      action_button: {
        text: template?.action_button?.text || '',
        link: template?.action_button?.link || '',
      },
      children_id: template?.children_id ? [...template.children_id] : [],
    });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!activeForm.tag.trim()) errs.tag = 'Thẻ chuyên mục là bắt buộc';
    if (!activeForm.title_main.trim()) errs.title_main = 'Tiêu đề chuyên mục là bắt buộc';
    if (!activeForm.action_button.text?.trim() || !activeForm.action_button.link?.trim()) {
      errs.action_button = 'Vui lòng điền đủ tên nút và link liên kết';
    }
    if (!Array.isArray(activeForm.children_id) || activeForm.children_id.length === 0) {
      errs.children_id = 'Vui lòng tích chọn ít nhất 1 mục để hiển thị';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (handleSaveCallback) {
      await handleSaveCallback(activeForm);
    }
    setEditingId(null);
    setStatusMessage('Đã lưu chuyên mục thành công!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Reusable form component for both in-place editing and new creation
  const renderEditorForm = (isNew = false) => (
    <form
      onSubmit={handleSave}
      className="border-2 border-(--admin-accent) bg-(--admin-surface) shadow-lg p-5 sm:p-6 rounded-xl space-y-5 animate-in fade-in duration-200"
    >
      <div className="flex items-center justify-between pb-3 border-b border-(--admin-border)">
        <h3 className="text-sm font-bold text-(--admin-title) flex items-center gap-2">
          <Edit3 size={15} />
          <span>
            {isNew ? 'Tạo mới chuyên mục nổi bật' : `Chỉnh sửa chuyên mục: ${activeForm.title_main || '#' + activeForm.id}`}
          </span>
        </h3>
        <button
          type="button"
          onClick={cancelEdit}
          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
          title="Đóng / Hủy"
        >
          <X size={16} />
        </button>
      </div>

      {/* Chọn mẫu nhanh khi tạo mới */}
      {isNew && (
        <div className="p-3 bg-(--admin-background) rounded-lg border border-(--admin-border) flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" /> Chọn mẫu chuyên mục:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => startCreate('events')}
              className="px-2.5 py-1 text-xs rounded bg-white border border-(--admin-border) hover:border-(--admin-accent) hover:text-(--admin-heading) font-medium cursor-pointer transition flex items-center gap-1"
            >
              <Calendar size={12} /> Sự kiện
            </button>
            <button
              type="button"
              onClick={() => startCreate('projects')}
              className="px-2.5 py-1 text-xs rounded bg-white border border-(--admin-border) hover:border-(--admin-accent) hover:text-(--admin-heading) font-medium cursor-pointer transition flex items-center gap-1"
            >
              <FolderKanban size={12} /> Dự án & Câu chuyện
            </button>
            <button
              type="button"
              onClick={() => startCreate('trainings')}
              className="px-2.5 py-1 text-xs rounded bg-white border border-(--admin-border) hover:border-(--admin-accent) hover:text-(--admin-heading) font-medium cursor-pointer transition flex items-center gap-1"
            >
              <GraduationCap size={12} /> Đào tạo & Hợp tác
            </button>
            <button
              type="button"
              onClick={() => startCreate('awards')}
              className="px-2.5 py-1 text-xs rounded bg-white border border-(--admin-border) hover:border-(--admin-accent) hover:text-(--admin-heading) font-medium cursor-pointer transition flex items-center gap-1"
            >
              <Trophy size={12} /> Giải thưởng
            </button>
          </div>
        </div>
      )}

      {/* Tag & Title inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-(--admin-heading) uppercase tracking-wider mb-1">
            Thẻ chuyên mục (Tag) *
          </label>
          <input
            type="text"
            value={activeForm.tag}
            onChange={(e) => setActiveForm({ ...activeForm, tag: e.target.value })}
            placeholder="VD: HOẠT ĐỘNG & KẾT NỐI"
            className="w-full px-3.5 py-2 text-xs bg-(--admin-background) border border-(--admin-border) rounded-lg outline-none text-(--admin-ink)"
          />
          {errors.tag && <p className="text-red-500 text-xs mt-1">{errors.tag}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-(--admin-heading) uppercase tracking-wider mb-1">
            Tiêu đề chuyên mục *
          </label>
          <input
            type="text"
            value={activeForm.title_main}
            onChange={(e) => setActiveForm({ ...activeForm, title_main: e.target.value })}
            placeholder="VD: Sự Kiện & Diễn Đàn Kỷ Lục Nổi Bật"
            className="w-full px-3.5 py-2 text-xs bg-(--admin-background) border border-(--admin-border) rounded-lg outline-none text-(--admin-ink) font-semibold"
          />
          {errors.title_main && <p className="text-red-500 text-xs mt-1">{errors.title_main}</p>}
        </div>
      </div>

      {/* Nút liên kết */}
      <div className="p-3.5 rounded-lg border border-(--admin-border) bg-(--admin-background) space-y-2">
        <span className="text-[11px] font-bold text-(--admin-heading) uppercase">
          Nút liên kết hành động
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={activeForm.action_button.text}
            onChange={(e) =>
              setActiveForm({
                ...activeForm,
                action_button: { ...activeForm.action_button, text: e.target.value },
              })
            }
            placeholder="Tên nút (VD: Xem tất cả sự kiện)"
            className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
          />
          <input
            type="text"
            value={activeForm.action_button.link}
            onChange={(e) =>
              setActiveForm({
                ...activeForm,
                action_button: { ...activeForm.action_button, link: e.target.value },
              })
            }
            placeholder="Link liên kết (VD: /events)"
            className="w-full px-3 py-1.5 text-xs bg-(--admin-surface) border border-(--admin-border) rounded-md outline-none text-(--admin-ink)"
          />
        </div>
        {errors.action_button && (
          <p className="text-red-500 text-xs mt-1">{errors.action_button}</p>
        )}
      </div>

      {/* Bộ tích chọn nội dung */}
      <div>
        <ChildrenIdTableSelector
          selectedIds={activeForm.children_id}
          onChange={(newIds) => setActiveForm((prev) => ({ ...prev, children_id: newIds }))}
          initialTableKey={detectTableForNav(activeForm)}
          navContext={activeForm}
        />
        {errors.children_id && (
          <p className="text-red-500 text-xs mt-1 font-semibold">{errors.children_id}</p>
        )}
      </div>

      {/* Form buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-(--admin-border)">
        <button
          type="button"
          onClick={cancelEdit}
          className="px-4 py-2 border border-(--admin-border) rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-(--admin-hover) text-(--admin-hover-text) text-xs font-semibold hover:opacity-90 transition cursor-pointer"
        >
          <Save size={14} />
          <span>{isSaving ? 'Đang lưu...' : 'Lưu chuyên mục này'}</span>
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
      />
      {/* Header bar */}
      <div className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 sm:p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-(--admin-heading)" />
            <h2 className="text-base sm:text-lg font-bold text-(--admin-title)">
              Quản lý các Chuyên mục nổi bật
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tùy chỉnh các khối nội dung và bài viết hiển thị trên trang chủ
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => startCreate('events')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-(--admin-accent) text-(--admin-black) text-xs sm:text-sm font-semibold hover:opacity-90 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus size={16} /> Thêm chuyên mục mới
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check size={16} /> {statusMessage}
        </div>
      )}

      {/* Form tạo mới xuất hiện ở đầu khi bấm "Thêm chuyên mục mới" */}
      {editingId === 'new' && (
        <div id="nav-editor-new" className="scroll-mt-6">
          {renderEditorForm(true)}
        </div>
      )}

      {/* Danh sách các chuyên mục hiện có - Mở chỉnh sửa TẠI CHỖ (In-place) */}
      <div className="space-y-4">
        {navSections.map((nav, index) => {
          const isEditingThis = editingId === nav.id;

          // Nếu đang chỉnh sửa nav này, hiển thị form trực tiếp TẠI ĐÂY (không nhảy lên đầu)
          if (isEditingThis) {
            return (
              <div key={nav.id || index} id={`nav-editor-${nav.id}`} className="scroll-mt-6">
                {renderEditorForm(false)}
              </div>
            );
          }

          const tableKey = detectTableForNav(nav);

          return (
            <div
              key={nav.id || index}
              id={`nav-card-${nav.id}`}
              className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-4 transition hover:border-(--admin-accent)/60"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    #{nav.id}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-(--admin-heading)">
                    {nav.tag}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-(--admin-title)">
                  {nav.title_main}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                  <span>
                    Nút bấm: <strong className="text-gray-800">{nav.action_button?.text}</strong>{' '}
                    <code className="text-[11px] bg-(--admin-background) px-1 rounded">
                      {nav.action_button?.link}
                    </code>
                  </span>
                </div>

                {/* Danh sách bài/nội dung hiển thị */}
                <div className="pt-1">
                  <div className="text-[11px] text-gray-500 font-medium mb-1.5 flex items-center gap-1.5">
                    <span>
                      Đang hiển thị {nav.children_id?.length || 0} mục:
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {Array.isArray(nav.children_id) && nav.children_id.length > 0 ? (
                      nav.children_id.map((cid) => {
                        const item = findItemById(cid, tableKey);
                        return (
                          <span
                            key={cid}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-(--admin-background) text-[11px] text-(--admin-ink) border border-(--admin-border)"
                            title={item.name}
                          >
                            <span className="font-mono font-bold text-(--admin-heading)">
                              #{cid}
                            </span>
                            <span className="max-w-[200px] truncate font-medium">
                              {item.name}
                            </span>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-red-500 italic">
                        (Chưa có mục nào được tích chọn)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Nút Chỉnh sửa & Xóa */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-1">
                <button
                  type="button"
                  onClick={() => startEdit(nav)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--admin-border) text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) cursor-pointer"
                >
                  <Edit3 size={14} /> Chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal({
                      isOpen: true,
                      title: 'Xác nhận xóa chuyên mục',
                      message: `Bạn có chắc chắn muốn xóa chuyên mục "${nav.title_main}" khỏi trang chủ không?`,
                      confirmText: 'Xóa chuyên mục',
                      type: 'danger',
                      onConfirm: () => {
                        closeConfirmModal();
                        onDeleteSection(nav.id);
                      },
                    });
                    if (confirm(`Bạn có chắc muốn xóa chuyên mục "${nav.title_main}"?`)) {
                      if (handleDeleteCallback) {
                        handleDeleteCallback(nav.id);
                      }
                    }
                  }}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
                  title="Xóa chuyên mục"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {navSections.length === 0 && (
          <div className="p-8 border border-dashed border-(--admin-border) rounded-xl text-center text-gray-400 text-sm">
            Chưa có chuyên mục nào. Hãy bấm "Thêm chuyên mục mới" ở trên để tạo.
          </div>
        )}
      </div>
    </div>
  );
}
