import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function ImageUploadField({
  value = '',
  onChange,
  onFileChange,
  selectedFile = null,
  label = 'Hình ảnh',
  required = false,
  error = '',
  placeholder = 'VD: https://... hoặc chọn ảnh từ máy tính',
}) {
  const [internalFile, setInternalFile] = useState(selectedFile);
  const [previewUrl, setPreviewUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  const activeFile = selectedFile !== undefined ? selectedFile : internalFile;

  // Cập nhật previewUrl
  useEffect(() => {
    if (activeFile) {
      const objUrl = URL.createObjectURL(activeFile);
      setPreviewUrl(objUrl);
      return () => URL.revokeObjectURL(objUrl);
    }
    setPreviewUrl(value || '');
  }, [activeFile, value]);

  const handleFileSelection = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError('');

    // Kiểm tra định dạng (JPG, PNG, WEBP)
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setValidationError('Chỉ hỗ trợ file ảnh định dạng JPG, PNG hoặc WEBP.');
      e.target.value = '';
      return;
    }

    // Kiểm tra dung lượng (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setValidationError('Kích thước ảnh không được vượt quá 5 MB.');
      e.target.value = '';
      return;
    }

    setInternalFile(file);
    if (onFileChange) {
      onFileChange(file);
    }
    if (onChange) {
      // Giữ giá trị hoặc preview
      onChange(value || file.name, file);
    }
    e.target.value = '';
  };

  const handleClear = () => {
    setInternalFile(null);
    setPreviewUrl('');
    setValidationError('');
    if (onFileChange) {
      onFileChange(null);
    }
    if (onChange) {
      onChange('', null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[var(--admin-text)] uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {activeFile && (
          <span className="text-[11px] text-amber-400 font-medium">
            Ảnh sẽ được tải lên Cloudinary khi lưu
          </span>
        )}
      </div>

      {/* Button & Input File Action */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelection}
          className="sr-only"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--admin-border)] bg-black/20 hover:bg-white/10 text-[var(--admin-text)] transition cursor-pointer shadow-sm active:scale-95"
        >
          <Upload className="w-3.5 h-3.5 text-violet-400" />
          <span>{activeFile ? 'Đổi ảnh đã chọn' : 'Chọn ảnh từ máy tính'}</span>
        </button>

        {activeFile && (
          <span className="text-xs text-[var(--admin-text-muted)] truncate max-w-[220px]">
            {activeFile.name} ({(activeFile.size / 1024).toFixed(0)} KB)
          </span>
        )}

        {(previewUrl || value || activeFile) && (
          <button
            type="button"
            onClick={handleClear}
            title="Xóa ảnh"
            className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {validationError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* URL Text input fallback */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (onChange) onChange(e.target.value, activeFile);
        }}
        className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-black/20 text-[var(--admin-text)] focus:outline-none transition ${
          error ? 'border-rose-500' : 'border-[var(--admin-border)] focus:border-violet-500'
        }`}
      />
      {error && <p className="text-xs text-rose-400">{error}</p>}

      {/* Image Preview Box */}
      <div className="mt-2 relative rounded-xl overflow-hidden border border-[var(--admin-border)] bg-black/30 h-32 flex items-center justify-center">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Xem trước ảnh"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 text-[var(--admin-text-muted)]">
            <ImageIcon className="w-6 h-6 opacity-40" />
            <span className="text-xs">Chưa có ảnh</span>
          </div>
        )}
        {previewUrl && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
            <span className="text-[10px] text-zinc-300 font-mono truncate block">
              {activeFile ? `[File] ${activeFile.name}` : value || 'Ảnh xem trước'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
