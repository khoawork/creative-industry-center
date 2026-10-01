import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import AdminContactInbox from '../../components/Admin/AdminContactInbox.jsx';
import { adminContactTabs } from '../../config/Admin/adminContact.js';
import { adminMessages } from '../../data/Admin/adminDashboardData.js';
import { site } from '../../config/shared/site.js';

export default function AdminContact() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabRefs = useRef([]);
  const activeTab = adminContactTabs.find((tab) => tab.id === searchParams.get('tab')) ?? adminContactTabs[0];

  function selectTab(tab) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (tab.id === 'inbox') next.delete('tab');
      else next.set('tab', tab.id);
      return next;
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--admin-border) pb-7">
        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-(--admin-heading) uppercase">Khu vực quản trị</p>
          <h1 className="text-2xl font-semibold tracking-tight text-(--admin-title) sm:text-3xl">Liên hệ</h1>
          <p className="mt-3 text-sm leading-6">Hộp thư, cấu hình form và thông tin liên hệ của trung tâm.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-(--admin-accent) px-3 py-1.5 text-[11px] text-(--admin-heading)"><Sparkles size={13} aria-hidden="true" />Dữ liệu minh họa</span>
      </div>
      <div role="tablist" aria-label="Quản lý liên hệ" className="my-6 flex max-w-full gap-1 overflow-x-auto border-b border-(--admin-border) bg-(--admin-surface) p-1">
        {adminContactTabs.map((tab, index) => (
          <button key={tab.id} ref={(node) => { tabRefs.current[index] = node; }} id={`contact-tab-${tab.id}`} type="button" role="tab"
            aria-selected={activeTab.id === tab.id} aria-controls={`contact-panel-${tab.id}`} tabIndex={activeTab.id === tab.id ? 0 : -1}
            onClick={() => selectTab(tab)} onKeyDown={(event) => {
              let nextIndex;
              if (event.key === 'ArrowRight') nextIndex = (index + 1) % adminContactTabs.length;
              else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + adminContactTabs.length) % adminContactTabs.length;
              else if (event.key === 'Home') nextIndex = 0;
              else if (event.key === 'End') nextIndex = adminContactTabs.length - 1;
              else return;
              event.preventDefault();
              selectTab(adminContactTabs[nextIndex]);
              tabRefs.current[nextIndex]?.focus();
            }}
            className={`min-h-11 shrink-0 cursor-pointer border-b-2 px-4 text-sm font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--admin-heading) ${activeTab.id === tab.id ? 'border-(--admin-accent) text-(--admin-title)' : 'border-transparent text-(--admin-heading) hover:bg-(--admin-background)'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {adminContactTabs.map((tab) => (
        <div key={tab.id} id={`contact-panel-${tab.id}`} role="tabpanel" aria-labelledby={`contact-tab-${tab.id}`} hidden={activeTab.id !== tab.id}>
          {tab.id === 'inbox' ? <AdminContactInbox messages={adminMessages} /> : tab.id === 'info' ? (
            <section className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-6">
              <h2 className="text-lg font-semibold text-(--admin-title)">Thông tin liên hệ</h2>
              <dl className="mt-5 grid gap-5 text-sm leading-6">
                <div><dt className="font-semibold text-(--admin-heading)">Đơn vị</dt><dd>{site.name}</dd></div>
                <div><dt className="font-semibold text-(--admin-heading)">Địa chỉ</dt><dd>{site.contact.address}</dd></div>
                <div><dt className="font-semibold text-(--admin-heading)">Điện thoại</dt><dd>{site.contact.phone}</dd></div>
                <div><dt className="font-semibold text-(--admin-heading)">Email</dt><dd className="break-words">{site.contact.emails.join(' · ')}</dd></div>
              </dl>
              <p className="mt-6 text-xs leading-5">Thông tin đang dùng trên website. Chức năng chỉnh sửa chưa được kết nối.</p>
            </section>
          ) : (
            <section className="border border-(--admin-border) bg-(--admin-surface) shadow-[var(--admin-panel-shadow)] p-6">
              <h2 className="text-lg font-semibold text-(--admin-title)">{tab.label}</h2>
              <p className="mt-3 text-sm leading-6">{tab.description}</p>
            </section>
          )}
        </div>
      ))}
    </>
  );
}
