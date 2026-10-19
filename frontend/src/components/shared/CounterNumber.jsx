import React, { useState, useEffect, useRef } from 'react';

/**
 * Phân tích chuỗi số có định dạng, tiền tố, hậu tố và dấu phân cách hàng nghìn.
 * VD: "4.000+" -> prefix: "", target: 4000, suffix: "+", separator: "."
 *     "120+"   -> prefix: "", target: 120, suffix: "+", separator: null
 *     "34"     -> prefix: "", target: 34, suffix: "", separator: null
 *     "22+"    -> prefix: "", target: 22, suffix: "+", separator: null
 */
export function parseNumberString(raw) {
  if (typeof raw !== 'string' && typeof raw !== 'number') {
    return { prefix: '', target: 0, suffix: '', separator: null, isNumber: false };
  }
  const str = String(raw).trim();
  const match = str.match(/^([^0-9]*)([0-9]+(?:[.,][0-9]+)*)(.*)$/);
  if (!match) {
    return { prefix: '', target: 0, suffix: str, separator: null, isNumber: false };
  }

  const prefix = match[1] || '';
  const numStr = match[2];
  const suffix = match[3] || '';

  let separator = null;
  let cleanNum = numStr;
  if (numStr.includes('.')) {
    separator = '.';
    cleanNum = numStr.replace(/\./g, '');
  } else if (numStr.includes(',')) {
    separator = ',';
    cleanNum = numStr.replace(/,/g, '');
  }

  const target = parseInt(cleanNum, 10);
  if (isNaN(target)) {
    return { prefix: '', target: 0, suffix: str, separator: null, isNumber: false };
  }

  return { prefix, target, suffix, separator, isNumber: true };
}

export function formatNumberWithMeta(num, meta) {
  if (!meta.isNumber) return meta.suffix || '';
  let formatted = Math.floor(num).toString();
  if (meta.separator) {
    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, meta.separator);
  }
  return (meta.prefix || '') + formatted + (meta.suffix || '');
}

export default function CounterNumber({ value, duration = 2000, className = '' }) {
  const meta = parseNumberString(value);
  const [displayValue, setDisplayValue] = useState(() =>
    meta.isNumber ? formatNumberWithMeta(0, meta) : String(value || '')
  );

  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const currentMeta = parseNumberString(value);
    if (!currentMeta.isNumber || currentMeta.target <= 0) {
      setDisplayValue(String(value || ''));
      return;
    }

    const startCounting = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const startTime = performance.now();
      const target = currentMeta.target;

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic: nhanh lúc đầu, hãm phanh mượt mà khi về số đích
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentNum = Math.floor(ease * target);

        setDisplayValue(formatNumberWithMeta(currentNum, currentMeta));

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          setDisplayValue(formatNumberWithMeta(target, currentMeta));
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    };

    // Kiểm tra nếu trình duyệt hỗ trợ IntersectionObserver
    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            startCounting();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    } else {
      // Fallback nếu không có IntersectionObserver
      startCounting();
      return () => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
      };
    }
  }, [value, duration]);

  return (
    <span ref={containerRef} className={className}>
      {displayValue}
    </span>
  );
}

