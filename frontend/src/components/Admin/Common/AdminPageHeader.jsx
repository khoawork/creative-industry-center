import React from 'react';

export default function AdminPageHeader({
  badge = 'Khu vực quản trị',
  title,
  subtitle,
  description,
  actions,
  children
}) {
  const desc = subtitle || description;
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--admin-border) pb-6">
      <div className="max-w-3xl">
        <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-(--admin-heading) uppercase">
          <span className="h-px w-6 bg-(--admin-accent)" />
          {badge}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-(--admin-title) sm:text-3xl">
          {title}
        </h1>
        {desc && (
          <p className="mt-2 text-sm leading-6 text-(--admin-ink)/75">
            {desc}
          </p>
        )}
      </div>

      {(actions || children) && (
        <div className="flex flex-wrap items-center gap-2.5">
          {actions || children}
        </div>
      )}
    </div>
  );
}

