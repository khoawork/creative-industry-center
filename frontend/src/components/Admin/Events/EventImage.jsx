import { useState } from 'react'
import { ImageOff } from 'lucide-react'

export default function EventImage({ src, alt, className = '' }) {
  const [failedSource, setFailedSource] = useState(null)
  return <div className={`flex items-center justify-center overflow-hidden bg-black/5 ${className}`}>
    {src && failedSource !== src
      ? <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" onError={() => setFailedSource(src)} />
      : <span className="flex items-center gap-2 p-3 text-sm opacity-60"><ImageOff size={20} aria-hidden="true" />Chưa có ảnh</span>}
  </div>
}
