import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Quote,
  Compass,
  Trophy,
  Share2,
  Calendar,
  Building,
  Globe,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Award,
  FileText,
} from 'lucide-react';
import { FounderAPI } from '../api/founderApi';
import {
  mapFounderPageToStories,
  unwrapFounderResponse,
  slugify,
} from '../services/founderMapper';

export default function FounderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    FounderAPI.getFounderPage()
      .then((result) => {
        if (!isMounted) return;
        const page = unwrapFounderResponse(result);
        const apiStories = mapFounderPageToStories(page);
        const target = String(id || '').trim().toLowerCase();
        const found = apiStories.find((s) => {
          const sSlug = s.slug || slugify(s.name);
          const paramSlug = slugify(target);
          return (
            sSlug === target ||
            sSlug === paramSlug ||
            String(s.id).toLowerCase() === target ||
            s.name.toLowerCase() === target.replace(/-/g, ' ') ||
            s.name.toLowerCase().includes(target.replace(/-/g, ' '))
          );
        });

        if (found) {
          setStory(found);
          setImgSrc(found.image);
        } else {
          setStory(null);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Lỗi tải dữ liệu Founder:', err);
        setStory(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Tự động đưa tên nhà sáng lập lên URL domain và cập nhật document.title trình duyệt
  useEffect(() => {
    if (story?.name) {
      const canonicalSlug = story.slug || slugify(story.name);
      // Nếu truy cập bằng id cũ (ví dụ /founder/section_1 hoặc /founder/1), tự động cập nhật URL domain đẹp
      if (id && id !== canonicalSlug && (String(id) === String(story.id) || id.startsWith('section_'))) {
        navigate(`/founder/${canonicalSlug}`, { replace: true });
      }
      document.title = `${story.name} — Chuyện nhà sáng nghiệp | Trung tâm Công nghiệp Sáng tạo`;
    }
  }, [story, id, navigate]);

  const handleShare = () => {
    const canonicalSlug = story?.slug || slugify(story?.name || '');
    const canonicalUrl = `${window.location.origin}/founder/${canonicalSlug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="inline-block size-10 border-4 border-[#710008] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-600">Đang tải câu chuyện nhà sáng lập...</p>
        </div>
      </div>
    );
  }



  const headline = story.storyTitle || story.tabs?.about?.title || story.title || 'Câu chuyện nhà sáng lập';
  const mainContent = story.profileDescription || story.tabs?.about?.content || story.description || '';
  const quoteText = story.quote || story.tabs?.about?.quote || '';
  const quoteAuthor = story.quoteAuthor || story.tabs?.about?.quoteAuthor || story.name || '';

  // Các phần bổ sung nếu có (Hành trình & Thành tựu)
  const journeyContent = story.tabs?.journey?.content;
  const achievementsContent = story.tabs?.achievements?.content;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2d2a29]">
      
      {/* Top Banner / Breadcrumb Bar */}
      <div className="bg-[#1e1e1a] text-[#e9e5da] border-b border-[#39321f]/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-gray-400">
            <Link to="/" className="hover:text-[#d49520] transition">Trang chủ</Link>
            <ChevronRight size={12} />
            <Link to="/founder" className="hover:text-[#d49520] transition">Chuyện nhà sáng nghiệp</Link>
            <ChevronRight size={12} />
            <span className="text-[#d49520] font-medium truncate max-w-[200px] sm:max-w-none">
              {story.name}
            </span>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Link
              to="/founder"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2a2a24] hover:bg-[#35352e] border border-[#39321f] text-gray-300 hover:text-white transition"
            >
              <ArrowLeft size={14} />
              <span>Danh sách Founder</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2a2a24] hover:bg-[#35352e] border border-[#39321f] text-gray-300 hover:text-white transition cursor-pointer"
            >
              <Share2 size={14} />
              <span>{copied ? 'Đã sao chép link!' : 'Chia sẻ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI (4 Cột): Profile Card, Ảnh, Meta Info */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-6 overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#710008] via-[#a81a24] to-[#d49520]"></div>

              {/* Ảnh chân dung */}
              <div className="relative rounded-xl overflow-hidden shadow-sm bg-gray-100 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 mt-2">
                <img
                  src={imgSrc}
                  alt={story.name}
                  onError={() => {
                    if (story.fallbackImage && imgSrc !== story.fallbackImage) {
                      setImgSrc(story.fallbackImage);
                    }
                  }}
                  className="w-full h-full object-cover object-center"
                />

                <div className="absolute top-3 left-3 bg-[#6b060e]/95 text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs shadow-md border border-amber-400/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{story.badgeText}</span>
                </div>
              </div>

              {/* Tên & Lĩnh vực */}
              <div className="mt-5 text-center sm:text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#b87d14] block">
                  {story.categoryLabel}
                </span>

                <h1 className="text-2xl font-bold text-[#710008] tracking-tight mt-1">
                  {story.name}
                </h1>

                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-snug">
                  {story.title}
                </p>
              </div>

              {/* Metadata Info (Năm thành lập, Quy mô, Thị trường...) */}
              {story.meta && story.meta.length > 0 && (
                <div className="mt-5 pt-5 border-t border-[#ede5d8] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Thông tin doanh nghiệp & dự án
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5 text-xs">
                    {story.meta.map((item, idx) => (
                      <div key={idx} className="bg-[#faf7f2] border border-[#ede5d8] rounded-xl p-3 flex justify-between items-center">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-semibold text-gray-900 text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Khẩu hiệu / Trích dẫn */}
              {quoteText && (
                <div className="bg-[#faf7f2] border-l-4 border-[#d49520] p-4 rounded-r-xl shadow-xs mt-5">
                  <Quote className="w-5 h-5 text-[#d49520] shrink-0 fill-amber-100/40 mb-1" />
                  <blockquote className="italic text-gray-700 text-xs leading-relaxed">
                    "{quoteText}"
                  </blockquote>
                  {quoteAuthor && (
                    <cite className="text-[11px] font-semibold text-[#710008] not-italic mt-2 block">
                      — {quoteAuthor}
                    </cite>
                  )}
                </div>
              )}

              {/* Nút hành động liên hệ / đề cử */}
              <div className="mt-6 pt-5 border-t border-[#ede5d8]">
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#710008] to-[#91131c] hover:from-[#840610] hover:to-[#a31923] text-white font-semibold text-xs shadow-md shadow-[#710008]/20 transition-all cursor-pointer"
                >
                  <Award size={15} className="text-amber-300" />
                  <span>Đề cử kỷ lục cùng chuyên gia</span>
                </Link>
              </div>

            </div>
          </aside>

          {/* CỘT PHẢI (8 Cột): Nội dung chi tiết Render HTML */}
          <section className="lg:col-span-8 space-y-6">
            <article className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm p-6 sm:p-8 lg:p-12 relative overflow-hidden">
              
              {/* Tiêu đề câu chuyện */}
              <div className="border-b border-[#ede5d8] pb-6 mb-8">
          
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#710008] tracking-tight leading-tight">
                  {headline}
                </h2>
              </div>

              {/* Scoped CSS chống đè chữ trên trang chi tiết */}
              <style>{`
                .founder-html-content .word-column-layout {
                  display: flex !important;
                  flex-direction: row !important;
                  gap: 24px !important;
                  width: 100% !important;
                  box-sizing: border-box !important;
                  margin: 20px 0 !important;
                  clear: both !important;
                }
                .founder-html-content .word-column-layout.word-cols-2 > .word-col {
                  flex: 1 1 0% !important;
                  width: 50% !important;
                  max-width: 50% !important;
                  min-width: 0 !important;
                  box-sizing: border-box !important;
                  overflow-wrap: break-word !important;
                  word-break: break-word !important;
                }
                .founder-html-content .word-column-layout.word-cols-3 > .word-col {
                  flex: 1 1 0% !important;
                  width: 33.333% !important;
                  max-width: 33.333% !important;
                  min-width: 0 !important;
                  box-sizing: border-box !important;
                  overflow-wrap: break-word !important;
                  word-break: break-word !important;
                }
                .founder-html-content .word-column-layout.word-cols-left-narrow > .word-col:first-child {
                  flex: 1 1 0% !important;
                  width: 35% !important;
                  max-width: 35% !important;
                  min-width: 0 !important;
                  box-sizing: border-box !important;
                }
                .founder-html-content .word-column-layout.word-cols-left-narrow > .word-col:last-child {
                  flex: 2 1 0% !important;
                  width: 65% !important;
                  max-width: 65% !important;
                  min-width: 0 !important;
                  box-sizing: border-box !important;
                }
                .founder-html-content .word-column-layout.word-cols-right-narrow > .word-col:first-child {
                  flex: 2 1 0% !important;
                  width: 65% !important;
                  max-width: 65% !important;
                  min-width: 0 !important;
                  box-sizing: border-box !important;
                }
                .founder-html-content .word-column-layout.word-cols-right-narrow > .word-col:last-child {
                  flex: 1 1 0% !important;
                  width: 35% !important;
                  max-width: 35% !important;
                  min-width: 0 !important;
                  box-sizing: border-box !important;
                }
                .founder-html-content .word-column-layout .word-col * {
                  max-width: 100% !important;
                  box-sizing: border-box !important;
                  position: static !important;
                  white-space: normal !important;
                  overflow-wrap: break-word !important;
                  word-break: break-word !important;
                }
                @media (max-width: 640px) {
                  .founder-html-content .word-column-layout {
                    flex-direction: column !important;
                    gap: 16px !important;
                  }
                  .founder-html-content .word-column-layout > .word-col {
                    width: 100% !important;
                    max-width: 100% !important;
                  }
                }
              `}</style>
              {/* Khung nội dung render HTML (theo định dạng Word từ Admin) */}
              <div
                className="founder-html-content text-sm sm:text-base text-gray-800 leading-relaxed space-y-4 text-justify font-normal
                  [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#710008] [&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:border-b [&_h1]:border-[#ede5d8] [&_h1]:pb-2
                  [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#710008] [&_h2]:mt-6 [&_h2]:mb-2.5
                  [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#710008] [&_h3]:mt-5 [&_h3]:mb-2
                  [&_p]:leading-relaxed [&_p]:my-3.5
                  [&_strong]:text-gray-950 [&_strong]:font-bold
                  [&_em]:italic [&_em]:text-gray-700
                  [&_u]:underline [&_u]:decoration-[#d49520] [&_u]:underline-offset-2
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#d49520] [&_blockquote]:bg-[#faf7f2] [&_blockquote]:p-4 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-5
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3.5 [&_ul_li]:my-1
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3.5 [&_ol_li]:my-1
                  [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:border [&_table]:border-gray-200 [&_table]:shadow-2xs [&_table]:rounded-lg
                  [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-100/90 [&_th]:p-3 [&_th]:font-bold [&_th]:text-[#710008] [&_th]:text-left [&_th]:text-sm
                  [&_td]:border [&_td]:border-gray-200 [&_td]:p-3 [&_td]:text-sm [&_td]:text-gray-700
                  [&_tr:nth-child(even)]:bg-[#faf8f5]/50
                  [&_a]:text-[#710008] [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-[#d49520]
                  [&_img]:rounded-xl [&_img]:my-5 [&_img]:shadow-md [&_img]:max-w-full [&_img]:mx-auto [&_img]:block
                  [&_.word-column-layout]:my-6 [&_.word-column-layout]:border-none [&_.word-column-layout]:bg-transparent [&_.word-column-layout]:w-full
                  [&_.word-col]:min-w-0 [&_.word-col]:break-words [&_.word-col]:relative
                  [&_.word-col_*]:static! [&_.word-col_*]:max-w-full
                  [&_figure]:my-6 [&_figure]:text-center
                  [&_figcaption]:text-xs [&_figcaption]:text-gray-500 [&_figcaption]:italic [&_figcaption]:mt-2
                  [&_hr]:border-[#ede5d8] [&_hr]:my-8"
                dangerouslySetInnerHTML={{ __html: mainContent }}
              />

              {/* Hành trình & Thành tựu nếu có bổ sung từ tabs */}
              {journeyContent && journeyContent !== mainContent && !journeyContent.includes('chưa được cập nhật') && (
                <div className="mt-10 pt-8 border-t border-[#ede5d8]">
                  <div className="flex items-center gap-2 text-[#710008] font-bold text-lg mb-3">
                    <Compass size={20} className="text-[#d49520]" />
                    <h3>Hành trình khởi nghiệp</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
                    {journeyContent}
                  </p>
                </div>
              )}

              {achievementsContent && achievementsContent !== mainContent && !achievementsContent.includes('chưa được cập nhật') && (
                <div className="mt-8 pt-8 border-t border-[#ede5d8]">
                  <div className="flex items-center gap-2 text-[#710008] font-bold text-lg mb-3">
                    <Trophy size={20} className="text-[#d49520]" />
                    <h3>Thành tựu & Vinh danh</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
                    {achievementsContent}
                  </p>
                </div>
              )}

            </article>

            {/* Điều hướng quay lại */}
            <div className="flex items-center justify-between pt-4">
              <Link
                to="/founder"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#710008] hover:text-[#d49520] transition"
              >
                <ArrowLeft size={16} />
                <span>Xem tất cả câu chuyện nhà sáng nghiệp</span>
              </Link>
            </div>
          </section>

        </div>
      </main>

    </div>
  );
}

