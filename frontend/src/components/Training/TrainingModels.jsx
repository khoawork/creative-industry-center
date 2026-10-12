import { FaChevronRight } from "react-icons/fa";
import { DynamicIcon } from "../icons/index.js";

const aliasMap = {
  hub: "Layers",
  workspace: "Briefcase",
  storefront: "Building2",
};

export default function TrainingModels({ models }) {
  if (!Array.isArray(models) || models.length === 0) {
    return null;
  }

  return (
    <section className="relative z-10 mx-auto -mt-8 w-full max-w-[75rem] px-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {models.map((model) => {
          const iconName = aliasMap[model.icon] || model.icon || "Layers";

          return (
            <div
              key={model.model}
              className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-md"
            >
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#f4f3f1] text-[#490003]">
                  <DynamicIcon name={iconName} size={26} fallback="Layers" />
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