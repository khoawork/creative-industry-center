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
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-xs">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Dữ liệu trang: <strong className="text-[var(--admin-title)]">slug /records</strong></span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/records"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] hover:bg-[var(--admin-border)]/40 transition cursor-pointer"
          >
            <ExternalLink size={14} /> Xem trang công khai
          </a>

          <button
            type="button"
            onClick={loadAllData}
            disabled={loading || saving}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] hover:bg-[var(--admin-border)]/40 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Tải lại
          </button>

          <button
            type="button"
            onClick={handleSaveCurrent}
            disabled={loading || saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-[var(--admin-accent)] text-white hover:opacity-90 shadow-md transition cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Đang lưu...
              </>
            ) : (
              <>
                <Save size={14} /> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border transition ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
              : "bg-rose-500/10 border-rose-500/20 text-rose-500"
          }`}
        >
          {feedback.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span className="font-semibold">{feedback.text}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <nav
        className="sticky top-4 z-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)]/95 p-2 shadow-sm backdrop-blur"
        aria-label="Nhóm nội dung trang kỷ lục"
      >
        {TABS.map(({ id, label, description, icon: Icon, color }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition cursor-pointer ${
              activeTab === id
                ? "bg-[var(--admin-background)] ring-1 ring-white/10 shadow-xs"
                : "hover:bg-[var(--admin-background)]/60"
            }`}
            aria-pressed={activeTab === id}
          >
            <Icon className={`size-4 shrink-0 ${color}`} />
            <div className="truncate">
              <span className="block text-xs font-bold text-[var(--admin-text)] truncate">
                {label}
              </span>
              <span className="block text-[10px] text-[var(--admin-text-muted)] truncate hidden sm:block">
                {description}
              </span>
            </div>
          </button>
        ))}
      </nav>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] text-gray-400 text-sm">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[var(--admin-accent)]" />
          Đang tải dữ liệu trang Kỷ lục...
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
              selectedRecordIds={selectedRecordIds}
              onSelectionChange={setSelectedRecordIds}
            />
          )}

          {activeTab === "honor_rolls" && (
            <RecordHonorRollEditor data={honorRolls} onChange={setHonorRolls} />
          )}

          {activeTab === "process" && (
            <RecordProcessEditor data={process} onChange={setProcess} />
          )}
        </div>
      )}
    </div>
  );
}
