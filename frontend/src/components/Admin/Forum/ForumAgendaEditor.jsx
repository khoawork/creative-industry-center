import React, { useState, useEffect } from 'react';
import { Save, Check, Plus, Trash2 } from 'lucide-react';
import { AdminCard, AdminButton, AdminStickySaveBar } from '../Common/index.js';

export default function ForumAgendaEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    tag: initialData?.tag ?? '',
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    certificate_title: initialData?.certificate_title ?? '',
    certificate_subtitle: initialData?.certificate_subtitle ?? '',
    sessions: Array.isArray(initialData?.sessions) ? [...initialData.sessions] : [],
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        tag: initialData.tag ?? '',
        title: initialData.title ?? '',
        description: initialData.description ?? '',
        certificate_title: initialData.certificate_title ?? '',
        certificate_subtitle: initialData.certificate_subtitle ?? '',
        sessions: Array.isArray(initialData.sessions) ? [...initialData.sessions] : [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSessionChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.sessions];
      if (field === 'tags') {
        const tagArr = typeof value === 'string'
          ? value.split(',').map((t) => t.trim()).filter(Boolean)
          : value;
        updated[index] = { ...updated[index], tags: tagArr };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, sessions: updated };
    });
  };

  const handleAddSession = () => {
    setFormData((prev) => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        {
          id: Date.now(),
          session_no: '',
          location: '',
          title: '',
          description: '',
          tags: [],
          accent_color: 'primary',
        },
      ],
    }));
  };

  const handleRemoveSession = (index) => {
    setFormData((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveSuccess(false);
    await onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <form id="forum-agenda-form" onSubmit={handleSubmit} className="space-y-6">
      <AdminCard
        title="Tiêu Đề & Chứng Nhận Tham Dự"
        subtitle="Cấu hình thông tin giới thiệu và thông điệp chứng nhận đại biểu trên khối lịch trình."
        actions={
          <AdminButton
            type="submit"
            form="forum-agenda-form"
            variant="primary"
            icon={saveSuccess ? Check : Save}
            loading={isSaving}
          >
            {saveSuccess ? 'Đã lưu Lịch Trình!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
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
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="Chương trình Nghị sự Toàn diện"
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Tiêu đề chính
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Lịch Trình 4 Phiên Làm Việc Chủ Chốt"
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
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Diễn đàn được thiết kế thành chuỗi..."
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Tiêu đề khối chứng nhận
              </label>
              <input
                type="text"
                name="certificate_title"
                value={formData.certificate_title}
                onChange={handleChange}
                placeholder="Chứng nhận Đại biểu Tham dự"
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
                Đơn vị cấp chứng nhận (Phụ đề)
              </label>
              <input
                type="text"
                name="certificate_subtitle"
                value={formData.certificate_subtitle}
                onChange={handleChange}
                placeholder="Cấp bởi Viện Kỷ lục Việt Nam & WorldKings"
                className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
              />
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard
        title="Danh Sách Các Phiên Làm Việc (Timeline)"
        subtitle="Quản lý chi tiết từng phiên họp, khung giờ, địa điểm tổ chức và các từ khóa."
        actions={
          <AdminButton
            type="button"
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={handleAddSession}
          >
            Thêm Phiên Làm Việc
          </AdminButton>
        }
      >
        <div className="space-y-4">
          {formData.sessions.map((session, index) => (
            <div
              key={session.id || index}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 uppercase">
                    {session.session_no || `Phiên 0${index + 1}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSession(index)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Xóa phiên"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Khung thời gian & Tên phiên
                  </label>
                  <input
                    type="text"
                    value={session.session_no || ''}
                    onChange={(e) => handleSessionChange(index, 'session_no', e.target.value)}
                    placeholder="PHIÊN I • 08:00 – 10:00"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Địa điểm / Hội trường
                  </label>
                  <input
                    type="text"
                    value={session.location || ''}
                    onChange={(e) => handleSessionChange(index, 'location', e.target.value)}
                    placeholder="Hội trường Đại Yến"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tiêu đề phiên
                </label>
                <input
                  type="text"
                  value={session.title || ''}
                  onChange={(e) => handleSessionChange(index, 'title', e.target.value)}
                  placeholder="Phiên Khai Mạc & Báo Cáo Chiến Lược..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Mô tả nội dung phiên
                </label>
                <textarea
                  rows={2}
                  value={session.description || ''}
                  onChange={(e) => handleSessionChange(index, 'description', e.target.value)}
                  placeholder="Báo cáo toàn cảnh về kinh tế kỷ lục..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Từ khóa phân loại (Tags, cách nhau bởi dấu phẩy)
                </label>
                <input
                  type="text"
                  value={Array.isArray(session.tags) ? session.tags.join(', ') : session.tags || ''}
                  onChange={(e) => handleSessionChange(index, 'tags', e.target.value)}
                  placeholder="Khai mạc, Báo cáo thường niên, Toàn thể"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                />
              </div>
            </div>
          ))}

          {formData.sessions.length === 0 && (
            <p className="text-center py-6 text-xs text-slate-500 italic">
              Chưa có phiên làm việc nào. Nhấn &ldquo;Thêm Phiên Làm Việc&rdquo; để bắt đầu.
            </p>
          )}
        </div>
      </AdminCard>

      <AdminStickySaveBar
        form="forum-agenda-form"
        type="submit"
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        buttonText={saveSuccess ? 'Đã lưu Lịch Trình!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        hintMessage="Nhấn lưu để đồng bộ dữ liệu lịch trình ra ngoài website."
      />
    </form>
  );
}
