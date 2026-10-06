import React from "react";
import { Plus, Trash2, ShieldCheck, CreditCard, Users } from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] px-3.5 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-[var(--admin-heading)] mb-1.5";

export default function RecordGovernanceEditor({ data = {}, onChange }) {
  const governance = {
    title: "",
    subtitle: "",
    description: "",
    cards: [],
    cta: [],
    ...data,
  };

  const handleFieldChange = (field, value) => {
    onChange({ ...governance, [field]: value });
  };

  // Cards handlers
  const handleAddCard = () => {
    const updated = [
      ...(governance.cards || []),
      {
        id: Date.now(),
        icon: "verified_user",
        title: "",
        description: "",
      },
    ];
    handleFieldChange("cards", updated);
  };

  const handleCardChange = (index, key, value) => {
    const updated = [...(governance.cards || [])];
    updated[index] = { ...updated[index], [key]: value };
    handleFieldChange("cards", updated);
  };

  const handleRemoveCard = (index) => {
    const updated = (governance.cards || []).filter((_, i) => i !== index);
    handleFieldChange("cards", updated);
  };

  // CTA handlers
  const handleAddCta = () => {
    const updated = [
      ...(governance.cta || []),
      {
        id: Date.now(),
        icon: "gavel",
        title: "Hội Đồng Khoa Học Độc Lập",
        cycle: "Nhiệm kỳ 2024 - 2029",
        number_decision: "18/QĐ-VIETKINGS",
        btn_action: "TRA CỨU DANH MỤC ĐỀ CỬ",
        roles: [{ role: "Chủ tịch Hội đồng", value: "" }],
      },
    ];
    handleFieldChange("cta", updated);
  };

  const handleCtaChange = (ctaIndex, key, value) => {
    const updated = [...(governance.cta || [])];
    updated[ctaIndex] = { ...updated[ctaIndex], [key]: value };
    handleFieldChange("cta", updated);
  };

  const handleRemoveCta = (ctaIndex) => {
    const updated = (governance.cta || []).filter((_, i) => i !== ctaIndex);
    handleFieldChange("cta", updated);
  };

  // CTA Role handlers
  const handleAddRole = (ctaIndex) => {
    const updated = [...(governance.cta || [])];
    const roles = [...(updated[ctaIndex].roles || []), { role: "", value: "" }];
    updated[ctaIndex] = { ...updated[ctaIndex], roles };
    handleFieldChange("cta", updated);
  };

  const handleRoleChange = (ctaIndex, roleIndex, key, value) => {
    const updated = [...(governance.cta || [])];
    const roles = [...(updated[ctaIndex].roles || [])];
    roles[roleIndex] = { ...roles[roleIndex], [key]: value };
    updated[ctaIndex] = { ...updated[ctaIndex], roles };
    handleFieldChange("cta", updated);
  };

  const handleRemoveRole = (ctaIndex, roleIndex) => {
    const updated = [...(governance.cta || [])];
    const roles = (updated[ctaIndex].roles || []).filter((_, i) => i !== roleIndex);
    updated[ctaIndex] = { ...updated[ctaIndex], roles };
    handleFieldChange("cta", updated);
  };

  return (
    <div className="space-y-6">
      {/* Thông tin chung quy chế */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xs">
        <div className="flex items-center gap-2.5 border-b border-[var(--admin-border)] pb-4 mb-5">
          <span className="p-2 rounded-lg bg-[var(--admin-accent)]/10 text-[var(--admin-heading)]">
            <ShieldCheck size={18} />
          </span>
          <div>
            <h3 className="text-base font-bold text-[var(--admin-title)]">
              Quy chế pháp lý &amp; Hội đồng thẩm định
            </h3>
            <p className="text-xs text-gray-500">
              Tiêu chuẩn và nguyên tắc pháp lý của Viện Kỷ lục
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Nhãn phụ (Title badge)</label>
            <input
              type="text"
              value={governance.title || ""}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="VD: QUY CHẾ PHÁP LÝ & CHUẨN MỰC"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tiêu đề phần (Subtitle heading)</label>
            <input
              type="text"
              value={governance.subtitle || ""}
              onChange={(e) => handleFieldChange("subtitle", e.target.value)}
              placeholder="VD: Quy Chế & Hội Đồng Thẩm Định Khoa Học"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Mô tả chi tiết quy chế</label>
            <textarea
              rows={4}
              value={governance.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Nhập nội dung quy định pháp lý, quy trình thẩm định..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Cards tiêu chuẩn */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <CreditCard size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-title)]">
                Các thẻ chuẩn mực (Governance Cards)
              </h3>
              <p className="text-xs text-gray-500">
                Hiển thị các khối tiêu chuẩn: Minh bạch, Chuẩn quốc tế, Di sản...
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddCard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--admin-accent)] text-white hover:opacity-90 transition cursor-pointer"
          >
            <Plus size={14} /> Thêm thẻ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(governance.cards || []).length === 0 ? (
            <div className="col-span-3 text-center py-6 text-xs text-gray-400 italic">
              Chưa có thẻ chuẩn mực nào.
            </div>
          ) : (
            (governance.cards || []).map((card, idx) => (
              <div
                key={card.id || idx}
                className="p-4 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)] space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--admin-heading)]">Thẻ #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                    title="Xóa thẻ"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 mb-1 block">Icon</label>
                  <input
                    type="text"
                    value={card.icon || ""}
                    onChange={(e) => handleCardChange(idx, "icon", e.target.value)}
                    placeholder="VD: verified_user, public, balance"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 mb-1 block">Tiêu đề</label>
                  <input
                    type="text"
                    value={card.title || ""}
                    onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                    placeholder="VD: Minh Bạch"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-400 mb-1 block">Mô tả</label>
                  <textarea
                    rows={3}
                    value={card.description || ""}
                    onChange={(e) => handleCardChange(idx, "description", e.target.value)}
                    placeholder="Mô tả tiêu chuẩn..."
                    className={inputClass}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CTA Box & Hội đồng */}
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Users size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-title)]">
                Khối Hội đồng &amp; Kêu gọi hành động (CTA Box)
              </h3>
              <p className="text-xs text-gray-500">
                Thông tin quyết định thành lập hội đồng, danh sách thành viên và nút tra cứu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddCta}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--admin-accent)] text-white hover:opacity-90 transition cursor-pointer"
          >
            <Plus size={14} /> Thêm CTA
          </button>
        </div>

        <div className="space-y-6">
          {(governance.cta || []).length === 0 ? (
            <p className="text-center py-6 text-xs text-gray-400 italic">
              Chưa có khối CTA nào.
            </p>
          ) : (
            (governance.cta || []).map((ctaItem, ctaIdx) => (
              <div
                key={ctaItem.id || ctaIdx}
                className="p-5 rounded-xl bg-[var(--admin-background)] border border-[var(--admin-border)] space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[var(--admin-border)]/60 pb-3">
                  <h4 className="text-sm font-bold text-[var(--admin-title)]">
                    CTA #{ctaIdx + 1}: {ctaItem.title || "Chưa đặt tên"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveCta(ctaIdx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Tiêu đề khối CTA</label>
                    <input
                      type="text"
                      value={ctaItem.title || ""}
                      onChange={(e) => handleCtaChange(ctaIdx, "title", e.target.value)}
                      placeholder="VD: Hội Đồng Khoa Học Độc Lập"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Icon</label>
                    <input
                      type="text"
                      value={ctaItem.icon || ""}
                      onChange={(e) => handleCtaChange(ctaIdx, "icon", e.target.value)}
                      placeholder="VD: gavel"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Số quyết định</label>
                    <input
                      type="text"
                      value={ctaItem.number_decision || ""}
                      onChange={(e) => handleCtaChange(ctaIdx, "number_decision", e.target.value)}
                      placeholder="VD: 18/QĐ-VIETKINGS"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Nhiệm kỳ / Chu kỳ (Cycle)</label>
                    <input
                      type="text"
                      value={ctaItem.cycle || ""}
                      onChange={(e) => handleCtaChange(ctaIdx, "cycle", e.target.value)}
                      placeholder="VD: Nhiệm kỳ 2024 - 2029"
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Tên nút hành động (Button Action)</label>
                    <input
                      type="text"
                      value={ctaItem.btn_action || ""}
                      onChange={(e) => handleCtaChange(ctaIdx, "btn_action", e.target.value)}
                      placeholder="VD: TRA CỨU DANH MỤC ĐỀ CỬ"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Danh sách thành viên hội đồng */}
                <div className="mt-4 pt-4 border-t border-[var(--admin-border)]/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[var(--admin-heading)]">
                      Danh sách nhân sự / vai trò hội đồng ({ctaItem.roles?.length || 0}):
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddRole(ctaIdx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded bg-[var(--admin-accent)]/10 text-[var(--admin-heading)] hover:bg-[var(--admin-accent)]/20 transition cursor-pointer"
                    >
                      <Plus size={13} /> Thêm vai trò
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(ctaItem.roles || []).map((r, roleIdx) => (
                      <div key={roleIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={r.role || ""}
                          onChange={(e) => handleRoleChange(ctaIdx, roleIdx, "role", e.target.value)}
                          placeholder="Chức danh (VD: Chủ tịch Hội đồng)"
                          className={`${inputClass} w-1/3`}
                        />
                        <input
                          type="text"
                          value={r.value || ""}
                          onChange={(e) => handleRoleChange(ctaIdx, roleIdx, "value", e.target.value)}
                          placeholder="Họ tên & chức vụ chi tiết..."
                          className={`${inputClass} flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(ctaIdx, roleIdx)}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
