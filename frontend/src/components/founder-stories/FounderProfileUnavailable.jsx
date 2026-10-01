import { Clock3 } from 'lucide-react';

export function FounderProfileUnavailable() {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-[#d49520]/60 bg-gradient-to-br from-[#fffaf0] via-[#fcfbf9] to-[#f7eee2] px-5 shadow-inner">
      <div className="inline-flex items-center gap-2.5 rounded-full border border-[#d49520]/40 bg-white/80 px-4 py-2 text-sm font-semibold text-[#710008] shadow-sm">
        <span className="flex size-7 items-center justify-center rounded-full bg-[#710008] text-[#f6d98b]">
          <Clock3 size={15} strokeWidth={2} aria-hidden="true" />
        </span>
        <span>Chưa cập nhật</span>
      </div>
    </div>
  );
}

export default FounderProfileUnavailable;
