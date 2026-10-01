import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ExternalLink, RefreshCw, Layout, Info, Layers, BellRing } from 'lucide-react';
import {
  HeroSectionEditor,
  AboutSectionEditor,
  NavSectionsEditor,
  SupportBannerEditor,
} from '../../components/Admin/Home';

import { site } from '../../config/shared/site.js';
import { HomeAPI } from '../../api/homeApi.js';

// Định nghĩa danh sách các Tab quản trị
const adminHomeTabs = [
  { id: 'hero', label: 'Hero Section', icon: Layout },
  { id: 'about', label: 'Giới thiệu (About)', icon: Info },
  { id: 'nav', label: 'Chuyên mục (Nav)', icon: Layers },
  { id: 'support', label: 'Banner hỗ trợ', icon: BellRing },
];

export default function AdminHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabRefs = useRef([]);
  const activeTabId = searchParams.get('tab') || 'hero';
  const activeTab = adminHomeTabs.find((t) => t.id === activeTabId) || adminHomeTabs[0];

  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

    HomeAPI.getHomePage(9)
      .then((result) => {
        console.log('Fetched home data from API:', result);
        if (isMounted && result) {
          const dataPayload = result.data || result;
          setHomeData(dataPayload);
          setIsLiveApi(result.isLive ?? true);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu từ API:', err);
        alert('Không thể kết nối lấy dữ liệu trang chủ từ API.');
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

  // Hàm xử lý cập nhật props và gửi lên API
  const handleUpdateProps = async (newPropsSection) => {
    if (!homeData) return;
    setIsSaving(true);

    try {
      const updatedProps = {
        ...(homeData.props || {}),
        ...newPropsSection,
      };
      
      const payload = {
        ...homeData,
        props: updatedProps,
      };

      // Gọi API cập nhật (Giả định HomeAPI có phương thức update hoặc save)
      if (typeof HomeAPI.updateHomePage === 'function') {
        await HomeAPI.updateHomePage(homeData.id, payload);
      } else if (typeof HomeAPI.saveHomePage === 'function') {
        await HomeAPI.saveHomePage(payload);
      } else {
        console.warn('Chưa cấu hình hàm update trong HomeAPI');
      }

      setHomeData(payload);
      alert('Lưu thay đổi thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu lên hệ thống.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHero = (newHeroData) => {
    handleUpdateProps({ hero_section: newHeroData });
  };

  const handleSaveAbout = (newAboutData) => {
    handleUpdateProps({ about_section: newAboutData });
  };

  const handleSaveNavSection = (savedSection) => {
    const navSections = homeData?.props?.nav_sections || [];
    const index = navSections.findIndex((sec) => sec.id === savedSection.id);
    let updatedNavSections;
    
    if (index >= 0) {
      updatedNavSections = navSections.map((sec) => (sec.id === savedSection.id ? savedSection : sec));
    } else {
      updatedNavSections = [...navSections, { ...savedSection, id: Date.now() }];
    }
    
    handleUpdateProps({ nav_sections: updatedNavSections });
  };

  const handleDeleteNavSection = (sectionId) => {
    const navSections = homeData?.props?.nav_sections || [];
    const updatedNavSections = navSections.filter((sec) => sec.id !== sectionId);
    handleUpdateProps({ nav_sections: updatedNavSections });
  };

  const handleSaveSupportBanner = (newSupportData) => {
    handleUpdateProps({ support_banner: newSupportData });
  };

  // Hiển thị trạng thái đang tải dữ liệu từ API
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
    <>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--admin-border) pb-7">
        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-(--admin-heading) uppercase">
            Khu vực quản trị nội dung
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-(--admin-title) sm:text-3xl">
            Quản lý Trang chủ
          </h1>
          <p className="mt-3 text-sm leading-6">
            Chỉnh sửa nội dung Hero, Giới thiệu (About), Chuyên mục (Nav) và Banner hỗ trợ theo chuẩn Marshmallow DTO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isLiveApi ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Kết nối trực tiếp
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-(--admin-accent) px-3 py-1.5 text-[11px] text-(--admin-heading)">
              <Sparkles size={13} aria-hidden="true" />
              Trực tuyến từ API
            </span>
          )}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-(--admin-border) bg-(--admin-surface) px-3 py-1.5 text-[11px] font-semibold text-(--admin-heading) hover:bg-(--admin-background) transition"
          >
            <ExternalLink size={13} />
            Xem trang chủ
          </a>
        </div>
      </div>

      {/* Tabs List */}
      <div
        role="tablist"
        aria-label="Quản lý trang chủ"
        className="my-6 flex max-w-full gap-1 overflow-x-auto border-b border-(--admin-border) bg-(--admin-surface) p-1 [scrollbar-width:none]"
      >
        {adminHomeTabs.map((tab, index) => {
          const IconComponent = tab.icon;
          const isSelected = activeTab.id === tab.id;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`home-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`home-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => selectTab(tab)}
              onKeyDown={(event) => {
                let nextIndex;
                if (event.key === 'ArrowRight') nextIndex = (index + 1) % adminHomeTabs.length;
                else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + adminHomeTabs.length) % adminHomeTabs.length;
                else if (event.key === 'Home') nextIndex = 0;
                else if (event.key === 'End') nextIndex = adminHomeTabs.length - 1;
                else return;
                event.preventDefault();
                selectTab(adminHomeTabs[nextIndex]);
                tabRefs.current[nextIndex]?.focus();
              }}
              className={`min-h-11 shrink-0 cursor-pointer border-b-2 px-4 text-sm font-semibold whitespace-nowrap flex items-center gap-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--admin-heading) transition-colors ${
                isSelected
                  ? 'border-(--admin-accent) text-(--admin-title)'
                  : 'border-transparent text-(--admin-heading) hover:bg-(--admin-background)'
              }`}
            >
              <IconComponent size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-4">
        {/* Tab 1: Hero */}
        <div
          id="home-panel-hero"
          role="tabpanel"
          aria-labelledby="home-tab-hero"
          hidden={activeTab.id !== 'hero'}
        >
          {activeTab.id === 'hero' && (
            <HeroSectionEditor
              initialData={homeData?.props?.hero_section}
              onSave={handleSaveHero}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Tab 2: About */}
        <div
          id="home-panel-about"
          role="tabpanel"
          aria-labelledby="home-tab-about"
          hidden={activeTab.id !== 'about'}
        >
          {activeTab.id === 'about' && (
            <AboutSectionEditor
              initialData={homeData?.props?.about_section}
              onSave={handleSaveAbout}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Tab 3: Nav Sections */}
        <div
          id="home-panel-nav"
          role="tabpanel"
          aria-labelledby="home-tab-nav"
          hidden={activeTab.id !== 'nav'}
        >
          {activeTab.id === 'nav' && (
            <NavSectionsEditor
              navSections={homeData?.props?.nav_sections || []}
              onSaveSection={handleSaveNavSection}
              onDeleteSection={handleDeleteNavSection}
              isSaving={isSaving}
            />
          )}
        </div>

        {/* Tab 4: Support Banner */}
        <div
          id="home-panel-support"
          role="tabpanel"
          aria-labelledby="home-tab-support"
          hidden={activeTab.id !== 'support'}
        >
          {activeTab.id === 'support' && (
            <SupportBannerEditor
              initialData={homeData?.props?.support_banner}
              onSave={handleSaveSupportBanner}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>

      {/* Bottom Footer Note */}
      <p className="mt-12 border-t border-(--admin-border) pt-5 text-[11px] leading-5 text-gray-500">
        Khu vực quản trị trang chủ · Viện Kỷ lục Việt Nam (VIETKINGS) · {site.name}
      </p>
    </>
  );
}