import { FaUserCheck } from "react-icons/fa";

export default function RegistrationForm({ training }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    alert(
      "Cảm ơn Quý học viên. Ban Tuyển sinh sẽ liên hệ trong 24 giờ làm việc."
    );
  };

  return (
    <div className="flex flex-col justify-center bg-[#f4f3f1] p-8 lg:col-span-5">
      <div className="mb-4">
        <span className="text-[12px] leading-4 font-bold uppercase tracking-[0.05em] text-[#490003]">
          Đăng ký tham gia
        </span>

        <p className="text-[14px] leading-[22px] text-[#58413f]">
          Ghi danh trực tiếp cho khóa học {training.code}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <div>
          <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
            Họ và tên *
          </label>

          <input
            type="text"
            placeholder={training.placeholderName}
            required
            className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-sm placeholder:text-[#58413f]/50 focus:outline-none focus:ring-1 focus:ring-[#490003]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
            Số điện thoại *
          </label>

          <input
            type="tel"
            placeholder={training.placeholderPhone}
            required
            className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-sm placeholder:text-[#58413f]/50 focus:outline-none focus:ring-1 focus:ring-[#490003]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[12px] leading-4 font-semibold text-[#1a1c1b]">
            Địa chỉ Email *
          </label>

          <input
            type="email"
            placeholder={training.placeholderEmail}
            required
            className="w-full rounded bg-white px-3 py-2 text-[14px] leading-[22px] text-[#1a1c1b] shadow-sm placeholder:text-[#58413f]/50 focus:outline-none focus:ring-1 focus:ring-[#490003]"
          />
        </div>

        <button
          type="submit"
          className="mt-1 flex w-full items-center justify-center gap-1 rounded bg-[#490003] py-2.5 text-[14px] leading-5 font-bold text-white shadow transition-all hover:bg-[#710008]"
        >
          <FaUserCheck className="text-[18px]" />
          Đăng ký khóa học
        </button>
      </form>
    </div>
  );
}