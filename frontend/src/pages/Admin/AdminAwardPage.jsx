import React, { useState } from 'react';
import { FileText, ListChecks, Trophy } from 'lucide-react';
import AwardPageContentManager from '../../components/Admin/Catalog/AwardPageContentManager.jsx';
import { AdminPageHeader, AdminTabs } from '../../components/Admin/Common/index.js';

export default function AdminAwardPage() {
  const [activeSection, setActiveSection] = useState('header');

  const sections = [
    { id: 'header', label: 'Header & Tiêu đề', icon: FileText },
    { id: 'selection', label: 'Award hiển thị', icon: ListChecks },
    { id: 'honors', label: 'Bảng vàng vinh danh', icon: Trophy },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        badge="Nội dung website"
        title="Quản trị Trang Giải thưởng"
        subtitle="Chọn award hiển thị, cập nhật header và quản lý bảng vàng của trang công khai."
      />

      <AdminTabs
        tabs={sections}
        activeTab={activeSection}
        onChange={setActiveSection}
      />

      <AwardPageContentManager activeSection={activeSection} />
    </div>
  );
}
