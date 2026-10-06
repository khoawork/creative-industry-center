import React from 'react';
import { Sliders, Plus, Trash2 } from 'lucide-react';

export default function FieldBuilderTable({
  fields = [],
  onAddField,
  onUpdateField,
  onRemoveField,
}) {
  return (
    <div className="rounded-xl border border-(--admin-border) bg-(--admin-surface) overflow-hidden shadow-2xs">
      {/* Header của bảng */}
      <div className="px-5 py-3.5 border-b border-(--admin-border) flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
        <div>
          <h3 className="text-sm font-bold text-(--admin-title) flex items-center gap-2">
            <Sliders className="w-4 h-4 text-(--admin-heading)" />
            Danh Sách Các Trường Nhập Liệu (Form Fields)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Các trường này sẽ được hiển thị trên form website và tương ứng với các cột trên trang tính Google Sheet.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddField}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-(--admin-heading) text-white shadow-xs hover:opacity-90 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm trường mới
        </button>
      </div>

      {/* Table danh sách fields */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100/70 border-b border-(--admin-border) text-gray-600 uppercase tracking-wider text-[11px] font-bold">
              <th className="py-2.5 px-3 text-center w-12">#</th>
              <th className="py-2.5 px-3 min-w-[160px]">Mã Cột Sheet (Key) *</th>
              <th className="py-2.5 px-3 min-w-[200px]">Tiêu Đề Hiển Thị (Label) *</th>
              <th className="py-2.5 px-3 min-w-[130px]">Kiểu Nhập Liệu</th>
              <th className="py-2.5 px-3 min-w-[180px]">Gợi Ý (Placeholder)</th>
              <th className="py-2.5 px-3 text-center w-24">Bắt Buộc</th>
              <th className="py-2.5 px-3 text-center w-16">Xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--admin-border)/60">
            {/* Cột thời gian gửi cố định */}
            <tr className="bg-gray-50/50 text-gray-400 select-none">
              <td className="py-2.5 px-3 text-center font-bold">0</td>
              <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-gray-500">
                submittedAt (Cố định)
              </td>
              <td className="py-2.5 px-3 font-semibold text-gray-600">Thời gian gửi</td>
              <td className="py-2.5 px-3 text-gray-500">Ngày giờ (Tự động)</td>
              <td className="py-2.5 px-3 text-gray-400 italic">Hệ thống tự ghi ngày giờ</td>
              <td className="py-2.5 px-3 text-center">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-600">
                  Cố định
                </span>
              </td>
              <td className="py-2.5 px-3 text-center">-</td>
            </tr>

            {/* Các trường do Admin cấu hình */}
            {fields.map((field, index) => (
              <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                {/* STT */}
                <td className="py-2.5 px-3 text-center font-bold text-gray-500">
                  {index + 1}
                </td>

                {/* Key (Tên cột Sheet) */}
                <td className="py-2.5 px-3">
                  <input
                    type="text"
                    value={field.key || ''}
                    onChange={(e) => onUpdateField(index, 'key', e.target.value)}
                    placeholder="vd: fullName"
                    className="w-full px-2.5 py-1.5 font-mono text-xs rounded border border-gray-200 bg-white focus:outline-hidden focus:border-(--admin-heading)"
                  />
                </td>

                {/* Label hiển thị */}
                <td className="py-2.5 px-3">
                  <input
                    type="text"
                    value={field.label || ''}
                    onChange={(e) => onUpdateField(index, 'label', e.target.value)}
                    placeholder="vd: Họ và tên đại biểu"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold rounded border border-gray-200 bg-white focus:outline-hidden focus:border-(--admin-heading)"
                  />
                </td>

                {/* Kiểu dữ liệu */}
                <td className="py-2.5 px-3">
                  <select
                    value={field.type || 'text'}
                    onChange={(e) => onUpdateField(index, 'type', e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded border border-gray-200 bg-white focus:outline-hidden focus:border-(--admin-heading)"
                  >
                    <option value="text">Văn bản (Text)</option>
                    <option value="email">Email</option>
                    <option value="tel">Số điện thoại (Tel)</option>
                    <option value="textarea">Đoạn văn (Textarea)</option>
                    <option value="number">Số (Number)</option>
                    <option value="date">Ngày tháng (Date)</option>
                    <option value="select">Lựa chọn (Select)</option>
                  </select>
                </td>

                {/* Placeholder */}
                <td className="py-2.5 px-3">
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => onUpdateField(index, 'placeholder', e.target.value)}
                    placeholder="Nhập hướng dẫn gợi ý..."
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 bg-white focus:outline-hidden focus:border-(--admin-heading)"
                  />
                </td>

                {/* Bắt buộc toggle */}
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={!!field.required}
                    onChange={(e) => onUpdateField(index, 'required', e.target.checked)}
                    className="w-4 h-4 rounded text-(--admin-heading) focus:ring-(--admin-heading) cursor-pointer"
                  />
                </td>

                {/* Xóa */}
                <td className="py-2.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => onRemoveField(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded transition cursor-pointer"
                    title="Xóa trường này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {fields.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400 text-xs">
                  Chưa có trường nào. Bấm &quot;+ Thêm trường mới&quot; để tạo cột cho trang tính.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
