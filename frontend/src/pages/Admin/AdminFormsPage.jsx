import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Save,
  RefreshCw,
  AlertTriangle,
  Check,
  Sliders,
  HelpCircle,
  Eye,
  Zap,
} from 'lucide-react';
import {
  getAllFormConfigs,
  saveFormConfig,
  getServiceAccountInfo,
  syncFieldsToSheet,
  syncAllFormsToSheet,
  formatRelativeTime,
  DEFAULT_FORM_CONFIGS,
} from '../../services/googleSheetService.js';
import {
  FormListSidebar,
  SheetLinkConfig,
  FieldBuilderTable,
  FormIntegrationGuide,
  FormPreviewContainer,
} from '../../components/Admin/Forms';

export default function AdminFormsPage() {
  const [allConfigs, setAllConfigs] = useState({});
  const [activeFormId, setActiveFormId] = useState('event_newsletter');
  const [currentConfig, setCurrentConfig] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('sheet'); // 'sheet' | 'fields' | 'preview' | 'guide'
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncAllResults, setSyncAllResults] = useState(null);
  const [applyToAllForms, setApplyToAllForms] = useState(true);
  const [serviceAccountInfo, setServiceAccountInfo] = useState({
    configured: false,
    botEmail: 'form-to-google-sheet@sharp-bulwark-510807-v0.iam.gserviceaccount.com',
  });
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Danh sách các form hệ thống
  const formList = Object.values(DEFAULT_FORM_CONFIGS);

  // Tải cấu hình form & thông tin Service Account khi trang khởi động
  useEffect(() => {
    const loaded = getAllFormConfigs();
    setAllConfigs(loaded);

    // Tìm URL Google Sheet dùng chung sẵn có (nếu form nào đó đã lưu)
    let commonSheetUrl = '';
    for (const key of Object.keys(loaded)) {
      if (loaded[key]?.sheetUrl && loaded[key].sheetUrl.trim()) {
        commonSheetUrl = loaded[key].sheetUrl.trim();
        break;
      }
    }

    // Nạp form đang chọn
    const activeRaw = loaded[activeFormId] || DEFAULT_FORM_CONFIGS[activeFormId];
    const activeCfg = JSON.parse(JSON.stringify(activeRaw));
    if ((!activeCfg.sheetUrl || !activeCfg.sheetUrl.trim()) && commonSheetUrl) {
      activeCfg.sheetUrl = commonSheetUrl;
    }
    setCurrentConfig(activeCfg);

    // Lấy thông tin Bot Service Account từ backend
    getServiceAccountInfo().then((res) => {
      if (res?.botEmail) {
        setServiceAccountInfo(res);
      }
    });
  }, []);

  // Khi chuyển đổi biểu mẫu
  const handleSelectForm = (id) => {
    setActiveFormId(id);
    const cfg = allConfigs[id] || DEFAULT_FORM_CONFIGS[id];
    const newCfg = JSON.parse(JSON.stringify(cfg));

    // Nếu form mới chưa có URL, tự động kế thừa URL đang dùng chung
    if ((!newCfg.sheetUrl || !newCfg.sheetUrl.trim()) && currentConfig?.sheetUrl) {
      newCfg.sheetUrl = currentConfig.sheetUrl;
    }

    setCurrentConfig(newCfg);
    setSyncResult(null);
  };

  // Cập nhật cấu hình form hiện tại
  const handleUpdateConfigField = (field, value) => {
    setCurrentConfig((prev) => {
      const next = { ...prev, [field]: value };
      return next;
    });

    // Nếu thay đổi sheetUrl và đang bật chế độ dùng chung -> cập nhật cho tất cả các form
    if (field === 'sheetUrl' && applyToAllForms) {
      setAllConfigs((prev) => {
        const updated = { ...prev };
        Object.keys(DEFAULT_FORM_CONFIGS).forEach((k) => {
          updated[k] = {
            ...(updated[k] || DEFAULT_FORM_CONFIGS[k]),
            sheetUrl: value,
          };
        });
        return updated;
      });
    }
  };

  // Thao tác Fields
  const handleAddField = () => {
    const newKey = `truong_${Date.now().toString().slice(-4)}`;
    const newField = {
      key: newKey,
      label: 'Trường thông tin mới',
      type: 'text',
      placeholder: 'Nhập thông tin...',
      required: false,
      colSpan: 1,
    };
    setCurrentConfig((prev) => ({
      ...prev,
      fields: [...(prev.fields || []), newField],
    }));
  };

  const handleUpdateField = (index, fieldKey, value) => {
    setCurrentConfig((prev) => {
      const nextFields = [...prev.fields];
      nextFields[index] = {
        ...nextFields[index],
        [fieldKey]: value,
      };
      return { ...prev, fields: nextFields };
    });
  };

  const handleRemoveField = (index) => {
    setCurrentConfig((prev) => {
      const nextFields = prev.fields.filter((_, i) => i !== index);
      return { ...prev, fields: nextFields };
    });
  };

  // Đồng bộ tiêu đề các cột vào đúng Tab Google Sheet (Chỉ ghi Row 1, không ghi test data)
  const handleSyncToSheet = async () => {
    if (!currentConfig?.sheetUrl?.trim()) {
      showToast('Vui lòng nhập đường dẫn Google Sheet trước khi đồng bộ!', 'error');
      return;
    }
    const targetSheetName = currentConfig.sheetName || 'DangKySuKien';
    setIsSyncing(true);
    setSyncResult(null);

    try {
      const res = await syncFieldsToSheet(
        currentConfig.sheetUrl,
        targetSheetName,
        currentConfig.fields || []
      );
      setSyncResult(res);
      if (res.success) {
        const nowIso = new Date().toISOString();
        const updatedCfg = {
          ...currentConfig,
          lastSyncedAt: nowIso,
          syncedSheetName: targetSheetName,
        };
        setCurrentConfig(updatedCfg);
        await saveFormConfig(activeFormId, updatedCfg);
        setAllConfigs((prev) => ({
          ...prev,
          [activeFormId]: updatedCfg,
        }));

        showToast(`Đã đồng bộ tiêu đề các cột vào trang tính "${targetSheetName}" thành công!`);
      } else {
        showToast(res.message || 'Không thể đồng bộ vào Google Sheet!', 'error');
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: error.message || 'Lỗi khi đồng bộ các cột vào Google Sheet.',
      });
      showToast('Lỗi khi đồng bộ Google Sheet!', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Đồng bộ tất cả 7 Form cùng 1 lúc (1 lần duy nhất)
  const handleSyncAllForms = async () => {
    const targetUrl = currentConfig?.sheetUrl;
    if (!targetUrl?.trim()) {
      showToast('Vui lòng nhập đường dẫn Google Sheet trước khi đồng bộ tất cả!', 'error');
      return;
    }

    setIsSyncingAll(true);
    setSyncAllResults(null);

    try {
      const allFormsPayload = formList.map((f) => {
        const saved = allConfigs[f.id] || f;
        return {
          id: f.id,
          sheetName: saved.sheetName || f.sheetName,
          fields: saved.fields || f.fields,
        };
      });

      const res = await syncAllFormsToSheet(targetUrl, allFormsPayload);
      setSyncAllResults(res);

      if (res.success) {
        const nowIso = res.syncedAt || new Date().toISOString();

        // Cập nhật lastSyncedAt cho toàn bộ các form
        const nextAllConfigs = { ...allConfigs };
        for (const item of formList) {
          const fid = item.id;
          const current = nextAllConfigs[fid] || item;
          const updated = {
            ...current,
            sheetUrl: targetUrl,
            lastSyncedAt: nowIso,
          };
          nextAllConfigs[fid] = updated;
          await saveFormConfig(fid, updated);
        }

        setAllConfigs(nextAllConfigs);
        if (nextAllConfigs[activeFormId]) {
          setCurrentConfig(nextAllConfigs[activeFormId]);
        }

        showToast(res.message || 'Đã đồng bộ tất cả 7 biểu mẫu vào Google Sheet thành công!');
      } else {
        showToast(res.message || 'Có lỗi khi đồng bộ tất cả các trang tính.', 'error');
      }
    } catch (error) {
      console.error('Lỗi sync all:', error);
      showToast('Lỗi khi thực hiện đồng bộ tất cả biểu mẫu.', 'error');
    } finally {
      setIsSyncingAll(false);
    }
  };

  // Lưu cấu hình
  const handleSave = async () => {
    if (!currentConfig) return;
    setIsSaving(true);
    try {
      // Lưu form hiện tại
      await saveFormConfig(activeFormId, currentConfig);

      // Nếu bật "dùng chung link cho tất cả form", lưu đồng bộ sheetUrl cho mọi form
      if (applyToAllForms && currentConfig.sheetUrl) {
        for (const key of Object.keys(DEFAULT_FORM_CONFIGS)) {
          if (key !== activeFormId) {
            const cfgToUpdate = allConfigs[key] || DEFAULT_FORM_CONFIGS[key];
            await saveFormConfig(key, {
              ...cfgToUpdate,
              sheetUrl: currentConfig.sheetUrl,
            });
          }
        }
      }

      setAllConfigs((prev) => ({
        ...prev,
        [activeFormId]: currentConfig,
      }));
      showToast(`Đã lưu cấu hình biểu mẫu "${currentConfig.title}" thành công!`);
    } catch (error) {
      console.error('Lỗi khi lưu biểu mẫu:', error);
      showToast('Có lỗi xảy ra khi lưu cấu hình biểu mẫu.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Khôi phục mặc định
  const handleResetDefault = () => {
    if (window.confirm(`Khôi phục các trường mặc định cho biểu mẫu "${currentConfig?.title}"?`)) {
      const def = DEFAULT_FORM_CONFIGS[activeFormId] || DEFAULT_FORM_CONFIGS.event_newsletter;
      const next = JSON.parse(JSON.stringify(def));
      if (currentConfig?.sheetUrl) next.sheetUrl = currentConfig.sheetUrl;
      setCurrentConfig(next);
      showToast('Đã khôi phục danh sách trường mặc định.');
    }
  };

  // Sao chép email Bot
  const handleCopyBotEmail = () => {
    if (!serviceAccountInfo.botEmail) return;
    navigator.clipboard.writeText(serviceAccountInfo.botEmail);
    setIsEmailCopied(true);
    setTimeout(() => setIsEmailCopied(false), 2500);
    showToast('Đã sao chép email Bot! Hãy dán vào nút Chia sẻ (Share) trên Google Sheet.');
  };

  if (!currentConfig) {
    return <div className="p-8 text-center text-gray-500">Đang tải cấu hình biểu mẫu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Toast thông báo */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-4 py-3 shadow-lg transition-all animate-bounce">
          {toast.type === 'error' ? (
            <AlertTriangle className="size-5 text-red-500 shrink-0" />
          ) : (
            <Check className="size-5 text-emerald-500 shrink-0" />
          )}
          <span className="text-sm font-medium text-(--admin-title)">{toast.message}</span>
        </div>
      )}

      {/* Header trang quản trị */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-(--admin-border) pb-5">
        <div>
          <p className="text-[11px] font-semibold tracking-wider text-(--admin-heading) uppercase">
            Hệ thống &amp; Tích hợp Dữ liệu
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-(--admin-title) sm:text-3xl flex items-center gap-2.5 mt-1">
            <FileSpreadsheet className="w-7 h-7 text-(--admin-heading)" />
            Quản Lý Biểu Mẫu &amp; Tích Hợp Google Sheet
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-3xl">
            Tất cả 7 biểu mẫu trên website được quản lý tập trung. Bạn chỉ cần đồng bộ 1 lần duy nhất, các lần sau dữ liệu người dùng gửi sẽ tự động lưu vào trang tính mà không cần đồng bộ lại.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSyncAllForms}
            disabled={isSyncingAll || !currentConfig.sheetUrl}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition cursor-pointer disabled:opacity-40"
            title="Tự động khởi tạo cả 7 tab trong Google Sheet trong 1 lần bấm"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>{isSyncingAll ? 'Đang sync 7 tab...' : '⚡ Đồng bộ tất cả (1 lần)'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-(--admin-border) bg-(--admin-surface) text-gray-600 hover:text-gray-900 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Mặc định
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-(--admin-heading) text-white shadow-sm hover:opacity-95 transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
          </button>
        </div>
      </div>

      {/* LAYOUT 2 CỘT: Cột trái (Sidebar chọn form) & Cột phải (Cấu hình chi tiết form) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* CỘT TRÁI (4/12 trên Desktop): Sidebar danh sách Form */}
        <div className="lg:col-span-4 xl:col-span-4 sticky top-6">
          <FormListSidebar
            forms={formList}
            activeFormId={activeFormId}
            onSelectForm={handleSelectForm}
            allConfigs={allConfigs}
            sharedSheetUrl={currentConfig.sheetUrl}
          />
        </div>

        {/* CỘT PHẢI (8/12 trên Desktop): Chi tiết cấu hình Form đang chọn */}
        <div className="lg:col-span-8 xl:col-span-8 space-y-4">
          {/* Header Card Form đang chọn */}
          <div className="p-4 rounded-2xl border border-(--admin-border) bg-(--admin-surface) shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-(--admin-heading)/10 text-(--admin-heading)">
                    {currentConfig.badgeText || 'BIỂU MẪU'}
                  </span>
                  <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    ID: {currentConfig.id}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-(--admin-title) mt-1">
                  {currentConfig.title}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {currentConfig.subtitle}
                </p>
              </div>

              {/* Thông tin gắn kết trang web */}
              <div className="flex items-center gap-2 text-right">
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Trang hiển thị</span>
                  <span className="text-xs font-mono font-bold text-(--admin-heading)">
                    {currentConfig.pagePath}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-Tabs chuyển đổi giữa Cấu hình Sheet, Cấu hình Fields, Giao diện mẫu và Hướng dẫn */}
            <div className="flex items-center gap-1 mt-4 pt-3 border-t border-(--admin-border) overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveSubTab('sheet')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition cursor-pointer shrink-0 ${
                  activeSubTab === 'sheet'
                    ? 'bg-(--admin-heading) text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                1. Google Sheet &amp; Trang Tính
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('fields')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition cursor-pointer shrink-0 ${
                  activeSubTab === 'fields'
                    ? 'bg-(--admin-heading) text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Sliders className="w-4 h-4" />
                2. Cột Dữ Liệu ({currentConfig.fields?.length || 0} Fields)
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('preview')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition cursor-pointer shrink-0 ${
                  activeSubTab === 'preview'
                    ? 'bg-(--admin-heading) text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye className="w-4 h-4" />
                3. Giao Diện Mẫu Ngoài Web
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('guide')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition cursor-pointer shrink-0 ${
                  activeSubTab === 'guide'
                    ? 'bg-(--admin-heading) text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                4. Luồng Hoạt Động &amp; Hướng Dẫn
              </button>
            </div>
          </div>

          {/* NỘI DUNG TƯƠNG ỨNG VỚI SUB-TAB ĐANG CHỌN */}

          {/* Sub-Tab 1: Liên kết Google Sheet */}
          {activeSubTab === 'sheet' && (
            <SheetLinkConfig
              sheetUrl={currentConfig.sheetUrl || ''}
              sheetName={currentConfig.sheetName || ''}
              lastSyncedAt={currentConfig.lastSyncedAt}
              onUpdateSheetUrl={(val) => handleUpdateConfigField('sheetUrl', val)}
              onUpdateSheetName={(val) => handleUpdateConfigField('sheetName', val)}
              onSync={handleSyncToSheet}
              isSyncing={isSyncing}
              syncResult={syncResult}
              onSyncAll={handleSyncAllForms}
              isSyncingAll={isSyncingAll}
              syncAllResults={syncAllResults}
              botEmail={serviceAccountInfo.botEmail}
              isEmailCopied={isEmailCopied}
              onCopyBotEmail={handleCopyBotEmail}
              applyToAllForms={applyToAllForms}
              onToggleApplyToAll={setApplyToAllForms}
            />
          )}

          {/* Sub-Tab 2: Cấu hình Fields */}
          {activeSubTab === 'fields' && (
            <FieldBuilderTable
              fields={currentConfig.fields || []}
              onAddField={handleAddField}
              onUpdateField={handleUpdateField}
              onRemoveField={handleRemoveField}
            />
          )}

          {/* Sub-Tab 3: Giao diện mẫu ngoài web (Preview) */}
          {activeSubTab === 'preview' && (
            <FormPreviewContainer formConfig={currentConfig} />
          )}

          {/* Sub-Tab 4: Luồng hoạt động & Hướng dẫn */}
          {activeSubTab === 'guide' && (
            <FormIntegrationGuide
              formConfig={currentConfig}
              botEmail={serviceAccountInfo.botEmail}
              sheetUrl={currentConfig.sheetUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}

