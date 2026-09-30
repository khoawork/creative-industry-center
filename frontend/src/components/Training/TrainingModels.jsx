import {
  FaProjectDiagram,
  FaAward,
  FaStore,
  FaChevronRight,
} from "react-icons/fa";

const icons = {
  hub: FaProjectDiagram,
  workspace: FaAward,
  storefront: FaStore,
};

export default function TrainingModels({ models }) {
  return (
    <section className="relative z-10 mx-auto -mt-8 w-full max-w-[75rem] px-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {models.map((model) => {
          const Icon = icons[model.icon];

          return (
            <div
              key={model.model}
              className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-md"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f4f3f1] text-[#490003]">
                  <Icon className="text-[26px]" />
                </div>

                <span className="text-[12px] leading-4 font-semibold uppercase text-[#805600]">
                  {model.model}
                </span>

                <h2 className="mt-1 mb-2 text-[18px] leading-6 font-bold text-[#490003]">
                  {model.title}
                </h2>

                <p className="text-[14px] leading-[22px] text-[#58413f]">
                  {model.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-[14px] leading-5 font-semibold text-[#805600]">
                <span>{model.action}</span>
                <FaChevronRight className="text-[12px]" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}