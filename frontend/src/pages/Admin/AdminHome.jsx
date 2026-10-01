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
  const tabRefs = useRef([]);
  const activeTabId = searchParams.get('tab') || 'hero';
  const activeTab = adminHomeTabs.find((t) => t.id === activeTabId) || adminHomeTabs[0];

  const [homeData, setHomeData] = useState(null);
  const [navSections, setNavSections] = useState([]);
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

// Helper chuẩn hóa JSON để so sánh sâu (deep compare) dữ liệu
const canonicalStringify = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map(canonicalStringify).join(',')}]`;
  }
  const sortedKeys = Object.keys(obj).sort();
  const entries = sortedKeys.map((key) => `${JSON.stringify(key)}:${canonicalStringify(obj[key])}`);
  return `{${entries.join(',')}}`;
};

const isSectionChanged = (currentVal, newVal) => {
  if (newVal === undefined) return false;
  return canonicalStringify(currentVal) !== canonicalStringify(newVal);
};

  const handleUpdateProps = async (newPropsSection) => {
    if (!homeData) return;

    const targetProps = newPropsSection?.props || newPropsSection || {};
    const currentProps = homeData.props || {};

    const updateTasks = [];
    const updatedSectionNames = [];
    const mergedProps = { ...currentProps };

    // 1. Kiểm tra Hero Section
    if (
      targetProps.hero_section !== undefined &&
      isSectionChanged(currentProps.hero_section, targetProps.hero_section)
    ) {
      updateTasks.push(async () => {
        const res = await HomeAPI.updateHeroSection(homeData.id, targetProps.hero_section);
        const savedData = res?.data || targetProps.hero_section;
        mergedProps.hero_section = savedData;
        updatedSectionNames.push('Hero Section');
      });
    }

    // 2. Kiểm tra About Section
    if (
      targetProps.about_section !== undefined &&
      isSectionChanged(currentProps.about_section, targetProps.about_section)
    ) {
      updateTasks.push(async () => {
        const res = await HomeAPI.updateAboutSection(homeData.id, targetProps.about_section);
        const savedData = res?.data || targetProps.about_section;
        mergedProps.about_section = savedData;
        updatedSectionNames.push('Giới thiệu (About)');
      });
    }

    // 3. Kiểm tra Support Banner
    if (
      targetProps.support_banner !== undefined &&
      isSectionChanged(currentProps.support_banner, targetProps.support_banner)
    ) {
      updateTasks.push(async () => {
        const res = await HomeAPI.updateSupportBanner(homeData.id, targetProps.support_banner);
        const savedData = res?.data || targetProps.support_banner;
        mergedProps.support_banner = savedData;
        updatedSectionNames.push('Banner hỗ trợ');
      });
    }

    // Nếu không có phần nào thay đổi so với dữ liệu hiện tại
    if (updateTasks.length === 0) {
      alert('Không phát hiện thay đổi nào so với dữ liệu hiện tại.');
      return;
    }

    setIsSaving(true);
    try {
      // Thực hiện đồng thời các API cập nhật của các phần đã thay đổi
      await Promise.all(updateTasks.map((task) => task()));

      // Cập nhật lại state cục bộ của trang
      setHomeData((prev) => ({
        ...prev,
        props: {
          ...(prev?.props || {}),
          ...mergedProps,
        },
      }));

      alert(`Lưu thay đổi thành công: ${updatedSectionNames.join(', ')}!`);
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu lên hệ thống.');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHero = (newHeroData) => {
    return handleUpdateProps({ hero_section: newHeroData });
  };

  const handleSaveAbout = (newAboutData) => {
    return handleUpdateProps({ about_section: newAboutData });
  };

  const handleSaveNavSection = async (savedSection) => {
    if (!homeData) return;
    setIsSaving(true);

    try {
      const existingSection = navSections.find(
        (section) => String(section.id) === String(savedSection.id)
      );

      if (!existingSection) {
        await HomeAPI.createNav(homeData.id, savedSection);
      } else {
        const metadataChanged =
          existingSection.tag !== savedSection.tag ||
          existingSection.title_main !== savedSection.title_main ||
          JSON.stringify(existingSection.action_button) !==
            JSON.stringify(savedSection.action_button);
        const childrenChanged =
          JSON.stringify(existingSection.children_id || []) !==
          JSON.stringify(savedSection.children_id || []);

        if (metadataChanged) {
          await HomeAPI.updateNav(homeData.id, existingSection.id, {
            ...savedSection,
            children_id: existingSection.children_id || [],
          });
        }
        if (childrenChanged) {
          await HomeAPI.addNavChildren(homeData.id, existingSection.id, {
            children_id: savedSection.children_id || [],
          });
        }
      }

      const updatedNavSections = await fetchNavSections(homeData.id);
      setNavSections(updatedNavSections);
      setHomeData((current) => ({
        ...current,
        props: { ...current.props, nav_sections: updatedNavSections },
      }));
      alert('Lưu thay đổi thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu nav section:', error);
      alert('Có lỗi xảy ra khi lưu chuyên mục lên hệ thống.');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNavSection = async (sectionId) => {
    if (!homeData) return;
    setIsSaving(true);

    try {
      await HomeAPI.deleteNav(homeData.id, sectionId);
      const updatedNavSections = await fetchNavSections(homeData.id);
      setNavSections(updatedNavSections);
      setHomeData((current) => ({
        ...current,
        props: { ...current.props, nav_sections: updatedNavSections },
      }));
    } catch (error) {
      console.error('Lỗi khi xóa nav section:', error);
      alert('Có lỗi xảy ra khi xóa chuyên mục khỏi hệ thống.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSupportBanner = (newSupportData) => {
    return handleUpdateProps({ support_banner: newSupportData });
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
              navSections={navSections}
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