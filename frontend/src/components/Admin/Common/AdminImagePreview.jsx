import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminImagePreview({
  url,
  src,
  alt = 'Hình ảnh',
  label,
  aspectRatio = '16/9',
  onRemove,
  onChangeUrl,
  placeholder = 'Chưa có ảnh hiển thị',
  className = '',
  loading = false,
  isLoading = false,
}) {
  const [hasError, setHasError] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const imageSrc = url || src;
  const isBusy = loading || isLoading || isImgLoading;

  useEffect(() => {
    setHasError(false);
    if (imageSrc) {
      setIsImgLoading(true);
    } else {
      setIsImgLoading(false);
    }
  }, [imageSrc]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <span className="block text-xs font-semibold tracking-wide text-(--admin-heading)">
          {label}
        </span>
      )}

      <div
        className="relative group overflow-hidden rounded-xl border border-(--admin-border) bg-(--admin-background) flex items-center justify-center transition-colors"
        style={{ aspectRatio }}
      >
        {/* Loading Overlay */}
        {(loading || isLoading || isImgLoading) && (
          <div className="absolute inset-0 z-20 bg-(--admin-surface)/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-(--admin-accent)" />
            <span className="text-xs font-medium text-(--admin-ink)/70">Đang tải ảnh...</span>
          </div>
        )}

        {imageSrc && !hasError ? (
          <>
            <img
              src={imageSrc}
              alt={alt}
              loading="lazy"
              onLoad={() => setIsImgLoading(false)}
              onError={() => {
                setIsImgLoading(false);
                setHasError(true);
              }}
              className={`h-full w-full object-cover transition-transform duration-200 group-hover:scale-102 ${
                isBusy ? 'opacity-30' : 'opacity-100'
              }`}
            />
            <div className="absolute inset-0 z-10 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
              <a
                href={imageSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-lg bg-white/90 text-black hover:bg-white text-xs font-semibold transition"
                title="Xem ảnh gốc"
              >
                <ExternalLink size={14} />
              </a>
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="inline-flex size-8 items-center justify-center rounded-lg bg-red-600/90 text-white hover:bg-red-600 text-xs font-semibold transition cursor-pointer"
                  title="Xóa ảnh này"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-(--admin-ink)/50">
            {hasError ? (
              <>
                <AlertCircle size={28} className="text-amber-500" />
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                  Link ảnh không tải được
                </span>
              </>
            ) : (
              <>
                <ImageIcon size={32} strokeWidth={1.5} />
                <span className="text-xs font-medium">{placeholder}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

