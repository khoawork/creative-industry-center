import { Moon, Sun } from 'lucide-react';

export default function AdminThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button type="button" role="switch" aria-checked={isDark} aria-label="Giao diện tối"
      title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'} onClick={onToggle}
      className="inline-flex h-11 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--admin-heading)">
      <span aria-hidden="true" className={`relative isolate grid h-9 w-16 shrink-0 grid-cols-2 rounded-full p-1 leading-none ring-1 ring-inset transition-colors duration-200 motion-reduce:transition-none ${isDark ? 'bg-(--admin-black) ring-(--admin-sidebar-text)' : 'bg-(--admin-background) ring-(--admin-primary)'}`}>
        <span className={`pointer-events-none absolute top-1 left-1 size-7 rounded-full transition-[translate,background-color] duration-200 ease-out motion-reduce:transition-none ${isDark ? 'translate-x-7 bg-(--admin-white)' : 'translate-x-0 bg-(--admin-primary)'}`} />
        <span className="relative grid size-7 place-items-center text-(--admin-white)">
          <Sun size={16} strokeWidth={1.8} className="block size-4 shrink-0" />
        </span>
        <span className={`relative grid size-7 place-items-center ${isDark ? 'text-(--admin-black)' : 'text-(--admin-primary)'}`}>
          <Moon size={16} strokeWidth={1.8} className="block size-4 shrink-0" />
        </span>
      </span>
    </button>
  );
}
