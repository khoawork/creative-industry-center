import RecordHolderIcon from "./RecordHolderIcon.jsx";

export default function RecordList({ records, error, onNominate, onDownloadDoc }) {
  // Đảm bảo records luôn là một mảng, nếu không phải sẽ mặc định là mảng trống []
  const safeRecords = Array.isArray(records) ? records : [];

  return (
    <section className="w-full py-16 lg:py-24 bg-record-surface-container-low" id="danh-sach-giai-thuong">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold">
              <RecordHolderIcon name="military_tech" size={18} /> DANH MỤC ĐỀ CỬ KỶ LỤC
            </div>
            <h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold">
              DANH MỤC HẠNG MỤC ĐỀ CỬ KỶ LỤC
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
              className="bg-record-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              <div className="lg:col-span-3 flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-b from-record-surface-container-low to-record-surface-container text-center shadow-inner">
                <div className="w-24 h-24 rounded-full bg-record-secondary-container/20 flex items-center justify-center text-record-secondary mb-3 shadow-sm">
                  <RecordHolderIcon name={rec.icon || "flare"} size={54} filled className="text-record-secondary" />
                </div>
                <span className="font-label-sm text-label-sm text-record-primary font-bold uppercase tracking-widest">
                  {rec.rank}
                </span>
                {rec.subtitle && (
                  <span className="font-label-sm text-label-sm text-record-on-surface-variant mt-1">
                    {rec.subtitle}
                  </span>
                )}
              </div>

              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-label-sm">
                    <span className="px-2.5 py-1 rounded bg-record-secondary-fixed text-record-on-secondary-fixed font-bold uppercase">
                      {rec.category}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-record-surface-container-high text-record-on-surface-variant font-semibold">
                      Chu kỳ: {rec.cycle}
                    </span>
                  </div>
                  <h3 className="font-headline-lg text-headline-lg text-record-primary font-bold pt-1">
                    {rec.title}
                  </h3>
                </div>
                
                {rec.criteria && (
                  <div className="space-y-2 pt-1">
                    <div className="font-label-md text-label-md text-record-primary font-bold uppercase tracking-wide">
                      Tiêu chí xét duyệt cốt lõi:
                    </div>
                    <ul className="space-y-1.5 font-body-sm text-body-sm text-record-on-surface">
                      {rec.criteria.map((crit, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2">
                          <RecordHolderIcon name="star" size={18} filled className="text-record-secondary shrink-0 mt-0.5" />
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 flex flex-col gap-3 justify-center lg:pl-6 bg-record-surface-container-low/50 p-6 rounded-xl">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-lg bg-record-primary text-record-on-primary font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-record-tertiary transition-all shadow-md flex items-center justify-center gap-2"
                  onClick={() => onNominate(rec.action?.nomination || rec.title)}
                >
                  <RecordHolderIcon name="assignment_turned_in" size={18} />
                  Đề Cử / Nộp Hồ Sơ
                </button>
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-lg bg-record-surface-container text-record-primary font-label-md text-label-md font-semibold tracking-wider hover:bg-record-surface-container-high transition-all flex items-center justify-center gap-2"
                  onClick={() => onDownloadDoc(rec.action?.download || "Document.pdf")}
                >
                  <RecordHolderIcon name="download" size={18} />
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