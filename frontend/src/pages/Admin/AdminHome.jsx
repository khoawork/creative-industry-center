import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ExternalLink, RefreshCw, Layout, Info, Layers, BellRing } from 'lucide-react';
import {
  HeroSectionEditor,
  AboutSectionEditor,
  NavSectionsEditor,
  SupportBannerEditor,
} from '../../components/Admin/Home';
import { AdminPageHeader, AdminTabs, AdminToast, AdminBadge, AdminButton } from '../../components/Admin/Common';
import { site } from '../../config/shared/site.js';
import { HomeAPI } from '../../api/homeApi.js';
import { fetchNavSections } from '../../services/contentTablesService.js';

// Định nghĩa danh sách các Tab quản trị
const adminHomeTabs = [
  { id: 'hero', label: 'Hero Section', icon: Layout },
  { id: 'about', label: 'Giới thiệu (About)', icon: Info },
  { id: 'nav', label: 'Chuyên mục (Nav)', icon: Layers },
  { id: 'support', label: 'Banner hỗ trợ', icon: BellRing },
];

export default function AdminHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'hero';
  const activeTab = adminHomeTabs.find((t) => t.id === activeTabId) || adminHomeTabs[0];

  const [homeData, setHomeData] = useState(null);
  const [navSections, setNavSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const selectTab = (tab) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (tab.id === 'hero') next.delete('tab');
      else next.set('tab', tab.id);
      return next;
    });
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    HomeAPI.getHomePage(1)
      .then(async (result) => {
        if (isMounted && result) {
          const dataPayload = result.data || result;
          setHomeData(dataPayload);
          setIsLiveApi(result.isLive ?? true);
          try {
            const sections = await fetchNavSections(dataPayload.id);
            if (isMounted) setNavSections(sections);
          } catch (error) {
            console.error('Lỗi khi tải nav sections từ database:', error);
            if (isMounted) setNavSections(dataPayload.props?.nav_sections || []);
          }
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu từ API:', err);
        showToast('Không thể kết nối lấy dữ liệu trang chủ từ API.', 'error');
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateProps = async (newPropsSection, aboutImageFile = null) => {
    if (!homeData) return;
    setIsSaving(true);

    try {
      const updatedProps = {
        ...(homeData.props || {}),
        ...newPropsSection,
      };

      let response;
      if (newPropsSection.hero_section) {
        response = await HomeAPI.updateHeroSection(homeData.id, newPropsSection.hero_section);
      } else if (newPropsSection.about_section) {
        response = await HomeAPI.updateAboutSection(
          homeData.id,
          newPropsSection.about_section,
          aboutImageFile
        );
        if (response?.data) updatedProps.about_section = response.data;
      } else if (newPropsSection.support_banner) {
        response = await HomeAPI.updateSupportBanner(newPropsSection.support_banner, homeData.id);
      } else {
        throw new Error('Không xác định được section Home cần cập nhật.');
      }

      setHomeData({ ...homeData, props: updatedProps });
      showToast('Lưu thay đổi thành công!');
      return newPropsSection.about_section ? updatedProps.about_section : true;
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      showToast('Có lỗi xảy ra khi lưu dữ liệu lên hệ thống.', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHero = (newHeroData) => {
    handleUpdateProps({ hero_section: newHeroData });
  };

  const handleSaveAbout = (newAboutData, imageFile) => {
    return handleUpdateProps({ about_section: newAboutData }, imageFile);
  };

  const handleSaveNavSection = async (savedSection) => {
    if (!homeData) return;
    setIsSaving(true);

    try {
      const existingSection = navSections.find(
        (section) => String(section.id) === String(savedSection.id)
      );

      let updatedSections = [];
      if (existingSection) {
        updatedSections = navSections.map((section) =>
          String(section.id) === String(savedSection.id) ? savedSection : section
        );
      } else {
        updatedSections = [...navSections, savedSection];
      }

      setNavSections(updatedSections);
      showToast('Lưu chuyên mục thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu nav section:', error);
      showToast('Có lỗi xảy ra khi lưu chuyên mục.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNavSection = async (sectionId) => {
    if (!homeData) return;
    setIsSaving(true);

    try {
      const updatedSections = navSections.filter(
        (section) => String(section.id) !== String(sectionId)
      );
      setNavSections(updatedSections);
      showToast('Xóa chuyên mục thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa nav section:', error);
      showToast('Có lỗi xảy ra khi xóa chuyên mục.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSupportBanner = (newSupportData) => {
    handleUpdateProps({ support_banner: newSupportData });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-(--admin-heading)" />
          <p className="text-sm font-semibold text-gray-500">Đang tải dữ liệu từ API trang chủ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* Header chuẩn hóa */}
      <AdminPageHeader
        badge="Khu vực quản trị nội dung"
        title="Quản lý Trang chủ"
        description="Chỉnh sửa nội dung Hero, Giới thiệu (About), Chuyên mục (Nav) và Banner hỗ trợ."
        actions={
          <div className="flex items-center gap-2">
            {isLiveApi ? (
              <AdminBadge variant="success">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse mr-1 inline-block" />
                API Kết nối trực tiếp
              </AdminBadge>
            ) : (
              <AdminBadge variant="accent" icon={Sparkles}>
                Trực tuyến từ API
              </AdminBadge>
            )}

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-(--admin-border) bg-(--admin-surface) px-3 py-2 text-xs font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition"
            >
              <ExternalLink size={13} />
              <span>Xem trang chủ</span>
            </a>
          </div>
        }
      />

      {/* Tabs chuẩn hóa */}
      <AdminTabs
        tabs={adminHomeTabs}
        activeTab={activeTab.id}
        onChange={(tabId) => selectTab(adminHomeTabs.find((t) => t.id === tabId))}
      />

      {/* Tab Panels */}
      <div>
        {activeTab.id === 'hero' && (
          <HeroSectionEditor
            initialData={homeData?.props?.hero_section}
            onSave={handleSaveHero}
            isSaving={isSaving}
          />
        )}

        {activeTab.id === 'about' && (
          <AboutSectionEditor
            initialData={homeData?.props?.about_section}
            onSave={handleSaveAbout}
            isSaving={isSaving}
          />
        )}

        {activeTab.id === 'nav' && (
          <NavSectionsEditor
            initialData={navSections}
            pageId={homeData?.id}
            onSave={handleSaveNavSection}
            onDelete={handleDeleteNavSection}
            isSaving={isSaving}
          />
        )}

        {activeTab.id === 'support' && (
          <SupportBannerEditor
            initialData={homeData?.props?.support_banner}
            onSave={handleSaveSupportBanner}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}