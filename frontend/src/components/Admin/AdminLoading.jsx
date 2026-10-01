import useAdminTheme from '../../hooks/Admin/useAdminTheme.js';

export default function AdminLoading() {
  const { theme } = useAdminTheme();

  return (
    <div role="status" className={`flex min-h-dvh items-center justify-center p-6 text-sm [font-family:Inter,sans-serif] ${theme === 'dark' ? 'bg-black text-white [color-scheme:dark]' : 'bg-white text-black [color-scheme:light]'}`}>
      Đang mở khu vực quản trị…
    </div>
  );
}
