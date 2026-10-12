import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { EventAPI } from "../../../api/eventApi.js";
import {
  adminButton,
  adminContentTheme,
  adminPanel,
  adminPrimaryButton,
} from "../../../config/Admin/adminEvents.js";
import {
  eventStatuses,
  eventStatusLabel,
  formatEventDate,
} from "../../../config/Events/eventsConfig.js";
import { eventError, requireEventData } from "../../../api/eventApi.js";
import useDebouncedValue from "../../../hooks/shared/useDebouncedValue.js";
import EventEditor from "./EventEditor.jsx";
import Field from "./EventField.jsx";
import EventImage from "./EventImage.jsx";

function sameEventIds(left, right) {
  if (left.length !== right.length) return false;
  const rightIds = new Set(right.map(String));
  return left.every((id) => rightIds.has(String(id)));
}

export default function EventManager({
  reloadKey = 0,
  pageId = 3,
  displayedEventIds,
  onDisplayedEventsSaved,
  selectionMode = false,
  onOpenCategories,
}) {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [selectionInitialized, setSelectionInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 500);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [savingSelection, setSavingSelection] = useState(false);
  const write = useRef(false);
  const listHeading = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      EventAPI.getEvents({ signal: controller.signal }),
      EventAPI.getCategories({ signal: controller.signal }),
    ])
      .then(([items, groups]) => {
        if (controller.signal.aborted) return;
        const nextEvents = requireEventData(items, true);
        const nextCategories = requireEventData(groups, true);
        const initialIds =
          selectionMode && Array.isArray(displayedEventIds)
            ? displayedEventIds
            : nextEvents.map((event) => event.id);
        setEvents(nextEvents);
        setCategories(nextCategories);
        setSelectedEventIds(initialIds);
        setSavedEventIds(initialIds);
        setSelectionInitialized(true);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(eventError(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt, displayedEventIds, reloadKey, selectionMode]);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  const selectionDirty =
    selectionMode &&
    selectionInitialized &&
    !sameEventIds(selectedEventIds, savedEventIds);
  const selectedIds = new Set(selectedEventIds.map(String));
  const selectedCount = events.filter((event) =>
    selectedIds.has(String(event.id)),
  ).length;
  const toggleDisplayedEvent = (eventId) => {
    setSelectedEventIds((current) =>
      current.some((id) => String(id) === String(eventId))
        ? current.filter((id) => String(id) !== String(eventId))
        : [...current, eventId],
    );
    setError("");
    setToast(null);
  };
  const saveDisplayedEvents = async () => {
    if (write.current || !selectionDirty) return;
    write.current = true;
    setBusy(true);
    setSavingSelection(true);
    setError("");
    setToast(null);
    try {
      const orderedIds = events
        .filter((event) => selectedIds.has(String(event.id)))
        .map((event) => event.id);
      const response = await EventAPI.updateDisplayedEvents(
        pageId || 3,
        orderedIds,
      );
      const saved = requireEventData(response);
      if (!Array.isArray(saved.event_ids))
        throw new Error("Phản hồi lưu danh sách hiển thị không hợp lệ.");
      setSelectedEventIds(saved.event_ids);
      setSavedEventIds(saved.event_ids);
      onDisplayedEventsSaved?.(saved);
      setToast({
        message: "Đã cập nhật các sự kiện hiển thị trên trang Event.",
      });
    } catch (err) {
      setToast({ error: true, message: eventError(err) });
    } finally {
      write.current = false;
      setBusy(false);
      setSavingSelection(false);
    }
  };
  const deleteEvent = async () => {
    if (write.current) return;
    write.current = true;
    setBusy(true);
    setError("");
    setToast(null);
    try {
      const response = await EventAPI.deleteEvent(deleting.id);
      if (response?.success !== true) throw new Error("Chưa xóa được sự kiện.");
      setEvents((current) => current.filter((item) => item.id !== deleting.id));
      setSelectedEventIds((current) =>
        current.filter((id) => String(id) !== String(deleting.id)),
      );
      setDeleting(null);
      setToast({ message: "Đã xóa sự kiện." });
      listHeading.current?.focus();
    } catch (err) {
      setToast({ error: true, message: eventError(err) });
    } finally {
      write.current = false;
      setBusy(false);
    }
  };
  const term = debouncedQuery.trim().toLocaleLowerCase("vi");
  const filtered = events.filter(
    (event) =>
      (!category || String(event.category?.id) === category) &&
      (!status || event.status === status) &&
      [
        event.name,
        event.location,
        event.description,
        ...(event.speakers || []).map((item) => item.name),
      ].some((value) =>
        String(value || "")
          .toLocaleLowerCase("vi")
          .includes(term),
      ),
  );
  return (
    <div className={`${adminContentTheme} space-y-4`}>
      <>
        {selectionMode ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3
              ref={listHeading}
              tabIndex={-1}
              className="text-lg font-semibold text-(--admin-title) outline-none"
            >
              Danh sách sự kiện
            </h3>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className={adminButton}
                disabled={loading || busy}
                onClick={() => {
                  setLoading(true);
                  setError("");
                  setToast(null);
                  setAttempt((value) => value + 1);
                }}
              >
                <RefreshCw size={16} />
                Tải lại
              </button>
              {!selectionMode && (
                <button
                  type="button"
                  className={adminPrimaryButton}
                  disabled={
                    loading || Boolean(error) || categories.length === 0
                  }
                  onClick={() => {
                    setEditing({});
                    setToast(null);
                  }}
                >
                  <Plus size={16} />
                  Thêm sự kiện
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            ref={listHeading}
            tabIndex={-1}
            aria-label="Công cụ quản lý sự kiện"
            className="flex flex-wrap items-center gap-3 rounded-xl border border-(--admin-border) bg-(--admin-surface) p-3 shadow-[var(--admin-panel-shadow)] outline-none"
          >
            <div className="relative min-w-0 basis-full xl:flex-1 xl:basis-0">
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--admin-ink)/60"
              />
              <input
                aria-label="Tìm sự kiện"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm tên, địa điểm hoặc diễn giả…"
                className="w-full rounded-lg border border-(--admin-border) bg-(--admin-background) py-2 pr-4 pl-9 text-sm text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent)"
              />
            </div>
            <select
              aria-label="Lọc chuyên mục"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-sm text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent) xl:w-48 xl:flex-none"
            >
              <option value="">Tất cả chuyên mục</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Lọc trạng thái"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-sm text-(--admin-ink) focus:outline-2 focus:outline-(--admin-accent) xl:w-40 xl:flex-none"
            >
              <option value="">Tất cả trạng thái</option>
              {eventStatuses.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <div className="flex shrink-0 items-center gap-2">
              {onOpenCategories && (
                <button
                  type="button"
                  onClick={onOpenCategories}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) focus-visible:outline-2 focus-visible:outline-(--admin-accent)"
                  title="Quản lý danh sách chuyên mục sự kiện (Thêm, Sửa, Xóa)"
                >
                  <Tags size={13} aria-hidden="true" />
                  <span>Chuyên mục ({categories.length})</span>
                </button>
              )}
              <button
                type="button"
                disabled={loading || busy}
                onClick={() => {
                  setLoading(true);
                  setError("");
                  setToast(null);
                  setAttempt((value) => value + 1);
                }}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) focus-visible:outline-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  aria-hidden="true"
                  className={loading ? "motion-safe:animate-spin" : ""}
                />
                Làm mới
              </button>
              <button
                type="button"
                disabled={
                  loading || busy || Boolean(error) || categories.length === 0
                }
                onClick={() => {
                  setEditing({});
                  setToast(null);
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-(--admin-accent) px-4 py-2 text-xs font-bold text-(--admin-black) shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={14} aria-hidden="true" />
                Thêm sự kiện
              </button>
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-(--admin-heading)">
            {error}
          </p>
        )}
        <div className="min-h-[300px] space-y-4">
          {loading ? (
            <div
              role="status"
              className="flex min-h-[300px] items-center justify-center gap-3 rounded-xl border border-(--admin-border) bg-(--admin-surface) text-sm text-(--admin-heading)"
            >
              <RefreshCw
                size={24}
                aria-hidden="true"
                className="motion-safe:animate-spin"
              />
              <span>Đang tải danh sách sự kiện…</span>
            </div>
          ) : (
            <>
              {categories.length === 0 && !error && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900">
                  <p>
                    Chưa có chuyên mục sự kiện nào. Bạn cần tạo ít nhất một chuyên mục trước khi tạo sự kiện.
                  </p>
                  {onOpenCategories && (
                    <button
                      type="button"
                      onClick={onOpenCategories}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition"
                    >
                      <Plus size={13} />
                      <span>Thêm chuyên mục ngay</span>
                    </button>
                  )}
                </div>
              )}
              {selectionMode && (
                <div className={`${adminPanel} grid gap-4 md:grid-cols-3`}>
                  <Field
                    label="Tìm sự kiện"
                    value={query}
                    onChange={setQuery}
                    placeholder="Tên, địa điểm hoặc diễn giả…"
                  />
                  <Field
                    label="Lọc chuyên mục"
                    value={category}
                    onChange={setCategory}
                  >
                    <option value="">Tất cả chuyên mục</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Field>
                  <Field
                    label="Lọc trạng thái"
                    value={status}
                    onChange={setStatus}
                  >
                    <option value="">Tất cả trạng thái</option>
                    {eventStatuses.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Field>
                </div>
              )}
              {!error && (
                <p className="text-sm text-(--admin-ink)/70">
                  {filtered.length} / {events.length} sự kiện
                  {selectionMode
                    ? ` · ${selectedCount} sự kiện được chọn hiển thị`
                    : ""}
                </p>
              )}
              {!selectionMode && deleting && (
                <div role="alert" className={`${adminPanel} space-y-3`}>
                  <p>
                    Xóa sự kiện “{deleting.name}”? Thao tác này không thể hoàn
                    tác.
                  </p>
                  <div className="flex gap-2">
                    <button
                      className={adminButton}
                      disabled={busy}
                      onClick={() => setDeleting(null)}
                    >
                      Hủy xóa
                    </button>
                    <button
                      className={adminPrimaryButton}
                      disabled={busy}
                      onClick={deleteEvent}
                    >
                      {busy ? "Đang xóa…" : "Xác nhận xóa"}
                    </button>
                  </div>
                </div>
              )}
              {!error && filtered.length === 0 && (
                <p className={`${adminPanel} text-center`}>
                  {events.length
                    ? "Không có sự kiện phù hợp với bộ lọc."
                    : "Chưa có sự kiện trong cơ sở dữ liệu."}
                </p>
              )}
              {selectionMode ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((item, index) => {
                    const checked = selectedIds.has(String(item.id));
                    const speakerNames = (item.speakers || [])
                      .map((speaker) => speaker.name)
                      .filter(Boolean);
                    return (
                      <article
                        key={item.id}
                        onClick={() => toggleDisplayedEvent(item.id)}
                        className={`group flex min-w-0 cursor-pointer select-none flex-col rounded-xl border p-4 transition-all ${checked ? "border-(--admin-accent) bg-(--admin-surface) shadow-sm ring-2 ring-(--admin-accent)/20" : "border-(--admin-border) bg-(--admin-background) opacity-70 hover:opacity-100"}`}
                      >
                        <div className="flex items-center justify-between gap-3 pb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`flex size-6 items-center justify-center rounded-md ${checked ? "bg-(--admin-accent) text-(--admin-black)" : "border border-(--admin-border) bg-(--admin-surface)"}`}
                            >
                              <input
                                type="checkbox"
                                aria-label={`Hiển thị ${item.name}`}
                                checked={checked}
                                disabled={busy || !selectionInitialized}
                                onClick={(event) => event.stopPropagation()}
                                onChange={() => toggleDisplayedEvent(item.id)}
                                className="sr-only"
                              />
                              {checked && (
                                <Check size={15} aria-hidden="true" />
                              )}
                            </span>
                            <span className="text-xs font-mono font-bold text-(--admin-heading)">
                              #{index + 1}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${checked ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" : "border-(--admin-border) text-(--admin-heading)"}`}
                          >
                            {checked ? (
                              <Eye size={13} aria-hidden="true" />
                            ) : (
                              <EyeOff size={13} aria-hidden="true" />
                            )}
                            {checked ? "Hiển thị" : "Đang ẩn"}
                          </span>
                        </div>
                        <div className="relative mb-3 h-36 w-full overflow-hidden rounded-lg bg-(--admin-background)">
                          <EventImage
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full"
                          />
                          <span className="absolute top-2 left-2 rounded bg-(--admin-black)/75 px-2 py-1 text-[10px] font-semibold text-(--admin-white)">
                            {item.category?.name || "Sự kiện"}
                          </span>
                        </div>
                        <h4
                          className="line-clamp-2 text-sm font-bold text-(--admin-title)"
                          title={item.name}
                        >
                          {item.name}
                        </h4>
                        <p className="mt-1 line-clamp-1 text-sm font-medium text-(--admin-accent)">
                          {eventStatusLabel(item.status)}
                        </p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-(--admin-ink)/60">
                          {item.description}
                        </p>
                        {speakerNames.length > 0 && (
                          <p
                            className="mt-2 line-clamp-1 text-xs text-(--admin-ink)/60"
                            title={speakerNames.join(", ")}
                          >
                            Diễn giả: {speakerNames.join(", ")}
                          </p>
                        )}
                        <div className="mt-3 border-t border-(--admin-border) pt-2.5 text-xs text-(--admin-ink)/60">
                          <p className="truncate" title={item.location}>
                            {item.location}
                          </p>
                          <p className="mt-1">
                            {formatEventDate(item.event_date)}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-surface)">
                  {/* Header */}
                  <div
                    aria-hidden="true"
                    className={`hidden gap-5 border-b border-(--admin-border) bg-(--admin-background) px-5 py-4 text-sm font-semibold uppercase tracking-wider text-(--admin-muted) xl:grid ${
                      selectionMode
                        ? "xl:grid-cols-[minmax(0,1fr)_11rem_11rem_9rem]"
                        : "xl:grid-cols-[minmax(0,1fr)_11rem_11rem_10rem]"
                    }`}
                  >
                    <span>Sự kiện</span>
                    <span>Chuyên mục</span>
                    <span>Trạng thái</span>

                    <span className={selectionMode ? "" : "text-right"}>
                      {selectionMode ? "Hiển thị" : "Thao tác"}
                    </span>
                  </div>

                  {filtered.map((item) => (
                    <article
                      key={item.id}
                      className={`grid min-w-0 gap-4 border-b border-(--admin-border) p-4 last:border-b-0 hover:bg-(--admin-background)/40 transition-colors sm:p-5 xl:items-center xl:gap-5 ${
                        selectionMode
                          ? "xl:grid-cols-[minmax(0,1fr)_11rem_11rem_9rem]"
                          : "xl:grid-cols-[minmax(0,1fr)_11rem_11rem_10rem]"
                      }`}
                    >
                      {/* Sự kiện */}
                      <div className="flex min-w-0 items-center gap-4">
                        <EventImage
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-24 shrink-0 rounded-lg"
                        />

                        <div className="min-w-0 space-y-1.5">
                          <h4
                            className="line-clamp-2 text-base font-semibold text-(--admin-title)"
                            title={item.name}
                          >
                            {item.name}
                          </h4>

                          <p
                            className="truncate text-sm text-(--admin-muted)"
                            title={item.location}
                          >
                            {item.location}
                          </p>

                          <p className="text-sm text-(--admin-muted)">
                            {formatEventDate(item.event_date)}
                          </p>
                        </div>
                      </div>

                      {/* Chuyên mục */}
                      <p className="text-sm font-medium text-(--admin-ink)">
                        {item.category?.name || "Chưa phân loại"}
                      </p>

                      {/* Trạng thái */}
                      <div>
                        <span
                          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md border px-3 py-1.5 text-sm font-semibold ${
                            {
                              PENDING:
                                "border-amber-500/20 bg-amber-500/10 text-amber-600",
                              REGISTRATION_OPEN:
                                "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
                              UPCOMING:
                                "border-blue-500/20 bg-blue-500/10 text-blue-600",
                              ENDED:
                                "border-gray-500/20 bg-gray-500/10 text-gray-600",
                            }[String(item.status).toUpperCase()] ||
                            "border-(--admin-border) bg-(--admin-background) text-(--admin-muted)"
                          }`}
                        >
                          <span
                            className={`size-2 shrink-0 rounded-full ${
                              {
                                PENDING: "bg-amber-500",
                                REGISTRATION_OPEN: "bg-emerald-500",
                                UPCOMING: "bg-blue-500",
                                ENDED: "bg-gray-500",
                              }[String(item.status).toUpperCase()] ||
                              "bg-(--admin-muted)"
                            }`}
                          />

                          {eventStatusLabel(item.status)}
                        </span>
                      </div>

                      {/* Hiển thị / Thao tác */}
                      {selectionMode ? (
                        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-(--admin-ink)">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(String(item.id))}
                            disabled={busy || !selectionInitialized}
                            onChange={() => toggleDisplayedEvent(item.id)}
                            className="size-5 shrink-0 cursor-pointer accent-(--admin-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-accent) disabled:cursor-not-allowed"
                          />

                          <span className="text-(--admin-title)">
                            {selectedIds.has(String(item.id)) ? "Có" : "Không"}
                          </span>
                        </label>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            className={`${adminButton} px-3 py-2 text-sm text-(--admin-muted) hover:text-(--admin-accent) hover:bg-(--admin-background)`}
                            disabled={busy}
                            onClick={() => {
                              setEditing(item);
                              setDeleting(null);
                              setToast(null);
                            }}
                            aria-label={`Sửa ${item.name}`}
                          >
                            <Pencil size={16} />
                            Sửa
                          </button>

                          <button
                            className={`${adminButton} px-3 py-2 text-sm text-(--admin-muted) hover:text-red-500 hover:bg-red-50`}
                            disabled={busy}
                            onClick={() => {
                              setDeleting(item);
                              setError("");
                            }}
                            aria-label={`Xóa ${item.name}`}
                          >
                            <Trash2 size={16} />
                            Xóa
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}
              {selectionMode && (
                <div className="flex justify-end border-t border-(--admin-border) pt-5">
                  <button
                    type="button"
                    className={adminPrimaryButton}
                    disabled={busy || !selectionDirty}
                    onClick={saveDisplayedEvents}
                  >
                    <Save size={16} />
                    {savingSelection ? "Đang lưu…" : "Lưu thay đổi"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {editing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-(--admin-black)/60 p-4 backdrop-blur-xs"
            role="presentation"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={editing.id ? "Chỉnh sửa sự kiện" : "Thêm sự kiện"}
              className="w-full max-w-none overflow-hidden rounded-2xl border border-(--admin-border) bg-(--admin-surface) shadow-2xl md:w-[50vw]"
            >
              <EventEditor
                modal
                key={editing.id || "new"}
                event={editing}
                categories={categories}
                onClose={() => setEditing(null)}
                onSaved={(saved) => {
                  setEvents((current) =>
                    current.some((item) => item.id === saved.id)
                      ? current.map((item) =>
                          item.id === saved.id ? saved : item,
                        )
                      : [...current, saved],
                  );
                  setEditing(null);
                  setToast({ message: "Đã lưu sự kiện." });
                  setError("");
                }}
              />
            </div>
          </div>
        )}
        {toast && (
          <div className="fixed right-4 bottom-4 z-40 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-lg border border-(--admin-heading) bg-(--admin-surface) p-4 text-(--admin-ink) shadow-lg sm:right-6 sm:bottom-6">
            {toast.error ? (
              <AlertCircle
                size={20}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-(--admin-heading)"
              />
            ) : (
              <CheckCircle2
                size={20}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-(--admin-heading)"
              />
            )}
            <p
              role={toast.error ? "alert" : "status"}
              aria-atomic="true"
              className="min-w-0 flex-1 text-sm leading-6 wrap-anywhere"
            >
              {toast.message}
            </p>
            <button
              type="button"
              aria-label="Đóng thông báo"
              onClick={() => setToast(null)}
              className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded text-(--admin-ink)/70 hover:bg-(--admin-background) hover:text-(--admin-ink) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-gold)"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </>
    </div>
  );
}
