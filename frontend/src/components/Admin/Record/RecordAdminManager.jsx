import React, { useState, useEffect } from "react";
import {
  FileText,
  ShieldCheck,
  Trophy,
  Award,
  ListOrdered,
  Code,
  Save,
  RefreshCw,
  ExternalLink,
  Check,
  AlertCircle,
} from "lucide-react";
import { RecordAPI } from "../../../api/recordsApi.js";
import RecordHeaderEditor from "./RecordHeaderEditor.jsx";
import RecordGovernanceEditor from "./RecordGovernanceEditor.jsx";
import RecordItemsEditor from "./RecordItemsEditor.jsx";
import RecordHonorRollEditor from "./RecordHonorRollEditor.jsx";
import RecordProcessEditor from "./RecordProcessEditor.jsx";
import { AdminPageHeader, AdminTabs, AdminButton, AdminToast, AdminBadge, AdminStickySaveBar } from "../Common";

const TABS = [
  {
    id: "header",
    label: "Header",
    description: "Tiêu đề, slogan & chỉ số",
    icon: FileText,
    color: "text-sky-400",
  },
  {
    id: "governance",
    label: "Quy chế",
    description: "Chuẩn mực & Hội đồng",
    icon: ShieldCheck,
    color: "text-indigo-400",
  },
  {
    id: "records",
    label: "Kỷ lục hiển thị",
    description: "Chọn hạng mục công khai",
    icon: Trophy,
    color: "text-amber-400",
  },
  {
    id: "honor_rolls",
    label: "Bảng vàng",
    description: "Tôn vinh gương mặt",
    icon: Award,
    color: "text-emerald-400",
  },
  {
    id: "process",
    label: "Quy trình",
    description: "4 bước thẩm định",
    icon: ListOrdered,
    color: "text-purple-400",
  },
];

