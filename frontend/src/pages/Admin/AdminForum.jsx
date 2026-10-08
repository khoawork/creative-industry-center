import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Users,
  CalendarDays,
  Trophy,
  Building2,
  Send,
  RefreshCw,
  ExternalLink,
  PanelTop,
} from 'lucide-react';
import { ForumPageAPI } from '../../api/forumApi.js';
import {
  ForumHeroEditor,
  ForumPillarsEditor,
  ForumSpeakersEditor,
  ForumAgendaEditor,
  ForumAwardSelector,
  ForumPartnersEditor,
  ForumRegistrationEditor,
  ForumHeaderEditor,
} from '../../components/Admin/Forum/index.js';
import {
  AdminPageHeader,
  AdminTabs,
  AdminToast,
  AdminButton,
} from '../../components/Admin/Common/index.js';

const adminForumTabs = [
  { id: 'header', label: 'Header & Điều hướng', icon: PanelTop },
  { id: 'hero', label: 'Hero & Thông điệp', icon: Sparkles },
  { id: 'pillars', label: 'Bốn Trụ Cột Chiến Lược', icon: Layers },
  { id: 'speakers', label: 'Hội Đồng Diễn Giả', icon: Users },
  { id: 'agenda', label: 'Lịch Trình Nghị Sự (4 Phiên)', icon: CalendarDays },
  { id: 'awards', label: 'Giải Thưởng Vinh Danh (Chọn DB)', icon: Trophy },
  { id: 'partners', label: 'Đơn Vị Đồng Hành', icon: Building2 },
  { id: 'registration', label: 'Đăng Ký & Tiếp Nhận', icon: Send },
];

