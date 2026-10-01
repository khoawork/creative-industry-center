import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Layout,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { FounderAPI } from '../../../api/founderApi.js';

const tabs = [
  { id: 'hero', label: 'Hero', icon: Layout },
  { id: 'sections', label: 'Founder', icon: UsersRound },
  { id: 'cta', label: 'CTA & chứng nhận', icon: Award },
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

function toCtaPayload(data) {
  return {
    subtitle: data.subtitle,
    title: data.title,
    description: data.description,
    btn_cta: data.btn_cta,
    sub_btn_cta: data.sub_btn_cta,
    certificate: (data.certificate || []).map(({ name }) => ({ name })),
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

function Field({ label, name, value, onChange, type = 'text', required = true, placeholder = '' }) {
  const inputId = `founder-${name.replaceAll('.', '-')}`;
  const commonProps = {
    id: inputId,
    name,
    value: value ?? '',
    onChange: (event) => onChange(event.target.value),
    required,
    placeholder,
    className: 'mt-1.5 min-h-11 w-full rounded-md border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-sm text-(--admin-ink) outline-none transition focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/30',
  };

  return (
    <label htmlFor={inputId} className="block text-sm font-medium text-(--admin-ink)">
      {label}
      {type === 'textarea' ? <textarea {...commonProps} rows={4} /> : <input {...commonProps} type={type} />}
    </label>
  );
}

function StatusMessage({ status }) {
  if (!status) return null;
  const isError = status.type === 'error';
  return (
    <div role={isError ? 'alert' : 'status'} className={`mt-5 flex items-start gap-2 rounded-md border px-3 py-2.5 text-sm ${isError ? 'border-red-300 bg-red-50 text-red-800' : 'border-emerald-300 bg-emerald-50 text-emerald-800'}`}>
      {isError ? <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" /> : <CheckCircle2 size={17} className="mt-0.5 shrink-0" aria-hidden="true" />}
      <span>{status.message}</span>
    </div>
  );
}

function HeroEditor({ hero, saving, onSave }) {
  const [form, setForm] = useState({ ...emptyHero, ...(hero || {}) });

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  return (
    <form onSubmit={(event) => { event.preventDefault(); onSave({ ...form, number_of_founders: Number(form.number_of_founders) }); }} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Tiêu đề" name="title" value={form.title} onChange={(value) => update('title', value)} />
        <Field label="Tên nhóm Founder" name="name" value={form.name} onChange={(value) => update('name', value)} />
        <Field label="Subtitle" name="subtitle" value={form.subtitle} onChange={(value) => update('subtitle', value)} />
        <Field label="Số lượng Founder" name="number_of_founders" type="number" value={form.number_of_founders} onChange={(value) => update('number_of_founders', value)} />
      </div>
      <Field label="Mô tả" name="description" type="textarea" value={form.description} onChange={(value) => update('description', value)} />
      <Field label="Mô tả phụ" name="subdescription" type="textarea" value={form.subdescription} onChange={(value) => update('subdescription', value)} />
      <SaveButton saving={saving} label={hero ? 'Lưu Hero' : 'Tạo Hero'} />
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
    <form onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Tên Founder" name="name" value={form.name} onChange={(value) => update('name', value)} />
        <Field label="Chức danh / major" name="major" value={form.major} onChange={(value) => update('major', value)} />
        <Field label="URL hình ảnh" name="image" value={form.image} onChange={(value) => update('image', value)} placeholder="https://..." />
        <label htmlFor="founder-is-verified" className="flex min-h-11 items-center gap-3 self-end rounded-md border border-(--admin-border) px-3 text-sm font-medium">
          <input id="founder-is-verified" type="checkbox" checked={form.is_verified} onChange={(event) => update('is_verified', event.target.checked)} className="size-4 accent-(--admin-accent)" />
          Đã xác minh
        </label>
      </div>
      <Field label="Mô tả Founder" name="description" type="textarea" value={form.description} onChange={(value) => update('description', value)} />

      <fieldset className="space-y-3 rounded-md border border-(--admin-border) p-4">
        <legend className="px-1 text-sm font-semibold text-(--admin-heading)">Thông tin Founder</legend>
        {form.founder_info.map((item, index) => (
          <div key={item.id || index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <Field label={`Nhãn ${index + 1}`} name={`founder-info-label-${index}`} value={item.label} onChange={(value) => updateInfo(index, 'label', value)} />
            <Field label={`Giá trị ${index + 1}`} name={`founder-info-value-${index}`} value={item.value} onChange={(value) => updateInfo(index, 'value', value)} />
            <button type="button" onClick={() => removeInfo(index)} disabled={form.founder_info.length === 1} aria-label={`Xóa thông tin ${index + 1}`} className="mt-6 flex min-h-11 items-center justify-center rounded-md px-3 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"><Trash2 size={16} /></button>
          </div>
        ))}
        <button type="button" onClick={addInfo} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-dashed border-(--admin-accent) px-3 text-sm font-semibold text-(--admin-heading) hover:bg-(--admin-background)"><Plus size={15} />Thêm thông tin</button>
      </fieldset>

      <fieldset className="space-y-4 rounded-md border border-(--admin-border) p-4">
        <legend className="px-1 text-sm font-semibold text-(--admin-heading)">Founder profile</legend>
        <div className="grid gap-5 md:grid-cols-2">
          <label htmlFor="founder-profile-filter" className="block text-sm font-medium">
            Bộ lọc
            <select id="founder-profile-filter" value={form.founder_profile.filter} onChange={(event) => updateProfileFilter(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-md border border-(--admin-border) bg-(--admin-background) px-3 py-2 text-sm outline-none focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/30">
              <option value="bio">Bio</option>
              <option value="projects">Projects</option>
              <option value="achievements">Achievements</option>
            </select>
          </label>
          <Field label="Tiêu đề profile" name="profile-title" value={form.founder_profile.title} onChange={(value) => updateProfile('title', value)} />
          <Field label="Slogan" name="slogan" value={form.founder_profile.slogan} onChange={(value) => updateProfile('slogan', value)} />
          <Field label="Sub slogan" name="sub-slogan" value={form.founder_profile.sub_slogan} onChange={(value) => updateProfile('sub_slogan', value)} />
        </div>
        <Field label="Mô tả profile" name="profile-description" type="textarea" value={form.founder_profile.description} onChange={(value) => updateProfile('description', value)} />
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <SaveButton saving={saving} label={section ? 'Lưu Founder' : 'Tạo Founder'} />
        {section && <button type="button" onClick={onCancel} className="min-h-11 rounded-md border border-(--admin-border) px-4 text-sm font-semibold hover:bg-(--admin-background)">Hủy chỉnh sửa</button>}
      </div>
    </form>
  );
}

function CtaEditor({ cta, saving, onSave }) {
  const [form, setForm] = useState({ ...emptyCta, ...(cta || {}) });

  const update = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  return (
    <form onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Subtitle" name="cta-subtitle" value={form.subtitle} onChange={(value) => update('subtitle', value)} />
        <Field label="Tiêu đề" name="cta-title" value={form.title} onChange={(value) => update('title', value)} />
        <Field label="Nút chính" name="btn-cta" value={form.btn_cta} onChange={(value) => update('btn_cta', value)} />
        <Field label="Nút phụ" name="sub-btn-cta" value={form.sub_btn_cta} onChange={(value) => update('sub_btn_cta', value)} />
      </div>
      <Field label="Mô tả CTA" name="cta-description" type="textarea" value={form.description} onChange={(value) => update('description', value)} />
      <SaveButton saving={saving} label={cta ? 'Lưu CTA' : 'Tạo CTA'} />
    </form>
  );
}

function SaveButton({ saving, label }) {
  return (
    <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-(--admin-primary) px-4 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--admin-heading)">
      <Save size={16} aria-hidden="true" />
      {saving ? 'Đang lưu...' : label}
    </button>
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
  const [status, setStatus] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [editingCertificateId, setEditingCertificateId] = useState(null);

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
      const mergedCertificates = Array.isArray(certificateData)
        ? certificateData
        : pageCta.certificate || [];
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
    setStatus(null);
    try {
      const payload = toHeroPayload(data);
      const result = page?.props?.hero_section ? await FounderAPI.updateHero(payload) : await FounderAPI.createHero(payload);
      const savedHero = unwrap(result);
      setPage((current) => ({ ...current, props: { ...(current?.props || {}), hero_section: savedHero } }));
      showSuccess('Đã lưu Hero thành công.');
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  async function saveSection(data) {
    setSaving(true);
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
      showSuccess(selectedSectionId ? 'Đã cập nhật Founder.' : 'Đã tạo Founder mới.');
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  async function deleteSection(sectionId) {
    if (!window.confirm('Bạn có chắc muốn xóa Founder này không?')) return;
    setSaving(true);
    setStatus(null);
    try {
      const result = await FounderAPI.deleteFounderSection(sectionId);
      const nextSections = unwrap(result);
      setPage((current) => ({ ...current, props: { ...(current?.props || {}), section: Array.isArray(nextSections) ? nextSections : (current?.props?.section || []).filter((section) => section.id !== sectionId) } }));
      if (selectedSectionId === sectionId) setSelectedSectionId(null);
      showSuccess('Đã xóa Founder.');
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  async function saveCta(data) {
    setSaving(true);
    setStatus(null);
    try {
      const result = cta ? await FounderAPI.updateFounderCta(toCtaPayload(data)) : await FounderAPI.createFounderCta(toCtaPayload(data));
      setCta(unwrap(result));
      showSuccess('Đã lưu CTA thành công.');
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  async function saveCertificate(event) {
    event.preventDefault();
    if (!certificateName.trim()) return;
    setSaving(true);
    setStatus(null);
    try {
      const result = editingCertificateId
        ? await FounderAPI.updateFounderCertificate(editingCertificateId, { name: certificateName.trim() })
        : await FounderAPI.createFounderCertificate({ name: certificateName.trim() });
      const savedCertificate = unwrap(result);
      setCertificates((current) => {
        const nextCertificates = editingCertificateId
          ? current.map((certificate) => certificate.id === editingCertificateId ? savedCertificate : certificate)
          : [...current, savedCertificate];
        setCta((currentCta) => ({ ...(currentCta || {}), certificate: nextCertificates }));
        return nextCertificates;
      });
      setCertificateName('');
      setEditingCertificateId(null);
      showSuccess(editingCertificateId ? 'Đã cập nhật chứng nhận.' : 'Đã thêm chứng nhận.');
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  }

  async function deleteCertificate(certificateId) {
    if (!window.confirm('Bạn có chắc muốn xóa chứng nhận này không?')) return;
    setSaving(true);
    setStatus(null);
    try {
      const result = await FounderAPI.deleteFounderCertificate(certificateId);
      const nextCertificates = unwrap(result);
      const updatedCertificates = Array.isArray(nextCertificates)
        ? nextCertificates
        : certificates.filter((certificate) => certificate.id !== certificateId);
      setCertificates(updatedCertificates);
      setCta((current) => ({ ...(current || {}), certificate: updatedCertificates }));
      showSuccess('Đã xóa chứng nhận.');
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
    <>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--admin-border) pb-7">
        <div>
          <p className="mb-3 text-[11px] font-semibold tracking-[0.16em] text-(--admin-heading) uppercase">Khu vực quản trị</p>
          <h1 className="text-2xl font-semibold tracking-tight text-(--admin-title) sm:text-3xl">Chuyện nhà sáng nghiệp</h1>
          <p className="mt-3 text-sm leading-6">Quản lý Hero, hồ sơ Founder, lời kêu gọi hành động và chứng nhận.</p>
        </div>
        <button type="button" onClick={loadFounderData} className="inline-flex min-h-11 items-center gap-2 rounded-md border border-(--admin-border) px-3 text-sm font-semibold hover:bg-(--admin-background)" title="Tải lại dữ liệu"><RefreshCw size={16} />Tải lại</button>
      </div>

      <StatusMessage status={status} />

      <div role="tablist" aria-label="Quản lý Founder" className="my-6 flex max-w-full gap-1 overflow-x-auto border-b border-(--admin-border) bg-(--admin-surface) p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-(--admin-heading) ${activeTab === tab.id ? 'border-(--admin-accent) text-(--admin-title)' : 'border-transparent text-(--admin-heading) hover:bg-(--admin-background)'}`}><Icon size={16} />{tab.label}</button>;
        })}
      </div>

      {activeTab === 'hero' && <Panel title="Hero section" description="Nội dung mở đầu của trang Founder."><HeroEditor key={page?.props?.hero_section?.id || 'new'} hero={page?.props?.hero_section} saving={saving} onSave={saveHero} /></Panel>}

      {activeTab === 'sections' && (
        <div className="grid gap-6 xl:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.5fr)]">
          <Panel title="Danh sách Founder" description={`${sections.length} hồ sơ đang có.`}>
            <div className="space-y-2">
              <button type="button" onClick={() => setSelectedSectionId(null)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-dashed border-(--admin-accent) px-3 text-sm font-semibold text-(--admin-heading) hover:bg-(--admin-background)"><Plus size={16} />Thêm Founder</button>
              {sections.map((section) => <div key={section.id} className={`flex items-center gap-2 rounded-md border p-3 ${selectedSectionId === section.id ? 'border-(--admin-accent) bg-(--admin-background)' : 'border-(--admin-border)'}`}><button type="button" onClick={() => setSelectedSectionId(section.id)} className="min-w-0 flex-1 text-left"><span className="block truncate text-sm font-semibold">{section.name}</span><span className="mt-1 block truncate text-xs opacity-70">{section.major} · {section.id}</span></button><button type="button" onClick={() => setSelectedSectionId(section.id)} aria-label={`Sửa ${section.name}`} className="flex size-9 shrink-0 items-center justify-center rounded-md hover:bg-(--admin-background)"><Pencil size={15} /></button><button type="button" onClick={() => deleteSection(section.id)} aria-label={`Xóa ${section.name}`} className="flex size-9 shrink-0 items-center justify-center rounded-md text-red-700 hover:bg-red-50"><Trash2 size={15} /></button></div>)}
              {!sections.length && <p className="py-8 text-center text-sm opacity-70">Chưa có Founder nào.</p>}
            </div>
          </Panel>
          <Panel title={selectedSection ? 'Chỉnh sửa Founder' : 'Tạo Founder'} description="Các trường bắt buộc theo FounderSectionDto."><SectionEditor key={selectedSectionId || 'new'} section={selectedSection} saving={saving} onSave={saveSection} onCancel={() => setSelectedSectionId(null)} /></Panel>
        </div>
      )}

      {activeTab === 'cta' && (
        <div className="space-y-6">
          <Panel title="CTA section" description="Nội dung kêu gọi hành động của trang Founder."><CtaEditor key={cta?.id || 'new'} cta={cta} saving={saving} onSave={saveCta} /></Panel>
          <Panel title="Chứng nhận" description="Quản lý các chứng nhận hiển thị trong CTA.">
            <form onSubmit={saveCertificate} className="flex flex-col gap-3 sm:flex-row"><label htmlFor="certificate-name" className="sr-only">Tên chứng nhận</label><input id="certificate-name" value={certificateName} onChange={(event) => setCertificateName(event.target.value)} placeholder="Ví dụ: ISO 9001" className="min-h-11 flex-1 rounded-md border border-(--admin-border) bg-(--admin-background) px-3 text-sm outline-none focus:border-(--admin-accent) focus:ring-2 focus:ring-(--admin-accent)/30" /><button type="submit" disabled={saving || !certificateName.trim()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-(--admin-primary) px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{editingCertificateId ? <Pencil size={16} /> : <Plus size={16} />}{editingCertificateId ? 'Lưu chứng nhận' : 'Thêm chứng nhận'}</button>{editingCertificateId && <button type="button" onClick={() => { setEditingCertificateId(null); setCertificateName(''); }} className="min-h-11 rounded-md border border-(--admin-border) px-4 text-sm font-semibold">Hủy</button>}</form>
            <div className="mt-5 divide-y divide-(--admin-border) border-y border-(--admin-border)">{certificates.map((certificate) => <div key={certificate.id} className="flex min-h-14 items-center gap-3 py-2"><span className="flex-1 text-sm font-medium">{certificate.name}</span><button type="button" onClick={() => { setEditingCertificateId(certificate.id); setCertificateName(certificate.name); }} aria-label={`Sửa ${certificate.name}`} className="flex size-9 items-center justify-center rounded-md hover:bg-(--admin-background)"><Pencil size={15} /></button><button type="button" onClick={() => deleteCertificate(certificate.id)} aria-label={`Xóa ${certificate.name}`} className="flex size-9 items-center justify-center rounded-md text-red-700 hover:bg-red-50"><Trash2 size={15} /></button></div>)}{!certificates.length && <p className="py-8 text-center text-sm opacity-70">Chưa có chứng nhận nào.</p>}</div>
          </Panel>
        </div>
      )}
    </>
  );
}

function Panel({ title, description, children }) {
  return <section className="border border-(--admin-border) bg-(--admin-surface) p-5 shadow-[var(--admin-panel-shadow)] sm:p-6"><h2 className="text-lg font-semibold text-(--admin-title)">{title}</h2><p className="mt-1 text-sm leading-6 opacity-75">{description}</p><div className="mt-5">{children}</div></section>;
}