export default function RecordAdminManager() {
  const [activeTab, setActiveTab] = useState("header");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', text: '' }
  const [pageId, setPageId] = useState(4);

  // Core sections data
  const [header, setHeader] = useState({});
  const [governance, setGovernance] = useState({});
  const [records, setRecords] = useState([]);
  const [recordsTitle, setRecordsTitle] = useState("DANH MỤC HẠNG MỤC ĐỀ CỬ KỶ LỤC");
  const [recordsSubtitle, setRecordsSubtitle] = useState("DANH MỤC ĐỀ CỬ KỶ LỤC");
  const [selectedRecordIds, setSelectedRecordIds] = useState([]);
  const [honorRolls, setHonorRolls] = useState([]);
  const [process, setProcess] = useState({});

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch SQL items from RecordAPI.getRecords() trước
      let sqlItems = [];
      try {
        const itemsRes = await RecordAPI.getRecords();
        const items = itemsRes?.data || itemsRes;
        if (Array.isArray(items)) {
          sqlItems = items;
          setRecords(items);
        }
      } catch (e) {
        console.warn("Không lấy được records/items:", e);
      }

      // 2. Fetch page data by slug records
      let pageData = null;
      try {
        const pageRes = await RecordAPI.getPageBySlug("records");
        pageData = pageRes?.data || pageRes;
      } catch (err) {
        console.warn("Chưa tải được Page slug records, tiếp tục tải từng endpoint:", err);
      }

      if (pageData) {
        if (pageData.id) setPageId(pageData.id);
        const props = pageData.props || {};
        if (props.header) setHeader(props.header);
        if (props.governance) setGovernance(props.governance);
        if (props.records && sqlItems.length === 0) setRecords(props.records);
        if (props.record_section_title) setRecordsTitle(props.record_section_title);
        if (props.record_section_subtitle) setRecordsSubtitle(props.record_section_subtitle);
        if (props.selected_record_ids) {
          setSelectedRecordIds(props.selected_record_ids.map(String));
        } else {
          // Mặc định chọn tất cả
          const currentList = sqlItems.length > 0 ? sqlItems : (props.records || []);
          setSelectedRecordIds(currentList.map((r) => String(r.id)));
        }
        if (props.honor_rolls) setHonorRolls(props.honor_rolls);
        if (props.process) setProcess(props.process);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu admin records:", err);
      showFeedback("error", "Không thể tải dữ liệu trang Kỷ lục.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSaveCurrent = async () => {
    setSaving(true);
    try {
      const fullProps = {
        header,
        governance,
        records,
        record_section_title: recordsTitle,
        record_section_subtitle: recordsSubtitle,
        selected_record_ids: selectedRecordIds,
        honor_rolls: Array.isArray(honorRolls) ? honorRolls : [honorRolls],
        process,
      };

      // 1. Save full props to Page records
      await RecordAPI.updatePageProps(pageId, fullProps);

      // 2. Also save granular endpoints if needed
      try {
        if (activeTab === "header") {
          await RecordAPI.updateHeader(header);
        } else if (activeTab === "governance") {
          await RecordAPI.updateGovernance(governance);
        } else if (activeTab === "process") {
          await RecordAPI.updateProcess(process);
        }
      } catch (subErr) {
        console.warn("Granular endpoint update note:", subErr);
      }

      showFeedback("success", "Đã lưu thay đổi thành công!");
    } catch (err) {
      console.error("Lỗi khi lưu dữ liệu:", err);
      showFeedback("error", "Lỗi khi lưu: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="space-y-6">
      <AdminToast
        toast={feedback ? { message: feedback.text, type: feedback.type } : null}
        onClose={() => setFeedback(null)}
      />

      {/* Header trang quản trị chuẩn hóa */}
      <AdminPageHeader
        badge="Nội dung website"
        title="Quản trị Trang Đề cử Kỷ lục"
        subtitle="Quản lý biểu ngữ header, quy chế pháp lý & hội đồng, chọn hạng mục kỷ lục hiển thị, bảng vàng vinh danh và quy trình thẩm định công khai."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/records"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-surface) text-(--admin-heading) hover:bg-(--admin-background) transition cursor-pointer"
            >
              <ExternalLink size={13} />
              <span>Xem trang công khai</span>
            </a>

            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              icon={RefreshCw}
              loading={loading}
              disabled={loading || saving}
              onClick={loadAllData}
            >
              Tải lại
            </AdminButton>

            <AdminButton
              type="button"
              variant="primary"
              size="sm"
              icon={Save}
              loading={saving}
              disabled={loading || saving}
              onClick={handleSaveCurrent}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </AdminButton>
          </div>
        }
      />

      {/* Tabs Navigation chuẩn hóa */}
      <AdminTabs
        tabs={TABS.map((t) => ({
          id: t.id,
          label: t.label,
          icon: t.icon,
        }))}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center rounded-xl border border-(--admin-border) bg-(--admin-surface) text-(--admin-ink)/60 text-sm flex flex-col items-center justify-center gap-2">
          <RefreshCw size={24} className="animate-spin text-(--admin-accent)" />
          <span>Đang tải dữ liệu trang Kỷ lục...</span>
        </div>
      ) : (
        <div>
          {activeTab === "header" && (
            <RecordHeaderEditor data={header} onChange={setHeader} />
          )}

          {activeTab === "governance" && (
            <RecordGovernanceEditor data={governance} onChange={setGovernance} />
          )}

          {activeTab === "records" && (
            <RecordItemsEditor
              records={records}
              title={recordsTitle}
              subtitle={recordsSubtitle}
              onTitleChange={setRecordsTitle}
              onSubtitleChange={setRecordsSubtitle}
              selectedRecordIds={selectedRecordIds}
              onSelectionChange={setSelectedRecordIds}
            />
          )}

          {activeTab === "honor_rolls" && (
            <RecordHonorRollEditor
              data={honorRolls}
              onChange={setHonorRolls}
              onSaveAll={handleSaveCurrent}
            />
          )}

          {activeTab === "process" && (
            <RecordProcessEditor data={process} onChange={setProcess} />
          )}

          <AdminStickySaveBar
            type="button"
            isSaving={saving}
            saveSuccess={feedback?.type === 'success'}
            successMessage={feedback?.text || "Đã lưu thay đổi thành công!"}
            hintMessage="Nhấn lưu để đồng bộ thông tin và chỉ số trang Kỷ lục ra ngoài website."
            buttonText="Lưu thay đổi"
            savingText="Đang lưu..."
            onSave={handleSaveCurrent}
            disabled={loading || saving}
          />
        </div>
      )}
    </div>
  );
}
