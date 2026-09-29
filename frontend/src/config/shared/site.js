export const site = {
  name: 'Trung tâm Công nghiệp Sáng tạo',
  shortName: 'TTCNST',
  institute: 'VIỆN KỶ LỤC VIỆT NAM',
  tagline: 'VIỆN KỶ LỤC VIỆT NAM - VIETKINGS',
  description: 'Cơ quan nghiên cứu, tôn vinh và thúc đẩy các giá trị sáng tạo quốc gia, khơi nguồn tinh hoa trí tuệ Việt vươn tầm thế giới.',
  contact: {
    address: 'Trung tâm Công nghiệp Sáng tạo, Viện Kỷ lục Việt Nam, TP. Hồ Chí Minh & Hà Nội',
    phone: '(+84) 28 3847 7777',
    phoneHref: 'tel:+842838477777',
    emails: ['bbt@kyluc.vn', 'contact@vietkings.org'],
  },
}

const titleWords = site.name.split(' ')
export const siteHeading = {
  lead: titleWords.slice(0, -2).join(' '),
  accent: titleWords.slice(-2).join(' '),
}

export const sectionIds = {
  home: 'trang-chu',
  about: 'gioi-thieu',
  events: 'su-kien',
  awards: 'giai-thuong',
  projects: 'du-an',
  stories: 'chuyen-nha-sang-nghiep',
  records: 'de-cu',
  training: 'dao-tao',
  contact: 'lien-he',
}

export const siteLinks = {
  home: { label: 'Trang chủ', href: '/' },
  about: { label: 'Giới thiệu', href: '/about' },
  events: { label: 'Sự kiện', href: '/events' },
  awards: { label: 'Giải thưởng', href: '/awards' },
  projects: { label: 'Dự án nổi bật', href: '/projects' },
  stories: { label: 'Chuyện nhà sáng nghiệp', href: '/stories' },
  records: { label: 'Đề cử kỷ lục', href: '/records' },
  training: { label: 'Hợp tác & Đào tạo', href: '/training' },
  forum: { label: 'Diễn đàn Kinh tế Kỷ lục', href: '/forum' },
  contact: { label: 'Liên hệ', href: '/contact', icon: 'person' },
}

export const navigation = [
  siteLinks.home, siteLinks.about, siteLinks.events, siteLinks.records,
  siteLinks.projects, siteLinks.awards, siteLinks.stories,
  siteLinks.forum, siteLinks.training, siteLinks.contact,
]

export const footerGroups = [
  {
    title: 'Về Viện & Dự Án',
    links: [
      { ...siteLinks.about, label: 'Giới thiệu Tổ chức' },
      siteLinks.projects,
      siteLinks.stories,
      { ...siteLinks.records, label: 'Hệ thống Kỷ lục' },
    ],
  },
  {
    title: 'Sự Kiện & Hoạt Động',
    links: [
      { ...siteLinks.events, label: 'Sự kiện tiêu biểu' },
      { ...siteLinks.awards, label: 'Hạng mục Giải thưởng' },
      siteLinks.training,
    ],
  },
]
