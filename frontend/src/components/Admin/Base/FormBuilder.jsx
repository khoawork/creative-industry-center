import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Sliders,
  Eye,
  AlertCircle,
  Monitor,
  Smartphone,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Columns,
  Sparkles,
  Lock,
  RefreshCw,
  Check,
} from 'lucide-react';
import { AdminConfirmModal } from '../Common/index.js';
import DynamicFormRenderer from '../../shared/DynamicFormRenderer.jsx';
import { syncFieldsToSheet, getFormConfig } from '../../../services/googleSheetService.js';

/**
 * Hàm chuẩn hóa nhãn tiếng Việt thành mã khóa slug ASCII an toàn
 */
const slugify = (text) => {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 35);
};

// Các tùy chọn loại trường nhập liệu
const FIELD_TYPES = [
  { value: 'text', label: 'Văn bản ngắn (Text)', icon: 'T' },
  { value: 'tel', label: 'Số điện thoại (Tel)', icon: '📞' },
  { value: 'email', label: 'Địa chỉ Email', icon: '✉️' },
  { value: 'number', label: 'Số lượng / Giá trị số', icon: '#' },
  { value: 'textarea', label: 'Văn bản nhiều dòng (Textarea)', icon: '📝' },
  { value: 'select', label: 'Danh sách lựa chọn (Dropdown)', icon: '▼' },
  { value: 'radio', label: 'Chọn một trong nhiều (Radio)', icon: '◉' },
  { value: 'checkbox', label: 'Hộp kiểm (Checkbox)', icon: '☑' },
  { value: 'date', label: 'Ngày tháng (Date)', icon: '📅' },
  { value: 'time', label: 'Thời gian (Time)', icon: '⏰' },
];

// Các tùy chọn độ rộng layout cho từng trường
const WIDTH_OPTIONS = [
  { value: 'full', label: '100% (Toàn dòng)', col: '12/12' },
  { value: 'half', label: '50% (Nửa dòng)', col: '6/12' },
  { value: 'third', label: '33% (Một phần ba)', col: '4/12' },
  { value: 'two-thirds', label: '67% (Hai phần ba)', col: '8/12' },
  { value: 'quarter', label: '25% (Một phần tư)', col: '3/12' },
];

// Bảng màu sắc chủ đạo gợi ý
const ACCENT_COLORS = [
  { label: 'Đỏ đô Kỷ lục', value: '#710008' },
  { label: 'Vàng kim VietKings', value: '#805600' },
  { label: 'Xanh Navy', value: '#1e3a8a' },
  { label: 'Xanh Lục bảo', value: '#047857' },
  { label: 'Tím Hoàng gia', value: '#581c87' },
  { label: 'Đen Tối giản', value: '#1f2937' },
];

/**
 * Reusable FormBuilder Component (Nâng cấp toàn diện)
 *
 * Hỗ trợ tạo và tùy chỉnh form động với đa dạng loại trường,
 * điều chỉnh layout lưới 12 cột linh hoạt và xem trước trực tiếp (Desktop/Mobile).
 */
