import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ArrowUp, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function ForumFooter({ data = {} }) {
  const header = data.header_section || {};
  const hero = data.hero_section || {};
  const registration = data.registration_section || {};
  const partners = data.partners_section || {};
  const organizers = Array.isArray(partners.organizers) ? partners.organizers : [];
  const navItems = Array.isArray(header.nav_items) ? header.nav_items : [];
  const organizerName = organizers[0]?.name || '';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#002868] text-slate-300 border-t border-blue-900/40 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-blue-900/40">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0058bc] to-[#1f71e3] p-0.5 shadow-md">
                <div className="w-full h-full bg-[#001947] rounded-[10px] flex items-center justify-center text-amber-400">
                  <Award size={22} />
                </div>
              </div>
              <div>
                <div className="text-sm font-extrabold uppercase tracking-wider text-white">
                  {header.brand_title}
                </div>
                <div className="text-[10px] tracking-widest text-blue-300 font-semibold uppercase">
                  {header.brand_subtitle}
                </div>
              </div>
            </div>

            <p className="text-xl sm:text-sm text-blue-200/80 leading-relaxed max-w-md">
              {hero.motto}
            </p>

            {organizerName && (
              <div className="flex items-center gap-2 pt-2 text-xs text-amber-400 font-semibold">
                <ShieldCheck size={16} />
                <span>{organizerName}</span>
              </div>
            )}
          </div>

          {/* Quick Anchor Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-base font-extrabold tracking-widest uppercase text-white mb-2">
              Chuyên Mục Sự Kiện
            </h4>
            <ul className="space-y-2 text-sm">
              {navItems.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  <a href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Back to Portal */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-base font-extrabold tracking-widest uppercase text-white mb-2">
              Liên Hệ Ban Thư Ký
            </h4>
            <div className="space-y-2 text-base text-blue-200/80">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400 shrink-0" />
                <span>{registration.hotline}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-amber-400 shrink-0" />
                <span>{registration.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span>{registration.address}</span>
              </div>
            </div>

            <div className="pt-3">
              <Link
                to={header.top_back_link || '/'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900/40 hover:bg-blue-900/70 border border-blue-700/50 text-xs font-semibold text-white transition-colors"
              >
                ← {header.top_back_text}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-base text-blue-300/60">
          <div>
            © {new Date().getFullYear()} {organizerName}. All rights reserved.
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors"
          >
            <span>Lên đầu trang</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
