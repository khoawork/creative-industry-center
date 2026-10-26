import React, { useEffect, useRef, useState } from 'react';
import mammoth from 'mammoth';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Link2,
  Upload,
  Download,
  Code,
  Eye,
  RotateCcw,
  RotateCw,
  Minus,
  Sparkles,
  Image as ImageIcon,
  Paperclip,
  Table as TableIcon,
  Highlighter,
  FileText,
  LoaderCircle,
  Check,
  X,
  Indent,
  Outdent,
  Eraser,
  Type,
  Maximize2,
  Minimize2,
  Columns2,
  Columns3,
  LayoutGrid,
  ChevronDown,
  ClipboardPaste,
  Trash2,
} from 'lucide-react';
import { UploadAPI } from '../../../api/uploadApi.js';

// Bộ phông chữ chuẩn Microsoft Word
const FONT_FAMILIES = [
  { label: 'Segoe UI (Mặc định)', value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Calibri', value: 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Courier New', value: "'Courier New', Courier, monospace" },
];

// Cỡ chữ chuẩn Word
const FONT_SIZES = [
  { label: '11 pt (Nhỏ)', value: '2' },
  { label: '12 pt (Văn bản thường)', value: '3' },
  { label: '14 pt (Phụ đề)', value: '4' },
  { label: '18 pt (Tiêu đề nhỏ)', value: '5' },
  { label: '24 pt (Tiêu đề lớn)', value: '6' },
  { label: '36 pt (Tiêu đề chính)', value: '7' },
];

// Bảng màu chữ
const TEXT_COLORS = [
  { label: 'Đen tự động', value: '#1a1a1a' },
  { label: 'Đỏ rượu (Thương hiệu)', value: '#710008' },
  { label: 'Vàng đồng', value: '#d49520' },
  { label: 'Xanh dương Word', value: '#2563eb' },
  { label: 'Xanh lục đậm', value: '#15803d' },
  { label: 'Xám đậm', value: '#4b5563' },
  { label: 'Đỏ tươi', value: '#dc2626' },
];

// Bảng bút dạ quang (Highlight marker)
const HIGHLIGHT_COLORS = [
  { label: 'Không màu', value: 'transparent' },
  { label: 'Vàng dạ quang', value: '#fef08a' },
  { label: 'Xanh lục nhạt', value: '#bbf7d0' },
  { label: 'Xanh lam nhạt', value: '#bfdbfe' },
  { label: 'Cam nhạt', value: '#fed7aa' },
  { label: 'Hồng phấn', value: '#fbcfe8' },
];

// HÀM LÀM SẠCH WORD CLIPBOARD: GIỮ NGUYÊN 100% KÝ TỰ, DẤU TIẾNG VIỆT, FONT, MÀU SẮC, BẢNG, BOLD/ITALIC
// VÀ LOẠI BỎ TRIỆT ĐỂ POSITION ABSOLUTE, FLOAT, LỀ ÂM GÂY ĐÈ CHỮ
const cleanWordHtml = (rawHtml) => {
  if (!rawHtml) return '';

  let html = rawHtml;

  // 1. Trích xuất đúng phân đoạn mà Microsoft Word sao chép (nằm giữa StartFragment và EndFragment)
  const startMatch = html.match(/<!--StartFragment-->/i);
  const endMatch = html.match(/<!--EndFragment-->/i);
  if (startMatch && endMatch) {
    const startIdx = html.indexOf(startMatch[0]) + startMatch[0].length;
    const endIdx = html.indexOf(endMatch[0]);
    if (startIdx < endIdx) {
      html = html.substring(startIdx, endIdx);
    }
  }

  // 2. Chuyển đổi ký tự bullet hoặc số thứ tự của Word (MsoListParagraph) thành ký tự rõ ràng
  html = html.replace(/<!--\[if\s+!supportLists\]-->([\s\S]*?)<!--\[endif\]-->/gi, (match, bulletContent) => {
    const textBullet = bulletContent.replace(/<[^>]+>/g, '').trim();
    return `<span style="display:inline-block; min-width: 1.4em; font-weight:bold;">${textBullet || '•'}</span> `;
  });

  // 3. Xóa các chú thích XML Word và conditional comments
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  html = html.replace(/<\/?\??xml[^>]*>/gi, '');
  html = html.replace(/<\/?o:[^>]*>/gi, '');
  html = html.replace(/<\/?w:[^>]*>/gi, '');
  html = html.replace(/<\/?m:[^>]*>/gi, '');
  html = html.replace(/<\/?v:[^>]*>/gi, '');

  // 4. Parse DOM để làm sạch CSS định vị mà vẫn giữ trọn vẹn văn bản tiếng Việt và style
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Loại bỏ các thẻ script, style, meta rác
    const forbidden = doc.querySelectorAll('script, style, link, meta, object, embed, iframe, form, button');
    forbidden.forEach((el) => el.remove());

    const allElements = doc.body.querySelectorAll('*');
    allElements.forEach((el) => {
      // Xóa các thuộc tính Word không dùng trên web
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (
          name.startsWith('on') ||
          name.startsWith('v:') ||
          name.startsWith('o:') ||
          name.startsWith('w:') ||
          name.startsWith('mso-')
        ) {
          el.removeAttribute(attr.name);
        }
        if (name === 'class' && (attr.value.includes('Mso') || attr.value.includes('WordSection'))) {
          el.removeAttribute('class');
        }
      });

      // Làm sạch CSS inline: giữ màu, font, cỡ chữ, căn lề, border; chỉ xóa thuộc tính định vị gây đè chữ
      if (el.hasAttribute('style')) {
        let style = el.getAttribute('style') || '';

        // XÓA CÁC THUỘC TÍNH ĐỊNH VỊ VÀ ĐỘ RỘNG GÂY ĐÈ CHỮ:
        style = style.replace(/position\s*:\s*[^;]+;?/gi, '');
        style = style.replace(/(top|left|right|bottom|z-index)\s*:\s*[^;]+;?/gi, '');
        style = style.replace(/float\s*:\s*[^;]+;?/gi, '');
        style = style.replace(/clear\s*:\s*[^;]+;?/gi, '');
        style = style.replace(/margin(-[a-z]+)?\s*:\s*-[^;]+;?/gi, '');
        style = style.replace(/text-indent\s*:\s*-[^;]+;?/gi, '');
        style = style.replace(/white-space\s*:\s*nowrap\s*;?/gi, '');
        style = style.replace(/min-width\s*:\s*[^;]+;?/gi, '');
        style = style.replace(/width\s*:\s*\d{3,}(px|pt|in|cm)\s*;?/gi, 'max-width: 100%;');
        style = style.replace(/mso-[^:]+:[^;]+;?/gi, '');

        style = style.trim();
        if (style) {
          el.setAttribute('style', style);
        } else {
          el.removeAttribute('style');
        }
      }
    });

    return doc.body.innerHTML;
  } catch (err) {
    console.warn('Lỗi parse HTML Word:', err);
    return html;
  }
};

