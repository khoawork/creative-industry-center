import { useState } from 'react';
import { Sparkles, Compass, Trophy, Quote } from 'lucide-react';

export const FounderCard = ({ story }) => {
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'journey' | 'achievements'
  const [imgSrc, setImgSrc] = useState(story.image);

  const tabsConfig = [
    { key: 'about', label: 'Về nhà sáng lập', icon: Sparkles },
    { key: 'journey', label: 'Hành trình khởi nghiệp', icon: Compass },
    { key: 'achievements', label: 'Thành tựu & Giải thưởng', icon: Trophy },
  ];

  const currentTabContent = story.tabs[activeTab] || story.tabs.about;

  return (
    <article className="bg-white rounded-2xl border border-[#e8dfd3] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative group">
      <div className="h-1.5 bg-gradient-to-r from-[#710008] via-[#a81a24] to-[#d49520]"></div>

      <div className="p-5 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <div className="lg:col-span-5 flex flex-col">
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

            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#b87d14] block">
                {story.categoryLabel}
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-[#710008] tracking-tight mt-1 hover:text-[#910510] transition-colors">
                {story.name}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-snug font-normal">
                {story.title}
              </p>

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
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col h-full">
            <div className="flex items-center gap-1.5 border-b border-[#e2d7c7] overflow-x-auto scrollbar-none pb-0.5">
              {tabsConfig.map((tab) => {
                const isActive = activeTab === tab.key;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#710008] text-white shadow-xs'
                        : 'bg-[#f4efe8] text-gray-600 hover:bg-[#eadecf] hover:text-[#710008]'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-gray-500'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-[#fcfbf9] border border-[#e6ddd1] border-t-0 rounded-b-xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-[#b87d14] shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                    {currentTabContent.title}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mt-3.5 text-justify font-normal">
                  {currentTabContent.content}
                </p>
              </div>

              <div className="bg-white border-l-4 border-[#d49520] p-4 rounded-r-xl shadow-xs mt-5 transition-all hover:shadow-sm">
                <div className="flex items-start gap-3">
                  <Quote className="w-6 h-6 text-[#d49520] shrink-0 fill-amber-100/40" />
                  <div className="flex flex-col">
                    <blockquote className="italic text-gray-700 text-xs sm:text-sm leading-relaxed">
                      "{currentTabContent.quote}"
                    </blockquote>
                    <cite className="text-[11px] sm:text-xs font-semibold text-[#710008] not-italic mt-2">
                      — {currentTabContent.quoteAuthor}
                    </cite>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </article>
  );
};

export default FounderCard;
