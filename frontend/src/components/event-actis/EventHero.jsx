import {
  Calendar,
  Users,
  Award,
  Building2,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import { validEventLink } from "../../api/eventApi.js";

const icons = {
  calendar: Calendar,
  users: Users,
  certificate: Award,
  building: Building2,
};
export const EventHero = ({ section }) => (
  <section className="relative isolate overflow-hidden bg-(--color-brand-red) pb-20 pt-10 text-white md:pt-16">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-tr from-black/30 via-transparent to-(--color-brand-gold)/15"
    />
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
   
      {section?.badge && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-(--color-brand-gold)/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-(--color-brand-cream)">
          <BadgeCheck size={16} aria-hidden="true" />
          {section.badge}
        </div>
      )}
      <h1 className="text-3xl font-extrabold uppercase tracking-tight sm:text-4xl lg:text-[56px] lg:leading-tight">
        {section?.title}
      </h1>
      {section?.description && (
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/95 md:text-lg">
          {section.description}
        </p>
      )}
      {section?.statistics?.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 rounded-lg bg-black/20 p-4 md:grid-cols-4">
          {section.statistics.map((stat, index) => {
            const Icon = icons[stat.icon] || Award;
            return (
              <div key={index} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--color-brand-gold)/20 text-(--color-brand-cream)">
                  <Icon size={23} aria-hidden="true" />
                </span>
                <div>
                  <strong className="block text-base font-extrabold leading-tight md:text-lg">
                    {stat.value}
                  </strong>
                  <span className="text-xs font-semibold text-white/85">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </section>
);
export default EventHero;
