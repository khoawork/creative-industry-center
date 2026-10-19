import RecordHolderIcon from "./RecordHolderIcon.jsx";

export default function RecordList({
  records,
  error,
  title  ,
  subtitle ,
  onNominate,
  onDownloadDoc,
}) {
  // Đảm bảo records luôn là một mảng, nếu không phải sẽ mặc định là mảng trống []
  const safeRecords = Array.isArray(records) ? records : [];

  return (
    <section className="w-full py-16 lg:py-24 bg-record-surface-container-low" id="danh-sach-giai-thuong">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold">
              <RecordHolderIcon name="military_tech" size={18} /> {subtitle}
            </div>
            <h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {safeRecords.length === 0 && !error && (
            <p className="text-center">Đang tải danh sách record...</p>
          )}
          {error && <div className="text-red-600 mb-4">{error}</div>}

          {/* Dùng safeRecords thay cho records trực tiếp để tránh crash */}
          {safeRecords.map((rec) => (
            <article
              key={rec.id}
              className="bg-record-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row lg:items-stretch border border-black/5"
            >
              {/* Cột 1: Ảnh bao phủ sát mép thẻ */}
              <div className="w-full lg:w-72 xl:w-80 shrink-0 min-h-[220px] lg:min-h-0 relative overflow-hidden bg-record-surface-container">
                {rec.image ? (
                  <img
                    src={rec.image}
                    alt={rec.title || "Kỷ lục"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full min-h-[220px] flex items-center justify-center bg-gradient-to-b from-record-surface-container-low to-record-surface-container">
                    <RecordHolderIcon name={rec.icon || "flare"} size={54} className="text-record-secondary/40" />
                  </div>
                )}
              </div>

              {/* Cột 2: Nội dung chính với khoảng đệm thoải mái */}
              <div className="flex-1 p-6 lg:py-8 lg:px-8 flex flex-col justify-center gap-3.5">
                <div className="space-y-2">
                  {rec.category && (
                    <span className="inline-block px-3 py-1 rounded-md bg-[#faeed8] text-[#8a4b08] text-xs font-bold uppercase tracking-wider">
                      {rec.category}
                    </span>
                  )}
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-[#4a0008] leading-snug tracking-tight">
                    {rec.title}
                  </h3>
                </div>

                {rec.criteria && rec.criteria.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#4a0008]">
                      Tiêu chí xét duyệt cốt lõi:
                    </div>
                    <ul className="space-y-2 text-sm text-[#374151] leading-relaxed">
                      {rec.criteria.map((crit, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2.5">
                          <RecordHolderIcon name="star" size={17} filled={false} className="text-[#b45309] shrink-0 mt-0.5" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Cột 3: Nút hành động trực tiếp trên nền thẻ */}
              <div className="w-full lg:w-64 xl:w-72 shrink-0 p-6 lg:p-8 flex flex-col justify-center gap-3">
                <button
                  type="button"
                  className="w-full py-3.5 px-4 rounded-lg bg-[#4a0008] hover:bg-[#680007] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => onNominate(rec.action?.nomination || rec.title)}
                >
                  <RecordHolderIcon name="help" size={16} />
                  {rec.action?.nomination || "Đề Cử / Nộp Hồ Sơ"}
                </button>
                <button
                  type="button"
                  className="w-full py-3.5 px-4 rounded-lg bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#1f2937] text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => onDownloadDoc(rec.action?.download, rec.title)}
                >
                  <RecordHolderIcon name="download" size={16} />
                  Tải Hồ Sơ Tiêu Chí Đề Cử
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}