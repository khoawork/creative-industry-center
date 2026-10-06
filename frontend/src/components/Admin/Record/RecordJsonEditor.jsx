import React, { useState, useEffect } from "react";
import { Code, Check, Copy, Upload, Download, RefreshCw, AlertCircle } from "lucide-react";

export default function RecordJsonEditor({ fullData = {}, onApplyJson }) {
  const [jsonString, setJsonString] = useState("");
  const [parseError, setParseError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    try {
      setJsonString(JSON.stringify(fullData, null, 2));
      setParseError(null);
    } catch (err) {
      setParseError("Không thể format dữ liệu sang JSON: " + err.message);
    }
  }, [fullData]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonString);
      setParseError(null);
      onApplyJson(parsed);
      setApplySuccess(true);
      setTimeout(() => setApplySuccess(false), 3000);
    } catch (err) {
      setParseError("Lỗi cú pháp JSON: " + err.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        JSON.parse(content); // Test validity
        setJsonString(content);
        setParseError(null);
      } catch (err) {
        setParseError("Tệp tải lên không phải JSON hợp lệ: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `records_page_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--admin-border)] pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Code size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-[var(--admin-title)]">
                Chỉnh sửa Trực tiếp qua JSON (JSON &harr; UI)
              </h3>
              <p className="text-xs text-gray-500">
                Tải lên, sao chép hoặc chỉnh sửa trực tiếp mã JSON và đồng bộ ngay lên giao diện UI
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] hover:bg-[var(--admin-border)]/40 transition cursor-pointer">
              <Upload size={14} /> Tải tệp JSON lên
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] hover:bg-[var(--admin-border)]/40 transition cursor-pointer"
            >
              <Download size={14} /> Xuất tệp
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--admin-border)] bg-[var(--admin-background)] text-[var(--admin-ink)] hover:bg-[var(--admin-border)]/40 transition cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? "Đã chép" : "Sao chép"}
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-[var(--admin-accent)] text-white hover:opacity-90 transition cursor-pointer"
            >
              <RefreshCw size={14} /> Đồng bộ sang UI
            </button>
          </div>
        </div>

        {parseError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {applySuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
            <Check size={16} className="shrink-0" />
            <span>Đã đồng bộ JSON thành công sang giao diện form UI!</span>
          </div>
        )}

        <div className="relative">
          <textarea
            rows={22}
            value={jsonString}
            onChange={(e) => {
              setJsonString(e.target.value);
              setParseError(null);
            }}
            spellCheck={false}
            className="w-full font-mono text-xs p-4 rounded-xl border border-[var(--admin-border)] bg-[#12141c] text-[#e0e6ed] outline-none transition focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20 leading-relaxed resize-y"
          />
        </div>
      </div>
    </div>
  );
}
