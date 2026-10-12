import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowRight, CheckCircle2, Save, X } from "lucide-react";
import { EventAPI } from "../../api/eventApi.js";
import {
  eventsAdminTabs,
  eventSectionDraft,
} from "../../config/Admin/adminEvents.js";
import {
  adminButton,
  adminContentTheme,
  adminPanel,
  adminPrimaryButton,
} from "../../config/Admin/adminEvents.js";
import { eventError, requireEventData } from "../../api/eventApi.js";
import PageSectionFields from "../../components/Admin/Events/PageSectionFields.jsx";
import EventManager from "../../components/Admin/Events/EventManager.jsx";
import { AdminPageHeader, AdminTabs, AdminToast, AdminCard, AdminButton, AdminStickySaveBar } from "../../components/Admin/Common/index.js";

export default function AdminEvents() {
  const [params, setParams] = useSearchParams();
  const active =
    eventsAdminTabs.find((tab) => tab.key === params.get("tab")) ||
    eventsAdminTabs[0];
  const [saved, setSaved] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [listVersion, setListVersion] = useState(0);
  const busy = useRef(false);
  const tabRefs = useRef([]);
  const [pageId, setPageId] = useState(3);
  const dirtyKeys = saved
    ? eventsAdminTabs
        .filter(
          ({ key }) =>
            key !== "events" &&
            JSON.stringify(drafts[key]) !==
              JSON.stringify(eventSectionDraft(key, saved[key])),
        )
        .map(({ key }) => key)
    : [];
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [toast]);
  useEffect(() => {
    const controller = new AbortController();
    EventAPI.getPage(pageId || 3, { signal: controller.signal })
      .then((response) => {
        if (controller.signal.aborted) return;
        const page = requireEventData(response);
        if (
          page.slug !== "events" ||
          !page.props ||
          typeof page.props !== "object" ||
          Array.isArray(page.props)
        )
          throw new Error("Nội dung trang Sự kiện không hợp lệ.");
        setPageId(page.id);
        setSaved(page.props);
        const pageDrafts = Object.fromEntries(
          eventsAdminTabs
            .filter(({ key }) => key !== "events")
            .map(({ key }) => [key, eventSectionDraft(key, page.props[key])]),
        );

        // Đảm bảo newsletter_section luôn có danh sách fields đầy đủ từ form config
        const currentNlFields = pageDrafts?.newsletter_section?.form_fields;
        if (!Array.isArray(currentNlFields) || currentNlFields.length === 0) {
          import('../../services/googleSheetService.js').then(({ fetchFormConfig, DEFAULT_FORM_CONFIGS }) => {
            fetchFormConfig('event_newsletter').then((cfg) => {
              const activeCfg = cfg || DEFAULT_FORM_CONFIGS.event_newsletter;
              const defaultFields = (activeCfg?.fields || []).map((f) => ({
                id: f.id || f.key,
                key: f.key || f.id,
                label: f.label || '',
                type: f.type || 'text',
                placeholder: f.placeholder || '',
                required: Boolean(f.required),
                width: f.width || (f.colSpan === 1 ? 'half' : 'full'),
                options: Array.isArray(f.options) ? f.options : [],
                helpText: f.helpText || '',
              }));
              if (defaultFields.length > 0) {
                setDrafts((prev) => ({
                  ...prev,
                  newsletter_section: {
                    ...prev.newsletter_section,
                    form_fields: defaultFields,
                  },
                }));
              }
            });
          });
        }

        setDrafts(pageDrafts);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setLoadError(eventError(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => {
    if (!dirtyKeys.length) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirtyKeys.length]);
  const selectTab = (key) => {
    setToast(null);
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set("tab", key);
        return next;
      },
      { replace: true },
    );
  };
  const save = async (e) => {
    e.preventDefault();
    if (busy.current || !dirtyKeys.includes(active.key)) return;
    const key = active.key;
    busy.current = true;
    setSaving(true);
    setToast(null);
    try {
      let response;
      if (key === "hero_section")
        response = await EventAPI.updateHeroSection(pageId || 3, drafts[key]);
      else if (key === "filter_section")
        response = await EventAPI.updateFilterSection(pageId || 3, drafts[key]);
      else if (key === "newsletter_section")
        response = await EventAPI.updateNewsletterSection(pageId || 3, drafts[key]);
      else return;
      const data = requireEventData(response);
      if (Object.keys(drafts[key]).some((field) => !Object.hasOwn(data, field)))
        throw new Error("Phản hồi lưu nội dung không đầy đủ.");
      setSaved((current) => ({ ...current, [key]: data }));
      setDrafts((current) => ({
        ...current,
        [key]: eventSectionDraft(key, data),
      }));

      // Đồng bộ cấu hình ô nhập liệu sang trang Quản lý Biểu mẫu nếu lưu newsletter_section
      if (key === "newsletter_section") {
        try {
          const { saveFormConfig } = await import('../../services/googleSheetService.js');
          const nlData = drafts[key] || {};
          const nlFields = Array.isArray(nlData.form_fields) ? nlData.form_fields : [];
          if (nlFields.length > 0) {
            await saveFormConfig('event_newsletter', {
              title: nlData.title || "Đăng Ký Nhận Bản Tin & Thông Báo Sự Kiện",
              subtitle: nlData.description || "Nhận thư mời ưu tiên, tài liệu kỷ yếu...",
              button_text: nlData.button_text || "Xác Nhận Đăng Ký Thông Báo",
              fields: nlFields.map((f) => ({
                key: f.id || f.key,
                label: f.label,
                type: f.type,
                placeholder: f.placeholder,
                required: Boolean(f.required),
                colSpan: f.width === 'half' ? 1 : 2,
                options: f.options,
              })),
            });
          }
        } catch (syncErr) {
          console.warn("Lỗi sync event_newsletter config:", syncErr);
        }
      }

      setToast({ message: "Đã lưu thay đổi." });
    } catch (err) {
      const details = err.response?.data?.error?.details;
      const messages = (value) =>
        typeof value === "string"
          ? [value]
          : value && typeof value === "object"
            ? Object.values(value).flatMap(messages)
            : [];
      setToast({
        error: true,
        message: [eventError(err), ...new Set(messages(details))].join(" "),
      });
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  return (
    <div className="space-y-6">
      <AdminPageHeader
        badge="Khu vực quản trị nội dung"
        title="Quản lý Sự kiện"
        subtitle="Chỉnh sửa từng phần theo thứ tự hiển thị trên trang Sự kiện."
      />

      <AdminTabs
        tabs={eventsAdminTabs.map((tab) => ({
          ...tab,
          id: tab.key,
          badge: dirtyKeys.includes(tab.key) ? 'chưa lưu' : undefined,
        }))}
        activeTab={active.key}
        onChange={selectTab}
      />
      {eventsAdminTabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`events-panel-${tab.key}`}
          aria-labelledby={`events-tab-${tab.key}`}
          hidden={active.key !== tab.key}
        >
          {tab.key === "events" ? (
            loading ? (
              <div className="flex min-h-[300px] items-center justify-center text-sm font-semibold text-(--admin-ink)/60">Đang tải nội dung sự kiện…</div>
            ) : loadError ? (
              <div role="alert" className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 space-y-3">
                <p className="text-sm">{loadError}</p>
                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLoading(true);
                    setLoadError("");
                    setAttempt((value) => value + 1);
                  }}
                >
                  Thử lại
                </AdminButton>
              </div>
            ) : (
              <AdminCard
                title="Quản lý Sự kiện & Lựa chọn Hiển thị"
                subtitle="Danh sách các sự kiện được tổ chức và cấu hình các sự kiện xuất hiện trên trang Sự kiện ngoài website."
              >
                <EventManager
                  selectionMode
                  reloadKey={listVersion}
                  pageId={pageId || 3}
                  displayedEventIds={saved?.displayed_events?.event_ids}
                  onDisplayedEventsSaved={(data) =>
                    setSaved((current) => ({
                      ...current,
                      displayed_events: data,
                    }))
                  }
                />
              </AdminCard>
            )
          ) : (
            active.key === tab.key && (
              <div className="space-y-6">
                {loading ? (
                  <div className="flex min-h-[300px] items-center justify-center text-sm font-semibold text-(--admin-ink)/60">Đang tải nội dung trang…</div>
                ) : loadError ? (
                  <div role="alert" className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 space-y-3">
                    <p className="text-sm">{loadError}</p>
                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setLoading(true);
                        setLoadError("");
                        setAttempt((value) => value + 1);
                      }}
                    >
                      Thử lại
                    </AdminButton>
                  </div>
                ) : (
                  <>
                    <AdminCard
                      title={tab.label}
                      subtitle={tab.description || "Tùy biến nội dung chi tiết của phần này trên trang Sự kiện."}
                      actions={
                        <AdminButton
                          type="submit"
                          form={`events-form-${tab.key}`}
                          variant="primary"
                          size="sm"
                          icon={Save}
                          loading={saving}
                          disabled={!dirtyKeys.includes(tab.key) || saving}
                        >
                          {saving ? "Đang lưu…" : "Lưu thay đổi"}
                        </AdminButton>
                      }
                    >
                      <form id={`events-form-${tab.key}`} onSubmit={save} className="space-y-5">
                        {!saved?.[tab.key] && (
                          <p className="border-l-2 border-(--admin-accent) px-3 py-2 text-sm bg-(--admin-background)/50 rounded-r-lg">
                            Phần này chưa có nội dung. Nhập và lưu để hiển thị trên
                            trang Sự kiện.
                          </p>
                        )}
                        <fieldset
                          disabled={saving}
                          className="min-w-0 space-y-5 disabled:opacity-60"
                        >
                          <PageSectionFields
                            section={tab.key}
                            value={drafts[tab.key]}
                            onChange={(value) => {
                              setDrafts((current) => ({
                                ...current,
                                [tab.key]: value,
                              }));
                              setToast(null);
                            }}
                          />
                        </fieldset>
                      </form>
                    </AdminCard>
                    <AdminStickySaveBar
                      form={`events-form-${tab.key}`}
                      type="submit"
                      isSaving={saving}
                      disabled={!dirtyKeys.includes(tab.key) || saving}
                      buttonText="Lưu thay đổi"
                      savingText="Đang lưu…"
                      hintMessage="Nhấn lưu để đồng bộ thông tin phần này ra ngoài trang Sự kiện."
                    />
                  </>
                )}
                {tab.key === "filter_section" && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-blue-950">Quản lý Chuyên mục Sự kiện</p>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Tính năng thêm, sửa, xóa chuyên mục sự kiện đã được chuyển sang mục <strong>Danh mục Dữ liệu &gt; Sự kiện &gt; Quản lý Chuyên mục</strong>.
                      </p>
                    </div>
                    <Link
                      to="/admin/catalog?tab=events&view=categories"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shrink-0 shadow-2xs"
                    >
                      <span>Mở Quản lý Chuyên mục</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      ))}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
