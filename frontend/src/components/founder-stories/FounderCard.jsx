import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Quote, ArrowRight } from 'lucide-react';
import { slugify } from '../../services/founderMapper';

export const FounderCard = ({ story }) => {
  const [imgSrc, setImgSrc] = useState(story.image);

  // Đường dẫn thân thiện SEO đưa tên nhà sáng lập lên URL / domain
  const founderSlug = story.slug || slugify(story.name) || story.id;
  const detailUrl = `/founder/${founderSlug}`;

  // Lấy nội dung câu chuyện (từ about tab hoặc trường description/content)
  const tabAbout = story.tabs?.about || {};
  const headline = story.storyTitle || tabAbout.title || story.title || 'Câu chuyện nhà sáng lập';
  const rawContent = story.description || tabAbout.content || '';
  const quoteText = story.quote || tabAbout.quote || '';
  const quoteAuthor = story.quoteAuthor || tabAbout.quoteAuthor || story.name || '';

  return (
    <article className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group">
      <div className="h-1.5 bg-gradient-to-r from-[#710008] via-[#a81a24] to-[#d49520]"></div>

      <div className="p-5 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Cột trái: Hình ảnh & Thông tin tóm tắt */}
          <div className="lg:col-span-5 flex flex-col">
            <Link to={detailUrl} className="block group/img">
              <div className="relative rounded-xl overflow-hidden shadow-sm bg-gray-100 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 group-hover:shadow-md transition-shadow">
                <img
                  src={imgSrc}
                  alt={story.name}
                  onError={() => {
                    if (story.fallbackImage && imgSrc !== story.fallbackImage) {
                      setImgSrc(story.fallbackImage);
                    }
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute top-3 left-3 bg-[#6b060e]/90 text-amber-200 text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs shadow-md border border-amber-400/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{story.badgeText}</span>
                </div>
              </div>
            </Link>

            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b87d14] block">
                {story.categoryLabel}
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-[#710008] tracking-tight mt-1 hover:text-[#910510] transition-colors">
                <Link to={detailUrl}>
                  {story.name}
                </Link>
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-snug font-normal">
                {story.title}
              </p>

              {story.meta && story.meta.length > 0 && (
                <div className="bg-[#faf7f2] border border-[#ede5d8] rounded-xl p-3.5 mt-3.5 grid grid-cols-2 gap-2.5 text-xs">
                  {story.meta.map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-gray-500 text-[11px]">{item.label}</span>
                      <span className="font-semibold text-gray-800 text-xs truncate mt-0.5" title={item.value}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cột phải: Nội dung câu chuyện & Nút Xem chi tiết */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full bg-[#fcfbf9] border border-[#e6ddd1] rounded-xl p-5 sm:p-6 shadow-xs">
            <div>
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-100 text-[#b87d14] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  {headline}
                </h4>
              </div>

              {/* Mô tả rendered HTML / văn bản */}
              <div
                className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-3.5 text-justify font-normal line-clamp-4 prose prose-sm max-w-none [&_p]:my-1 [&_strong]:text-[#710008] [&_ul]:list-disc [&_ul]:pl-4"
                dangerouslySetInnerHTML={{ __html: rawContent }}
              />

              {/* Trích dẫn / Khẩu hiệu (nếu có) */}
              {quoteText && (
                <div className="bg-white border-l-4 border-[#d49520] p-4 rounded-r-xl shadow-xs mt-4 transition-all hover:shadow-sm">
                  <div className="flex items-start gap-3">
                    <Quote className="w-5 h-5 text-[#d49520] shrink-0 fill-amber-100/40" />
                    <div className="flex flex-col">
                      <blockquote className="italic text-gray-700 text-xs sm:text-sm leading-relaxed">
                        "{quoteText}"
                      </blockquote>
                      {quoteAuthor && (
                        <cite className="text-[11px] sm:text-xs font-semibold text-[#710008] not-italic mt-1.5">
                          — {quoteAuthor}
                        </cite>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nút Xem chi tiết theo yêu cầu */}
            <div className="pt-5 mt-4 border-t border-[#ede5d8] flex items-center justify-between">
              <span className="text-xs text-gray-500 hidden sm:inline">
                Khám phá hành trình & thành tựu
              </span>
              <Link
                to={detailUrl}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#710008] to-[#91131c] hover:from-[#840610] hover:to-[#a31923] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#710008]/20 hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer ml-auto"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </article>
  );
};

export default FounderCard;
