import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminModuleCard({ item }) {
  const Icon = item.icon;
  return (
    <Link to={item.path} className="group flex items-start gap-4 p-5 transition-colors duration-150 hover:border-(--admin-accent) motion-reduce:transition-none rounded-lg border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--admin-heading)">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-(--admin-background) text-(--admin-heading) group-hover:bg-(--admin-hover) group-hover:text-(--admin-hover-text)">
        <Icon size={21} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm leading-6 font-semibold text-(--admin-heading)">{item.label}</h3>
        <p className="mt-1 text-xs leading-5">{item.description}</p>
      </div>
      <ChevronRight size={16} className="mt-1 shrink-0 text-(--admin-heading)" aria-hidden="true" />
    </Link>
  );
}
