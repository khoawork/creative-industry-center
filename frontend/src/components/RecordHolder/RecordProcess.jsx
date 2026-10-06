import RecordHolderIcon from "./RecordHolderIcon.jsx";

export default function RecordProcess({ process }) {
  if (!process) return null;

  return (
    <section className="w-full py-16 lg:py-24 bg-record-surface-container-high text-record-on-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-14">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold">
            <span className="w-2 h-2 rounded-full bg-record-primary"></span>
            {process.subtitle}
          </div>
          <h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold">
            {process.title}
          </h2>
          <p className="font-body-md text-body-md text-record-on-surface-variant">
            {process.description}
          </p>
        </div>

        {/* Lưới 4 bước quy trình */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.cards?.map((card, idx) => {
            const stepNum = String(idx + 1).padStart(2, "0");
            const isLastStep = idx === 3; // Bước 4 có style màu đặc biệt (secondary-container)

            return (
              <div
                key={card.id || idx}
                className="p-6 rounded-xl bg-record-surface-container-lowest shadow-sm flex flex-col justify-between gap-6 relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-10 h-10 rounded-lg font-headline-sm text-headline-sm font-bold flex items-center justify-center ${
                        isLastStep
                          ? "bg-record-secondary-container text-record-on-secondary-container"
                          : "bg-record-primary text-record-on-primary"
                      }`}
                    >
                      {stepNum}
                    </span>
                    <RecordHolderIcon
                      name={card.icon}
                      size={28}
                      filled={isLastStep}
                      className={isLastStep ? "text-record-primary" : "text-record-secondary"}
                    />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-record-primary font-bold">
                    {card.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-record-on-surface-variant leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Thông tin thời gian / biên bản / địa điểm ở chân mỗi card */}
                {card.info && card.info.length > 0 && (
                  <div className="pt-4 bg-record-surface-container-low p-3 rounded-lg text-label-sm text-record-on-surface-variant">
                    {card.info.map((inf, i) => (
                      <span key={i}>
                        <strong className="text-record-primary">{inf.label}:</strong> {inf.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}