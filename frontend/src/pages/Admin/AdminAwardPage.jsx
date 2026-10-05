import React, { useState } from 'react';
import { Award, FileText, ListChecks, Trophy } from 'lucide-react';
import AwardPageContentManager from '../../components/Admin/Catalog/AwardPageContentManager.jsx';

export default function AdminAwardPage() {
  const [activeSection, setActiveSection] = useState('header');

  const sections = [
    { id: 'header', label: 'Header', description: 'Tiêu đề và mô tả trang', icon: FileText, color: 'text-sky-400' },
    { id: 'selection', label: 'Award hiển thị', description: 'Chọn danh mục công khai', icon: ListChecks, color: 'text-emerald-400' },
    { id: 'honors', label: 'Bảng vàng', description: 'Hồ sơ được vinh danh', icon: Trophy, color: 'text-amber-400' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 animate-fade-in">
      <header className="rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-3">
          <span className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
            <Award className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--admin-text-muted)]">Nội dung website</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--admin-text)] sm:text-3xl">Trang Giải thưởng</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--admin-text-muted)]">Chọn award hiển thị, cập nhật header và quản lý bảng vàng của trang công khai.</p>
          </div>
        </div>
      </header>
      <nav className="sticky top-4 z-20 grid gap-2 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)]/95 p-2 shadow-sm backdrop-blur sm:grid-cols-3" aria-label="Nhóm nội dung trang giải thưởng">
        {sections.map(({ id, label, description, icon: Icon, color }) => (
          <button key={id} type="button" onClick={() => setActiveSection(id)} className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${activeSection === id ? 'bg-[var(--admin-background)] ring-1 ring-white/10' : 'hover:bg-[var(--admin-background)]'}`} aria-pressed={activeSection === id}>
            <Icon className={`size-4 ${color}`} />
            <span><span className="block text-sm font-bold text-[var(--admin-text)]">{label}</span><span className="block text-xs text-[var(--admin-text-muted)]">{description}</span></span>
          </button>
        ))}
      </nav>
      <AwardPageContentManager activeSection={activeSection} />
    </div>
  );
}
