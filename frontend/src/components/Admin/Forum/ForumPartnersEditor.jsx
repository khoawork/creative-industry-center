import React, { useState, useEffect } from 'react';
import { Save, Check, Plus, Trash2 } from 'lucide-react';
import { AdminCard, AdminButton, AdminStickySaveBar } from '../Common/index.js';
import ForumImageUploadField from './ForumImageUploadField.jsx';

export default function ForumPartnersEditor({ initialData, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    organizers_tag: initialData?.organizers_tag ?? '',
    organizers: Array.isArray(initialData?.organizers) ? [...initialData.organizers] : [],
    sponsors_tag: initialData?.sponsors_tag ?? '',
    sponsors: Array.isArray(initialData?.sponsors) ? [...initialData.sponsors] : [],
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        organizers_tag: initialData.organizers_tag ?? '',
        organizers: Array.isArray(initialData.organizers) ? [...initialData.organizers] : [],
        sponsors_tag: initialData.sponsors_tag ?? '',
        sponsors: Array.isArray(initialData.sponsors) ? [...initialData.sponsors] : [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Organizers methods
  const handleOrgChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.organizers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, organizers: updated };
    });
  };

  const handleAddOrg = () => {
    setFormData((prev) => ({
      ...prev,
      organizers: [
        ...prev.organizers,
        {
          name: '',
          desc: '',
          tier: '',
          icon: 'stars',
        },
      ],
    }));
  };

  const handleRemoveOrg = (index) => {
    setFormData((prev) => ({
      ...prev,
      organizers: prev.organizers.filter((_, idx) => idx !== index),
    }));
  };

  // Sponsors methods
  const handleSponsorChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.sponsors];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, sponsors: updated };
    });
  };

  const handleAddSponsor = () => {
    setFormData((prev) => ({
      ...prev,
      sponsors: [
        ...prev.sponsors,
        {
          name: '',
          desc: '',
          tier: '',
          icon: 'verified',
        },
      ],
    }));
  };

  const handleRemoveSponsor = (index) => {
    setFormData((prev) => ({
      ...prev,
      sponsors: prev.sponsors.filter((_, idx) => idx !== index),
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
    <form id="forum-partners-form" onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Đơn Vị Chủ Trì & Sáng Lập */}
      <AdminCard
        title="Đơn Vị Chủ Trì & Sáng Lập"
        subtitle="Quản lý các cơ quan, viện nghiên cứu và trung tâm đứng tên tổ chức diễn đàn."
        actions={
          <AdminButton
            type="submit"
            form="forum-partners-form"
            variant="primary"
            icon={saveSuccess ? Check : Save}
            loading={isSaving}
          >
            {saveSuccess ? 'Đã lưu Đối Tác!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </AdminButton>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Nhãn tiêu đề khối chủ trì
            </label>
            <input
              type="text"
              name="organizers_tag"
              value={formData.organizers_tag}
              onChange={handleChange}
              placeholder="Đơn Vị Chủ Trì & Sáng Lập"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Danh sách Đơn vị Chủ trì
              </span>
              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={handleAddOrg}
              >
                Thêm Đơn Vị
              </AdminButton>
            </div>

            {formData.organizers.map((org, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase">
                    {org.name || `Đơn vị 0${index + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOrg(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tên đơn vị
                    </label>
                    <input
                      type="text"
                      value={org.name || ''}
                      onChange={(e) => handleOrgChange(index, 'name', e.target.value)}
                      placeholder="VIỆN KỶ LỤC VIỆT NAM (VIETKINGS)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Vai trò / Danh vị (Tier)
                    </label>
                    <input
                      type="text"
                      value={org.tier || ''}
                      onChange={(e) => handleOrgChange(index, 'tier', e.target.value)}
                      placeholder="Đơn vị Sáng lập"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Mô tả chức năng / vai trò
                  </label>
                  <input
                    type="text"
                    value={org.desc || ''}
                    onChange={(e) => handleOrgChange(index, 'desc', e.target.value)}
                    placeholder="Tổ chức xác lập và quản lý hệ thống kỷ lục..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
                  />
                </div>
                <ForumImageUploadField
                  label="Logo đơn vị chủ trì"
                  folder="forum/partners"
                  value={org.image || ''}
                  onChange={(value) => handleOrgChange(index, 'image', value)}
                />
              </div>
            ))}
          </div>
        </div>
      </AdminCard>

      {/* 2. Đơn Vị Đồng Hành Chiến Lược & Tài Trợ */}
      <AdminCard
        title="Đơn Vị Đồng Hành Chiến Lược & Tài Trợ"
        subtitle="Quản lý danh sách các tập đoàn, doanh nghiệp tài trợ hiển thị trên dải logo đối tác."
        actions={
          <AdminButton
            type="button"
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={handleAddSponsor}
          >
            Thêm Nhà Tài Trợ
          </AdminButton>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-(--admin-heading) mb-1.5">
              Nhãn tiêu đề khối tài trợ
            </label>
            <input
              type="text"
              name="sponsors_tag"
              value={formData.sponsors_tag}
              onChange={handleChange}
              placeholder="Đơn Vị Đồng Hành Chiến Lược & Tài Trợ"
              className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-background) text-xs sm:text-sm text-(--admin-ink) focus:outline-none focus:border-(--admin-accent)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {formData.sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-700 uppercase">
                    #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSponsor(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Tên tập đoàn / thương hiệu
                  </label>
                  <input
                    type="text"
                    value={sponsor.name || ''}
                    onChange={(e) => handleSponsorChange(index, 'name', e.target.value)}
                    placeholder="PETROVIETNAM"
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Hạng mức tài trợ (Kim Cương, Bạch Kim, Vàng, Đồng hành)
                  </label>
                  <input
                    type="text"
                    value={sponsor.tier || ''}
                    onChange={(e) => handleSponsorChange(index, 'tier', e.target.value)}
                    placeholder="Kim Cương"
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Mô tả ngắn
                  </label>
                  <input
                    type="text"
                    value={sponsor.desc || ''}
                    onChange={(e) => handleSponsorChange(index, 'desc', e.target.value)}
                    placeholder="Tập đoàn Năng lượng Quốc gia"
                    className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 bg-white text-xs text-slate-600"
                  />
                </div>
                <ForumImageUploadField
                  label="Logo nhà tài trợ"
                  folder="forum/partners"
                  value={sponsor.image || ''}
                  onChange={(value) => handleSponsorChange(index, 'image', value)}
                />
              </div>
            ))}
          </div>

          {formData.sponsors.length === 0 && (
            <p className="text-center py-6 text-xs text-slate-500 italic">
              Chưa có nhà tài trợ nào. Nhấn &ldquo;Thêm Nhà Tài Trợ&rdquo; để bắt đầu.
            </p>
          )}
        </div>
      </AdminCard>

      <AdminStickySaveBar
        form="forum-partners-form"
        type="submit"
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        buttonText={saveSuccess ? 'Đã lưu Đối Tác!' : isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        hintMessage="Nhấn lưu để đồng bộ dữ liệu đơn vị đối tác và nhà tài trợ ra ngoài website."
      />
    </form>
  );
}
