import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminStatCard({ item, label = item.label, value, detail }) {
  const Icon = item.icon;
  return (
    <Link to={item.path} className="group flex min-h-[176px] flex-col p-5 transition-colors duration-150 hover:border-(--admin-accent) motion-reduce:transition-none xl:p-6 rounded-lg border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--admin-heading)">
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-lg bg-(--admin-background) text-(--admin-heading)">
          <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <ArrowUpRight size={18} className="text-(--admin-heading)" aria-hidden="true" />
      </div>
      <span className="mt-4 text-xs leading-5 font-medium tracking-wide">{label}</span>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
        <span className="text-4xl leading-none font-semibold tracking-tight text-(--admin-heading) tabular-nums">{value}</span>
        <span className="pb-0.5 text-xs leading-5">{detail}</span>
      </div>
    </Link>
  );
}
