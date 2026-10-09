import React, { useState, useEffect } from 'react';
import { Save, Check, Plus, Trash2, User } from 'lucide-react';
import { AdminCard, AdminButton, AdminStickySaveBar } from '../Common/index.js';
import ForumImageUploadField from './ForumImageUploadField.jsx';

export default function ForumSpeakersEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    tag: initialData?.tag ?? '',
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    speakers: Array.isArray(initialData?.speakers) ? [...initialData.speakers] : [],
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        tag: initialData.tag ?? '',
        title: initialData.title ?? '',
        description: initialData.description ?? '',
        speakers: Array.isArray(initialData.speakers) ? [...initialData.speakers] : [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpeakerChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.speakers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, speakers: updated };
    });
  };

  const handleAddSpeaker = () => {
    setFormData((prev) => ({
      ...prev,
      speakers: [
        ...prev.speakers,
        {
          id: Date.now(),
          name: '',
          role: '',
          topic: '',
          image: '',
          icon: 'school',
        },
      ],
    }));
  };

  const handleRemoveSpeaker = (index) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, idx) => idx !== index),
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
    <form id="forum-speakers-form" onSubmit={handleSubmit} className="space-y-6">
      <AdminCard
        title="Tiêu Đề & Giới Thiệu Hội Đồng Diễn Giả"
        subtitle="Cấu hình tiêu đề và mô tả của khối diễn giả thượng đỉnh."
        actions={
          <AdminButton
            type="submit"
            form="forum-speakers-form"
            variant="primary"
            icon={saveSuccess ? Check : Save}
            loading={isSaving}
          >
            {saveSuccess ? 'Đã lưu Diễn Giả!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
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
                placeholder="Hội đồng Diễn giả Thượng đỉnh"
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
                placeholder="Những Bộ Óc Chiến Lược & Chuyên Gia Cố Vấn"
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
              placeholder="Lắng nghe phân tích chuyên sâu..."
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard
        title="Danh Sách Diễn Giả & Chuyên Gia"
        subtitle="Quản lý thông tin từng diễn giả bao gồm họ tên, chức danh, chủ đề phát biểu và ảnh đại diện."
        actions={
          <AdminButton
            type="button"
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={handleAddSpeaker}
          >
            Thêm Diễn Giả
          </AdminButton>
        }
      >
        <div className="space-y-4">
          {formData.speakers.map((speaker, index) => (
            <div
              key={speaker.id || index}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-300 bg-slate-200 shrink-0">
                    {speaker.image ? (
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase block">
                      {speaker.name || `Diễn giả 0${index + 1}`}
                    </span>
                    <span className="text-[11px] text-slate-500 line-clamp-1">
                      {speaker.role || 'Chưa thiết lập chức vụ'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSpeaker(index)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Xóa diễn giả"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Họ và tên diễn giả
                  </label>
                  <input
                    type="text"
                    value={speaker.name || ''}
                    onChange={(e) => handleSpeakerChange(index, 'name', e.target.value)}
                    placeholder="GS.TS. NGUYỄN VĂN AN"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Học hàm / Chức vụ / Đơn vị
                  </label>
                  <input
                    type="text"
                    value={speaker.role || ''}
                    onChange={(e) => handleSpeakerChange(index, 'role', e.target.value)}
                    placeholder="Chuyên gia Kinh tế trưởng, Viện Nghiên cứu..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Chủ đề tham luận / Câu nói trọng tâm
                </label>
                <input
                  type="text"
                  value={speaker.topic || ''}
                  onChange={(e) => handleSpeakerChange(index, 'topic', e.target.value)}
                  placeholder="“Khai phóng tiềm năng tài sản vô hình...”"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                />
              </div>

              <ForumImageUploadField
                label="Ảnh đại diện diễn giả"
                folder="forum/speakers"
                value={speaker.image || ''}
                onChange={(value) => handleSpeakerChange(index, 'image', value)}
              />
            </div>
          ))}

          {formData.speakers.length === 0 && (
            <p className="text-center py-6 text-xs text-slate-500 italic">
              Chưa có diễn giả nào. Nhấn &ldquo;Thêm Diễn Giả&rdquo; để bắt đầu.
            </p>
          )}
        </div>
      </AdminCard>

      <AdminStickySaveBar
        form="forum-speakers-form"
        type="submit"
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        buttonText={saveSuccess ? 'Đã lưu Diễn Giả!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        hintMessage="Nhấn lưu để đồng bộ dữ liệu diễn giả ra ngoài website."
      />
    </form>
  );
}
