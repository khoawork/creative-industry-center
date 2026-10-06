import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  RefreshCw,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  AlertTriangle,
  Building,
  Link as LinkIcon,
  Phone,
  Mail,
  MapPin,
  Eye,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { SiteSettingsAPI } from '../../api/siteSettingsApi.js';
import { useSiteSettings } from '../../context/SiteSettingsContext.jsx';
import defaultLogo from '../../assets/shared/logo/creative-industry-center-logo.png';

const TABS = [
  { id: 'brand', label: 'Nhận diện & Logo', icon: Building },
  { id: 'groups', label: 'Cột liên kết Footer', icon: Layers },
  { id: 'contact', label: 'Liên hệ & Bản quyền', icon: Phone },
  { id: 'preview', label: 'Xem trước Footer', icon: Eye },
];

export default function AdminLogoFooter() {
  const { updateSettingsState, refreshSettings: refreshGlobalSettings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState('brand');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    logo: '',
    company_name: '',
    company_tagline: '',
    footer: {
      short_name: '',
      institute: '',
      description: '',
      groups: [],
      contact: {
        title: 'THÔNG TIN LIÊN HỆ',
        address: '',
        phone: '',
        phone_href: '',
        emails: [],
      },
      copyright: '',
    },
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const fetchSettings = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await SiteSettingsAPI.getSiteSettings();
      const data = res?.data;
      if (data) {
        setFormData({
          logo: data.logo || '',
          company_name: data.company_name || '',
          company_tagline: data.company_tagline || '',
          footer: {
            short_name: data.footer?.short_name || 'TTCNST',
            institute: data.footer?.institute || 'VIỆN KỲ LỤC VIỆT NAM',
            description: data.footer?.description || '',
            groups: Array.isArray(data.footer?.groups) ? data.footer.groups : [],
            contact: {
              title: data.footer?.contact?.title || 'THÔNG TIN LIÊN HỆ',
              address: data.footer?.contact?.address || '',
              phone: data.footer?.contact?.phone || '',
              phone_href: data.footer?.contact?.phone_href || '',
              emails: Array.isArray(data.footer?.contact?.emails) ? data.footer.contact.emails : [],
            },
            copyright: data.footer?.copyright || '',
          },
        });
        if (isManual) {
          showToast('Đã tải lại dữ liệu mới nhất từ máy chủ!');
        }
      }
    } catch (err) {
      console.error('Lỗi tải cài đặt site:', err);
      showToast('Không thể kết nối đến máy chủ để lấy dữ liệu.', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Xử lý upload ảnh logo
  const handleUploadLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP).', 'error');
      return;
    }

    try {
      setUploadingLogo(true);
      const res = await SiteSettingsAPI.uploadLogo(file);
      const uploadedUrl = res?.data?.url;
      if (uploadedUrl) {
        setFormData((prev) => ({
          ...prev,
          logo: uploadedUrl,
        }));
        showToast('Tải lên ảnh logo thành công!');
      }
    } catch (err) {
      console.error('Lỗi upload logo:', err);
      showToast('Tải lên ảnh logo thất bại. Vui lòng thử lại.', 'error');
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Cập nhật trường nhóm liên kết
  const handleAddGroup = () => {
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        groups: [
          ...prev.footer.groups,
          {
            title: 'NHÓM LIÊN KẾT MỚI',
            links: [{ label: 'Liên kết 1', href: '/' }],
          },
        ],
      },
    }));
  };

  const handleRemoveGroup = (groupIndex) => {
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        groups: prev.footer.groups.filter((_, idx) => idx !== groupIndex),
      },
    }));
  };

  const handleGroupTitleChange = (groupIndex, newTitle) => {
    setFormData((prev) => {
      const newGroups = [...prev.footer.groups];
      newGroups[groupIndex] = {
        ...newGroups[groupIndex],
        title: newTitle,
      };
      return {
        ...prev,
        footer: { ...prev.footer, groups: newGroups },
      };
    });
  };

  const handleAddLink = (groupIndex) => {
    setFormData((prev) => {
      const newGroups = [...prev.footer.groups];
      newGroups[groupIndex] = {
        ...newGroups[groupIndex],
        links: [...(newGroups[groupIndex].links || []), { label: 'Tên mục mới', href: '/' }],
      };
      return {
        ...prev,
        footer: { ...prev.footer, groups: newGroups },
      };
    });
  };

  const handleRemoveLink = (groupIndex, linkIndex) => {
    setFormData((prev) => {
      const newGroups = [...prev.footer.groups];
      newGroups[groupIndex] = {
        ...newGroups[groupIndex],
        links: newGroups[groupIndex].links.filter((_, idx) => idx !== linkIndex),
      };
      return {
        ...prev,
        footer: { ...prev.footer, groups: newGroups },
      };
    });
  };

  const handleLinkChange = (groupIndex, linkIndex, field, value) => {
    setFormData((prev) => {
      const newGroups = [...prev.footer.groups];
      const newLinks = [...newGroups[groupIndex].links];
      newLinks[linkIndex] = {
        ...newLinks[linkIndex],
        [field]: value,
      };
      newGroups[groupIndex] = {
        ...newGroups[groupIndex],
        links: newLinks,
      };
      return {
        ...prev,
        footer: { ...prev.footer, groups: newGroups },
      };
    });
  };

  // Cập nhật emails
  const handleAddEmail = () => {
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        contact: {
          ...prev.footer.contact,
          emails: [...(prev.footer.contact.emails || []), ''],
        },
      },
    }));
  };

  const handleRemoveEmail = (index) => {
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        contact: {
          ...prev.footer.contact,
          emails: prev.footer.contact.emails.filter((_, idx) => idx !== index),
        },
      },
    }));
  };

  const handleEmailChange = (index, value) => {
    setFormData((prev) => {
      const newEmails = [...(prev.footer.contact.emails || [])];
      newEmails[index] = value;
      return {
        ...prev,
        footer: {
          ...prev.footer,
          contact: {
            ...prev.footer.contact,
            emails: newEmails,
          },
        },
      };
    });
  };

  // Submit lưu toàn bộ cài đặt
  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!formData.company_name.trim()) {
      showToast('Tên công ty / trung tâm không được để trống.', 'error');
      return;
    }

    if (!formData.footer.description.trim()) {
      showToast('Mô tả chân trang (footer description) không được để trống.', 'error');
      return;
    }

    if (!formData.footer.contact.address.trim()) {
      showToast('Địa chỉ trụ sở không được để trống.', 'error');
      return;
    }

    if (!formData.footer.contact.phone.trim()) {
      showToast('Số điện thoại không được để trống.', 'error');
      return;
    }

    const payload = {
      logo: formData.logo.trim(),
      company_name: formData.company_name.trim(),
      company_tagline: formData.company_tagline.trim(),
      footer: {
        short_name: formData.footer.short_name.trim() || 'TTCNST',
        institute: formData.footer.institute.trim() || 'VIỆN KỲ LỤC VIỆT NAM',
        description: formData.footer.description.trim(),
        groups: formData.footer.groups.map((g) => ({
          title: g.title.trim(),
          links: (g.links || [])
            .map((l) => ({
              label: (l.label || '').trim(),
              href: (l.href || '').trim(),
            }))
            .filter((l) => l.label && l.href),
        })),
        contact: {
          title: formData.footer.contact.title.trim() || 'THÔNG TIN LIÊN HỆ',
          address: formData.footer.contact.address.trim(),
          phone: formData.footer.contact.phone.trim(),
          phone_href: formData.footer.contact.phone_href.trim() || `tel:${formData.footer.contact.phone.replace(/\D/g, '')}`,
          emails: (formData.footer.contact.emails || []).map((e) => e.trim()).filter(Boolean),
        },
        copyright: formData.footer.copyright.trim(),
      },
    };

    setSaving(true);
    try {
      const res = await SiteSettingsAPI.updateSiteSettings(payload);
      if (res?.success) {
        showToast('Đã lưu cấu hình Logo & Footer thành công vào cơ sở dữ liệu!');
        updateSettingsState(res.data);
        refreshGlobalSettings();
      } else {
        showToast('Có lỗi xảy ra khi lưu cấu hình.', 'error');
      }
    } catch (err) {
      console.error('Lỗi khi lưu cài đặt:', err);
      const errMsg = err.response?.data?.message || 'Lỗi kết nối máy chủ.';
      showToast(`Không thể lưu: ${errMsg}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const previewLogoSrc = formData.logo && formData.logo.trim() && !formData.logo.endsWith('creative-industry-center-logo.png')
    ? formData.logo
    : defaultLogo;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <RefreshCw className="w-8 h-8 animate-spin text-[#680007] mb-3" />
        <p className="text-sm">Đang tải dữ liệu cấu hình Logo & Footer từ database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl transition-all duration-300 text-sm font-medium ${
            toast.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#680007]/10 text-[#680007]">
              <Building className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Logo & Footer</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Cấu hình nhận diện thương hiệu, tên công ty, biểu trưng logo và cấu trúc JSON Footer lưu trực tiếp vào database.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => fetchSettings(true)}
            disabled={refreshing || saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#680007] hover:bg-[#850009] text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-md cursor-pointer"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {TABS.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#680007] text-white shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: NHẬN DIỆN & LOGO */}
      {activeTab === 'brand' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#680007]" />
              Logo và Tên Tổ chức
            </h2>
            <p className="text-sm text-gray-500">
              Cấu hình hình ảnh logo hiển thị trên Header (Navbar) và Footer của toàn bộ website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Logo Preview & Upload */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 flex flex-col items-center text-center space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Biểu trưng Logo hiện tại
              </label>
              <div className="w-24 h-24 rounded-full bg-white p-2 border-2 border-amber-500/50 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={previewLogoSrc}
                  alt="Logo Preview"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="w-full space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadLogo}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {uploadingLogo ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingLogo ? 'Đang tải lên...' : 'Tải ảnh logo mới'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, logo: '' }))}
                  className="w-full text-xs text-gray-500 hover:text-gray-800 underline py-1"
                >
                  Khôi phục logo mặc định
                </button>
              </div>
            </div>

            {/* Thông tin nhận diện */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Đường dẫn ảnh Logo (URL hoặc Relative Path)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="/assets/shared/logo/creative-industry-center-logo.png hoặc https://..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
                  />
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Để trống sẽ tự động dùng ảnh logo nội bộ sẵn có.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Tên đầy đủ công ty / trung tâm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="Trung tâm Công nghiệp Sáng tạo"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
                  />
                  <span className="text-[11px] text-gray-400">Hiển thị ở Header & dòng bản quyền</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Khẩu hiệu / Tagline (Header)
                  </label>
                  <input
                    type="text"
                    value={formData.company_tagline}
                    onChange={(e) => setFormData({ ...formData, company_tagline: e.target.value })}
                    placeholder="VIỆN KỲ LỤC VIỆT NAM - VIETKINGS"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
                  />
                  <span className="text-[11px] text-gray-400">Dòng chữ vàng kim dưới tên logo trên Header</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Tên viết tắt (Footer Brand Title)
                  </label>
                  <input
                    type="text"
                    value={formData.footer.short_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        footer: { ...formData.footer, short_name: e.target.value },
                      })
                    }
                    placeholder="TTCNST"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
                  />
                  <span className="text-[11px] text-gray-400">Hiển thị chữ đậm góc trái Footer</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Tên Viện / Đơn vị chủ quản (Footer)
                  </label>
                  <input
                    type="text"
                    value={formData.footer.institute}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        footer: { ...formData.footer, institute: e.target.value },
                      })
                    }
                    placeholder="VIỆN KỲ LỤC VIỆT NAM"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
                  />
                  <span className="text-[11px] text-gray-400">Hiển thị chữ vàng kim góc trái Footer</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Đoạn mô tả sứ mệnh chân trang (Footer Description) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.footer.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, description: e.target.value },
                    })
                  }
                  placeholder="Cơ quan nghiên cứu, tôn vinh và thúc đẩy các giá trị sáng tạo quốc gia..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CỘT LIÊN KẾT FOOTER */}
      {activeTab === 'groups' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#680007]" />
                Các Cột Danh mục Liên kết Footer
              </h2>
              <p className="text-sm text-gray-500">
                Tùy biến các cột menu hiển thị tại phần giữa của Footer (Về Viện & Dự Án, Sự Kiện & Hoạt Động,...).
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddGroup}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm cột nhóm mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {formData.footer.groups.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 relative"
              >
                <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">
                      Tiêu đề cột #{groupIdx + 1}
                    </label>
                    <input
                      type="text"
                      value={group.title}
                      onChange={(e) => handleGroupTitleChange(groupIdx, e.target.value)}
                      className="w-full px-3 py-1.5 text-sm font-bold text-[#680007] bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#680007]"
                      placeholder="VD: VỀ VIỆN & DỰ ÁN"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveGroup(groupIdx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Xóa cột này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Danh sách link trong cột */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-600">Danh sách liên kết</span>
                    <button
                      type="button"
                      onClick={() => handleAddLink(groupIdx)}
                      className="text-xs font-semibold text-[#680007] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm mục</span>
                    </button>
                  </div>

                  {(group.links || []).map((link, linkIdx) => (
                    <div
                      key={linkIdx}
                      className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200"
                    >
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) =>
                          handleLinkChange(groupIdx, linkIdx, 'label', e.target.value)
                        }
                        placeholder="Tên nhãn (Label)"
                        className="flex-1 px-2.5 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#680007]"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) =>
                          handleLinkChange(groupIdx, linkIdx, 'href', e.target.value)
                        }
                        placeholder="Đường dẫn (/about, /events)"
                        className="flex-1 px-2.5 py-1 text-xs border border-gray-200 rounded font-mono text-gray-600 focus:outline-none focus:border-[#680007]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(groupIdx, linkIdx)}
                        className="p-1 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Xóa mục này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {(!group.links || group.links.length === 0) && (
                    <p className="text-xs text-gray-400 italic text-center py-2">
                      Chưa có liên kết nào. Nhấn "Thêm mục" để tạo mới.
                    </p>
                  )}
                </div>
              </div>
            ))}

            {formData.footer.groups.length === 0 && (
              <div className="lg:col-span-2 text-center py-10 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                <Layers className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Hiện chưa có cột menu nào.</p>
                <button
                  type="button"
                  onClick={handleAddGroup}
                  className="mt-3 px-4 py-2 bg-[#680007] text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Tạo cột menu đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: LIÊN HỆ & BẢN QUYỀN */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#680007]" />
              Thông Tin Liên Hệ & Bản Quyền
            </h2>
            <p className="text-sm text-gray-500">
              Quản lý khối thông tin liên lạc (cột thứ 4 của footer) và dòng bản quyền dưới cùng.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Tiêu đề khối liên hệ
                </label>
                <input
                  type="text"
                  value={formData.footer.contact.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: {
                        ...formData.footer,
                        contact: { ...formData.footer.contact, title: e.target.value },
                      },
                    })
                  }
                  placeholder="THÔNG TIN LIÊN HỆ"
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Đường dây nóng (Hotline) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.footer.contact.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        footer: {
                          ...formData.footer,
                          contact: {
                            ...formData.footer.contact,
                            phone: e.target.value,
                            phone_href: `tel:${e.target.value.replace(/\D/g, '')}`,
                          },
                        },
                      })
                    }
                    placeholder="(+84) 28 3847 7777"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Trụ sở chính <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.footer.contact.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: {
                        ...formData.footer,
                        contact: { ...formData.footer.contact, address: e.target.value },
                      },
                    })
                  }
                  placeholder="Trung tâm Công nghiệp Sáng tạo, Viện Kỷ lục Việt Nam, TP. Hồ Chí Minh & Hà Nội"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Quản lý danh sách email */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Danh sách Thư điện tử (Emails) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="text-xs font-semibold text-[#680007] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm email</span>
                </button>
              </div>

              <div className="space-y-2">
                {(formData.footer.contact.emails || []).map((email, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(idx, e.target.value)}
                        placeholder="contact@vietkings.org"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(idx)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Xóa email"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dòng bản quyền */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Dòng chữ Bản quyền chân trang (Copyright text) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.footer.copyright}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footer: { ...formData.footer, copyright: e.target.value },
                  })
                }
                placeholder="© 2026 Bản quyền thuộc Trung tâm Công nghiệp Sáng tạo - VIỆN KỲ LỤC VIỆT NAM. Bảo lưu mọi quyền."
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#680007]/20 focus:border-[#680007]"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: XEM TRƯỚC FOOTER TRỰC TIẾP */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Xem trước giao diện Footer thực tế
            </span>
            <span className="text-xs text-gray-400">
              Giao diện sẽ hiển thị đúng như thiết kế màu rượu vang ({formData.footer.short_name})
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
            <footer className="site-footer" style={{ margin: 0 }}>
              <div className="footer-container">
                <div className="footer-columns grid min-[681px]:grid-cols-2 min-[961px]:grid-cols-4">
                  <div className="footer-identity">
                    <div className="brand brand--footer flex items-center gap-3">
                      <img
                        className="brand-mark w-9 h-9 rounded-full object-contain"
                        src={previewLogoSrc}
                        alt="Logo"
                      />
                      <span>
                        <strong className="uppercase block text-white font-bold text-sm">
                          {formData.footer.short_name || 'TTCNST'}
                        </strong>
                        <small className="block text-[#d49520] text-xs font-semibold">
                          {formData.footer.institute || 'VIỆN KỲ LỤC VIỆT NAM'}
                        </small>
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-white/80 leading-relaxed">
                      {formData.footer.description}
                    </p>
                  </div>

                  {formData.footer.groups.map((group, idx) => (
                    <div className="footer-group" key={idx}>
                      <h2>{group.title}</h2>
                      <ul>
                        {(group.links || []).map((l, lIdx) => (
                          <li key={lIdx}>
                            <a href={l.href} onClick={(e) => e.preventDefault()}>
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <div className="footer-contact">
                    <h2>{formData.footer.contact.title || 'THÔNG TIN LIÊN HỆ'}</h2>
                    <p>
                      <strong>Trụ sở chính:</strong> {formData.footer.contact.address}
                    </p>
                    <p>
                      <strong>Đường dây nóng:</strong>{' '}
                      <a href={`tel:${formData.footer.contact.phone}`}>
                        {formData.footer.contact.phone}
                      </a>
                    </p>
                    <p>
                      <strong>Thư điện tử:</strong>{' '}
                      {(formData.footer.contact.emails || []).map((email, i) => (
                        <span key={email}>
                          {i > 0 && ' / '}
                          <a href={`mailto:${email}`}>{email}</a>
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <p className="footer-copyright">
                  {formData.footer.copyright ||
                    `© ${new Date().getFullYear()} Bản quyền thuộc ${formData.company_name} - ${formData.footer.institute}. Bảo lưu mọi quyền.`}
                </p>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

