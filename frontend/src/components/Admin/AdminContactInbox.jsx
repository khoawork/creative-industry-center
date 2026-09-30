import { useState } from 'react';
import { Inbox, MailOpen, RefreshCw } from 'lucide-react';
import AdminTimestamp from './AdminTimestamp.jsx';

export default function AdminContactInbox({ messages }) {
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [refreshed, setRefreshed] = useState(false);
  const unreadCount = messages.filter((message) => message.unread).length;
  const visibleMessages = filter === 'unread' ? messages.filter((message) => message.unread) : messages;
  const selectedMessage = visibleMessages.find((message) => message.id === selectedId);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Lọc hộp thư" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={filter === 'all'} onClick={() => { setFilter('all'); setRefreshed(false); }}
            className={`min-h-11 cursor-pointer px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-heading) ${filter === 'all' ? 'bg-(--admin-accent) text-(--admin-black)' : 'text-(--admin-heading) hover:bg-(--admin-nav-hover)'}`}>
            Tất cả ({messages.length})
          </button>
          <button type="button" aria-pressed={filter === 'unread'} onClick={() => { setFilter('unread'); setRefreshed(false); }}
            className={`min-h-11 cursor-pointer px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-heading) ${filter === 'unread' ? 'bg-(--admin-accent) text-(--admin-black)' : 'text-(--admin-heading) hover:bg-(--admin-nav-hover)'}`}>
            Chưa đọc ({unreadCount})
          </button>
        </div>
        <button type="button" onClick={() => { setSelectedId(null); setRefreshed(true); }}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 px-4 text-sm font-semibold text-(--admin-heading) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-heading)">
          <RefreshCw size={15} aria-hidden="true" />Làm mới
        </button>
      </div>
      {refreshed && <p role="status" className="mb-4 text-xs leading-5">Đã tải lại danh sách minh họa. Hộp thư chưa kết nối dữ liệu thực tế.</p>}
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <section aria-label="Danh sách thư" className="min-w-0 border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)]">
          {visibleMessages.length ? (
            <ul className="divide-y divide-(--admin-border)">
              {visibleMessages.map((message) => (
                <li key={message.id}>
                  <button type="button" aria-pressed={selectedId === message.id} aria-controls="admin-message-detail"
                    onClick={() => { setSelectedId(message.id); setRefreshed(false); }}
                    className={`block w-full cursor-pointer border-l-[3px] p-5 text-left transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--admin-heading) ${selectedId === message.id ? 'border-(--admin-accent) bg-(--admin-background)' : 'border-transparent hover:bg-(--admin-background)'}`}>
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold">{message.sender}</span>
                      {message.unread && <span className="rounded-full bg-(--admin-accent) px-2 py-1 text-[10px] font-semibold text-(--admin-black)">Chưa đọc</span>}
                    </span>
                    <span className="mt-2 block text-sm leading-6 break-words text-(--admin-heading)">{message.subject}</span>
                    <span className="mt-2 block"><AdminTimestamp value={message.receivedAt} /></span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-3 p-5 text-sm text-(--admin-heading)">
              <Inbox size={20} aria-hidden="true" />{filter === 'unread' ? 'Không có tin nhắn chưa đọc.' : 'Không có tin nhắn.'}
            </div>
          )}
        </section>
        <section id="admin-message-detail" aria-label="Chi tiết thư" aria-live="polite" className="min-w-0 border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-5 sm:p-6">
          {selectedMessage ? (
            <>
              <h2 className="text-lg leading-7 font-semibold text-(--admin-title)">{selectedMessage.subject}</h2>
              <p className="mt-3 text-sm">Người gửi: <strong>{selectedMessage.sender}</strong></p>
              <div className="mt-1"><AdminTimestamp value={selectedMessage.receivedAt} /></div>
              <p className="mt-5 border-t border-(--admin-border) pt-5 text-sm leading-7 whitespace-pre-line break-words">{selectedMessage.body}</p>
              <p className="mt-6 text-xs leading-5 text-(--admin-heading)">Bản xem trước dữ liệu minh họa. Trạng thái đã đọc và trả lời thư chưa được lưu.</p>
            </>
          ) : (
            <div className="flex items-center gap-3 text-sm leading-6 text-(--admin-heading)">
              <MailOpen size={20} className="shrink-0" aria-hidden="true" />Chọn một tin nhắn để xem chi tiết.
            </div>
          )}
        </section>
      </div>
    </>
  );
}
