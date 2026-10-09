import { useEffect, useState } from 'react';
import {
  Layout,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UsersRound,
  Award,
} from 'lucide-react';
import { FounderAPI } from '../../../api/founderApi.js';
import {
  AdminPageHeader,
  AdminTabs,
  AdminCard,
  AdminButton,
  AdminToast,
  AdminLoadingModal,
  AdminConfirmModal,
  AdminStickySaveBar,
} from '../Common/index.js';

const tabs = [
  { id: 'hero', label: 'Hero Banner', icon: Layout },
  { id: 'sections', label: 'Danh sách Founder', icon: UsersRound },
  { id: 'cta', label: 'CTA & Chứng nhận', icon: Award },
];

const emptyHero = {
  title: '',
  description: '',
  name: '',
  number_of_founders: 0,
  subtitle: '',
  subdescription: '',
};

const emptySection = {
  major: '',
  name: '',
  description: '',
  founder_info: [{ label: '', value: '' }],
  is_verified: false,
  image: '',
  founder_profile: {
    filter: 'bio',
    title: '',
    description: '',
    slogan: '',
    sub_slogan: '',
  },
};

const emptyCta = {
  subtitle: '',
  title: '',
  description: '',
  btn_cta: '',
  sub_btn_cta: '',
  certificate: [],
};

function unwrap(result) {
  return result?.data ?? result;
}

function getErrorMessage(error) {
  const message = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
  if (typeof message === 'string') return message;
  if (message && typeof message === 'object') {
    return Object.entries(message)
      .map(([field, details]) => `${field}: ${Array.isArray(details) ? details.join(', ') : details}`)
      .join(' | ');
  }
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
}

function toHeroPayload(data) {
  const { title, description, name, number_of_founders, subtitle, subdescription } = data;
  return { title, description, name, number_of_founders, subtitle, subdescription };
}

function toSectionPayload(data) {
  return {
    major: data.major,
    name: data.name,
    description: data.description,
    founder_info: (data.founder_info || []).map(({ label, value }) => ({ label, value })),
    is_verified: data.is_verified,
    image: data.image,
    founder_profile: {
      filter: data.founder_profile?.filter,
      title: data.founder_profile?.title,
      description: data.founder_profile?.description,
      slogan: data.founder_profile?.slogan,
      sub_slogan: data.founder_profile?.sub_slogan,
    },
  };
}

function toCtaPayload(data, currentCertificates = []) {
  const certs = currentCertificates && currentCertificates.length > 0
    ? currentCertificates
    : (data.certificate || []);
  return {
    subtitle: data.subtitle,
    title: data.title,
    description: data.description,
    btn_cta: data.btn_cta,
    sub_btn_cta: data.sub_btn_cta,
    certificate: certs.map((item) => ({
      ...(item.id ? { id: item.id } : {}),
      name: item.name,
    })),
  };
}

function cloneSection(section) {
  return {
    ...emptySection,
    ...section,
    founder_info: section?.founder_info?.length ? section.founder_info.map((item) => ({ ...item })) : [{ label: '', value: '' }],
    founder_profile: { ...emptySection.founder_profile, ...(section?.founder_profile || {}) },
  };
}

function emptyProfile(filter) {
  return {
    filter,
    title: '',
    description: '',
    slogan: '',
    sub_slogan: '',
  };
}

const inputClass =
  'w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3.5 py-2.5 text-sm text-(--admin-title) placeholder:text-(--admin-body)/40 outline-none transition focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/10';
const labelClass =
  'block text-xs font-bold uppercase tracking-wider text-(--admin-heading) mb-1.5';

function Field({ label, name, value, onChange, type = 'text', required = true, placeholder = '' }) {
  const inputId = `founder-${name.replaceAll('.', '-')}`;
  const commonProps = {
    id: inputId,
    name,
    value: value ?? '',
    onChange: (event) => onChange(event.target.value),
    required,
    placeholder,
    className: inputClass,
  };

  return (
    <label htmlFor={inputId} className="block">
      <span className={labelClass}>{label}</span>
      {type === 'textarea' ? <textarea {...commonProps} rows={3} /> : <input {...commonProps} type={type} />}
    </label>
  );
}

