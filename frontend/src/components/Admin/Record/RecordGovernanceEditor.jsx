import React from "react";
import { Plus, Trash2, ShieldCheck, CreditCard, Users } from "lucide-react";
import { AdminCard, AdminButton, AdminInput } from "../Common";

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

  // Role handlers inside CTA
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
      <AdminCard
        title="Quy chế pháp lý & Hội đồng thẩm định"
        subtitle="Tiêu chuẩn và nguyên tắc pháp lý của Viện Kỷ lục."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AdminInput
            label="Nhãn phụ (Title badge)"
            value={governance.title || ""}
            onChange={(e) => handleFieldChange("title", e?.target?.value ?? e)}
            placeholder="VD: QUY CHẾ PHÁP LÝ & CHUẨN MỰC"
          />

          <AdminInput
            label="Tiêu đề phần (Subtitle heading)"
            value={governance.subtitle || ""}
            onChange={(e) => handleFieldChange("subtitle", e?.target?.value ?? e)}
            placeholder="VD: Quy Chế & Hội Đồng Thẩm Định Khoa Học"
          />

          <div className="md:col-span-2">
            <AdminInput
              label="Mô tả chi tiết quy chế"
              multiline
              rows={4}
              value={governance.description || ""}
              onChange={(e) => handleFieldChange("description", e?.target?.value ?? e)}
              placeholder="Nhập nội dung quy định pháp lý, quy trình thẩm định..."
            />
          </div>
        </div>
      </AdminCard>

      {/* Cards tiêu chuẩn */}
      <AdminCard
        title={`Các thẻ chuẩn mực (Governance Cards) - ${governance.cards?.length || 0} thẻ`}
        subtitle="Hiển thị các khối tiêu chuẩn: Minh bạch, Chuẩn quốc tế, Di sản..."
        actions={
          <AdminButton
            type="button"
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleAddCard}
          >
            Thêm thẻ
          </AdminButton>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(governance.cards || []).length === 0 ? (
            <div className="col-span-3 text-center py-6 text-xs text-(--admin-ink)/60 italic border border-dashed border-(--admin-border) rounded-xl">
              Chưa có thẻ chuẩn mực nào.
            </div>
          ) : (
            (governance.cards || []).map((card, idx) => (
              <div
                key={card.id || idx}
                className="p-4 rounded-xl bg-(--admin-background) border border-(--admin-border) space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-(--admin-heading)">Thẻ #{idx + 1}</span>
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
                  <AdminInput
                    label="Icon"
                    value={card.icon || ""}
                    onChange={(e) => handleCardChange(idx, "icon", e.target.value)}
                    placeholder="VD: verified_user, public, balance"
                  />
                </div>
                <div>
                  <AdminInput
                    label="Tiêu đề"
                    value={card.title || ""}
                    onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                    placeholder="VD: Minh Bạch"
                  />
                </div>
                <div>
                  <AdminInput
                    label="Mô tả"
                    multiline
                    rows={3}
                    value={card.description || ""}
                    onChange={(e) => handleCardChange(idx, "description", e.target.value)}
                    placeholder="Mô tả tiêu chuẩn..."
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </AdminCard>

      {/* CTA Box & Hội đồng */}
      <AdminCard
        title="Khối Hội đồng & Kêu gọi hành động (CTA Box)"
        subtitle="Thông tin quyết định thành lập hội đồng, danh sách thành viên và nút tra cứu."
        actions={
          <AdminButton
            type="button"
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleAddCta}
          >
            Thêm CTA
          </AdminButton>
        }
      >
        <div className="space-y-6">
          {(governance.cta || []).length === 0 ? (
            <div className="text-center py-6 text-xs text-(--admin-ink)/60 italic border border-dashed border-(--admin-border) rounded-xl">
              Chưa có khối CTA nào.
            </div>
          ) : (
            (governance.cta || []).map((ctaItem, ctaIdx) => (
              <div
                key={ctaItem.id || ctaIdx}
                className="p-5 rounded-xl bg-(--admin-background) border border-(--admin-border) space-y-4"
              >
                <div className="flex items-center justify-between border-b border-(--admin-border) pb-3">
                  <h4 className="text-sm font-bold text-(--admin-title)">
                    CTA #{ctaIdx + 1}: {ctaItem.title || "Chưa đặt tên"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveCta(ctaIdx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AdminInput
                    label="Tiêu đề khối CTA"
                    value={ctaItem.title || ""}
                    onChange={(e) => handleCtaChange(ctaIdx, "title", e.target.value)}
                    placeholder="VD: Hội Đồng Khoa Học Độc Lập"
                  />
                  <AdminInput
                    label="Icon"
                    value={ctaItem.icon || ""}
                    onChange={(e) => handleCtaChange(ctaIdx, "icon", e.target.value)}
                    placeholder="VD: gavel"
                  />
                  <AdminInput
                    label="Số quyết định"
                    value={ctaItem.number_decision || ""}
                    onChange={(e) => handleCtaChange(ctaIdx, "number_decision", e.target.value)}
                    placeholder="VD: 18/QĐ-VIETKINGS"
                  />
                  <AdminInput
                    label="Nhiệm kỳ / Chu kỳ (Cycle)"
                    value={ctaItem.cycle || ""}
                    onChange={(e) => handleCtaChange(ctaIdx, "cycle", e.target.value)}
                    placeholder="VD: Nhiệm kỳ 2024 - 2029"
                  />
                  <div className="md:col-span-2">
                    <AdminInput
                      label="Tên nút hành động (Button Action)"
                      value={ctaItem.btn_action || ""}
                      onChange={(e) => handleCtaChange(ctaIdx, "btn_action", e.target.value)}
                      placeholder="VD: TRA CỨU DANH MỤC ĐỀ CỬ"
                    />
                  </div>
                </div>

                {/* Danh sách thành viên hội đồng */}
                <div className="mt-4 pt-4 border-t border-(--admin-border)">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-(--admin-ink)">
                      Danh sách nhân sự / vai trò hội đồng ({ctaItem.roles?.length || 0}):
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddRole(ctaIdx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-(--admin-accent)/10 text-(--admin-accent) hover:bg-(--admin-accent)/20 transition cursor-pointer"
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
                          className="w-1/3 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs font-semibold text-(--admin-ink) focus:outline-hidden focus:border-(--admin-accent)"
                        />
                        <input
                          type="text"
                          value={r.value || ""}
                          onChange={(e) => handleRoleChange(ctaIdx, roleIdx, "value", e.target.value)}
                          placeholder="Họ tên & chức vụ chi tiết..."
                          className="flex-1 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs text-(--admin-ink) focus:outline-hidden focus:border-(--admin-accent)"
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
      </AdminCard>
    </div>
  );
}