export default function RichTextEditor({
  label = 'Mô tả chi tiết',
  value = '',
  onChange,
  placeholder = 'Nhập nội dung tài liệu và định dạng như Microsoft Word...',
  className = '',
}) {
  const editorRef = useRef(null);
  const docxInputRef = useRef(null);
  const fileInputHtmlRef = useRef(null);
  const imageInputRef = useRef(null);
  const docInputRef = useRef(null);
  const columnMenuRef = useRef(null);

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview' | 'html'
  const [rawHtml, setRawHtml] = useState(value || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [statusNotice, setStatusNotice] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [currentFont, setCurrentFont] = useState(FONT_FAMILIES[0].value);
  const [currentFontSize, setCurrentFontSize] = useState('3');
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Lưu lại vị trí con trỏ (Range) để chèn ảnh / file / cột đúng vị trí
  const savedSelectionRef = useRef(null);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  // Đóng menu chia cột khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target)) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Đồng bộ prop `value` từ bên ngoài vào `contentEditable` khi giá trị thực sự thay đổi
  useEffect(() => {
    if (value !== undefined && value !== null) {
      if (editorRef.current && editorRef.current.innerHTML !== value) {
        if (document.activeElement !== editorRef.current) {
          editorRef.current.innerHTML = value;
        }
      }
      setRawHtml(value);
    }
  }, [value]);

  // ĐẢM BẢO KHI CHUYỂN TỪ PREVIEW / HTML VỀ EDIT THÌ NỘI DUNG VẪN NGUYÊN VẸN KHÔNG BỊ MẤT
  useEffect(() => {
    if (activeTab === 'edit' && editorRef.current) {
      if (editorRef.current.innerHTML !== rawHtml) {
        editorRef.current.innerHTML = rawHtml || '';
      }
    }
  }, [activeTab, rawHtml]);

  const executeCommand = (command, val = null) => {
    if (activeTab !== 'edit') return;
    restoreSelection();
    document.execCommand(command, false, val);
    handleEditorInput();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setRawHtml(html);
      if (onChange) {
        onChange(html);
      }
    }
    saveSelection();
  };

  const handleRawHtmlChange = (e) => {
    const nextHtml = e.target.value;
    setRawHtml(nextHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = nextHtml;
    }
    if (onChange) {
      onChange(nextHtml);
    }
  };

  // HÀM CHÈN HTML AN TOÀN BẰNG RANGE API: THAY THẾ CHÍNH XÁC VÙNG CHỌN MÀ KHÔNG GÂY LỖI SPLIT TAG
  const insertHtmlAtSelection = (html) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      if (editorRef.current) {
        editorRef.current.innerHTML += html;
      }
      return;
    }

    const range = sel.getRangeAt(0);

    // Nếu con trỏ nằm ngoài editor thì focus lại editor
    if (!editorRef.current?.contains(range.commonAncestorContainer)) {
      editorRef.current?.focus();
    }

    range.deleteContents();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const fragment = document.createDocumentFragment();
    let node = tempDiv.firstChild;
    let lastNode = null;

    while (node) {
      const nextNode = node.nextSibling;
      lastNode = fragment.appendChild(node);
      node = nextNode;
    }

    range.insertNode(fragment);

    // Đưa con trỏ ra ngay sau phần tử vừa dán
    if (lastNode) {
      try {
        const newRange = document.createRange();
        newRange.setStartAfter(lastNode);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
        savedSelectionRef.current = newRange;
      } catch (rangeErr) {
        // Fallback an toàn
      }
    }
  };

  // 1. DÁN THÔNG MINH (Ctrl + V): GIỮ NGUYÊN 100% ĐỊNH DẠNG VÀ TỪNG KÝ TỰ WORD
  const handlePaste = async (e) => {
    // A. Nếu clipboard chứa hình ảnh: upload và chèn ảnh
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            await uploadAndInsertImage(file);
          }
          return;
        }
      }
    }

    // B. Nếu clipboard chứa mã HTML từ Microsoft Word, Google Docs hoặc web
    const rawHtmlPaste = e.clipboardData?.getData('text/html');
    const plainTextPaste = e.clipboardData?.getData('text/plain');

    if (rawHtmlPaste && rawHtmlPaste.trim()) {
      e.preventDefault();
      const cleaned = cleanWordHtml(rawHtmlPaste);
      if (cleaned && cleaned.trim()) {
        insertHtmlAtSelection(cleaned);
        handleEditorInput();
        setStatusNotice('Đã dán giữ nguyên 100% định dạng từ Word!');
        setTimeout(() => setStatusNotice(''), 3000);
        return;
      }
    }

    // C. Fallback: Dán văn bản thuần túy (Plain Text) giữ trọn vẹn từng ký tự & dòng ngắt
    if (plainTextPaste) {
      e.preventDefault();
      const paragraphs = plainTextPaste.split(/\r?\n\r?\n/);
      if (paragraphs.length > 1) {
        const formatted = paragraphs
          .map((p) => `<p style="margin: 0.5em 0; line-height: 1.7;">${p.replace(/\r?\n/g, '<br/>')}</p>`)
          .join('');
        insertHtmlAtSelection(formatted);
      } else {
        insertHtmlAtSelection(`<p style="margin: 0.5em 0; line-height: 1.7;">${plainTextPaste.replace(/\r?\n/g, '<br/>')}</p>`);
      }
      handleEditorInput();
      setStatusNotice('Đã dán văn bản nguyên vẹn từng ký tự!');
      setTimeout(() => setStatusNotice(''), 3000);
    }
  };

  // NÚT BẤM DÁN TỪ WORD TRÊN THANH CÔNG CỤ
  const handlePasteFromWordButton = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          if (item.types.includes('text/html')) {
            const blob = await item.getType('text/html');
            const html = await blob.text();
            const cleaned = cleanWordHtml(html);
            if (cleaned) {
              insertHtmlAtSelection(cleaned);
              handleEditorInput();
              setStatusNotice('Đã dán thành công văn bản chuẩn Word!');
              setTimeout(() => setStatusNotice(''), 3000);
              return;
            }
          }
          if (item.types.includes('text/plain')) {
            const blob = await item.getType('text/plain');
            const text = await blob.text();
            if (text) {
              insertHtmlAtSelection(`<p style="margin: 0.5em 0; line-height: 1.7;">${text.replace(/\r?\n/g, '<br/>')}</p>`);
              handleEditorInput();
              setStatusNotice('Đã dán văn bản!');
              setTimeout(() => setStatusNotice(''), 3000);
              return;
            }
          }
        }
      }
      alert('Vui lòng nhấp chuột vào trang giấy rồi nhấn tổ hợp phím Ctrl + V để dán.');
    } catch (err) {
      alert('Vui lòng nhấp chuột vào trang giấy rồi nhấn tổ hợp phím Ctrl + V để dán trực tiếp từ Word.');
    }
  };

  // 2. CHIA CỘT VĂN BẢN (COLUMNS LAYOUT) HOẶC HỦY CHIA CỘT
  const handleInsertColumns = (type) => {
    restoreSelection();

    // HỦY CHIA CỘT: MỞ RỘNG TẤT CẢ VĂN BẢN TRONG CỘT RA NGOÀI VÀ XÓA KHUNG CỘT
    if (type === '1-col') {
      if (editorRef.current) {
        const columnLayouts = editorRef.current.querySelectorAll('.word-column-layout');
        if (columnLayouts.length > 0) {
          columnLayouts.forEach((layout) => {
            const cols = layout.querySelectorAll('.word-col');
            const replacementFrag = document.createDocumentFragment();
            cols.forEach((col) => {
              while (col.firstChild) {
                replacementFrag.appendChild(col.firstChild);
              }
            });
            layout.parentNode.replaceChild(replacementFrag, layout);
          });
          handleEditorInput();
          setStatusNotice('Đã hủy chia cột, đưa toàn bộ văn bản về dạng 1 cột chuẩn!');
          setTimeout(() => setStatusNotice(''), 3000);
          setShowColumnMenu(false);
          return;
        }
      }
      setShowColumnMenu(false);
      return;
    }

    let colHtml = '';

    if (type === 'fix-layout') {
      if (editorRef.current) {
        const layouts = editorRef.current.querySelectorAll('.word-column-layout');
        layouts.forEach((layout) => {
          layout.setAttribute('style', 'display: flex; flex-direction: row; gap: 24px; width: 100%; box-sizing: border-box; margin: 18px 0; border: 1.5px dashed #cbd5e1; border-radius: 8px; background-color: #fafbfc; padding: 12px;');
          const cols = layout.querySelectorAll('.word-col');
          const isTwo = cols.length === 2;
          cols.forEach((c) => {
            const w = isTwo ? '50%' : '33.333%';
            c.setAttribute('style', `flex: 1 1 0%; width: ${w}; max-width: ${w}; min-width: 0; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 6px;`);
            c.querySelectorAll('*').forEach((child) => {
              if (child.style) {
                child.style.position = 'static';
                child.style.whiteSpace = 'normal';
                child.style.maxWidth = '100%';
                if (child.style.marginLeft && child.style.marginLeft.startsWith('-')) child.style.marginLeft = '0';
                if (child.style.textIndent && child.style.textIndent.startsWith('-')) child.style.textIndent = '0';
              }
            });
          });
        });
        handleEditorInput();
        setStatusNotice('Đã sửa xong cấu trúc cột và loại bỏ hoàn toàn đè chữ!');
        setTimeout(() => setStatusNotice(''), 3000);
      }
      setShowColumnMenu(false);
      return;
    }

    if (type === '2-cols') {
      colHtml = `
<div class="word-column-layout word-cols-2" style="display: flex; flex-direction: row; gap: 24px; margin: 18px 0; padding: 12px; border: 1.5px dashed #cbd5e1; border-radius: 8px; background-color: #fafbfc; width: 100%; box-sizing: border-box;">
  <div class="word-col" style="flex: 1 1 0%; width: 50%; max-width: 50%; min-width: 0; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 6px;">
    <p><strong>Cột 1:</strong> Nhập nội dung bên trái...</p>
  </div>
  <div class="word-col" style="flex: 1 1 0%; width: 50%; max-width: 50%; min-width: 0; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 6px;">
    <p><strong>Cột 2:</strong> Nhập nội dung bên phải...</p>
  </div>
</div>
<p><br></p>`;
    } else if (type === '3-cols') {
      colHtml = `
<div class="word-column-layout word-cols-3" style="display: flex; flex-direction: row; gap: 20px; margin: 18px 0; padding: 12px; border: 1.5px dashed #cbd5e1; border-radius: 8px; background-color: #fafbfc; width: 100%; box-sizing: border-box;">
  <div class="word-col" style="flex: 1 1 0%; width: 33.333%; max-width: 33.333%; min-width: 0; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 6px;">
    <p><strong>Cột 1:</strong> Nội dung...</p>
  </div>
  <div class="word-col" style="flex: 1 1 0%; width: 33.333%; max-width: 33.333%; min-width: 0; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 6px;">
    <p><strong>Cột 2:</strong> Nội dung...</p>
  </div>
  <div class="word-col" style="flex: 1 1 0%; width: 33.333%; max-width: 33.333%; min-width: 0; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 6px;">
    <p><strong>Cột 3:</strong> Nội dung...</p>
  </div>
</div>
<p><br></p>`;
    } else if (type === 'left-narrow') {
      colHtml = `
<div class="word-column-layout word-cols-left-narrow" style="display: flex; flex-direction: row; gap: 24px; margin: 18px 0; padding: 12px; border: 1.5px dashed #cbd5e1; border-radius: 8px; background-color: #fafbfc; width: 100%; box-sizing: border-box;">
  <div class="word-col" style="flex: 1 1 0%; width: 35%; max-width: 35%; min-width: 0; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 6px;">
    <p><strong>Cột phụ (1/3):</strong> Ảnh / Tóm tắt...</p>
  </div>
  <div class="word-col" style="flex: 2 1 0%; width: 65%; max-width: 65%; min-width: 0; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 6px;">
    <p><strong>Cột chính (2/3):</strong> Văn bản thuyết minh...</p>
  </div>
</div>
<p><br></p>`;
    } else if (type === 'right-narrow') {
      colHtml = `
<div class="word-column-layout word-cols-right-narrow" style="display: flex; flex-direction: row; gap: 24px; margin: 18px 0; padding: 12px; border: 1.5px dashed #cbd5e1; border-radius: 8px; background-color: #fafbfc; width: 100%; box-sizing: border-box;">
  <div class="word-col" style="flex: 2 1 0%; width: 65%; max-width: 65%; min-width: 0; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 6px;">
    <p><strong>Cột chính (2/3):</strong> Văn bản thuyết minh...</p>
  </div>
  <div class="word-col" style="flex: 1 1 0%; width: 35%; max-width: 35%; min-width: 0; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 6px;">
    <p><strong>Cột phụ (1/3):</strong> Ảnh / Tóm tắt...</p>
  </div>
</div>
<p><br></p>`;
    }

    if (colHtml) {
      insertHtmlAtSelection(colHtml);
      handleEditorInput();
      setStatusNotice('Đã chèn khối chia cột!');
      setTimeout(() => setStatusNotice(''), 3000);
    }
    setShowColumnMenu(false);
  };

  // 3. CHUYỂN ĐỔI VÀ TẢI LÊN FILE WORD (.DOCX) SỬ DỤNG MAMMOTH
  const convertDocxFile = async (file) => {
    if (!file) return;
    setLoadingDocx(true);
    setStatusNotice('Đang đọc và chuyển đổi tài liệu Word (.docx)...');

    try {
      const arrayBuffer = await file.arrayBuffer();

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
      let html = result.value || '';

      if (!html.trim()) {
        throw new Error('Tài liệu Word trống hoặc không có nội dung văn bản.');
      }

      setRawHtml(html);
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
      }
      if (onChange) {
        onChange(html);
      }

      setStatusNotice(`Đã nạp thành công file Word: "${file.name}"!`);
      setTimeout(() => setStatusNotice(''), 4000);
    } catch (err) {
      console.error('Lỗi nạp file Word:', err);
      alert('Không thể đọc file Word: ' + (err.message || 'Lỗi không xác định'));
      setStatusNotice('');
    } finally {
      setLoadingDocx(false);
    }
  };

  const handleDocxUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      convertDocxFile(file);
    }
  };

  // 4. XÓA TRẮNG NỘI DUNG ĐỂ SOẠN LẠI TỪ ĐẦU
  const handleClearContent = () => {
    if (window.confirm('Bạn có muốn xóa toàn bộ nội dung trong trang để dán hoặc soạn thảo lại từ đầu không?')) {
      if (editorRef.current) {
        editorRef.current.innerHTML = '<p><br></p>';
      }
      setRawHtml('');
      if (onChange) {
        onChange('');
      }
      setStatusNotice('Đã xóa trắng trang văn bản!');
      setTimeout(() => setStatusNotice(''), 3000);
    }
  };

  // 5. Hàm upload và chèn ảnh dùng chung cho File Picker, Drag & Drop và Paste Clipboard
  const uploadAndInsertImage = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp định dạng hình ảnh (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    setUploadingImage(true);
    setStatusNotice('Đang tải ảnh lên máy chủ...');
    try {
      const url = await UploadAPI.uploadImage(file, 'founders/content');
      if (!url) throw new Error('Không nhận được đường dẫn ảnh từ máy chủ.');

      const cleanFileName = file.name ? file.name.replace(/\.[^/.]+$/, '') : 'Hình ảnh đính kèm';
      const imgHtml = `
<figure style="margin: 16px auto; text-align: center; max-width: 100%;">
  <img src="${url}" alt="${cleanFileName}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto; display: block; box-shadow: 0 4px 14px rgba(0,0,0,0.12);" />
  <figcaption style="font-size: 13px; color: #64748b; font-style: italic; margin-top: 6px;">${cleanFileName}</figcaption>
</figure>
<p><br></p>`;

      insertHtmlAtSelection(imgHtml);
      handleEditorInput();
      setStatusNotice('Đã chèn ảnh thành công!');
      setTimeout(() => setStatusNotice(''), 3000);
    } catch (err) {
      console.error('Lỗi tải ảnh:', err);
      alert('Không thể tải ảnh: ' + (err.message || 'Lỗi không xác định'));
      setStatusNotice('');
    } finally {
      setUploadingImage(false);
    }
  };

  // 6. Chèn ảnh từ máy tính qua File input
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      uploadAndInsertImage(file);
    }
  };

  // 7. Chèn ảnh qua link URL
  const handleInsertImageUrl = () => {
    const url = prompt('Nhập đường dẫn hình ảnh (URL):', 'https://');
    if (url && url.trim() && url !== 'https://') {
      const imgHtml = `
<figure style="margin: 16px auto; text-align: center; max-width: 100%;">
  <img src="${url.trim()}" alt="Hình ảnh" style="max-width: 100%; height: auto; border-radius: 8px; margin: 0 auto; display: block; box-shadow: 0 4px 14px rgba(0,0,0,0.12);" />
</figure>
<p><br></p>`;
      insertHtmlAtSelection(imgHtml);
      handleEditorInput();
    }
  };

  // 8. Đính kèm File (PDF, DOCX, XLSX...)
  const uploadAndInsertDoc = async (file) => {
    if (!file) return;
    setUploadingDoc(true);
    setStatusNotice('Đang tải tệp đính kèm lên máy chủ...');
    try {
      const url = await UploadAPI.uploadDocument(file, 'founders/documents');
      if (!url) throw new Error('Không nhận được đường dẫn tệp.');

      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

      const fileCardHtml = `
<div style="margin: 16px 0; padding: 14px 18px; border-radius: 12px; border: 1.5px solid #d49520; background-color: #faf7f2; display: inline-flex; align-items: center; gap: 14px; max-width: 100%; box-shadow: 0 2px 8px rgba(212,149,32,0.12);">
  <span style="background-color: #710008; color: white; padding: 8px 12px; border-radius: 8px; font-weight: 800; font-size: 12px; letter-spacing: 0.5px;">${ext}</span>
  <div style="text-align: left;">
    <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #710008; font-weight: 700; text-decoration: underline; font-size: 15px;">
      ${file.name}
    </a>
    <div style="font-size: 12px; color: #64748b; margin-top: 3px;">
      Tệp tài liệu đính kèm (${sizeMb} MB) · Bấm vào đây để tải về
    </div>
  </div>
</div>
<p><br></p>`;

      insertHtmlAtSelection(fileCardHtml);
      handleEditorInput();
      setStatusNotice('Đã đính kèm tệp thành công!');
      setTimeout(() => setStatusNotice(''), 3000);
    } catch (err) {
      console.error('Lỗi tải tệp:', err);
      alert('Không thể tải tệp đính kèm: ' + (err.message || 'Lỗi không xác định'));
      setStatusNotice('');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      uploadAndInsertDoc(file);
    }
  };

  // 9. Kéo thả file ảnh, file Word .docx hoặc tài liệu vào trực tiếp tờ giấy Word
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.toLowerCase().endsWith('.docx')) {
        await convertDocxFile(file);
      } else if (file.type.startsWith('image/')) {
        await uploadAndInsertImage(file);
      } else {
        await uploadAndInsertDoc(file);
      }
    }
  };

  // 10. Chèn Bảng Word (Table 3x3)
  const handleInsertTable = () => {
    const tableHtml = `
<table style="width: 100%; border-collapse: collapse; margin: 18px 0; border: 1px solid #cbd5e1; font-size: 14px;">
  <thead>
    <tr style="background-color: #f1f5f9;">
      <th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-weight: 700; color: #710008;">Tiêu đề 1</th>
      <th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-weight: 700; color: #710008;">Tiêu đề 2</th>
      <th style="border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-weight: 700; color: #710008;">Tiêu đề 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #cbd5e1; padding: 10px 14px;">Nội dung hàng 1 - cột 1</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px 14px;">Nội dung hàng 1 - cột 2</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px 14px;">Nội dung hàng 1 - cột 3</td>
    </tr>
    <tr style="background-color: #fafbfc;">
      <td style="border: 1px solid #cbd5e1; padding: 10px 14px;">Nội dung hàng 2 - cột 1</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px 14px;">Nội dung hàng 2 - cột 2</td>
      <td style="border: 1px solid #cbd5e1; padding: 10px 14px;">Nội dung hàng 2 - cột 3</td>
    </tr>
  </tbody>
</table>
<p><br></p>`;
    insertHtmlAtSelection(tableHtml);
    handleEditorInput();
  };

  // 11. Chèn liên kết
  const handleInsertLink = () => {
    const url = prompt('Nhập đường dẫn liên kết (URL):', 'https://');
    if (url && url.trim() && url !== 'https://') {
      executeCommand('createLink', url.trim());
    }
  };

  // 12. Đổi phông chữ
  const handleFontChange = (e) => {
    const font = e.target.value;
    setCurrentFont(font);
    executeCommand('fontName', font);
  };

  // 13. Đổi cỡ chữ
  const handleFontSizeChange = (e) => {
    const size = e.target.value;
    setCurrentFontSize(size);
    executeCommand('fontSize', size);
  };

  // 14. Nhập file HTML
  const handleHtmlFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      let content = event.target?.result || '';
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        content = bodyMatch[1];
      }

      setRawHtml(content);
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
      }
      if (onChange) {
        onChange(content);
      }
      setStatusNotice('Đã nạp nội dung từ file HTML!');
      setTimeout(() => setStatusNotice(''), 3000);
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  // 15. Xuất ra file HTML
  const handleExportHtml = () => {
    const currentContent = rawHtml || (editorRef.current?.innerHTML || '');
    const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Tài liệu Word Founder</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #1e293b; max-width: 850px; margin: 40px auto; padding: 0 24px; }
    h1, h2, h3 { color: #710008; }
    blockquote { border-left: 4px solid #d49520; background: #faf7f2; padding: 12px 16px; margin: 16px 0; font-style: italic; color: #475569; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; }
    th { background: #f1f5f9; color: #710008; }
    img { max-width: 100%; height: auto; border-radius: 8px; }
    .word-column-layout { display: grid; gap: 20px; margin: 18px 0; }
    .word-col { min-width: 0; overflow-wrap: break-word; word-break: break-word; }
    @media (max-width: 640px) { .word-column-layout { grid-template-columns: 1fr !important; } }
  </style>
</head>
<body>
${currentContent}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `founder-document-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Thống kê số từ và ký tự
  const wordCount = rawHtml
    ? rawHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = rawHtml
    ? rawHtml.replace(/<[^>]+>/g, '').trim().length
    : 0;

  return (
    <div className={`space-y-3 font-[Segoe_UI,sans-serif] ${className}`}>
      
      {/* 1. THANH TIÊU ĐỀ WORD & 3 CHẾ ĐỘ XEM (Soạn thảo Word | Xem trước Web | Mã HTML) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-8 rounded-lg bg-[#2b579a] text-white font-bold shadow-xs">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {label}
              </span>
              {statusNotice && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-fade-in">
                  {statusNotice}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Trình soạn thảo văn bản phong cách Microsoft Word</p>
          </div>
        </div>

        {/* Chuyển đổi 3 chế độ: Soạn thảo Word | Xem trước Web | Mã HTML */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-[#2b579a] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText size={13} />
            <span>Soạn thảo Word</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#710008] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Eye size={13} />
            <span>Xem trước Web (Preview)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
              activeTab === 'html'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Code size={13} />
            <span>Mã HTML</span>
          </button>
        </div>
      </div>

      {/* 2. VÙNG TRÌNH SOẠN THẢO WORD (GIAO DIỆN SÁNG - LIGHT THEME) */}
      <div className="rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-md">
        
        {/* THANH CÔNG CỤ WORD (RIBBON TOOLBAR) - NỀN SÁNG (Chỉ hiện khi ở tab Soạn thảo) */}
        {activeTab === 'edit' && (
          <div className="bg-[#f8fafc] border-b border-slate-200 p-2.5 space-y-2 text-xs select-none">
            
            {/* Hàng Ribbon 1: Font chữ, Cỡ chữ, Phím định dạng & Thao tác file */}
            <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-200">
              
              {/* Hoàn tác (Undo / Redo) */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('undo'); }}
                  title="Hoàn tác (Ctrl+Z)"
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('redo'); }}
                  title="Làm lại (Ctrl+Y)"
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <RotateCw size={14} />
                </button>
              </div>

              <span className="w-px h-5 bg-slate-300 mx-1" />

              {/* Lựa chọn Phông chữ (Font Family) */}
              <select
                value={currentFont}
                onChange={handleFontChange}
                title="Phông chữ Word"
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 outline-none hover:border-[#2b579a] focus:border-[#2b579a] transition cursor-pointer shadow-2xs font-medium"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              {/* Lựa chọn Cỡ chữ (Font Size) */}
              <select
                value={currentFontSize}
                onChange={handleFontSizeChange}
                title="Cỡ chữ Word"
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2.5 py-1.5 outline-none hover:border-[#2b579a] focus:border-[#2b579a] transition cursor-pointer shadow-2xs font-medium w-28"
              >
                {FONT_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              <span className="w-px h-5 bg-slate-300 mx-1" />

              {/* Định dạng chữ: In đậm, In nghiêng, Gạch chân, Gạch ngang */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }}
                  title="In đậm (Ctrl+B)"
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-800 font-bold transition cursor-pointer"
                >
                  <Bold size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }}
                  title="In nghiêng (Ctrl+I)"
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-800 italic transition cursor-pointer"
                >
                  <Italic size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }}
                  title="Gạch chân (Ctrl+U)"
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-800 underline transition cursor-pointer"
                >
                  <Underline size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('strikeThrough'); }}
                  title="Gạch ngang chữ"
                  className="p-1.5 rounded-md hover:bg-slate-100 text-slate-800 transition cursor-pointer"
                >
                  <Strikethrough size={14} />
                </button>
              </div>

              <span className="w-px h-5 bg-slate-300 mx-1" />

              {/* Màu chữ (Font Color) */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-600">Màu:</span>
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      executeCommand('foreColor', c.value);
                    }}
                    title={`Màu chữ: ${c.label}`}
                    className="size-4 rounded-full border border-slate-300 hover:scale-125 transition cursor-pointer shadow-2xs"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>

              {/* Bút dạ quang Highlight */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-2xs">
                <Highlighter size={13} className="text-amber-500 mr-0.5" />
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      executeCommand('hiliteColor', c.value);
                    }}
                    title={`Đánh dấu: ${c.label}`}
                    className="size-3.5 rounded border border-slate-300 hover:scale-125 transition cursor-pointer"
                    style={{ backgroundColor: c.value === 'transparent' ? '#ffffff' : c.value }}
                  />
                ))}
              </div>

              {/* Tẩy sạch định dạng (Clear formatting) */}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); executeCommand('removeFormat'); }}
                title="Xóa toàn bộ định dạng đoạn văn đã chọn"
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-2xs"
              >
                <Eraser size={14} />
              </button>

              {/* Xóa trắng trang để làm lại */}
              <button
                type="button"
                onClick={handleClearContent}
                title="Xóa toàn bộ nội dung để dán bài mới từ đầu"
                className="p-1.5 rounded-lg bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 transition cursor-pointer shadow-2xs ml-auto"
              >
                <Trash2 size={14} />
              </button>

            </div>

            {/* Hàng Ribbon 2: Khối văn bản, Căn lề, CHIA CỘT, GẮN ẢNH, Gắn file, Chèn bảng & Nhập/Xuất */}
            <div className="flex flex-wrap items-center gap-1.5">
              
              {/* NÚT TẢI LÊN FILE WORD (.DOCX) */}
              <div className="inline-flex items-center">
                <button
                  type="button"
                  onClick={() => docxInputRef.current?.click()}
                  disabled={loadingDocx}
                  title="Tải lên và chuyển đổi toàn bộ tài liệu Word (.docx) sang Web"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2b579a] hover:bg-[#1f4277] text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {loadingDocx ? (
                    <LoaderCircle size={15} className="animate-spin text-white" />
                  ) : (
                    <FileText size={15} className="text-white" />
                  )}
                  <span>{loadingDocx ? 'Đang nạp file...' : 'Tải file Word (.docx)'}</span>
                </button>
                <input
                  ref={docxInputRef}
                  type="file"
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleDocxUpload}
                  className="sr-only"
                />
              </div>

              {/* NÚT DÁN TỪ WORD TRỰC TIẾP */}
              <button
                type="button"
                onClick={handlePasteFromWordButton}
                title="Dán văn bản sao chép từ Microsoft Word (Ctrl + V)"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold transition cursor-pointer shadow-2xs"
              >
                <ClipboardPaste size={15} className="text-emerald-700" />
                <span>Dán từ Word</span>
              </button>

              <span className="w-px h-5 bg-slate-300 mx-1" />

              {/* NÚT CHIA CỘT (COLUMNS) - DROPDOWN KIỂU MICROSOFT WORD */}
              <div className="relative inline-block" ref={columnMenuRef}>
                <button
                  type="button"
                  onClick={() => { saveSelection(); setShowColumnMenu(!showColumnMenu); }}
                  title="Chia bố cục thành nhiều cột (Columns)"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold transition cursor-pointer shadow-2xs"
                >
                  <Columns2 size={14} className="text-[#2b579a]" />
                  <span>Chia cột</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {showColumnMenu && (
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in text-xs">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      Chọn bố cục cột Word
                    </div>

                    <button
                      type="button"
                      onClick={() => handleInsertColumns('fix-layout')}
                    className="w-full text-left px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-semibold border-b border-slate-100"
                  >
                    <span>🔧 Sửa lỗi đè chữ & căn đều cột</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertColumns('1-col')}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-slate-700 flex items-center gap-2.5 transition cursor-pointer border-b border-slate-100"
                    >
                      <Minus size={16} className="text-rose-600" />
                      <div>
                        <div className="font-semibold text-rose-700">1 Cột (Mặc định - Hủy chia cột)</div>
                        <div className="text-[11px] text-slate-500">Xóa khung cột, trải đều văn bản</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInsertColumns('2-cols')}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <Columns2 size={16} className="text-[#2b579a]" />
                      <div>
                        <div className="font-semibold text-slate-800">Chia 2 cột đều (50% - 50%)</div>
                        <div className="text-[11px] text-slate-500">2 cột nội dung song song bằng nhau</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInsertColumns('3-cols')}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <Columns3 size={16} className="text-[#2b579a]" />
                      <div>
                        <div className="font-semibold text-slate-800">Chia 3 cột đều (33% mỗi cột)</div>
                        <div className="text-[11px] text-slate-500">3 cột nội dung song song</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInsertColumns('left-narrow')}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <LayoutGrid size={16} className="text-[#d49520]" />
                      <div>
                        <div className="font-semibold text-slate-800">Cột trái nhỏ (1/3) + Phải lớn (2/3)</div>
                        <div className="text-[11px] text-slate-500">Trái chèn ảnh, phải văn bản</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInsertColumns('right-narrow')}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700 flex items-center gap-2.5 transition cursor-pointer"
                    >
                      <LayoutGrid size={16} className="text-[#d49520]" />
                      <div>
                        <div className="font-semibold text-slate-800">Cột trái lớn (2/3) + Phải nhỏ (1/3)</div>
                        <div className="text-[11px] text-slate-500">Trái văn bản, phải chèn ảnh</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <span className="w-px h-5 bg-slate-300 mx-1" />

              {/* Định dạng khối tiêu đề (Styles) */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', 'p'); }}
                  title="Đoạn văn chuẩn"
                  className="px-2 py-1 rounded text-xs font-medium hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  Đoạn văn
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', 'h2'); }}
                  title="Tiêu đề 2 (H2)"
                  className="px-2 py-1 rounded text-xs font-bold hover:bg-slate-100 text-[#710008] transition cursor-pointer"
                >
                  H2
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', 'h3'); }}
                  title="Tiêu đề 3 (H3)"
                  className="px-2 py-1 rounded text-xs font-bold hover:bg-slate-100 text-[#710008] transition cursor-pointer"
                >
                  H3
                </button>
              </div>

              <span className="w-px h-5 bg-slate-300 mx-1" />

              {/* Căn lề đoạn văn */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyLeft'); }}
                  title="Căn lề trái"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <AlignLeft size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyCenter'); }}
                  title="Căn lề giữa"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <AlignCenter size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyRight'); }}
                  title="Căn lề phải"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <AlignRight size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyFull'); }}
                  title="Căn đều hai bên (Justify)"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <AlignJustify size={14} />
                </button>
              </div>

              {/* Danh sách & Thụt lề */}
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('insertUnorderedList'); }}
                  title="Danh sách gạch đầu dòng"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <List size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('insertOrderedList'); }}
                  title="Danh sách đánh số"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <ListOrdered size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('outdent'); }}
                  title="Giảm thụt lề"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <Outdent size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('indent'); }}
                  title="Tăng thụt lề"
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  <Indent size={14} />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('formatBlock', 'blockquote'); }}
                  title="Khối trích dẫn"
                  className="p-1.5 rounded hover:bg-slate-100 text-[#d49520] transition cursor-pointer"
                >
                  <Quote size={14} />
                </button>
              </div>

              <span className="w-px h-5 bg-slate-300 mx-1" />

              {/* NÚT UPLOAD ẢNH NỔI BẬT */}
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => { saveSelection(); imageInputRef.current?.click(); }}
                  disabled={uploadingImage}
                  title="Tải ảnh lên từ máy tính (Có thể kéo thả hoặc dán Ctrl+V trực tiếp)"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-700 font-bold transition cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <LoaderCircle size={15} className="animate-spin text-blue-600" />
                  ) : (
                    <ImageIcon size={15} className="text-blue-600" />
                  )}
                  <span>{uploadingImage ? 'Đang tải...' : 'Gắn ảnh từ máy'}</span>
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  onChange={handleImageUpload}
                  className="sr-only"
                />

                <button
                  type="button"
                  onClick={handleInsertImageUrl}
                  title="Chèn ảnh qua link URL"
                  className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition cursor-pointer text-xs shadow-2xs font-medium"
                >
                  Link ảnh
                </button>
              </div>

              {/* Nút Gắn File Đính Kèm */}
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => { saveSelection(); docInputRef.current?.click(); }}
                  disabled={uploadingDoc}
                  title="Đính kèm file tài liệu (PDF, Word, Excel, PPT, Zip...)"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold transition cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  {uploadingDoc ? (
                    <LoaderCircle size={15} className="animate-spin text-emerald-600" />
                  ) : (
                    <Paperclip size={15} className="text-emerald-600" />
                  )}
                  <span>{uploadingDoc ? 'Đang tải...' : 'Gắn file'}</span>
                </button>
                <input
                  ref={docInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.txt"
                  onChange={handleDocUpload}
                  className="sr-only"
                />
              </div>

              {/* Chèn Bảng & Link */}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleInsertTable(); }}
                title="Chèn bảng dữ liệu Word"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition cursor-pointer shadow-2xs font-medium"
              >
                <TableIcon size={14} className="text-[#d49520]" />
                <span>Bảng</span>
              </button>

              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleInsertLink(); }}
                title="Chèn đường dẫn liên kết"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition cursor-pointer shadow-2xs font-medium"
              >
                <Link2 size={14} className="text-blue-600" />
                <span>Link</span>
              </button>

              {/* Nhập / Xuất HTML */}
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputHtmlRef.current?.click()}
                  title="Nạp nội dung từ file .html vào trình soạn thảo"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition cursor-pointer shadow-2xs"
                >
                  <Upload size={12} className="text-[#d49520]" />
                  <span>Nhập HTML</span>
                </button>
                <input
                  ref={fileInputHtmlRef}
                  type="file"
                  accept=".html,.htm,.txt"
                  onChange={handleHtmlFileUpload}
                  className="sr-only"
                />

                <button
                  type="button"
                  onClick={handleExportHtml}
                  title="Tải nội dung hiện tại về dạng file .html"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 transition cursor-pointer shadow-2xs"
                >
                  <Download size={12} className="text-emerald-700" />
                  <span>Xuất HTML</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* 1. KHUNG SOẠN THẢO TRANG GIẤY WORD A4 (LUÔN ĐƯỢC GIỮ MOUNTED ĐỂ KHÔNG MẤT NỘI DUNG) */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ display: activeTab === 'edit' ? 'flex' : 'none' }}
          className={`p-6 sm:p-10 lg:p-12 bg-[#edf2f7] overflow-x-auto flex-col items-center min-h-[480px] transition-colors ${
            isDragging ? 'bg-blue-100/70 ring-4 ring-blue-400 ring-inset' : ''
          }`}
        >
          {/* THƯỚC ĐO WORD (RULER) */}
          <div className="w-full max-w-[850px] mb-2 bg-[#f8fafc] border border-slate-300 rounded-t shadow-2xs px-10 py-1 flex items-center justify-between text-[10px] text-slate-500 font-mono select-none">
            <span className="flex items-center gap-1 text-[#2b579a] font-sans font-bold">
              <FileText size={12} />
              Thước lề (cm)
            </span>
            <div className="flex-1 flex justify-between px-6 opacity-60">
              <span>0</span>
              <span>•</span>
              <span>2</span>
              <span>•</span>
              <span>4</span>
              <span>•</span>
              <span>6</span>
              <span>•</span>
              <span>8</span>
              <span>•</span>
              <span>10</span>
              <span>•</span>
              <span>12</span>
              <span>•</span>
              <span>14</span>
              <span>•</span>
              <span>16</span>
            </div>
            <span className="text-[10px] text-slate-400">Khổ A4</span>
          </div>

          {/* TỜ GIẤY TRẮNG A4 WORD */}
          <div
            className={`w-full max-w-[850px] bg-white text-slate-900 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-300 p-8 sm:p-14 relative min-h-[580px] transition ${
              isDragging ? 'border-2 border-dashed border-blue-500' : ''
            }`}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-blue-50/90 rounded-sm z-20 flex flex-col items-center justify-center pointer-events-none text-blue-700">
                <FileText size={48} className="animate-bounce mb-2" />
                <p className="font-bold text-base">Thả file Word (.docx), file ảnh hoặc tài liệu vào đây để tự động xử lý</p>
              </div>
            )}

            {/* Scoped CSS chống đè chữ và đảm bảo chia cột chuẩn 100% */}
            <style>{`
              .word-column-layout {
                display: flex !important;
                flex-direction: row !important;
                gap: 20px !important;
                width: 100% !important;
                box-sizing: border-box !important;
                margin: 16px 0 !important;
                clear: both !important;
              }
              .word-column-layout.word-cols-2 > .word-col {
                flex: 1 1 0% !important;
                width: 50% !important;
                max-width: 50% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
                overflow-wrap: break-word !important;
                word-break: break-word !important;
              }
              .word-column-layout.word-cols-3 > .word-col {
                flex: 1 1 0% !important;
                width: 33.333% !important;
                max-width: 33.333% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
                overflow-wrap: break-word !important;
                word-break: break-word !important;
              }
              .word-column-layout.word-cols-left-narrow > .word-col:first-child {
                flex: 1 1 0% !important;
                width: 35% !important;
                max-width: 35% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
              }
              .word-column-layout.word-cols-left-narrow > .word-col:last-child {
                flex: 2 1 0% !important;
                width: 65% !important;
                max-width: 65% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
              }
              .word-column-layout.word-cols-right-narrow > .word-col:first-child {
                flex: 2 1 0% !important;
                width: 65% !important;
                max-width: 65% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
              }
              .word-column-layout.word-cols-right-narrow > .word-col:last-child {
                flex: 1 1 0% !important;
                width: 35% !important;
                max-width: 35% !important;
                min-width: 0 !important;
                box-sizing: border-box !important;
              }
              .word-column-layout .word-col * {
                max-width: 100% !important;
                box-sizing: border-box !important;
                position: static !important;
                white-space: normal !important;
                overflow-wrap: break-word !important;
                word-break: break-word !important;
              }
            `}</style>
            {/* Vùng Content Editable */}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              onBlur={handleEditorInput}
              onKeyUp={saveSelection}
              onMouseUp={saveSelection}
              onPaste={handlePaste}
              role="textbox"
              aria-multiline="true"
              data-placeholder={placeholder}
              style={{ fontFamily: currentFont }}
              className="outline-none min-h-[480px] text-[15px] leading-relaxed text-slate-900 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none prose max-w-none
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#710008] [&_h1]:mt-5 [&_h1]:mb-2.5
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#710008] [&_h2]:mt-4 [&_h2]:mb-2
                [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#710008] [&_h3]:mt-3 [&_h3]:mb-1.5
                [&_p]:my-2.5 [&_p]:leading-relaxed
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#d49520] [&_blockquote]:bg-[#faf7f2] [&_blockquote]:p-3.5 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:my-3.5 [&_blockquote]:text-slate-700
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2.5
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2.5
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:border [&_table]:border-slate-300
                [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2.5 [&_th]:font-bold [&_th]:text-left
                [&_td]:border [&_td]:border-slate-300 [&_td]:p-2.5
                [&_img]:rounded-lg [&_img]:my-3.5 [&_img]:shadow-sm [&_img]:max-w-full
                [&_.word-column-layout]:my-4 [&_.word-column-layout]:w-full
                [&_.word-col]:min-w-0 [&_.word-col]:break-words [&_.word-col]:relative
                [&_.word-col_*]:static! [&_.word-col_*]:max-w-full"
            />
          </div>

          <p className="mt-4 text-xs text-slate-500 text-center">
            💡 <strong>Mẹo:</strong> Bạn chỉ cần copy văn bản từ <strong>Microsoft Word</strong> rồi nhấn <strong>Ctrl + V</strong> vào đây, toàn bộ ký tự, dấu tiếng Việt, in đậm, in nghiêng và cấu trúc sẽ được giữ nguyên 100%.
          </p>
        </div>

        {/* 2. KHUNG XEM TRƯỚC (PREVIEW WEB THEO ĐÚNG THIẾT KẾ WEBSITE) */}
        <div
          style={{ display: activeTab === 'preview' ? 'block' : 'none' }}
          className="p-6 sm:p-10 bg-[#faf8f5] text-[#2d2a29] min-h-[480px]"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#e8dfd3] p-6 sm:p-12 shadow-sm">
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-[#ede5d8]">
              <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#710008]">
                Xem trước nội dung hiển thị thực tế trên website
              </span>
            </div>

            {rawHtml ? (
              <div
                className="founder-html-preview text-base text-gray-800 leading-relaxed space-y-4 text-justify font-normal
                  [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#710008] [&_h1]:mt-6 [&_h1]:mb-3
                  [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#710008] [&_h2]:mt-5 [&_h2]:mb-2.5
                  [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#710008] [&_h3]:mt-4 [&_h3]:mb-2
                  [&_p]:leading-relaxed [&_p]:my-2.5
                  [&_strong]:text-gray-950 [&_strong]:font-bold
                  [&_em]:italic [&_em]:text-gray-700
                  [&_u]:underline [&_u]:decoration-[#d49520]
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#d49520] [&_blockquote]:bg-[#faf7f2] [&_blockquote]:p-4 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-4
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
                  [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:border [&_table]:border-gray-200
                  [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:p-2.5 [&_th]:font-bold [&_th]:text-left
                  [&_td]:border [&_td]:border-gray-300 [&_td]:p-2.5
                  [&_a]:text-[#710008] [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-[#d49520]
                  [&_img]:rounded-xl [&_img]:my-4 [&_img]:shadow-sm
                  [&_.word-column-layout]:my-5 [&_.word-column-layout]:w-full
                  [&_.word-col]:min-w-0 [&_.word-col]:break-words [&_.word-col]:relative
                  [&_.word-col_*]:static! [&_.word-col_*]:max-w-full
                  [&_hr]:border-[#ede5d8] [&_hr]:my-6"
                dangerouslySetInnerHTML={{ __html: rawHtml }}
              />
            ) : (
              <div className="py-14 text-center text-slate-400 text-sm">
                Chưa có nội dung để xem trước. Hãy nhập hoặc đính kèm tài liệu ở tab "Soạn thảo Word".
              </div>
            )}
          </div>
        </div>

        {/* 3. KHUNG MÃ NGUỒN HTML */}
        <div
          style={{ display: activeTab === 'html' ? 'block' : 'none' }}
          className="p-6 bg-slate-900"
        >
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-medium">Mã nguồn HTML sạch sẽ được lưu và xuất ra website:</span>
            <span className="font-mono text-[11px] text-emerald-400 font-bold">UTF-8 HTML</span>
          </div>
          <textarea
            value={rawHtml}
            onChange={handleRawHtmlChange}
            placeholder="<p>Nhập mã HTML hoặc dán mã tại đây...</p>"
            rows={16}
            className="w-full p-4 font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl focus:outline-none focus:border-[#d49520] resize-y min-h-[380px]"
          />
        </div>

        {/* 4. THANH TRẠNG THÁI WORD (STATUS BAR) NỀN SÁNG */}
        <div className="bg-[#f8fafc] border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-600 select-none">
          <div className="flex items-center gap-3">
            <span>Trang 1 / 1</span>
            <span className="w-px h-3 bg-slate-300" />
            <span><strong>{wordCount}</strong> từ</span>
            <span className="w-px h-3 bg-slate-300" />
            <span><strong>{charCount}</strong> ký tự</span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <span className="flex items-center gap-1 text-[#2b579a] font-medium">
              <Sparkles size={11} />
              Định dạng Word (Bố cục trang in)
            </span>
            <span className="w-px h-3 bg-slate-300" />
            <span className="font-medium text-emerald-700">Tự động kết xuất HTML chuẩn web</span>
            <span className="w-px h-3 bg-slate-300" />
            <span>100%</span>
          </div>
        </div>

      </div>

    </div>
  );
}
