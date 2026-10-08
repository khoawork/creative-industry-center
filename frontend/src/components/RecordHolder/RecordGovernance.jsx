import RecordHolderIcon from "./RecordHolderIcon.jsx";

export default function RecordGovernance({ governance }) {
  if (!governance) return null;

  return (
    <section className="w-full py-16 lg:py-24 bg-record-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-4 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-record-secondary-container"></span>
                {governance.subtitle}
              </div>
              <h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold ">
                {governance.title}
              </h2>
            </div>
            <p className="font-body-md text-body-md text-record-on-surface-variant leading-relaxed text-justify">
              {governance.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {governance.cards?.map((card, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-record-surface-container-low shadow-sm flex flex-col gap-2">
                  <RecordHolderIcon name={card.icon} size={32} filled className="text-record-primary" />
                  <h3 className="font-headline-sm text-headline-sm text-record-on-surface font-bold">
                    {card.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-record-on-surface-variant">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col gap-6">
            {governance.cta?.map((item, idx) => (
              <div key={idx} className="relative p-8 rounded-xl bg-record-surface-container shadow-md overflow-hidden flex flex-col gap-6">
                <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full bg-record-secondary-container/25 pointer-events-none blur-2xl"></div>
                <div className="flex items-center gap-4 pb-4 bg-record-surface-container-high/60 p-4 rounded-lg">
                  <div className="w-14 h-14 rounded-xl bg-record-primary text-record-on-primary flex items-center justify-center shrink-0 shadow-md">
                    <RecordHolderIcon name={item.icon} size={32} />
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-record-primary font-bold">
                      {item.title}
                    </h4>
                    {/* Sửa lại hiển thị cycle và number_decision an toàn tránh bị lặp */}
                    <p className="font-label-sm text-label-sm text-record-on-surface-variant">
                      {item.cycle}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {item.roles?.map((r, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-3">
                      <RecordHolderIcon name="check_circle" size={20} filled className="text-record-secondary shrink-0 mt-0.5" />
                      <span className="font-body-sm text-body-sm text-record-on-surface">
                        <strong>{r.role}:</strong> {r.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 mt-2">
                  <a
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-record-primary text-record-on-primary font-label-md text-label-md font-bold uppercase tracking-wider hover:bg-record-tertiary shadow-md transition-colors"
                    href="#danh-sach-giai-thuong"
                  >
                    <RecordHolderIcon name="menu_book" size={20} />
                    {item.btn_action}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}