import React, { useRef, useState } from 'react';
import { Image as ImageIcon, LoaderCircle, Upload, Video as VideoIcon } from 'lucide-react';
import { UploadAPI } from '../../../api/uploadApi.js';

export default function ForumImageUploadField({
  label,
  value = '',
  folder,
  allowVideo = false,
  onChange,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const isVideoUrl = (url) => {
    if (!url) return false;
    const clean = url.split('?')[0].toLowerCase();
    return (
      clean.endsWith('.mp4') ||
      clean.endsWith('.webm') ||
      clean.endsWith('.mov') ||
      clean.endsWith('.ogg') ||
      clean.includes('/video/upload/')
    );
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const fileType = file.type || '';
    const fileName = file.name.toLowerCase();
    const isVid =
      fileType.startsWith('video/') ||
      fileName.endsWith('.mp4') ||
      fileName.endsWith('.webm') ||
      fileName.endsWith('.mov') ||
      fileName.endsWith('.ogg') ||
      fileName.endsWith('.avi');

    if (isVid) {
      if (!allowVideo) {
        setError('Mục này chỉ hỗ trợ hình ảnh.');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('Video không được vượt quá 100 MB.');
        return;
      }
    } else {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(fileType)) {
        setError(allowVideo ? 'Chỉ hỗ trợ ảnh (JPG, PNG, WEBP) hoặc video (MP4, WEBM, MOV).' : 'Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Ảnh không được vượt quá 10 MB.');
        return;
      }
    }

    setError('');
    setUploading(true);
    try {
      const url = isVid
        ? await UploadAPI.uploadVideo(file, folder)
        : await UploadAPI.uploadImage(file, folder);
      if (!url) throw new Error('Máy chủ không trả về đường dẫn tệp.');
      onChange(url);
    } catch (uploadError) {
      console.error('Không thể tải tệp diễn đàn lên:', uploadError);
      setError(uploadError.response?.data?.message || uploadError.message || 'Tải tệp thất bại.');
    } finally {
      setUploading(false);
    }
  };

  const isCurrentVideo = isVideoUrl(value);

  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-semibold text-slate-600">{label}</label>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
        >
          {uploading ? <LoaderCircle size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading
            ? 'Đang tải tệp...'
            : allowVideo
            ? 'Chọn ảnh hoặc video từ thiết bị'
            : 'Chọn ảnh từ thiết bị'}
        </button>
        {value && <span className="max-w-full truncate text-[10px] text-slate-500">{value}</span>}
        <input
          ref={inputRef}
          type="file"
          accept={
            allowVideo
              ? 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/ogg,video/quicktime'
              : 'image/jpeg,image/png,image/webp'
          }
          onChange={handleFileChange}
          className="sr-only"
        />
      </div>
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={allowVideo ? 'Hoặc dán URL ảnh / video banner' : 'Hoặc dán URL ảnh'}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
      />
      {value ? (
        isCurrentVideo ? (
          <div className="relative rounded-lg border border-slate-200 bg-black overflow-hidden">
            <video
              src={value}
              controls
              playsInline
              className="h-44 max-w-full mx-auto object-contain"
            />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-blue-600/80 text-white text-[10px] font-bold">
              Video Banner
            </span>
          </div>
        ) : (
          <img
            src={value}
            alt="Xem trước"
            className="h-32 max-w-full rounded-lg border border-slate-200 bg-white object-contain p-1"
          />
        )
      ) : (
        <div className="flex h-20 items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-white text-slate-400">
          {allowVideo ? <VideoIcon size={20} /> : <ImageIcon size={20} />}
          <span className="text-xs">{allowVideo ? 'Chưa có ảnh hoặc video banner' : 'Chưa có ảnh'}</span>
        </div>
      )}
    </div>
  );
}