export default function AdminForum() {
  const [activeTab, setActiveTab] = useState(adminForumTabs[0]);
  const [forumData, setForumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await ForumPageAPI.getForumPage(8);
      if (response && response.data) {
        setForumData(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Diễn đàn Kinh tế Kỷ lục:', error);
      setToast({
        message: 'Không thể kết nối đến máy chủ để tải dữ liệu trang Diễn đàn.',
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveHeader = async (newHeaderData) => {
    if (!forumData) return;
    setIsSaving(true);
    try {
      const response = await ForumPageAPI.updateHeader(forumData.id, newHeaderData);
      const savedHeader = response?.data || response || newHeaderData;
      setForumData((prev) => ({
        ...prev,
        props: {
          ...(prev?.props || {}),
          header_section: savedHeader,
        },
      }));
      setToast({ message: 'Cập nhật Header diễn đàn thành công!', error: false });
      return true;
    } catch (error) {
      console.error('Lỗi khi lưu Header diễn đàn:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Header diễn đàn.', error: true });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const selectTab = (tab) => {
    setActiveTab(tab);
  };

  // 1. Save Hero
  const handleSaveHero = async (newHeroData) => {
    if (!forumData) return;
    setIsSaving(true);
    try {
      const response = await ForumPageAPI.updateHero(forumData.id, newHeroData);
      const savedHero = response?.data || response || newHeroData;
      setForumData((prev) => ({
        ...prev,
        props: {
          ...(prev?.props || {}),
          hero_section: savedHero,
        },
      }));
      setToast({ message: 'Cập nhật Hero Banner thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Hero Banner:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Hero Banner.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Save Pillars
  const handleSavePillars = async (newPillarsData) => {
    if (!forumData) return;
    setIsSaving(true);
    try {
      const response = await ForumPageAPI.updatePillars(forumData.id, newPillarsData);
      const savedPillars = response?.data || response || newPillarsData;
      setForumData((prev) => ({
        ...prev,
        props: {
          ...(prev?.props || {}),
          pillars_section: savedPillars,
        },
      }));
      setToast({ message: 'Cập nhật Bốn Trụ Cột thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Bốn Trụ Cột:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Bốn Trụ Cột.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Save Speakers
  const handleSaveSpeakers = async (newSpeakersData) => {
    if (!forumData) return;
    setIsSaving(true);
    try {
      const response = await ForumPageAPI.updateSpeakers(forumData.id, newSpeakersData);
      const savedSpeakers = response?.data || response || newSpeakersData;
      setForumData((prev) => ({
        ...prev,
        props: {
          ...(prev?.props || {}),
          speakers_section: savedSpeakers,
        },
      }));
      setToast({ message: 'Cập nhật Hội đồng Diễn giả thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Hội đồng Diễn giả:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Hội đồng Diễn giả.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Save Agenda
  const handleSaveAgenda = async (newAgendaData) => {
    if (!forumData) return;
    setIsSaving(true);
    try {
      const response = await ForumPageAPI.updateAgenda(forumData.id, newAgendaData);
      const savedAgenda = response?.data || response || newAgendaData;
      setForumData((prev) => ({
        ...prev,
        props: {
          ...(prev?.props || {}),
          agenda_section: savedAgenda,
        },
      }));
      setToast({ message: 'Cập nhật Lịch trình Nghị sự thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Lịch trình Nghị sự:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Lịch trình Nghị sự.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Save Awards (includes award_ids from DB)
  const handleSaveAwards = async (newAwardsData) => {
    if (!forumData) return;
    setIsSaving(true);
    try {
      const response = await ForumPageAPI.updateAwards(forumData.id, newAwardsData);
      const savedAwards = response?.data || response || newAwardsData;
      setForumData((prev) => ({
        ...prev,
        props: {
          ...(prev?.props || {}),
          awards_section: savedAwards,
        },
      }));
      setToast({ message: 'Cập nhật Giải thưởng Vinh danh thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Giải thưởng:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Giải thưởng.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  // 6. Save Partners
  const handleSavePartners = async (newPartnersData) => {
    if (!forumData) return;
    setIsSaving(true);
    try {
      const response = await ForumPageAPI.updatePartners(forumData.id, newPartnersData);
      const savedPartners = response?.data || response || newPartnersData;
      setForumData((prev) => ({
        ...prev,
        props: {
          ...(prev?.props || {}),
          partners_section: savedPartners,
        },
      }));
      setToast({ message: 'Cập nhật Đơn vị Đồng hành thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Đơn vị Đồng hành:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Đơn vị Đồng hành.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  // 7. Save Registration
  const handleSaveRegistration = async (newRegData) => {
    if (!forumData) return;
    setIsSaving(true);
    try {
      const response = await ForumPageAPI.updateRegistration(forumData.id, newRegData);
      const savedReg = response?.data || response || newRegData;
      setForumData((prev) => ({
        ...prev,
        props: {
          ...(prev?.props || {}),
          registration_section: savedReg,
        },
      }));

      // Đồng bộ cấu hình ô nhập liệu sang googleSheetService
      try {
        const { saveFormConfig } = await import('../../services/googleSheetService.js');
        if (Array.isArray(newRegData.form_fields)) {
          await saveFormConfig('forum_registration', {
            title: newRegData.title,
            subtitle: newRegData.description,
            fields: newRegData.form_fields.map((f) => ({
              key: f.id,
              label: f.label,
              type: f.type,
              placeholder: f.placeholder,
              required: f.required,
              colSpan: f.width === 'half' ? 1 : 2,
              options: f.options,
            })),
          });
        }
      } catch (err) {
        console.warn('Đồng bộ googleSheetService hoàn tất với cảnh báo:', err);
      }

      setToast({ message: 'Cập nhật Thông tin & Trường Đăng ký thành công!', error: false });
    } catch (error) {
      console.error('Lỗi khi lưu Thông tin Đăng ký:', error);
      setToast({ message: 'Có lỗi xảy ra khi lưu Thông tin Đăng ký.', error: true });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-(--admin-body)">
        <div className="inline-block animate-spin mb-3">
          <RefreshCw size={24} className="text-(--admin-accent)" />
        </div>
        <p className="text-xs">Đang nạp cấu hình Diễn đàn Kinh tế Kỷ lục...</p>
      </div>
    );
  }

  const props = forumData?.props || {};

  return (
    <div className="space-y-6">
      {toast && (
        <AdminToast
          message={toast.message}
          error={toast.error}
          onClose={() => setToast(null)}
        />
      )}

      {/* Tiêu đề trang Admin */}
      <AdminPageHeader
        title="Quản Lý Diễn Đàn Kinh Tế Kỷ Lục 2026"
        description="Quản lý toàn diện các nội dung diễn đàn thượng đỉnh: thông điệp hero, 4 trụ cột, diễn giả, lịch trình nghị sự, giải thưởng từ DB và danh sách đối tác."
        actions={
          <div className="flex items-center gap-2">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              icon={ExternalLink}
              onClick={() => window.open('/forum', '_blank')}
            >
              Xem Trang Công Khai
            </AdminButton>
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={loadData}
            >
              Làm Mới
            </AdminButton>
          </div>
        }
      />

      {/* Tabs chuyển đổi phân hệ */}
      <AdminTabs
        tabs={adminForumTabs}
        activeTab={activeTab.id}
        onChange={(tabId) => {
          const found = adminForumTabs.find((t) => t.id === tabId);
          if (found) selectTab(found);
        }}
      />

      {/* Nội dung theo Tab đang chọn */}
      <div className="pt-2">
        {activeTab.id === 'header' && (
          <ForumHeaderEditor
            initialData={props.header_section}
            onSave={handleSaveHeader}
            isSaving={isSaving}
          />
        )}

        {activeTab.id === 'hero' && (
          <ForumHeroEditor
            initialData={props.hero_section}
            onSave={handleSaveHero}
            isSaving={isSaving}
          />
        )}

        {activeTab.id === 'pillars' && (
          <ForumPillarsEditor
            initialData={props.pillars_section}
            onSave={handleSavePillars}
            isSaving={isSaving}
          />
        )}

        {activeTab.id === 'speakers' && (
          <ForumSpeakersEditor
            initialData={props.speakers_section}
            onSave={handleSaveSpeakers}
            isSaving={isSaving}
          />
        )}

        {activeTab.id === 'agenda' && (
          <ForumAgendaEditor
            initialData={props.agenda_section}
            onSave={handleSaveAgenda}
            isSaving={isSaving}
          />
        )}

        {activeTab.id === 'awards' && (
          <ForumAwardSelector
            initialData={props.awards_section}
            onSave={handleSaveAwards}
            isSaving={isSaving}
          />
        )}

        {activeTab.id === 'partners' && (
          <ForumPartnersEditor
            initialData={props.partners_section}
            onSave={handleSavePartners}
            isSaving={isSaving}
          />
        )}

        {activeTab.id === 'registration' && (
          <ForumRegistrationEditor
            initialData={props.registration_section}
            onSave={handleSaveRegistration}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