function HeroEditor({ hero, saving, onSave }) {
  const [form, setForm] = useState({ ...emptyHero, ...(hero || {}) });

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  return (
    <form id="founder-hero-form" onSubmit={(event) => { event.preventDefault(); onSave({ ...form, number_of_founders: Number(form.number_of_founders) }); }} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Tiêu đề chính" name="title" value={form.title} onChange={(value) => update('title', value)} />
        <Field label="Tên nhóm Founder" name="name" value={form.name} onChange={(value) => update('name', value)} />
        <Field label="Tiêu đề phụ (Subtitle)" name="subtitle" value={form.subtitle} onChange={(value) => update('subtitle', value)} />
        <Field label="Số lượng Founder" name="number_of_founders" type="number" value={form.number_of_founders} onChange={(value) => update('number_of_founders', value)} />
      </div>
      <Field label="Mô tả mở đầu" name="description" type="textarea" value={form.description} onChange={(value) => update('description', value)} />
      <Field label="Mô tả bổ trợ" name="subdescription" type="textarea" value={form.subdescription} onChange={(value) => update('subdescription', value)} />
      
      <AdminStickySaveBar
        form="founder-hero-form"
        type="submit"
        isSaving={saving}
        buttonText={hero ? 'Lưu Hero Banner' : 'Tạo Hero Banner'}
        hintMessage="Nhấn lưu để đồng bộ thông tin Hero Banner ra trang Chuyện nhà sáng nghiệp."
      />
    </form>
  );
}

