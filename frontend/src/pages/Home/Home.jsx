import Icon from '../../components/shared/Icon.jsx'
import Header from '../../layout/Header.jsx'
import Footer from '../../layout/Footer.jsx'
import HomeDialog from '../../components/Home/HomeDialog.jsx'
import useHome from '../../hooks/Home/useHome.js'
import { navigation, statistics, events, awards, projects, programs, eligibility } from '../../config/Home/homeData.js'
import conference from '../../assets/Home/conference.svg'
import './Home.css'

function SectionHeading({ eyebrow, title, light = false, align = 'center' }) {
  return <div className={`section-heading${light ? ' section-heading--light' : ''} section-heading--${align}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><span className="heading-rule" /></div>
}

export default function Home() {
  const home = useHome()
  const { openDialog } = home

  return <>
    <a className="skip-link" href="#noi-dung">Chuyển đến nội dung</a>
    <Header navigation={navigation} {...home} />
    <main id="noi-dung">
      <section className="home-hero" id="trang-chu">
        <div className="heritage-seal" aria-hidden="true"><div className="seal-inner"><span>✦</span></div></div>
        <div className="container hero-content">
          <span className="hero-badge"><Icon name="star" size={14} /> TỰ HÀO GIÁ TRỊ VIỆT NAM <Icon name="star" size={14} /></span>
          <h1>TRUNG TÂM CÔNG NGHIỆP<br /><span>SÁNG TẠO</span></h1>
          <span className="heading-rule" />
          <p className="hero-subtitle">NƠI KẾT TINH TRI THỨC, XÁC LẬP KỶ LỤC VÀ TÔN VINH GIÁ TRỊ VIỆT</p>
          <p className="hero-manifesto">Chứng thực giá trị <i /> Kiến tạo bản sắc <i /> Trao truyền ý chí</p>
          <div className="hero-actions"><a className="button" href="#gioi-thieu">TÌM HIỂU VỀ CHÚNG TÔI <Icon name="arrow" size={18} /></a><a className="button button--outline" href="#giai-thuong"><Icon name="trophy" size={18} /> KHÁM PHÁ KỶ LỤC VIỆT NAM</a></div>
          <div className="hero-stats">{statistics.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
        </div>
      </section>

      <section className="home-section about-section" id="gioi-thieu">
        <div className="container">
          <SectionHeading eyebrow="SỨ MỆNH & TẦM NHÌN CỦA CHÚNG TÔI" title="VỀ TRUNG TÂM CÔNG NGHIỆP SÁNG TẠO" />
          <div className="about-grid">
            <div className="about-visual"><img src={conference} alt="Minh họa không gian hội ngộ và tôn vinh những giá trị sáng tạo Việt Nam" /><div className="about-caption"><span className="eyebrow">HÀNH TRÌNH KIẾN TẠO GIÁ TRỊ</span><h3>Viện Kỷ lục Việt Nam (VietKings)</h3><p>Tiếp nối tinh hoa, khơi nguồn sáng tạo và lan tỏa niềm tự hào Việt Nam.</p></div></div>
            <div className="about-content">
              <article className="mission-card"><div className="card-title"><span className="square-icon"><Icon name="book" /></span><h3>Tôn chỉ hoạt động</h3></div><p className="body-copy">Trung tâm Công nghiệp Sáng tạo là nơi hội tụ tri thức, kết nối những ý tưởng khác biệt và tôn vinh các giá trị sáng tạo của con người Việt Nam. Chúng tôi đồng hành cùng cá nhân, tổ chức và cộng đồng để phát triển các tiềm năng, lan tỏa bản sắc và kiến tạo những giá trị bền vững.</p></article>
              <div className="about-values"><article><Icon name="bulb" /><h3>Khơi lực chuyên môn</h3><p className="body-copy">Đồng hành cùng nhà sáng nghiệp, phát triển ý tưởng và đưa tri thức vào thực tiễn.</p></article><article><Icon name="globe" /><h3>Vươn tầm quốc tế</h3><p className="body-copy">Đưa các giá trị sáng tạo Việt kết nối với cộng đồng và bạn bè trên toàn thế giới.</p></article></div>
              <button className="button" onClick={() => openDialog('about')}>XEM CHI TIẾT GIỚI THIỆU <Icon name="arrow" size={18} /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section events-section" id="su-kien"><div className="container">
        <div className="section-topline"><SectionHeading eyebrow="ĐỒNG HÀNH CÙNG NHỊP SỐNG SÁNG TẠO" title="SỰ KIỆN NỔI BẬT & HOẠT ĐỘNG MỚI" align="left" /><button className="text-link" onClick={() => openDialog('events')}>XEM TẤT CẢ TIN TỨC <Icon name="arrow" size={17} /></button></div>
        <div className="events-grid">{events.map((event) => <article className="event-card" key={event.id}><button className="event-image" aria-label={`Đọc: ${event.title}`} onClick={() => openDialog('article', event)}><img src={event.image} alt={event.imageAlt} loading="lazy" /><span className="date-badge"><Icon name="calendar" size={12} />{event.date}</span></button><div className="event-content"><span className="eyebrow">{event.category}</span><h3><button onClick={() => openDialog('article', event)}>{event.title}</button></h3><p className="body-copy">{event.description}</p><button className="text-link" onClick={() => openDialog('article', event)}>ĐỌC CÂU CHUYỆN <Icon name="arrow" size={15} /></button></div></article>)}</div>
      </div></section>

      <section className="home-section awards-section" id="giai-thuong"><div className="container">
        <SectionHeading eyebrow="HỆ THỐNG GHI NHẬN DANH GIÁ" title="GIẢI THƯỞNG & TÔN VINH DANH HIỆU" light />
        <div className="awards-grid">{awards.map((award) => <article className={`award-card${award.featured ? ' award-card--featured' : ''}`} key={award.id}>{award.featured && <span className="featured-label">BIỂU TƯỢNG CỦA SỰ SÁNG TẠO</span>}<span className="award-icon"><Icon name={award.icon} size={32} /></span><h3>{award.title}</h3><p>{award.description}</p><span className="award-tag">{award.tag}</span></article>)}</div>
        <button className="button button--white" onClick={() => openDialog('awards')}>XEM CHI TIẾT DANH MỤC GIẢI THƯỞNG <Icon name="arrow" size={18} /></button>
      </div></section>

      <section className="home-section projects-section" id="du-an"><div className="container">
        <SectionHeading eyebrow="HÀNH TRÌNH TIẾP NỐI GIÁ TRỊ" title="DỰ ÁN TIÊU BIỂU & CHUYỆN NHÀ SÁNG NGHIỆP" />
        <div className="projects-grid">{projects.map((project, index) => <article className="project-card" id={index === 1 ? 'chuyen-nha-sang-nghiep' : undefined} key={project.id}><span className={`category-pill${index === 1 ? ' category-pill--wine' : ''}`}><Icon name={index === 1 ? 'star' : 'pin'} size={12} />{project.category}</span><h3>{project.title}</h3><p className="body-copy">{project.description}</p><button className="project-image" aria-label={project.action} onClick={() => openDialog('article', project)}><img src={project.image} alt={project.imageAlt} loading="lazy" /><span>{project.caption}</span></button><button className="text-link" onClick={() => openDialog('article', project)}>{project.action.toUpperCase()} <Icon name="arrow" size={15} /></button></article>)}</div>
      </div></section>

      <section className="nomination-section" id="de-cu"><div className="container"><div className="nomination-card"><div className="nomination-content"><span className="category-pill">CÙNG TÔN VINH GIÁ TRỊ VIỆT</span><h2>ĐỀ CỬ KỶ LỤC & ĐIỀN ĐĂNG KÝ KỶ LỤC</h2><p className="body-copy">Bạn hoặc tổ chức đang sở hữu một giá trị độc đáo, một công trình đặc sắc hoặc một câu chuyện sáng tạo đầy cảm hứng? Hãy cùng chúng tôi khám phá những giá trị xứng đáng được ghi nhận, để những nỗ lực của hôm nay trở thành di sản cho tương lai.</p><div className="nomination-actions"><button className="button" onClick={() => openDialog('nomination')}><Icon name="trophy" size={18} /> ĐỀ NGHỊ ĐỀ CỬ KỶ LỤC</button><button className="button button--outline" onClick={() => openDialog('contact')}><Icon name="mail" size={17} /> TƯ VẤN HỒ SƠ ĐỀ CỬ</button></div></div><aside className="eligibility"><h3>ĐỐI TƯỢNG HƯỚNG TỚI</h3>{eligibility.map((item, index) => <div key={item.title}><span>{index + 1}</span><p><strong>{item.title}</strong><small>{item.description}</small></p></div>)}</aside></div></div></section>

      <section className="home-section training-section" id="dao-tao"><div className="container">
        <SectionHeading eyebrow="CÙNG NHAU KIẾN TẠO TƯƠNG LAI" title="CHƯƠNG TRÌNH HỢP TÁC & ĐÀO TẠO" />
        <div className="programs-grid">{programs.map((program) => <article className="program-card" key={program.id}><Icon name={program.icon} size={27} /><h3>{program.title}</h3><p className="body-copy">{program.description}</p><div className="program-bottom"><span>{program.audience}</span><button className="text-link" onClick={() => openDialog('program', program)}>ĐĂNG KÝ QUAN TÂM <Icon name="arrow" size={15} /></button></div></article>)}</div>
        <div className="contact-banner"><Icon name="users" size={32} /><div><h3>Cần tư vấn trực tiếp từ Chuyên viên Viện Kỷ lục?</h3><p>Chúng tôi sẵn sàng lắng nghe và đồng hành cùng những ý tưởng của bạn.</p></div><button className="button" onClick={() => openDialog('contact')}>KẾT NỐI NGAY <Icon name="arrow" size={16} /></button></div>
      </div></section>
    </main>
    <Footer openDialog={openDialog} />
    <HomeDialog {...home} />
  </>
}
