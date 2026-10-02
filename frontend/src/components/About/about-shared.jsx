import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../shared/Icon.jsx';
import { getAboutIconName } from '../../config/About/aboutConfig.js';
function getSafeUrl(value) {
  // oxlint-disable-next-line no-control-regex -- Reject characters normalized away by browsers.
  if (typeof value !== 'string' || !value || /[\s\\\u0000-\u001f\u007f\u0085]/u.test(value)) return null
  if (value.startsWith('/') && !value.startsWith('//')) return value
  if (!/^https?:\/\/[^/?#]+/i.test(value)) return null
  try {
    const url = new URL(value)
    return url.hostname ? value : null
  } catch {
    return null
  }
}



export function AboutIcon({ code, size = 24, className = '' }) {
  const name = getAboutIconName(code);
  if (!name) return null;
  return <span aria-hidden="true" className={`inline-flex shrink-0 ${className}`}><Icon name={name} size={size} /></span>;
}

export function AboutLink({ href, className = '', children }) {
  const url = getSafeUrl(href);
  if (!url) return null;
  const classes = `focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d49520] ${className}`;
  return url.startsWith('/')
    ? <Link to={url} className={classes}>{children}</Link>
    : <a href={url} className={classes}>{children}</a>;
}

export function AboutHeading({ tag, title }) {
  return (
    <>
      {tag && <p className="inline-flex rounded-full border border-[#d49520]/40 bg-[#d49520]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-[#710008]">{tag}</p>}
      <h2 className="text-2xl font-extrabold leading-tight text-[#710008] lg:text-3xl">{title}</h2>
      <div aria-hidden="true" className="h-1.5 w-20 rounded-full bg-[#d49520]" />
    </>
  );
}

export function AboutImage({ image }) {
  const [failedUrl, setFailedUrl] = useState(null);
  const url = getSafeUrl(image?.url);
  const unavailable = !url || failedUrl === url;
  return (
    <figure className="relative isolate grid min-h-72 overflow-hidden rounded-xl border-2 border-[#d49520]/50 bg-[#f4f3f1] shadow-xl sm:min-h-[450px]">
      {unavailable ? (
        <div role="img" aria-label={image?.alt || 'Ảnh chưa có'} className="flex min-h-72 flex-col items-center justify-center gap-2 px-6 py-12 text-center text-black/70">
          <p className="font-semibold">Không thể hiển thị ảnh</p>
          {image?.alt && <p className="text-sm">{image.alt}</p>}
        </div>
      ) : (
        <img src={url} alt={image?.alt || ''} loading="lazy" onError={() => setFailedUrl(url)} className="absolute inset-0 h-full w-full object-cover" />
      )}
      {(image?.tag || image?.caption_title) && (
        <figcaption className="relative self-end space-y-1 bg-linear-to-t from-black via-black/80 to-black/0 px-5 pt-16 pb-6 text-white sm:px-6">
          {image.tag && <p className="text-xs font-bold uppercase tracking-wider text-[#d49520]">{image.tag}</p>}
          {image.caption_title && <p className="font-bold leading-snug">{image.caption_title}</p>}
        </figcaption>
      )}
    </figure>
  );
}
