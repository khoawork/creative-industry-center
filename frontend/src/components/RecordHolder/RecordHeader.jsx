import RecordHolderIcon from "./RecordHolderIcon.jsx";

export default function RecordHeader({ header }) {
  if (!header) return null;

  return (
    <header className="relative w-full bg-record-primary-container text-record-on-primary overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-record-primary via-record-primary-container to-record-tertiary-container opacity-90"></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-around">
        <RecordHolderIcon name="military_tech" size={320} className="text-record-secondary-fixed" />
        <RecordHolderIcon name="workspace_premium" size={280} className="text-record-secondary-fixed lg:-translate-x-14" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20 flex flex-col gap-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-record-surface-container-high font-label-md text-label-md">
          <a className="hover:text-record-secondary-container transition-colors flex items-center gap-1" href="/trang-chu">
            <RecordHolderIcon name="home" size={18} />
            Trang chủ
          </a>
          <span className="opacity-40">/</span>
          <span className="text-record-secondary-fixed font-semibold tracking-wide">
            {header.title}
          </span>
        </nav>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-2">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-record-surface-container-lowest/10 backdrop-blur-md shadow-sm">
              <RecordHolderIcon name={header.icon || "stars"} size={20} filled className="text-record-secondary-container" />
              <span className="text-record-secondary-fixed font-label-sm text-label-sm uppercase tracking-widest font-bold">
                {header.subtitle}
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-record-on-primary tracking-tight leading-tight uppercase drop-shadow-sm">
              {header.title}
            </h1>
            {header.slogan && (
              <p className="font-body-lg text-body-lg text-record-secondary-fixed-dim italic font-medium tracking-wide">
                <i>"{header.slogan}"</i>
              </p>
            )}
          </div>
          <div className="flex flex-row sm:flex-col gap-6 p-6 rounded-xl bg-record-surface-container-lowest/10 backdrop-blur-md shadow-inner text-right min-w-[240px]">
            {header.metrics?.map((metric, index) => (
              <div key={index}>
                <div className="font-display-lg text-display-lg text-record-secondary-container font-bold leading-none">
                  {metric.value}
                </div>
                <div className="font-label-sm text-label-sm text-record-surface-container uppercase tracking-wider mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}