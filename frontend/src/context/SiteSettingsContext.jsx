import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteSettingsAPI } from '../api/siteSettingsApi.js';
import { site, footerGroups } from '../config/shared/site.js';

const defaultSiteSettings = {
  logo: '/assets/shared/logo/creative-industry-center-logo.png',
  company_name: site.name,
  company_tagline: site.tagline,
  footer: {
    short_name: site.shortName,
    institute: site.institute,
    description: site.description,
    groups: footerGroups,
    contact: {
      title: 'THÔNG TIN LIÊN HỆ',
      address: site.contact.address,
      phone: site.contact.phone,
      phone_href: site.contact.phoneHref,
      emails: site.contact.emails || [],
    },
    copyright: `© ${new Date().getFullYear()} Bản quyền thuộc ${site.name} - ${site.institute}. Bảo lưu mọi quyền.`,
  },
};

const SiteSettingsContext = createContext({
  settings: defaultSiteSettings,
  loading: false,
  error: null,
  refreshSettings: async () => {},
  updateSettingsState: () => {},
});

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await SiteSettingsAPI.getSiteSettings();
      const data = res?.data;
      if (data) {
        setSettings({
          ...defaultSiteSettings,
          ...data,
          footer: {
            ...defaultSiteSettings.footer,
            ...(data.footer || {}),
            contact: {
              ...defaultSiteSettings.footer.contact,
              ...(data.footer?.contact || {}),
            },
            groups: Array.isArray(data.footer?.groups) ? data.footer.groups : defaultSiteSettings.footer.groups,
          },
        });
      }
      setError(null);
    } catch (err) {
      console.debug('Dùng cấu hình website mặc định:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettingsState = useCallback((newSettings) => {
    setSettings(newSettings);
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
        updateSettingsState,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

