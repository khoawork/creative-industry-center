import React from 'react';

export default function AdminCard({
  title,
  subtitle,
  badge,
  actions,
  children,
  footer,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  noPadding = false,
  ...props
}) {
  const hasHeader = title || subtitle || badge || actions;

  return (
    <section
      className={`rounded-xl border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] transition-colors ${className}`}
      {...props}
    >
      {hasHeader && (
        <header
          className={`flex flex-wrap items-center justify-between gap-3 border-b border-(--admin-border) px-5 py-4 sm:px-6 ${headerClassName}`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              {title && (
                <h2 className="text-base font-semibold tracking-tight text-(--admin-title) sm:text-lg">
                  {title}
                </h2>
              )}
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && (
              <p className="mt-1 text-xs leading-5 text-(--admin-ink)/70 sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}

      <div className={noPadding ? bodyClassName : `p-5 sm:p-6 ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <footer className="border-t border-(--admin-border) bg-(--admin-background)/40 px-5 py-3.5 sm:px-6 rounded-b-xl flex flex-wrap items-center justify-between gap-3">
          {footer}
        </footer>
      )}
    </section>
  );
}

