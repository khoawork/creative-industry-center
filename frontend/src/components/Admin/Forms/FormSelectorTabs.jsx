import React from 'react';

export default function FormSelectorTabs({
  tabs = [],
  activeFormId,
  onSelectForm,
  currentSheetName,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      {tabs.map((tab) => {
        const isActive = activeFormId === tab.id;
        const displaySheet = isActive && currentSheetName ? currentSheetName : tab.defaultSheet;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectForm(tab.id)}
            className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
              isActive
                ? 'border-(--admin-heading) bg-(--admin-heading)/5 ring-2 ring-(--admin-heading)/20 shadow-xs'
                : 'border-(--admin-border) bg-(--admin-surface) hover:border-gray-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-(--admin-title)">{tab.label}</span>
                {isActive && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-(--admin-heading) text-white">
                    Đang chọn
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{tab.sublabel}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200">
                Tab: {displaySheet}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
