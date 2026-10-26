import React, { useRef, useState } from 'react';
import mammoth from 'mammoth';
import {
  FileText,
  Upload,
  Eye,
  Code,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileCheck,
} from 'lucide-react';

export default function WordDocumentUploader({
  label = 'Tài liệu chi tiết Profile (Word .docx)',
  value = '',
  onChange,
  className = '',
}) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeView, setActiveView] = useState('preview'); // 'preview' | 'html'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Xử lý chuyển đổi file .docx sang HTML bằng mammoth
  const processDocxFile = async (file) => {
    if (!file) return;

    // Kiểm tra định dạng đuôi file
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.docx') && !lowerName.endsWith('.doc')) {
      setErrorMsg('Vui lòng chọn đúng tệp Microsoft Word có định dạng .docx');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('Đang trích xuất nội dung từ file Word...');

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Cấu hình chuyển đổi ảnh inline sang base64 data-url
      const options = {
        convertImage: mammoth.images.imgElement((image) => {
          return image.read('base64').then((imageBuffer) => {
            return {
              src: `data:${image.contentType};base64,${imageBuffer}`,
            };
          });
        }),
      };

      const result = await mammoth.convertToHtml({ arrayBuffer }, options);
      const convertedHtml = result.value || '';

      if (!convertedHtml.trim()) {
        throw new Error('Tệp Word rỗng hoặc không có nội dung văn bản.');
      }

      setUploadedFileName(file.name);
      if (onChange) {
        onChange(convertedHtml);
      }

      setSuccessMsg(`Đã tải lên và nạp thành công: "${file.name}"`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Lỗi đọc file Word:', err);
      setErrorMsg(err.message || 'Không thể đọc tệp Word. Vui lòng thử lại.');
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      processDocxFile(file);
    }
  };

  // Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processDocxFile(file);
    }
  };

  const handleClear = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
      if (onChange) onChange('');
      setUploadedFileName('');
      setSuccessMsg('Đã xóa nội dung tài liệu.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const hasContent = Boolean(value && value.trim());

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Tiêu đề & Các nút thao tác */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-(--admin-heading)">
          <FileText size={16} className="text-[#185abd]" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-2">
          {/* Nút ẩn file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {hasContent && (
            <>
              {/* Nút chuyển đổi Preview / HTML */}
              <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveView('preview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                    activeView === 'preview'
                      ? 'bg-[#710008] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Eye size={13} />
                  <span>Xem trước</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('html')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition cursor-pointer ${
                    activeView === 'html'
                      ? 'bg-[#710008] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Code size={13} />
                  <span>Mã HTML</span>
                </button>
              </div>

              {/* Nút Xóa tài liệu */}
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition cursor-pointer"
                title="Xóa tài liệu Word này"
              >
                <Trash2 size={13} />
                <span>Xóa</span>
              </button>
            </>
          )}

          {/* Nút Upload Word chính */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#185abd] hover:bg-[#124a9e] text-white shadow-xs hover:shadow transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Upload size={14} />
                <span>{hasContent ? 'Thay thế file Word (.docx)' : 'Tải lên file Word (.docx)'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Thông báo trạng thái */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
          <AlertCircle size={15} className="shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* KHUNG NỘI DUNG: CHƯA CÓ FILE VS ĐÃ CÓ FILE */}
      {!hasContent ? (
        // Khung Dropzone khi chưa có file Word
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition cursor-pointer ${
            isDragging
              ? 'border-[#185abd] bg-blue-50/70 scale-[1.01]'
              : 'border-slate-300 bg-slate-50/70 hover:border-[#185abd]/60 hover:bg-blue-50/30'
          }`}
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-[#185abd] shadow-xs mb-3">
            <FileText size={28} />
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-800">
            Kéo & thả file Word (.docx) vào đây
          </h4>
          <p className="mt-1.5 max-w-md text-xs text-slate-500 leading-relaxed">
            Hệ thống tự động chuyển đổi toàn bộ định dạng, bảng biểu, danh sách và hình ảnh từ Microsoft Word sang giao diện trang chi tiết.
          </p>

          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#185abd] border border-blue-200 shadow-xs hover:bg-blue-50 transition pointer-events-none"
          >
            <Upload size={14} />
            <span>Chọn file Word từ máy tính</span>
          </button>
        </div>
      ) : activeView === 'preview' ? (
        // Khung XEM TRƯỚC (Preview tờ giấy Word)
        <div className="rounded-2xl border border-slate-200 bg-slate-100/70 p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
              <FileCheck size={16} className="text-emerald-600" />
              <span>Nội dung đã nạp sẵn sàng hiển thị trên trang chi tiết</span>
              {uploadedFileName && (
                <span className="text-slate-500 font-normal">({uploadedFileName})</span>
              )}
            </span>
            <span className="text-[11px] text-slate-400">Xem trước văn bản</span>
          </div>

          {/* Trang giấy hiển thị nội dung Word */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200/80 p-6 sm:p-10 min-h-[280px]">
            <div
              className="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed
                [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#710008] [&_h1]:mt-6 [&_h1]:mb-3
                [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#710008] [&_h2]:mt-5 [&_h2]:mb-2
                [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#710008] [&_h3]:mt-4 [&_h3]:mb-1.5
                [&_p]:my-3 [&_p]:leading-relaxed
                [&_strong]:font-bold [&_strong]:text-slate-900
                [&_em]:italic [&_em]:text-slate-700
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#d49520] [&_blockquote]:bg-[#faf7f2] [&_blockquote]:p-3.5 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-slate-700
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-5 [&_table]:border [&_table]:border-slate-300
                [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:font-bold [&_th]:text-left
                [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5
                [&_img]:rounded-lg [&_img]:my-4 [&_img]:shadow-sm [&_img]:max-w-full [&_img]:mx-auto"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        </div>
      ) : (
        // Khung CHỈNH SỬA MÃ HTML (nếu cần tinh chỉnh trực tiếp)
        <div className="space-y-2">
          <textarea
            rows={12}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white p-4 font-mono text-xs text-slate-800 leading-relaxed focus:border-[#710008] focus:ring-2 focus:ring-[#710008]/10 outline-none"
            placeholder="Mã HTML được trích xuất từ file Word..."
          />
          <p className="text-[11px] text-slate-500">
            💡 <strong>Mẹo:</strong> Bạn có thể tinh chỉnh mã HTML trực tiếp tại đây hoặc bấm tab "Xem trước" để kiểm tra hiển thị.
          </p>
        </div>
      )}
    </div>
  );
}

