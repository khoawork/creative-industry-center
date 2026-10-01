import { ArrowRight, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminItemsById } from '../../config/Admin/adminNavigation.js';
import AdminTimestamp from './AdminTimestamp.jsx';

export default function AdminRecentMessages({ messages, unreadCount }) {
  return (
    <section aria-labelledby="admin-messages-title" className="rounded-lg border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--admin-border) px-5 py-4">
        <h2 id="admin-messages-title" className="text-base font-semibold">Hộp thư gần đây</h2>
        {unreadCount > 0 && <span className="rounded-full bg-(--admin-accent) px-2.5 py-1 text-[10px] font-semibold text-(--admin-black)">{unreadCount} chưa đọc</span>}
      </div>
      {messages.length ? (
        <ul className="divide-y divide-(--admin-border) px-5">
          {messages.slice(0, 3).map((message) => (
            <li key={message.id} className="flex gap-3 py-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--admin-background) text-[11px] font-semibold text-(--admin-heading)" aria-hidden="true">{message.initials}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-xs leading-5 font-semibold" title={message.sender}>{message.sender}</h3>
                  {message.unread && <span className="size-1.5 shrink-0 rounded-full bg-(--admin-heading)"><span className="sr-only">Chưa đọc</span></span>}
                </div>
                <p className="mt-1 text-xs leading-5 break-words">{message.subject}</p>
                <div className="mt-2"><AdminTimestamp value={message.receivedAt} /></div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
          <Inbox size={28} strokeWidth={1.5} className="text-(--admin-heading)" aria-hidden="true" />
          <p className="text-sm">Chưa có tin nhắn nào.</p>
        </div>
      )}
      <div className="border-t border-(--admin-border) px-5 py-2">
        <Link to={adminItemsById.contact.path} className="inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-(--admin-heading) hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--admin-heading)">Xem tất cả hộp thư <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
