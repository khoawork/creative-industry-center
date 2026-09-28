export default function Brand({ compact = false }) {
  return <a className={`brand${compact ? ' brand--footer' : ''}`} href="#trang-chu" aria-label="Trung tâm Công nghiệp Sáng tạo — Trang chủ">
    <svg className="brand-mark" width="49" height="49" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M8 16v17M8 10v1" stroke="var(--gold)" strokeWidth="5" />
      <path d="M36 12a15 15 0 1 0 0 24" stroke="var(--wine)" strokeWidth="5" />
      <path d="M34 18a8 8 0 1 0 0 12" stroke="var(--gold)" strokeWidth="4" />
      <circle cx="31" cy="24" r="3" fill="var(--wine)" />
    </svg>
    <span><strong>{compact ? 'TTCNST' : 'TRUNG TÂM CÔNG NGHIỆP SÁNG TẠO'}</strong><small>KHƠI NGUỒN TRI THỨC · KIẾN TẠO GIÁ TRỊ</small></span>
  </a>
}