export default function FormBuilder({
  value = {},
  onChange,
  errors = {},
  formId = null,
  sheetUrl = '',
  sheetName = '',
  showFormMeta = true,
  showPreview = true,
  previewValue = null,
  previewFooter = null,
  previewAccentColor = '#710008',
  title = 'Cấu hình Khối Form & Các Ô Nhập Liệu',
  description = 'Admin có thể tự do thêm mới, tùy chỉnh chủ đề (nhãn), gợi ý nhập (placeholder), kiểu dữ liệu và độ rộng layout cho từng ô nhập liệu.',
}) {
  // Chuẩn hóa dữ liệu tương thích cả 2 format (Base FormBuilder và GoogleSheetConfig)
  const formTitle = value?.form_title ?? value?.title ?? '';
  const formDescription = value?.form_description ?? value?.subtitle ?? '';
  const badgeText = value?.badge_text ?? value?.badgeText ?? '';
  const buttonText = value?.button_text ?? value?.submitButtonText ?? 'Gửi Hồ Sơ';
  const buttonAlign = value?.button_align ?? 'left';
  const accentColor = value?.accent_color ?? value?.theme_color ?? previewAccentColor;
  const privacyText = value?.privacy_text ?? value?.privacyText ?? '';

  const rawFields = Array.isArray(value?.form_fields)
    ? value.form_fields
    : Array.isArray(value?.fields)
    ? value.fields
    : [];

  // Chuẩn hóa fields sang format nội bộ đầy đủ
  const formFields = rawFields.map((f, i) => ({
    id: f.id || f.key || `field_${i + 1}`,
    key: f.key || f.id || `field_${i + 1}`,
    label: f.label || '',
    placeholder: f.placeholder || '',
    type: f.type || 'text',
    required: Boolean(f.required),
    width: f.width || (f.colSpan === 1 ? 'half' : 'full'),
    options: Array.isArray(f.options) ? f.options : [],
    helpText: f.helpText || '',
    readOnly: Boolean(f.readOnly),
  }));

  // State điều khiển preview thiết bị
  const [deviceView, setDeviceView] = useState('desktop'); // desktop | mobile

  // State theo dõi thay đổi cấu trúc & thông báo nhắc đồng bộ Google Sheet
  const [hasModified, setHasModified] = useState(false);
  const [isQuickSyncing, setIsQuickSyncing] = useState(false);
  const [quickSyncSuccess, setQuickSyncSuccess] = useState(false);
  const [quickSyncError, setQuickSyncError] = useState('');

  // State xác nhận xóa trường
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    fieldIndex: null,
    fieldLabel: '',
  });

  // Hàm cập nhật dữ liệu cha (Đồng bộ cả 2 chuẩn format để an toàn 100%)
  const updateParent = (updates) => {
    if (typeof onChange !== 'function') return;

    const currentFields = updates.form_fields !== undefined ? updates.form_fields : formFields;

    // Chuẩn hóa fields cho Google Sheet format
    const sheetFields = currentFields.map((field) => ({
      key: field.key || field.id,
      label: field.label,
      type: field.type,
      placeholder: field.placeholder,
      required: field.required,
      colSpan: field.width === 'half' ? 1 : 2,
      width: field.width,
      options: field.options,
    }));

    const nextValue = {
      ...value,
      ...updates,
      // Đồng bộ chuẩn Base FormBuilder
      form_title: updates.form_title !== undefined ? updates.form_title : formTitle,
      form_description: updates.form_description !== undefined ? updates.form_description : formDescription,
      button_text: updates.button_text !== undefined ? updates.button_text : buttonText,
      form_fields: currentFields,
      // Đồng bộ chuẩn GoogleSheetService
      title: updates.form_title !== undefined ? updates.form_title : formTitle,
      subtitle: updates.form_description !== undefined ? updates.form_description : formDescription,
      submitButtonText: updates.button_text !== undefined ? updates.button_text : buttonText,
      fields: sheetFields,
      badgeText: updates.badge_text !== undefined ? updates.badge_text : badgeText,
      button_align: updates.button_align !== undefined ? updates.button_align : buttonAlign,
      accent_color: updates.accent_color !== undefined ? updates.accent_color : accentColor,
      privacy_text: updates.privacy_text !== undefined ? updates.privacy_text : privacyText,
    };

    onChange(nextValue);
  };

  // Thêm ô nhập liệu mới với key chuẩn không trùng lặp
  const handleAddField = () => {
    let candidateKey = `truong_${formFields.length + 1}`;
    let count = 1;
    while (formFields.some((f) => f.key === candidateKey)) {
      candidateKey = `truong_${formFields.length + 1}_${count++}`;
    }

    const newField = {
      id: candidateKey,
      key: candidateKey,
      label: `Trường thông tin #${formFields.length + 1}`,
      placeholder: 'Nhập thông tin...',
      type: 'text',
      options: [],
      required: false,
      width: 'full',
      helpText: '',
      isAutoSlug: true,
    };
    setHasModified(true);
    updateParent({ form_fields: [...formFields, newField] });
  };

  // Nhân bản trường
  const handleDuplicateField = (index) => {
    const target = formFields[index];
    if (!target) return;
    if (target.key === 'courseCode' || target.key === 'courseName' || target.readOnly) {
      return; // Không nhân bản trường cố định của hệ thống
    }
    const timestamp = Date.now().toString().slice(-4);
    const duplicatedKey = `${target.key || 'field'}_copy_${timestamp}`;
    const duplicated = {
      ...target,
      id: duplicatedKey,
      key: duplicatedKey,
      label: `${target.label || 'Trường'} (Bản sao)`,
      isAutoSlug: false,
    };
    const nextFields = [...formFields];
    nextFields.splice(index + 1, 0, duplicated);
    setHasModified(true);
    updateParent({ form_fields: nextFields });
  };

  // Mở modal xác nhận xóa
  const promptRemoveField = (index) => {
    const field = formFields[index];
    if (field?.key === 'courseCode' || field?.key === 'courseName' || field?.readOnly) {
      alert('Trường này là trường cố định của hệ thống đào tạo (tự động lấy mã và tên khóa học), không được phép xóa.');
      return;
    }
    setConfirmDelete({
      isOpen: true,
      fieldIndex: index,
      fieldLabel: field?.label || `Trường #${index + 1}`,
    });
  };

  // Thực hiện xóa trường
  const confirmRemoveField = () => {
    if (confirmDelete.fieldIndex === null) return;
    const nextFields = formFields.filter((_, idx) => idx !== confirmDelete.fieldIndex);
    setHasModified(true);
    updateParent({ form_fields: nextFields });
    setConfirmDelete({ isOpen: false, fieldIndex: null, fieldLabel: '' });
  };

  // Di chuyển vị trí trường
  const handleMoveField = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= formFields.length) return;
    const nextFields = [...formFields];
    const temp = nextFields[index];
    nextFields[index] = nextFields[targetIndex];
    nextFields[targetIndex] = temp;
    setHasModified(true);
    updateParent({ form_fields: nextFields });
  };

  // Thay đổi thuộc tính ô nhập liệu
  const handleFieldChange = (index, key, val) => {
    setHasModified(true);
    const nextFields = [...formFields];
    const target = { ...nextFields[index] };

    if (key === 'label') {
      target.label = val;
      // Tự động sinh mã slug nếu trường đang ở chế độ auto slug hoặc mang key mặc định truong_
      if (target.isAutoSlug || String(target.key || '').startsWith('truong_')) {
        const autoSlug = slugify(val);
        if (autoSlug) {
          let finalKey = autoSlug;
          let counter = 1;
          while (formFields.some((f, idx) => idx !== index && f.key === finalKey)) {
            finalKey = `${autoSlug}_${counter++}`;
          }
          target.key = finalKey;
          target.id = finalKey;
          target.isAutoSlug = true;
        }
      }
    } else if (key === 'key') {
      // Làm sạch mã khóa slug nếu Admin chỉnh sửa thủ công
      const cleanKey = slugify(val) || val;
      target.key = cleanKey;
      target.id = cleanKey;
      target.isAutoSlug = false;
    } else {
      target[key] = val;
    }

    nextFields[index] = target;
    updateParent({ form_fields: nextFields });
  };

  // Hàm đồng bộ nhanh cấu trúc cột sang Google Sheet ngay trong FormBuilder
  const handleQuickSync = async () => {
    setIsQuickSyncing(true);
    setQuickSyncError('');
    setQuickSyncSuccess(false);

    try {
      let targetUrl = sheetUrl;
      let targetSheet = sheetName;
      if (!targetUrl && formId) {
        const cfg = getFormConfig(formId);
        targetUrl = cfg?.sheetUrl;
        targetSheet = cfg?.sheetName || targetSheet;
      }

      if (!targetUrl) {
        setQuickSyncError('Chưa có link Google Sheet liên kết. Vui lòng vào trang Quản lý biểu mẫu để dán link Google Sheet trước.');
        return;
      }

      const res = await syncFieldsToSheet(targetUrl, targetSheet || 'DangKySuKien', formFields);
      if (res.success) {
        setQuickSyncSuccess(true);
        setTimeout(() => setQuickSyncSuccess(false), 5000);
      } else {
        setQuickSyncError(res.message || 'Không thể đồng bộ các cột sang Google Sheet.');
      }
    } catch (err) {
      setQuickSyncError(err.message || 'Lỗi khi kết nối Google Sheet.');
    } finally {
      setIsQuickSyncing(false);
    }
  };

  // Dữ liệu dùng cho Live Preview
  const previewConfigData = previewValue || {
    title: formTitle,
    subtitle: formDescription,
    badgeText,
    submitButtonText: buttonText,
    button_align: buttonAlign,
    accent_color: accentColor,
    privacy_text: privacyText,
    fields: formFields,
  };

  return (
    <div className="space-y-6">
      {/* Modal Xác nhận xóa trường */}
      <AdminConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa ô nhập liệu"
        message={`Bạn có chắc chắn muốn xóa "${confirmDelete.fieldLabel}" khỏi biểu mẫu không?\nDữ liệu cấu hình của ô nhập này sẽ bị gỡ bỏ.`}
        confirmText="Xóa ô nhập"
        type="danger"
        onClose={() => setConfirmDelete({ isOpen: false, fieldIndex: null, fieldLabel: '' })}
        onConfirm={confirmRemoveField}
      />

      <div className="p-6 rounded-2xl border border-(--admin-border) bg-(--admin-surface) shadow-sm space-y-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--admin-border) pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-(--admin-accent)/10 text-(--admin-accent)">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-(--admin-title)">{title}</h3>
              {description && (
                <p className="text-xs text-(--admin-heading) mt-0.5 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 1. CẤU HÌNH THÔNG TIN CHUNG & LAYOUT FORM */}
        {showFormMeta && (
          <div className="space-y-4 rounded-xl border border-(--admin-border) bg-(--admin-background)/50 p-4.5">
            <h4 className="text-xs font-bold text-(--admin-heading) uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-(--admin-accent)" />
              1. Cấu hình Tiêu đề, Màu sắc & Nút hành động
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1.5">
                  Tiêu đề biểu mẫu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => updateParent({ form_title: e.target.value })}
                  placeholder="Ví dụ: Đăng Ký Đề Cử Kỷ Lục Mới"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-(--admin-border) bg-(--admin-surface) text-sm font-semibold text-(--admin-title) outline-none transition focus:border-(--admin-accent)"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1.5">
                  Nhãn nhận diện (Badge)
                </label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => updateParent({ badge_text: e.target.value })}
                  placeholder="Ví dụ: HỒ SƠ ĐỀ CỬ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-(--admin-border) bg-(--admin-surface) text-sm text-(--admin-title) outline-none transition focus:border-(--admin-accent)"
                />
              </div>

              <div className="md:col-span-12">
                <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1.5">
                  Mô tả hướng dẫn / Lời chào
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => updateParent({ form_description: e.target.value })}
                  placeholder="Ví dụ: Ban Thư ký sẽ tiếp nhận và liên hệ thẩm định trong vòng 03 ngày làm việc..."
                  className="w-full px-3.5 py-2 rounded-xl border border-(--admin-border) bg-(--admin-surface) text-sm text-(--admin-title) outline-none transition focus:border-(--admin-accent)"
                />
              </div>

              {/* Tùy chỉnh nút gửi & vị trí nút */}
              <div className="md:col-span-5">
                <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1.5">
                  Chữ hiển thị trên Nút gửi
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => updateParent({ button_text: e.target.value })}
                  placeholder="Gửi Thông Tin Ngay"
                  className="w-full px-3.5 py-2 rounded-xl border border-(--admin-border) bg-(--admin-surface) text-sm font-semibold text-(--admin-title) outline-none transition focus:border-(--admin-accent)"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1.5">
                  Căn lề Nút gửi
                </label>
                <div className="flex items-center gap-1 bg-(--admin-surface) p-1 rounded-xl border border-(--admin-border)">
                  {[
                    { id: 'left', label: 'Trái', icon: AlignLeft },
                    { id: 'center', label: 'Giữa', icon: AlignCenter },
                    { id: 'right', label: 'Phải', icon: AlignRight },
                    { id: 'full', label: 'Tràn', icon: Maximize2 },
                  ].map((align) => {
                    const IconComp = align.icon;
                    return (
                      <button
                        key={align.id}
                        type="button"
                        onClick={() => updateParent({ button_align: align.id })}
                        className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          buttonAlign === align.id
                            ? 'bg-(--admin-accent) text-black shadow-xs font-bold'
                            : 'text-(--admin-heading) hover:bg-(--admin-background)'
                        }`}
                        title={align.label}
                      >
                        <IconComp size={14} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-(--admin-heading) uppercase tracking-wider mb-1.5">
                  Màu chủ đạo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => updateParent({ accent_color: e.target.value })}
                    className="size-9 rounded-lg border border-(--admin-border) cursor-pointer p-0.5 bg-transparent"
                    title="Chọn màu tự do"
                  />
                  <div className="flex items-center gap-1 flex-1">
                    {ACCENT_COLORS.slice(0, 3).map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => updateParent({ accent_color: c.value })}
                        className={`size-6 rounded-full border transition cursor-pointer ${
                          accentColor === c.value ? 'ring-2 ring-offset-1 ring-black scale-110' : ''
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BANNER NHẮC ĐỒNG BỘ CỘT SANG GOOGLE SHEET KHI CÓ THAY ĐỔI */}
        {hasModified && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs shadow-2xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 text-amber-700 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">
                  Cấu trúc biểu mẫu vừa được chỉnh sửa!
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Sau khi bấm <strong>Lưu thay đổi</strong> trang này, hãy đảm bảo các cột mới được đồng bộ sang Google Sheet để dữ liệu người dùng gửi về được ghi nhận trọn vẹn.
                </p>
                {quickSyncError && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">
                    ⚠️ {quickSyncError}
                  </p>
                )}
                {quickSyncSuccess && (
                  <p className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
                    <Check size={13} /> Đã đồng bộ cấu trúc cột mới sang Google Sheet thành công!
                  </p>
                )}
              </div>
            </div>

            {(formId || sheetUrl) && (
              <button
                type="button"
                disabled={isQuickSyncing}
                onClick={handleQuickSync}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-(--admin-accent) text-white font-semibold text-xs hover:opacity-90 transition shrink-0 cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                <RefreshCw size={13} className={isQuickSyncing ? 'animate-spin' : ''} />
                {isQuickSyncing ? 'Đang đồng bộ...' : 'Đồng bộ cột sang Sheet'}
              </button>
            )}
          </div>
        )}

        {/* 2. DANH SÁCH & CẤU HÌNH CÁC Ô NHẬP LIỆU */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-(--admin-title) flex items-center gap-2">
                <span>Danh sách Các Trường Dữ Liệu</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-bold border border-blue-500/20">
                  {formFields.length} ô
                </span>
              </h4>
              <p className="text-xs text-(--admin-heading) mt-0.5">
                Tự do kéo chỉnh độ rộng theo lưới (100%, 50%, 33%, 25%), chọn kiểu nhập và thứ tự hiển thị.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddField}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-(--admin-accent) px-4 py-2 text-xs font-bold text-black shadow-xs transition hover:brightness-105 active:scale-98 cursor-pointer shrink-0"
            >
              <Plus size={15} /> Thêm ô nhập liệu mới
            </button>
          </div>

          {/* Khi chưa có ô nào */}
          {formFields.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-(--admin-border) rounded-2xl bg-(--admin-background)/40 space-y-3">
              <AlertCircle className="mx-auto text-gray-400" size={36} />
              <div className="text-sm font-semibold text-(--admin-heading)">
                Biểu mẫu hiện chưa có trường nhập liệu nào.
              </div>
              <button
                type="button"
                onClick={handleAddField}
                className="inline-flex items-center gap-2 rounded-xl bg-(--admin-accent) px-4 py-2 text-xs font-bold text-black transition hover:opacity-90 cursor-pointer"
              >
                <Plus size={15} /> Thêm ô nhập đầu tiên
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {formFields.map((field, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === formFields.length - 1;
                const currentWidth = field.width || 'full';
                const isSystemLocked = field.key === 'courseCode' || field.key === 'courseName' || field.readOnly;

                return (
                  <div
                    key={field.id || `field_${idx}`}
                    className="p-4 rounded-xl border border-(--admin-border) bg-(--admin-background) transition-all hover:border-(--admin-accent)/50 shadow-2xs space-y-3"
                  >
                    {/* Header Thẻ: Số thứ tự, Tên chủ đề, Nhãn loại, Thao tác */}
                    <div className="flex items-center justify-between gap-2 border-b border-(--admin-border)/60 pb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-(--admin-surface) text-xs font-bold text-(--admin-title) border border-(--admin-border)">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-(--admin-title) truncate max-w-xs sm:max-w-md">
                          {field.label || '(Chưa đặt tên trường)'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase bg-gray-200 text-gray-700">
                          {field.type}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                          {WIDTH_OPTIONS.find((w) => w.value === currentWidth)?.label || '100%'}
                        </span>
                        {field.required && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            Bắt buộc
                          </span>
                        )}
                        {isSystemLocked && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30 flex items-center gap-1">
                            <Lock size={10} /> Cố định hệ thống
                          </span>
                        )}
                      </div>

                      {/* Các nút: Di chuyển, Nhân bản, Xóa */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveField(idx, -1)}
                          disabled={isFirst}
                          className="flex size-7 items-center justify-center rounded-lg text-gray-400 hover:text-(--admin-title) hover:bg-(--admin-surface) disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition"
                          title="Di chuyển lên"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveField(idx, 1)}
                          disabled={isLast}
                          className="flex size-7 items-center justify-center rounded-lg text-gray-400 hover:text-(--admin-title) hover:bg-(--admin-surface) disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition"
                          title="Di chuyển xuống"
                        >
                          <ArrowDown size={14} />
                        </button>
                        {!isSystemLocked && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDuplicateField(idx)}
                              className="flex size-7 items-center justify-center rounded-lg text-gray-400 hover:text-(--admin-accent) hover:bg-(--admin-surface) cursor-pointer transition"
                              title="Nhân bản trường này"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => promptRemoveField(idx)}
                              className="flex size-7 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer transition ml-1"
                              title="Xóa trường này"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Form Chi Tiết Của Trường */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                      {/* Tên Nhãn (Label) */}
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                          Tên trường (Nhãn) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={field.label || ''}
                          onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                          placeholder="Ví dụ: Họ và tên đại biểu"
                          className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs font-semibold text-(--admin-title) outline-none focus:border-(--admin-accent)"
                        />
                      </div>

                      {/* Gợi ý nhập (Placeholder) */}
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                          Gợi ý nhập liệu (Placeholder)
                        </label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => handleFieldChange(idx, 'placeholder', e.target.value)}
                          placeholder="Ví dụ: Nguyễn Văn A..."
                          className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) outline-none focus:border-(--admin-accent)"
                        />
                      </div>

                      {/* Loại ô nhập (Field Type) */}
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                          Loại ô nhập
                        </label>
                        <select
                          value={field.type || 'text'}
                          onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) outline-none focus:border-(--admin-accent) cursor-pointer"
                        >
                          {FIELD_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Độ rộng Layout (Grid Width) */}
                      <div className="sm:col-span-7">
                        <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Columns size={13} className="text-(--admin-accent)" />
                          Độ rộng trên biểu mẫu (Layout Grid)
                        </label>
                        <div className="grid grid-cols-5 gap-1 bg-(--admin-surface) p-1 rounded-lg border border-(--admin-border)">
                          {WIDTH_OPTIONS.map((w) => (
                            <button
                              key={w.value}
                              type="button"
                              onClick={() => handleFieldChange(idx, 'width', w.value)}
                              className={`py-1.5 px-1 text-[11px] font-semibold rounded-md transition text-center cursor-pointer ${
                                currentWidth === w.value
                                  ? 'bg-(--admin-accent) text-black font-bold shadow-2xs'
                                  : 'text-(--admin-heading) hover:bg-(--admin-background)'
                              }`}
                              title={w.label}
                            >
                              {w.col}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mã khóa / Bắt buộc */}
                      <div className="sm:col-span-5 flex items-center justify-between gap-3 pt-1">
                        <div className="flex-1">
                          <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                            Mã khóa (Key / Cột Sheet) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={field.key || field.id || ''}
                            readOnly={isSystemLocked}
                            disabled={isSystemLocked}
                            onChange={(e) => {
                              if (isSystemLocked) return;
                              handleFieldChange(idx, 'key', e.target.value);
                            }}
                            placeholder="Mã khóa (slug)"
                            className={`w-full font-mono px-3 py-2 rounded-lg border text-xs outline-none ${
                              isSystemLocked
                                ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed select-none'
                                : 'border-(--admin-border) bg-(--admin-surface) text-(--admin-title) focus:border-(--admin-accent)'
                            }`}
                            title={isSystemLocked ? "Trường cố định hệ thống (không thể đổi mã khóa)" : "Mã định danh của trường trong cơ sở dữ liệu và cột Google Sheet"}
                          />
                        </div>

                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-(--admin-title) select-none pt-4">
                          <input
                            type="checkbox"
                            checked={Boolean(field.required)}
                            onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
                            className="size-4 rounded text-(--admin-accent) accent-(--admin-accent)"
                          />
                          <span>Bắt buộc</span>
                        </label>
                      </div>

                      {/* Tùy chỉnh danh sách lựa chọn (Dropdown / Radio) */}
                      {(field.type === 'select' || field.type === 'radio') && (
                        <div className="sm:col-span-12 pt-2 border-t border-(--admin-border)/50">
                          <label className="block text-[11px] font-bold text-(--admin-heading) uppercase tracking-wider mb-1">
                            Danh sách các phương án chọn (Phân cách bằng dấu phẩy)
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(field.options) ? field.options.join(', ') : ''}
                            onChange={(e) => {
                              const raw = e.target.value;
                              const opts = raw
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean);
                              handleFieldChange(idx, 'options', opts);
                            }}
                            placeholder="Ví dụ: Tham gia trực tiếp, Tham gia trực tuyến, Đại biểu VIP"
                            className="w-full px-3 py-2 rounded-lg border border-(--admin-border) bg-(--admin-surface) text-xs text-(--admin-title) outline-none focus:border-(--admin-accent)"
                          />
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {Array.isArray(field.options) &&
                              field.options.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-(--admin-surface) border border-(--admin-border) text-[11px] font-medium text-(--admin-title)"
                                >
                                  {opt}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. XEM TRƯỚC GIAO DIỆN FORM THỰC TẾ (LIVE PREVIEW) */}
        {showPreview && (
          <div className="pt-6 border-t border-(--admin-border) space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-(--admin-accent)" />
                <h4 className="text-sm font-bold text-(--admin-title)">
                  Xem Trước Giao Diện Biểu Mẫu Thực Tế (Live Preview)
                </h4>
              </div>

              {/* Chuyển đổi Desktop / Mobile */}
              <div className="flex items-center gap-1 bg-(--admin-background) p-1 rounded-xl border border-(--admin-border)">
                <button
                  type="button"
                  onClick={() => setDeviceView('desktop')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    deviceView === 'desktop'
                      ? 'bg-(--admin-surface) text-(--admin-title) shadow-2xs font-bold'
                      : 'text-(--admin-heading)'
                  }`}
                >
                  <Monitor size={14} />
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView('mobile')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    deviceView === 'mobile'
                      ? 'bg-(--admin-surface) text-(--admin-title) shadow-2xs font-bold'
                      : 'text-(--admin-heading)'
                  }`}
                >
                  <Smartphone size={14} />
                  Mobile
                </button>
              </div>
            </div>

            {/* Khung hiển thị Live Preview với DynamicFormRenderer */}
            <div className="p-6 rounded-2xl border border-dashed border-(--admin-border) bg-(--admin-background)/60 flex items-center justify-center min-h-[350px]">
              <div
                className={`w-full transition-all duration-300 ${
                  deviceView === 'mobile'
                    ? 'max-w-sm rounded-3xl p-3 bg-gray-900 shadow-2xl border-4 border-gray-800'
                    : 'max-w-3xl'
                }`}
              >
                {deviceView === 'mobile' && (
                  <div className="w-16 h-3 bg-gray-800 rounded-full mx-auto mb-3" />
                )}
                <div className={deviceView === 'mobile' ? 'rounded-2xl overflow-hidden' : ''}>
                  <DynamicFormRenderer
                    config={previewConfigData}
                    preview={true}
                  />
                  {previewFooter}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
