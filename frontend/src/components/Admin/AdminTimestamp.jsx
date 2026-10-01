const dateTimeFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh',
});

export default function AdminTimestamp({ value }) {
  return <time dateTime={value} className="text-[11px] leading-5 tabular-nums">{dateTimeFormat.format(new Date(value))}</time>;
}
