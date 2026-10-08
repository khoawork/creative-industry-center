import React, { useRef, useState } from 'react';
import { Image as ImageIcon, LoaderCircle, Upload } from 'lucide-react';
import { UploadAPI } from '../../../api/uploadApi.js';

export default function ForumImageUploadField({ label, value = '', folder, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh không được vượt quá 5 MB.');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const url = await UploadAPI.uploadImage(file, folder);
      if (!url) throw new Error('Máy chủ không trả về đường dẫn ảnh.');
      onChange(url);
    } catch (uploadError) {
      console.error('Không thể tải ảnh diễn đàn lên:', uploadError);
      setError(uploadError.response?.data?.message || uploadError.message || 'Tải ảnh thất bại.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-semibold text-slate-600">{label}</label>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {uploading ? <LoaderCircle size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? 'Đang tải ảnh...' : 'Chọn ảnh từ thiết bị'}
        </button>
        {value && <span className="max-w-full truncate text-[10px] text-slate-500">{value}</span>}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="sr-only"
        />
      </div>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Hoặc dán URL ảnh"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
      />
      {value ? (
        <img src={value} alt="Xem trước" className="h-28 max-w-full rounded-lg border border-slate-200 bg-white object-contain p-1" />
      ) : (
        <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white text-slate-400">
          <ImageIcon size={20} />
        </div>
      )}
    </div>
  );
}
