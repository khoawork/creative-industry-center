import Icon from '../shared/Icon.jsx'
import { awards, events, programs } from '../../config/Home/homeData.js'

export default function HomeDialog({ dialog, dialogRef, submitted, closeDialog, openDialog, submitDemo }) {
  const kind = dialog?.kind
  const item = dialog?.item
  const isForm = ['nomination', 'program', 'contact'].includes(kind)
  const title = kind === 'nomination' ? 'Đề cử kỷ lục & sáng tạo' : kind === 'program' ? 'Đăng ký quan tâm chương trình' : kind === 'contact' ? 'Kết nối cùng chúng tôi' : kind === 'awards' ? 'Danh mục giải thưởng' : kind === 'events' ? 'Tin tức & hoạt động' : item?.title || 'Về Trung tâm Công nghiệp Sáng tạo'

  return <dialog ref={dialogRef} className="home-dialog" aria-labelledby="dialog-title" onCancel={closeDialog} onClose={closeDialog} onClick={(event) => { if (event.target === event.currentTarget) closeDialog() }}>
    {dialog && <div className="dialog-content">
      <button className="dialog-close icon-button" onClick={closeDialog} aria-label="Đóng cửa sổ"><Icon name="close" /></button>
      <span className="eyebrow">KẾT NỐI · SÁNG TẠO · LAN TỎA</span>
      <h2 id="dialog-title">{title}</h2>
      {isForm ? submitted ? <div className="form-success" role="status"><span className="success-icon"><Icon name="check" size={32} /></span><h3>Đã hoàn tất bản đăng ký mẫu!</h3><p>Bạn đã trải nghiệm thành công biểu mẫu. Thông tin chưa được gửi hoặc lưu; chức năng tiếp nhận sẽ được kết nối sau.</p><button className="button" onClick={closeDialog}>Hoàn tất <Icon name="check" size={17} /></button></div> : <form onSubmit={submitDemo} className="contact-form">
        <p className="body-copy">{kind === 'nomination' ? 'Chia sẻ thành tựu và câu chuyện sáng tạo của bạn với chúng tôi.' : 'Để lại thông tin để bắt đầu hành trình đồng hành và phát triển.'}</p>
        <div className="form-row"><label>Họ và tên <span>*</span><input name="name" autoComplete="name" placeholder="Nguyễn Văn An" required maxLength={100} /></label><label>Email <span>*</span><input name="email" type="email" autoComplete="email" placeholder="ban@example.com" required /></label></div>
        <label>Tổ chức / Đơn vị<input name="organization" autoComplete="organization" placeholder="Tên tổ chức hoặc đơn vị của bạn" maxLength={150} /></label>
        {kind === 'program' && <label>Chương trình quan tâm<select name="program" defaultValue={item?.id || programs[0].id}>{programs.map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}</select></label>}
        {kind === 'nomination' && <label>Hạng mục đề cử<select name="category" defaultValue={item?.id || awards[0].id}>{awards.map((award) => <option key={award.id} value={award.id}>{award.title}</option>)}</select></label>}
        <label>{kind === 'nomination' ? 'Thành tựu muốn đề cử' : 'Nội dung quan tâm'} <span>*</span><textarea name="message" rows={4} placeholder="Chia sẻ thêm về ý tưởng hoặc nhu cầu của bạn…" required maxLength={2000} /></label>
        <p className="form-note">Biểu mẫu trải nghiệm — chưa gửi hoặc lưu thông tin.</p>
        <button className="button" type="submit">Hoàn tất đăng ký mẫu <Icon name="arrow" size={18} /></button>
      </form> : kind === 'awards' || kind === 'events' ? <div className="dialog-list">{(kind === 'awards' ? awards : events).map((entry) => <article key={entry.id}><h3>{entry.title}</h3><p className="body-copy">{entry.description}</p><button className="text-link" onClick={() => openDialog(kind === 'awards' ? 'nomination' : 'article', entry)}>{kind === 'awards' ? 'Đề cử hạng mục này' : 'Đọc bài viết'}<Icon name="arrow" size={16} /></button></article>)}</div> : item ? <article className="article-detail">{item.image && <img src={item.image} alt={item.imageAlt} />}<p className="article-lead">{item.description}</p><p className="body-copy">{item.body}</p><p className="form-note">Nội dung minh họa cho giao diện mẫu.</p></article> : <div className="article-detail"><p className="article-lead">Nơi kết tinh tri thức, xác lập kỷ lục và tôn vinh giá trị Việt.</p><p className="body-copy">Trung tâm Công nghiệp Sáng tạo hướng đến kết nối các cá nhân, tổ chức và cộng đồng cùng chung khát vọng sáng tạo. Chúng tôi đồng hành trên hành trình khám phá giá trị bản địa, ghi nhận những thành tựu mới và đưa ý tưởng đến gần hơn với cuộc sống.</p><p className="body-copy">Thông qua các chương trình tôn vinh, dự án sáng nghiệp và hoạt động đào tạo, trung tâm tạo nên không gian sẻ chia tri thức và phát triển các mối quan hệ hợp tác bền vững.</p><button className="button" onClick={() => openDialog('contact')}>Kết nối với trung tâm <Icon name="arrow" size={18} /></button></div>}
    </div>}
  </dialog>
}
