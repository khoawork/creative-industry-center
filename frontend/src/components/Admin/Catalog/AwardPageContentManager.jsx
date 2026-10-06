import React, { useEffect, useState, useMemo } from "react";
import {
  Check,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import { AwardAPI } from "../../../api/awardApi.js";
import { UploadAPI } from "../../../api/uploadApi.js";

const emptyHeader = { tittle: "", sub_title: "", description: "" };
const emptyHonor = {
  icon: "",
  image: "",
  title: "",
  name: "",
  sub_name: "",
  time: "",
  decision_number: "",
};

const inputClass =
  "min-h-10 w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-sm text-(--admin-ink) outline-none transition focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/30";
const labelClass =
  "mb-1 block text-xs font-semibold uppercase text-(--admin-heading)";
const honorFields = [
  ["icon", "Ảnh / biểu tượng"],
  ["title", "Hạng mục / Danh hiệu"],
  ["name", "Tên cá nhân / tập thể"],
  ["sub_name", "Thông tin đại diện"],
  ["time", "Thời gian vinh danh"],
  ["decision_number", "Số quyết định"],
];

function unwrap(result) {
  return result?.data || result || {};
}

export default function AwardPageContentManager({ activeSection = "header" }) {
  const [header, setHeader] = useState(emptyHeader);
  const [honors, setHonors] = useState([]);
  const [awards, setAwards] = useState([]);
  const [selectedAwardIds, setSelectedAwardIds] = useState([]);
  const [honorForm, setHonorForm] = useState(emptyHonor);
  const [honorImageFile, setHonorImageFile] = useState(null);
  const [honorImageLoading, setHonorImageLoading] = useState(false);
  const [honorImageError, setHonorImageError] = useState(false);
  const [honorProgress, setHonorProgress] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  // Year filter state
  const [selectedYear, setSelectedYear] = useState("");
  const yearsList = useMemo(() => {
    const years = new Set();
    awards.forEach((a) => {
      if (a.year) years.add(a.year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [awards]);

  const loadPage = async () => {
    setLoading(true);
    try {
      const [pageResult, awardsResult] = await Promise.all([
        AwardAPI.getAwardPage(),
        AwardAPI.getAwards({ per_page: 100 }),
      ]);
      const page = unwrap(pageResult);
      const awardItems = unwrap(awardsResult);
      setHeader({ ...emptyHeader, ...(page.props?.header || {}) });
      setHonors(page.props?.latest_honor_board || []);
      setAwards(Array.isArray(awardItems) ? awardItems : []);
      setSelectedAwardIds(
        page.props?.list_card?.award_ids?.length
          ? page.props.list_card.award_ids.map(String)
          : awardItems.map((award) => String(award.id)),
      );
    } catch {
      setMessage("Không thể tải nội dung trang award.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  const saveHeader = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await AwardAPI.updateAwardHeader(header);
      setMessage("Đã cập nhật header.");
    } catch {
      setMessage("Không thể cập nhật header.");
    } finally {
      setSaving(false);
    }
  };

  const saveAwardSelection = async () => {
    setSaving(true);
    try {
      await AwardAPI.updateAwardSelection(selectedAwardIds);
      setMessage("Đã cập nhật award hiển thị trên trang.");
    } catch {
      setMessage("Không thể cập nhật danh sách award.");
    } finally {
      setSaving(false);
    }
  };

  const saveHonor = async (event) => {
    event.preventDefault();
    setSaving(true);
    setHonorProgress(5);
    try {
      const payload = { ...honorForm };
      if (honorImageFile) {
        setHonorProgress(25);
        const uploadedImage = await UploadAPI.uploadImage(
          honorImageFile,
          "award-honors",
        );
        payload.icon = uploadedImage;
        payload.image = uploadedImage;
      } else {
        payload.image = payload.image || payload.icon || null;
      }
      setHonorProgress(70);
      const response = editingId
        ? await AwardAPI.updateHonorBoard(editingId, payload)
        : await AwardAPI.createHonorBoard(payload);
      setHonorProgress(95);
      const item = unwrap(response);
      setHonors((current) =>
        editingId
          ? current.map((honor) => (honor.id === editingId ? item : honor))
          : [...current, item],
      );
      setHonorForm(emptyHonor);
      setHonorImageFile(null);
      setEditingId(null);
      setMessage(editingId ? "Đã cập nhật bảng vàng." : "Đã thêm bảng vàng.");
      setHonorProgress(100);
    } catch {
      setMessage("Không thể lưu bảng vàng.");
    } finally {
      setSaving(false);
      setTimeout(() => setHonorProgress(null), 450);
    }
  };

  const removeHonor = async (id) => {
    setSaving(true);
    try {
      await AwardAPI.deleteHonorBoard(id);
      await loadPage();
      setMessage("Đã xóa bảng vàng.");
    } catch {
      setMessage("Không thể xóa bảng vàng.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-gray-500">
        <RefreshCw className="mr-2 size-4 animate-spin" />
        Đang tải nội dung trang...
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-4 shadow-[var(--admin-panel-shadow)]">
      {honorProgress !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-(--admin-border) bg-(--admin-surface) p-6 text-center shadow-2xl">
            <RefreshCw className="mx-auto size-8 animate-spin text-(--admin-accent)" />
            <p className="mt-3 text-sm font-bold text-(--admin-title)">
              Đang lưu bảng vàng...
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-(--admin-background)">
              <div
                className="h-full rounded-full bg-(--admin-accent) transition-all duration-300"
                style={{ width: `${honorProgress}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-gray-500">
              {honorProgress}%
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-(--admin-title)">
            Nội dung trang award
          </h2>
        </div>
        {message && <span className="text-xs text-emerald-600">{message}</span>}
      </div>

      <form
        id="award-header"
        onSubmit={saveHeader}
        className={`${activeSection === "header" ? "" : "hidden"} grid gap-3 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-4 shadow-[var(--admin-panel-shadow)] md:grid-cols-2`}
      >
        <label>
          <span className={labelClass}>Tiêu đề header</span>
          <input
            value={header.tittle}
            onChange={(event) =>
              setHeader({ ...header, tittle: event.target.value })
            }
            className={inputClass}
          />
        </label>
        <label>
          <span className={labelClass}>Tiêu đề phụ</span>
          <input
            value={header.sub_title}
            onChange={(event) =>
              setHeader({ ...header, sub_title: event.target.value })
            }
            className={inputClass}
          />
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>Mô tả header</span>
          <textarea
            value={header.description}
            onChange={(event) =>
              setHeader({ ...header, description: event.target.value })
            }
            rows={3}
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-10 w-fit items-center gap-1.5 rounded-lg bg-(--admin-accent) px-4 py-2 text-xs font-bold text-(--admin-black) transition hover:opacity-90 disabled:opacity-50"
        >
          <Check size={14} />
          Lưu header
        </button>
      </form>

      <section
        id="award-selection"
        className={`${activeSection === "selection" ? "" : "hidden"} rounded-xl border border-(--admin-border) bg-(--admin-surface) p-4 shadow-[var(--admin-panel-shadow)]`}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-(--admin-heading)">
              Award hiển thị
            </h3>
            <p className="text-xs text-gray-500">
              Chọn các award xuất hiện trong danh sách công khai.
            </p>
            {/* Year filter */}
            <div className="flex items-center mt-2 gap-2">
              <label className={labelClass}>Năm</label>
              <select
                className="rounded border px-2 py-1 text-xs"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Tất cả</option>
                {yearsList.map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={saveAwardSelection}
            disabled={saving}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-(--admin-accent) px-4 py-2 text-xs font-bold text-(--admin-black) transition hover:opacity-90 disabled:opacity-50"
          >
            <Check size={14} />
            Lưu lựa chọn
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {awards.map((award) => {
            const awardId = String(award.id);
            const checked = selectedAwardIds.includes(awardId);
            return (
              <label
                key={award.id}
                className={`group relative flex aspect-square cursor-pointer flex-col overflow-hidden rounded-2xl border transition ${checked ? "border-(--admin-accent) bg-(--admin-accent)/10 shadow-md ring-2 ring-(--admin-accent)/20" : "border-(--admin-border) bg-(--admin-background) hover:border-(--admin-accent)/60 hover:shadow-sm"}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setSelectedAwardIds((current) =>
                      checked
                        ? current.filter((id) => id !== awardId)
                        : [...current, awardId],
                    )
                  }
                  className="absolute right-3 top-3 z-10 size-5 accent-(--admin-accent)"
                />
                <div className="relative min-h-0 flex-1 overflow-hidden bg-(--admin-surface)">
                  <img
                    src={award.image}
                    alt={award.name}
                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2 py-1 font-mono text-[10px] font-bold tracking-wide text-white">
                    {award.code}
                  </span>
                </div>
                <div className="space-y-1.5 p-3">
                  <span className="block truncate text-sm font-bold text-(--admin-title)">
                    {award.name}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {award.title}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <div
        id="award-honors"
        className={`${activeSection === "honors" ? "" : "hidden"} rounded-2xl border border-(--admin-border) bg-(--admin-surface) p-5 shadow-[var(--admin-panel-shadow)]`}
      >
        <div className="mb-5 flex flex-col gap-3 border-b border-(--admin-border) pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-amber-400">
              <Trophy className="size-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-(--admin-title)">
                Bảng vàng tôn vinh
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Quản lý các cá nhân và tập thể đang hiển thị trên trang công
                khai.
              </p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-500">
            {honors.length} hồ sơ
          </span>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[2fr_3fr]">
          {/* Danh sách bảng vàng */}
          <div
            className={`h-full space-y-3 ${honors.length > 4 ? "max-h-[570px] overflow-y-auto pr-2" : ""}`}
          >
            {honors.map((honor) => (
              <div
                key={honor.id}
                className="group flex gap-4 rounded-xl border border-(--admin-border)  p-4 transition hover:border-amber-400/50 hover:shadow-sm"
              >
                <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-surface)">
                  <img
                    src={honor.image || honor.icon}
                    alt={honor.name}
                    className="size-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="inline-flex max-w-full truncate rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-500">
                    {honor.title}
                  </span>

                  <p className="mt-2 truncate text-base font-bold text-(--admin-title)">
                    {honor.name}
                  </p>

                  <p className="truncate text-sm text-gray-500">
                    {honor.sub_name}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                    <span>{honor.time}</span>
                    <span className="font-mono">{honor.decision_number}</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-1 opacity-70 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(honor.id);
                      setHonorImageFile(null);
                      setHonorForm({
                        ...emptyHonor,
                        ...honor,
                        image: honor.image || honor.icon || "",
                      });
                    }}
                    className="rounded-md p-2 text-gray-500 transition hover:bg-gray-200 hover:text-(--admin-heading)"
                    aria-label="Sửa bảng vàng"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeHonor(honor.id)}
                    className="rounded-md p-2 text-red-600 transition hover:bg-red-50"
                    aria-label="Xóa bảng vàng"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Form Thêm / Sửa bảng vàng (Layout tối ưu, bố cục thoáng) */}
          <form
            onSubmit={saveHonor}
            className="flex flex-col overflow-hidden rounded-xl border border-(--admin-border)"
          >
            {/* Header Form */}
            <div className="border-b border-(--admin-border) px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-(--admin-heading)">
                    {editingId ? "Sửa bảng vàng" : "Thêm bảng vàng"}
                  </h3>
                  <p className="mt-1 text-xs text-(--admin-muted)">
                    Nhập thông tin thành tích được vinh danh
                  </p>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setHonorImageFile(null);
                      setHonorForm(emptyHonor);
                    }}
                    aria-label="Hủy sửa"
                    className="rounded-lg p-1.5 text-(--admin-muted) transition hover:bg-(--admin-border) hover:text-(--admin-heading)"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Body Form */}
            <div className="flex-1 space-y-5 p-5">
              {/* Phần 1: Gắn ảnh icon */}
              <div className="space-y-1.5">
                <span className={labelClass}>
                  Ảnh biểu tượng (Icon / Huy chương)
                </span>
                <div className="flex items-center gap-4 rounded-xl border border-dashed border-(--admin-border) p-3 transition hover:border-amber-400/50">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-(--admin-border) bg-(--admin-surface)">
                    {honorImageLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35">
                        <RefreshCw className="size-5 animate-spin text-white" />
                      </div>
                    )}
                    {honorImageError ? (
                      <div className="flex size-full items-center justify-center px-2 text-center text-[10px] text-red-500">
                        Ảnh không hợp lệ
                      </div>
                    ) : honorForm.image || honorForm.icon ? (
                      <img
                        src={honorForm.image || honorForm.icon}
                        alt="Preview"
                        className="size-full object-cover"
                        onLoad={() => {
                          setHonorImageLoading(false);
                          setHonorImageError(false);
                        }}
                        onError={() => {
                          setHonorImageLoading(false);
                          setHonorImageError(true);
                        }}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-[10px] text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setHonorImageFile(file);
                          setHonorImageLoading(true);
                          setHonorImageError(false);
                          const imageUrl = URL.createObjectURL(file);
                          setHonorForm({
                            ...honorForm,
                            icon: imageUrl,
                            image: imageUrl,
                          });
                        }
                      }}
                      className="cursor-pointer block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-400/10 file:text-amber-500 hover:file:bg-amber-400/20 cursor-pointer"
                    />
                    <p className="mt-1 text-[11px] text-(--admin-muted)">
                      Hỗ trợ định dạng: PNG, JPG, WEBP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Phần 2: Tiêu đề danh hiệu & Tên giải thưởng */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1.5">
                  <span className={labelClass}>Tiêu đề huy hiệu (Title)</span>
                  <input
                    required
                    placeholder="VD: HUY CHƯƠNG VÀNG"
                    value={honorForm.title || ""}
                    onChange={(event) =>
                      setHonorForm({ ...honorForm, title: event.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className={labelClass}>Tên giải thưởng (Name)</span>
                  <input
                    required
                    placeholder="VD: GIẢI ĐẶC BIỆT..."
                    value={honorForm.name || ""}
                    onChange={(event) =>
                      setHonorForm({ ...honorForm, name: event.target.value })
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              {/* Phần 3: Đơn vị / Mô tả phụ */}
              <label className="block space-y-1.5">
                <span className={labelClass}>
                  Đơn vị / Mô tả phụ (Sub Name)
                </span>
                <input
                  required
                  placeholder="VD: ĐỘI MÚA CÔNG TY ABC"
                  value={honorForm.sub_name || ""}
                  onChange={(event) =>
                    setHonorForm({ ...honorForm, sub_name: event.target.value })
                  }
                  className={inputClass}
                />
              </label>

              {/* Phần 4: Thông tin quyết định & Thời gian (Datetime) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-(--admin-border)">
                <label className="space-y-1.5">
                  <span className={labelClass}>Thời gian vinh danh (Time)</span>
                  <input
                    required
                    type="datetime-local"
                    value={honorForm.time || ""}
                    onChange={(event) =>
                      setHonorForm({ ...honorForm, time: event.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="space-y-1.5">
                  <span className={labelClass}>
                    Số quyết định (Decision Number)
                  </span>
                  <input
                    required
                    placeholder="VD: QĐ-123/QĐ-KHĐT"
                    value={honorForm.decision_number || ""}
                    onChange={(event) =>
                      setHonorForm({
                        ...honorForm,
                        decision_number: event.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </label>
              </div>
            </div>

            {/* Footer Form */}
            <div className="flex items-center justify-end gap-2 border-t border-(--admin-border) px-5 py-3 bg-(--admin-surface)/50">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setHonorImageFile(null);
                    setHonorForm(emptyHonor);
                  }}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-(--admin-muted) transition hover:bg-(--admin-border) hover:text-(--admin-heading)"
                >
                  Hủy
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-(--admin-accent) px-4 py-2 text-xs font-bold text-(--admin-black) transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingId ? <Check size={14} /> : <Plus size={14} />}
                {editingId ? "Lưu bảng vàng" : "Thêm bảng vàng"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
