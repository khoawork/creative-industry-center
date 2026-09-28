import Brand from '../components/shared/Brand.jsx'
import Icon from '../components/shared/Icon.jsx'
import './Layout.css'

export default function Footer({ openDialog }) {
  return (
    <footer className="site-footer" id="lien-he">
      <div className="container footer-grid">
        <div className="footer-about">
          <Brand compact />
          <p>Kết nối tri thức, khơi nguồn sáng tạo và lan tỏa những giá trị bền vững của con người Việt Nam.</p>
          <div className="footer-motto">TRI THỨC · SÁNG TẠO · GIÁ TRỊ</div>
        </div>
        <div>
          <h3>VỀ CHÚNG TÔI</h3>
          <a href="#gioi-thieu">Giới thiệu trung tâm</a>
          <a href="#su-kien">Tin tức & hoạt động</a>
          <a href="#giai-thuong">Giải thưởng & tôn vinh</a>
          <button onClick={() => openDialog('contact')}>Liên hệ hợp tác</button>
        </div>
        <div>
          <h3>KẾT NỐI & ĐỒNG HÀNH</h3>
          <a href="#du-an">Dự án tiêu biểu</a>
          <a href="#chuyen-nha-sang-nghiep">Chuyện nhà sáng nghiệp</a>
          <a href="#de-cu">Đề cử kỷ lục</a>
          <a href="#dao-tao">Hợp tác & đào tạo</a>
        </div>
        <div className="footer-contact">
          <h3>THÔNG TIN LIÊN HỆ</h3>
          <strong>Trung tâm Công nghiệp Sáng tạo</strong>
          <p>Đồng hành cùng cộng đồng sáng tạo<br />trên khắp Việt Nam.</p>
          <button className="footer-contact-link" onClick={() => openDialog('contact')}>
            <Icon name="mail" size={17} /> Gửi thông tin liên hệ <Icon name="arrow" size={15} />
          </button>
          <small>Thông tin và nội dung trên trang là dữ liệu mẫu.</small>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Trung tâm Công nghiệp Sáng tạo.</span>
        <span>Khơi nguồn giá trị Việt.</span>
      </div>
    </footer>
  )
}