function SectionEditor({ section, saving, onSave, onCancel }) {
  const initialForm = cloneSection(section || emptySection);
  const [form, setForm] = useState(initialForm);
  const [profilesByFilter, setProfilesByFilter] = useState({
    [initialForm.founder_profile.filter]: initialForm.founder_profile,
  });

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));
  const updateProfile = (name, value) => setForm((current) => ({ ...current, founder_profile: { ...current.founder_profile, [name]: value } }));
  const updateProfileFilter = (value) => {
    setProfilesByFilter((currentProfiles) => ({
      ...currentProfiles,
      [form.founder_profile.filter]: { ...form.founder_profile },
    }));
    setForm((current) => ({
      ...current,
      founder_profile: profilesByFilter[value]
        ? { ...profilesByFilter[value], filter: value }
        : emptyProfile(value),
    }));
  };
  const updateInfo = (index, name, value) => setForm((current) => ({
    ...current,
    founder_info: current.founder_info.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [name]: value } : item
    )),
  }));

  const addInfo = () => setForm((current) => ({
    ...current,
    founder_info: [...current.founder_info, { label: '', value: '' }],
  }));

  const removeInfo = (index) => setForm((current) => ({
    ...current,
    founder_info: current.founder_info.length > 1
      ? current.founder_info.filter((_, itemIndex) => itemIndex !== index)
      : current.founder_info,
  }));

  return (
    <form id="founder-section-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Tên Founder" name="name" value={form.name} onChange={(value) => update('name', value)} />
        <Field label="Chức danh / Major" name="major" value={form.major} onChange={(value) => update('major', value)} />
        <Field label="URL hình ảnh chân dung" name="image" value={form.image} onChange={(value) => update('image', value)} placeholder="https://..." />
        <label htmlFor="founder-is-verified" className="flex min-h-[46px] items-center gap-3 self-end rounded-lg border border-(--admin-border) bg-(--admin-background) px-3.5 text-sm font-medium text-(--admin-title) cursor-pointer">
          <input id="founder-is-verified" type="checkbox" checked={form.is_verified} onChange={(event) => update('is_verified', event.target.checked)} className="size-4 accent-(--admin-accent)" />
          Đã xác minh (Verified)
        </label>
      </div>
      <Field label="Mô tả Founder" name="description" type="textarea" value={form.description} onChange={(value) => update('description', value)} />

      <fieldset className="space-y-3 rounded-xl border border-(--admin-border) bg-(--admin-background) p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-(--admin-heading)">Thông tin chi tiết Founder</legend>
        {form.founder_info.map((item, index) => (
          <div key={item.id || index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] items-end">
            <Field label={`Nhãn ${index + 1}`} name={`founder-info-label-${index}`} value={item.label} onChange={(value) => updateInfo(index, 'label', value)} />
            <Field label={`Giá trị ${index + 1}`} name={`founder-info-value-${index}`} value={item.value} onChange={(value) => updateInfo(index, 'value', value)} />
            <button
              type="button"
              onClick={() => removeInfo(index)}
              disabled={form.founder_info.length === 1}
              aria-label={`Xóa thông tin ${index + 1}`}
              className="flex min-h-[44px] items-center justify-center rounded-lg px-3 text-rose-500 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-40 transition cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <AdminButton
          type="button"
          variant="outline"
          size="sm"
          icon={Plus}
          onClick={addInfo}
        >
          Thêm thông tin
        </AdminButton>
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-(--admin-border) bg-(--admin-background) p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-wider text-(--admin-heading)">Hồ sơ Founder (Profile)</legend>
        <div className="grid gap-5 md:grid-cols-2">
          <label htmlFor="founder-profile-filter" className="block">
            <span className={labelClass}>Bộ lọc (Filter)</span>
            <select
              id="founder-profile-filter"
              value={form.founder_profile.filter}
              onChange={(event) => updateProfileFilter(event.target.value)}
              className={inputClass}
            >
              <option value="bio">Tiểu sử (Bio)</option>
              <option value="projects">Dự án (Projects)</option>
              <option value="achievements">Thành tựu (Achievements)</option>
            </select>
          </label>
          <Field label="Tiêu đề Profile" name="profile-title" value={form.founder_profile.title} onChange={(value) => updateProfile('title', value)} />
          <Field label="Khẩu hiệu (Slogan)" name="slogan" value={form.founder_profile.slogan} onChange={(value) => updateProfile('slogan', value)} />
          <Field label="Khẩu hiệu phụ (Sub slogan)" name="sub-slogan" value={form.founder_profile.sub_slogan} onChange={(value) => updateProfile('sub_slogan', value)} />
        </div>
        <Field label="Mô tả Profile" name="profile-description" type="textarea" value={form.founder_profile.description} onChange={(value) => updateProfile('description', value)} />
      </fieldset>

      <AdminStickySaveBar
        form="founder-section-form"
        type="submit"
        isSaving={saving}
        buttonText={section ? 'Lưu Founder' : 'Tạo Founder mới'}
        hintMessage="Nhấn lưu để đồng bộ thông tin Founder ra ngoài website."
        extraActions={
          section ? (
            <AdminButton
              type="button"
              variant="outline"
              size="md"
              onClick={onCancel}
            >
              Hủy chỉnh sửa
            </AdminButton>
          ) : null
        }
      />
    </form>
  );
}

function CtaEditor({ cta, saving, onSave }) {
  const [form, setForm] = useState({ ...emptyCta, ...(cta || {}) });

  useEffect(() => {
    if (cta) {
      setForm((prev) => ({ ...emptyCta, ...prev, ...cta }));
    }
  }, [cta]);

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  return (
    <form id="founder-cta-form" onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Tiêu đề phụ (Subtitle)" name="cta-subtitle" value={form.subtitle} onChange={(value) => update('subtitle', value)} />
        <Field label="Tiêu đề chính (Title)" name="cta-title" value={form.title} onChange={(value) => update('title', value)} />
        <Field label="Nút hành động chính (Button CTA)" name="btn-cta" value={form.btn_cta} onChange={(value) => update('btn_cta', value)} />
        <Field label="Nút hành động phụ (Sub Button CTA)" name="sub-btn-cta" value={form.sub_btn_cta} onChange={(value) => update('sub_btn_cta', value)} />
      </div>
      <Field label="Mô tả CTA" name="cta-description" type="textarea" value={form.description} onChange={(value) => update('description', value)} />
      
      <AdminStickySaveBar
        form="founder-cta-form"
        type="submit"
        isSaving={saving}
        buttonText={cta ? 'Lưu CTA' : 'Tạo CTA mới'}
        hintMessage="Nhấn lưu để đồng bộ thông tin CTA ra ngoài website."
      />
    </form>
  );
}

export default function FounderAdminPanel() {
  const [activeTab, setActiveTab] = useState('hero');
  const [page, setPage] = useState(null);
  const [cta, setCta] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingMessage, setSavingMessage] = useState('Đang lưu dữ liệu...');
  const [status, setStatus] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [editingCertificateId, setEditingCertificateId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Xóa vĩnh viễn',
    type: 'danger',
    onConfirm: null,
  });

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const sections = page?.props?.section || [];
  const selectedSection = sections.find((section) => section.id === selectedSectionId) || null;

  async function loadFounderData() {
    setLoading(true);
    setLoadError('');
    try {
      const [pageResult, ctaResult, certificateResult] = await Promise.all([
        FounderAPI.getFounderPage(),
        FounderAPI.getFounderCta(),
        FounderAPI.getFounderCertificates(),
      ]);
      const pageData = unwrap(pageResult);
      const ctaData = unwrap(ctaResult);
      const certificateData = unwrap(certificateResult);
      setPage(pageData);
      const pageCta = pageData?.props?.cta_section || {};
      const mergedCta = {
        ...pageCta,
        ...(ctaData && Object.keys(ctaData).length ? ctaData : {}),
      };
      const mergedCertificates = Array.isArray(certificateData) && certificateData.length
        ? certificateData
        : Array.isArray(mergedCta.certificate)
          ? mergedCta.certificate
          : [];
      setCta({ ...mergedCta, certificate: mergedCertificates });
      setCertificates(mergedCertificates);
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFounderData();
  }, []);

  function showSuccess(message) {
    setStatus({ type: 'success', message });
  }

  function showError(error) {
    setStatus({ type: 'error', message: getErrorMessage(error) });
  }

  async function saveHero(data) {
    setSaving(true);
    setSavingMessage('Đang lưu cấu hình Hero Banner...');
    setStatus(null);
    try {
      const payload = toHeroPayload(data);
      const result = page?.props?.hero_section ? await FounderAPI.updateHero(payload) : await FounderAPI.createHero(payload);
      const savedHero = unwrap(result);
      setPage((current) => ({ ...current, props: { ...(current?.props || {}), hero_section: savedHero } }));
      showSuccess('Đã lưu Hero Banner thành công.');
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  async function saveSection(data) {
    setSaving(true);
    setSavingMessage(selectedSectionId ? 'Đang cập nhật hồ sơ Founder...' : 'Đang tạo hồ sơ Founder mới...');
    setStatus(null);
    try {
      const result = selectedSectionId
        ? await FounderAPI.updateFounderSection(selectedSectionId, toSectionPayload(data))
        : await FounderAPI.createFounderSection(toSectionPayload(data));
      const savedSection = unwrap(result);
      setPage((current) => {
        const currentSections = current?.props?.section || [];
        const nextSections = selectedSectionId
          ? currentSections.map((section) => section.id === selectedSectionId ? savedSection : section)
          : [...currentSections, savedSection];
        return { ...current, props: { ...(current?.props || {}), section: nextSections } };
      });
      setSelectedSectionId(null);
      showSuccess(selectedSectionId ? 'Đã cập nhật Founder thành công.' : 'Đã tạo Founder mới thành công.');
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  function promptDeleteSection(section) {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa hồ sơ Founder',
      message: `Bạn có chắc chắn muốn xóa hồ sơ "${section.name}" không?\nDữ liệu đã xóa sẽ không thể khôi phục.`,
      confirmText: 'Xóa Founder',
      type: 'danger',
      onConfirm: () => performDeleteSection(section.id),
    });
  }

  async function performDeleteSection(sectionId) {
    closeConfirmModal();
    setSaving(true);
    setSavingMessage('Đang xóa Founder...');
    setStatus(null);
    try {
      const result = await FounderAPI.deleteFounderSection(sectionId);
      const nextSections = unwrap(result);
      setPage((current) => ({
        ...current,
        props: {
          ...(current?.props || {}),
          section: Array.isArray(nextSections)
            ? nextSections
            : (current?.props?.section || []).filter((section) => section.id !== sectionId),
        },
      }));
      if (selectedSectionId === sectionId) setSelectedSectionId(null);
      showSuccess('Đã xóa Founder thành công.');
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  async function saveCta(data) {
    setSaving(true);
    setSavingMessage('Đang lưu cấu hình CTA...');
    setStatus(null);
    try {
      const payload = toCtaPayload(data, certificates);
      const result = cta ? await FounderAPI.updateFounderCta(payload) : await FounderAPI.createFounderCta(payload);
      const updatedCta = unwrap(result);
      setCta(updatedCta);
      if (Array.isArray(updatedCta?.certificate)) {
        setCertificates(updatedCta.certificate);
      }
      showSuccess('Đã lưu cấu hình CTA thành công.');
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  async function saveCertificate(event) {
    event.preventDefault();
    const trimmedName = certificateName.trim();
    if (!trimmedName) return;
    setSaving(true);
    setSavingMessage(editingCertificateId ? 'Đang cập nhật chứng nhận...' : 'Đang thêm chứng nhận mới...');
    setStatus(null);
    try {
      if (editingCertificateId) {
        const result = await FounderAPI.updateFounderCertificate(editingCertificateId, {
          name: trimmedName,
        });
        const savedCertificate = unwrap(result);
        setCertificates((current) => {
          const nextCertificates = current.map((cert) =>
            cert.id === editingCertificateId ? savedCertificate : cert
          );
          setCta((currentCta) => ({ ...(currentCta || {}), certificate: nextCertificates }));
          return nextCertificates;
        });
        showSuccess(`Đã cập nhật chứng nhận "${trimmedName}" thành công.`);
      } else {
        const result = await FounderAPI.createFounderCertificate({
          name: trimmedName,
        });
        const savedCertificate = unwrap(result);
        setCertificates((current) => {
          const nextCertificates = [...current, savedCertificate];
          setCta((currentCta) => ({ ...(currentCta || {}), certificate: nextCertificates }));
          return nextCertificates;
        });
        showSuccess(`Đã thêm chứng nhận "${trimmedName}" thành công.`);
      }
      setCertificateName('');
      setEditingCertificateId(null);
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  function promptDeleteCertificate(certificate) {
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận xóa chứng nhận',
      message: `Bạn có chắc chắn muốn xóa chứng nhận "${certificate.name}" khỏi danh sách không?`,
      confirmText: 'Xóa chứng nhận',
      type: 'danger',
      onConfirm: () => performDeleteCertificate(certificate.id, certificate.name),
    });
  }

  async function performDeleteCertificate(certificateId, certNameToDelete = '') {
    closeConfirmModal();
    if (!certificateId) {
      showError(new Error('Mã chứng nhận không hợp lệ.'));
      return;
    }
    const displayName = certNameToDelete || 'chứng nhận này';
    setSaving(true);
    setSavingMessage('Đang xóa chứng nhận...');
    setStatus(null);
    try {
      const result = await FounderAPI.deleteFounderCertificate(certificateId);
      const nextCertificates = unwrap(result);
      const updatedCertificates = Array.isArray(nextCertificates)
        ? nextCertificates
        : certificates.filter((cert) => cert.id !== certificateId);
      setCertificates(updatedCertificates);
      setCta((current) => ({ ...(current || {}), certificate: updatedCertificates }));
      if (editingCertificateId === certificateId) {
        setEditingCertificateId(null);
        setCertificateName('');
      }
      showSuccess(`Đã xóa "${displayName}" thành công.`);
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex min-h-[420px] items-center justify-center text-sm text-(--admin-heading)"><RefreshCw className="mr-2 animate-spin" size={18} />Đang tải nội dung Founder...</div>;
  }

  if (loadError) {
    return (
      <section className="border border-red-300 bg-red-50 p-6 text-red-900">
        <div className="flex items-start gap-3"><AlertCircle className="mt-0.5 shrink-0" size={20} /><div><h1 className="font-semibold">Không thể tải Founder</h1><p className="mt-2 text-sm">{loadError}</p><button type="button" onClick={loadFounderData} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-(--admin-primary) px-4 text-sm font-semibold text-white"><RefreshCw size={16} />Thử lại</button></div></div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <AdminToast
        toast={status ? { message: status.message, type: status.type } : null}
        onClose={() => setStatus(null)}
      />

      <AdminLoadingModal
        show={saving}
        title={savingMessage}
        subtitle="Vui lòng chờ trong giây lát, dữ liệu đang được đồng bộ..."
      />

      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        loading={saving}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
      />

      {/* Header trang quản trị chuẩn hóa */}
      <AdminPageHeader
        badge="Nội dung website"
        title="Quản trị Chuyện nhà sáng nghiệp"
        subtitle="Quản lý Hero banner, hồ sơ các nhà sáng lập (Founder), lời kêu gọi hành động (CTA) và chứng nhận."
        actions={
          <AdminButton
            type="button"
            variant="outline"
            size="sm"
            icon={RefreshCw}
            loading={loading}
            onClick={loadFounderData}
          >
            Tải lại
          </AdminButton>
        }
      />

      {/* Tabs Navigation chuẩn hóa */}
      <AdminTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab 1: Hero Banner */}
      {activeTab === 'hero' && (
        <AdminCard
          title="Cấu hình Hero Banner"
          subtitle="Thông tin tiêu đề, lời mở đầu và số lượng nhà sáng lập"
          actions={
            <AdminButton
              type="submit"
              form="founder-hero-form"
              variant="primary"
              size="sm"
              loading={saving}
              icon={Save}
            >
              Lưu thay đổi
            </AdminButton>
          }
        >
          <HeroEditor
            key={page?.props?.hero_section?.id || 'new'}
            hero={page?.props?.hero_section}
            saving={saving}
            onSave={saveHero}
          />
        </AdminCard>
      )}

      {/* Tab 2: Danh sách Founder */}
      {activeTab === 'sections' && (
        <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
          <AdminCard
            title="Danh sách Founder"
            subtitle={`${sections.length} hồ sơ trong hệ thống`}
            actions={
              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => setSelectedSectionId(null)}
              >
                Thêm Founder
              </AdminButton>
            }
          >
            <div className="space-y-2.5">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`flex items-center gap-2 rounded-xl border p-3.5 transition duration-150 ${
                    selectedSectionId === section.id
                      ? 'border-(--admin-accent) bg-(--admin-accent)/5 shadow-xs ring-1 ring-(--admin-accent)/10'
                      : 'border-(--admin-border) bg-(--admin-background) hover:border-(--admin-border-hover)'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedSectionId(section.id)}
                    className="min-w-0 flex-1 text-left cursor-pointer"
                  >
                    <span className="block truncate text-sm font-bold text-(--admin-title)">
                      {section.name}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-(--admin-body)/60">
                      {section.major} · Mã: {section.id}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSectionId(section.id)}
                    aria-label={`Sửa ${section.name}`}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-(--admin-body)/60 hover:text-(--admin-accent) hover:bg-(--admin-surface) transition cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => promptDeleteSection(section)}
                    aria-label={`Xóa ${section.name}`}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {!sections.length && (
                <p className="py-8 text-center text-xs text-(--admin-body)/50 italic">
                  Chưa có Founder nào trong danh sách.
                </p>
              )}
            </div>
          </AdminCard>

          <AdminCard
            title={selectedSection ? `Chỉnh sửa: ${selectedSection.name}` : 'Tạo mới hồ sơ Founder'}
            subtitle="Thiết lập thông tin cá nhân, tiểu sử và profile chi tiết"
            actions={
              <AdminButton
                type="submit"
                form="founder-section-form"
                variant="primary"
                size="sm"
                loading={saving}
                icon={Save}
              >
                {selectedSection ? 'Lưu Founder' : 'Tạo Founder mới'}
              </AdminButton>
            }
          >
            <SectionEditor
              key={selectedSectionId || 'new'}
              section={selectedSection}
              saving={saving}
              onSave={saveSection}
              onCancel={() => setSelectedSectionId(null)}
            />
          </AdminCard>
        </div>
      )}

      {/* Tab 3: CTA & Chứng nhận */}
      {activeTab === 'cta' && (
        <div className="space-y-6">
          <AdminCard
            title="Cấu hình Khối Kêu gọi hành động (CTA)"
            subtitle="Nội dung kêu gọi đăng ký và hợp tác cuối trang Founder"
            actions={
              <AdminButton
                type="submit"
                form="founder-cta-form"
                variant="primary"
                size="sm"
                loading={saving}
                icon={Save}
              >
                {cta ? 'Lưu CTA' : 'Tạo CTA mới'}
              </AdminButton>
            }
          >
            <CtaEditor
              key={cta?.id || 'new'}
              cta={cta}
              saving={saving}
              onSave={saveCta}
            />
          </AdminCard>

          <AdminCard
            title={`Danh sách Chứng nhận (${certificates.length})`}
            subtitle="Quản lý các chứng nhận và bảo chứng pháp lý hiển thị trong khối CTA"
          >
            <div className="space-y-4">
              <form onSubmit={saveCertificate} className="flex flex-col gap-2.5 sm:flex-row">
                <input
                  value={certificateName}
                  onChange={(event) => setCertificateName(event.target.value)}
                  placeholder="Nhập tên chứng nhận (Ví dụ: ISO 9001:2015, VIETKINGS Seal...)"
                  className="w-full rounded-lg border border-(--admin-border) bg-(--admin-background) px-3.5 py-2.5 text-sm text-(--admin-title) placeholder:text-(--admin-body)/40 outline-none transition focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/10"
                />
                <AdminButton
                  type="submit"
                  variant="primary"
                  disabled={saving || !certificateName.trim()}
                  icon={editingCertificateId ? Pencil : Plus}
                >
                  {editingCertificateId ? 'Lưu chứng nhận' : 'Thêm chứng nhận'}
                </AdminButton>
                {editingCertificateId && (
                  <AdminButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingCertificateId(null);
                      setCertificateName('');
                    }}
                  >
                    Hủy
                  </AdminButton>
                )}
              </form>

              <div className="divide-y divide-(--admin-border) border-y border-(--admin-border)">
                {certificates.map((certificate, index) => {
                  const certId = certificate.id || `temp_${index}`;
                  const isEditing = editingCertificateId === certId;
                  return (
                    <div
                      key={certId}
                      className={`flex min-h-12 items-center justify-between gap-3 py-2.5 px-2 rounded-lg transition ${
                        isEditing ? 'bg-(--admin-accent)/5 ring-1 ring-(--admin-accent)/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--admin-surface) text-xs font-semibold text-(--admin-body)/70 border border-(--admin-border)">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold text-(--admin-title) truncate">
                          {certificate.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCertificateId(certId);
                            setCertificateName(certificate.name);
                          }}
                          aria-label={`Sửa ${certificate.name}`}
                          className={`flex size-8 items-center justify-center rounded-lg transition cursor-pointer ${
                            isEditing
                              ? 'bg-(--admin-accent) text-white'
                              : 'text-(--admin-body)/60 hover:text-(--admin-accent) hover:bg-(--admin-background)'
                          }`}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => promptDeleteCertificate(certificate)}
                          aria-label={`Xóa ${certificate.name}`}
                          className="flex size-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {!certificates.length && (
                  <p className="py-6 text-center text-xs text-(--admin-body)/50 italic">
                    Chưa có chứng nhận nào trong danh sách.
                  </p>
                )}
              </div>
            </div>
          </AdminCard>
        </div>
      )}
    </div>
  );
}
