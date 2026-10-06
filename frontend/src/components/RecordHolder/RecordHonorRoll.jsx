import RecordHolderIcon from "./RecordHolderIcon.jsx";

export default function RecordHonorRoll({ honorRoll, filter, setFilter }) {
  if (!honorRoll) return null;

  // Lọc danh sách card theo giá trị filter hiện tại (all / doanh-nhan / nghe-nhan)
  const filteredCards = honorRoll.cards?.filter((card) => {
    if (filter === "all") return true;
    return card.category === filter;
  }) || [];

  return (
    <section className="w-full py-16 lg:py-24 bg-record-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-record-secondary font-label-sm text-label-sm uppercase tracking-widest font-bold">
              <RecordHolderIcon name="verified" size={18} />
              {honorRoll.title}
            </div>
            <h2 className="font-headline-lg text-headline-lg text-record-primary uppercase font-bold">
              {honorRoll.subtitle}
            </h2>
            <p className="font-body-md text-body-md text-record-on-surface-variant">
              {honorRoll.description}
            </p>
          </div>
          
          {/* Bộ lọc Tab */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold tracking-wider transition-all ${filter === "all" ? "bg-record-primary text-record-on-primary shadow-sm" : "bg-record-surface-container-high text-record-on-surface-variant hover:bg-record-secondary-fixed"}`}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold tracking-wider transition-all ${filter === "doanh-nhan" ? "bg-record-primary text-record-on-primary shadow-sm" : "bg-record-surface-container-high text-record-on-surface-variant hover:bg-record-secondary-fixed"}`}
              onClick={() => setFilter("doanh-nhan")}
            >
              Doanh nghiệp
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-label-sm text-label-sm font-semibold tracking-wider transition-all ${filter === "nghe-nhan" ? "bg-record-primary text-record-on-primary shadow-sm" : "bg-record-surface-container-high text-record-on-surface-variant hover:bg-record-secondary-fixed"}`}
              onClick={() => setFilter("nghe-nhan")}
            >
              Nghệ nhân
            </button>
          </div>
        </div>

        {/* Lưới danh sách cá nhân / tập thể được tôn vinh */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCards.map((card, idx) => (
            <div
              key={idx}
              className="group bg-record-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Khung hiển thị hình ảnh */}
              {card.image && (
                <div className="relative h-64 w-full overflow-hidden bg-record-surface-container">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-record-primary-container text-record-on-primary font-label-sm text-label-sm font-bold shadow-md z-10">
                    {card.year}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                </div>
              )}

              <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                <div>
                  {/* Nếu không có ảnh thì hiển thị thẻ năm ở góc */}
                  {!card.image && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2.5 py-1 rounded bg-record-primary-container text-record-on-primary font-label-sm text-label-sm font-bold">
                        {card.year}
                      </span>
                    </div>
                  )}
                  <h3 className="font-headline-sm text-headline-sm text-record-on-surface font-bold">
                    {card.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-record-on-surface-variant mt-1">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 bg-record-surface-container-low p-3 rounded-lg flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-record-primary font-bold">
                    {honorRoll.award_nomination_name?.label}
                  </span>
                  <span className="font-body-sm text-body-sm text-record-on-surface font-medium flex items-center gap-1.5">
                    <RecordHolderIcon name="trophy" size={18} className="text-record-secondary" />
                    {honorRoll.award_nomination_name?.value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}