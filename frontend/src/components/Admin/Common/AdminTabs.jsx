import React from 'react';

export default function AdminTabs({
  tabs = [],
  activeTab,
  onChange,
  className = '',
  ariaLabel = 'Thanh chuyển tab quản trị',
}) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex max-w-full gap-1.5 overflow-x-auto rounded-xl border border-(--admin-border) bg-(--admin-surface) p-1.5 shadow-2xs [scrollbar-width:none] ${className}`}
    >
      {tabs.map((tab) => {
        const tabId = tab.id ?? tab.key;
        const isSelected = String(activeTab) === String(tabId);
        const IconComponent = tab.icon;

        return (
          <button
            key={tabId}
            type="button"
            role="tab"
            id={`tab-${tabId}`}
            aria-controls={`panel-${tabId}`}
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(tabId)}
            className={`group relative inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--admin-accent) ${
              isSelected
                ? 'bg-(--admin-background) text-(--admin-title) font-bold shadow-2xs border-b-2 border-(--admin-accent)'
                : 'border-b-2 border-transparent text-(--admin-ink)/70 hover:bg-(--admin-background)/70 hover:text-(--admin-heading)'
            }`}
          >
            {IconComponent && (
              <IconComponent
                size={14}
                className={
                  isSelected
                    ? 'text-(--admin-accent)'
                    : 'text-(--admin-ink)/50 group-hover:text-(--admin-heading)'
                }
                aria-hidden="true"
              />
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span className="ml-1 rounded-full bg-(--admin-surface) border border-(--admin-border) px-1.5 py-0.2 text-[10px] font-mono text-(--admin-heading)">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
